"use client";

import { Separator } from "@/components/ui/separator";
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

const CollectionForm = () => {
  const router = useRouter();
  const form = useForm<TCreateCollectionFormSchema>({
    resolver: zodResolver(createCollectionFormSchema),
  });

  //   destructing the important fields from form
  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = form;

  //   onSubmit function
  const onSubmit = async (values: TCreateCollectionFormSchema) => {
   console.log(values)
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Collection created successfully");
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
    <div className="p-10">
      <p className="text-heading2-bold text-gray-1">Create Collection</p>
      <Separator className="mt-4 mb-7 bg-gray-1" />

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
                      onChange={(url: string) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
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
