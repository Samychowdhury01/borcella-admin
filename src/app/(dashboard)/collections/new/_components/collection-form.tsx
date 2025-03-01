"use client";

import {
  createCollectionFormSchema,
  TCreateCollectionFormSchema,
} from "@/schemas/collection-form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/image-upload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Collection } from "@prisma/client";

interface CollectionFormProps {
  initialData?: Collection;
  HTTPType: "POST" | "PUT";
}

const CollectionForm = ({ initialData, HTTPType }: CollectionFormProps) => {
  const message =
    HTTPType === "POST"
      ? "Collection Created Successfully!"
      : "Collection Updated Successfully!";
  const api =
    HTTPType === "POST"
      ? "/api/collections"
      : `/api/collections/${initialData?.id}`;
      
  const router = useRouter();
  const form = useForm<TCreateCollectionFormSchema>({
    resolver: zodResolver(createCollectionFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  //   destructing the important fields from form
  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = form;

  //   onSubmit function
  const onSubmit = async (values: TCreateCollectionFormSchema) => {
    try {
      const response = await fetch(api, {
        method: HTTPType === "POST" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data?.message || message);
        router.push("/collections");
        reset();
      }
    } catch (error) {
      console.log("[ERROR at collection onSubmit]:", error);
      toast.error("Something went wrong!");
    }
  };

  //   error handler
  const onError = (errors: any) => console.log(errors);
  return (
    <div>
      {/* form  */}
      <div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Aesthetic Pants" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="e.g. A collection of pants that are aesthetically pleasing"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url[0])}
                      isMultiple={false}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => router.push("/collections")}
                disabled={isSubmitting}
              >
                Discard
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CollectionForm;
