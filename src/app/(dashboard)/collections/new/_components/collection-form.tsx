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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/image-upload";

const CollectionForm = () => {
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
    console.log(values);
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
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CollectionForm;
