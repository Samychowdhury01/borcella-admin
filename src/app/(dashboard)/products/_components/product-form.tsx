"use client";

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
import {
  createProductFormSchema,
  TCreateProductFormSchema,
} from "@/schemas/product-form-schema";
import MultiText from "@/components/ui/multi-text";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useState } from "react";
import { getCollections } from "@/actions/collection-action";
import { Collection } from "@prisma/client";

const ProductForm = () => {
  const [collections, setCollections] = useState<
    {
      value: string;
      label: string;
    }[]
  >();
  const router = useRouter();
  const form = useForm<TCreateProductFormSchema>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      expense: 0,
      media: [],
      category: "",
      collectionIds: [],
      tags: [],
      sizes: [],
      colors: [],
    },
  });

  //   destructing the important fields from form
  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = form;

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collections = await getCollections();

        if (collections.length) {
          const newCollections = collections.map((collection: Collection) => ({
            value: collection.id,
            label: collection.title,
          }));
          setCollections(newCollections);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  //   onSubmit function
  const onSubmit = async (values: TCreateProductFormSchema) => {
    console.log(values);
    console.log('g')
    // try {
    //   const response = await fetch("/api/collections", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(values),
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     toast.success("Collection created successfully");
    //     router.push("/collections");
    //     reset();
    //   }
    // } catch (error) {
    //   console.log("[ERROR at collection onSubmit]:", error);
    //   toast.error("Something went wrong!");
    // }
  };

  //   error handler
  const onError = (errors: any) => console.log("ERROR:", errors);

  console.log(form.watch("media"));
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
                  <FormLabel>Product Title</FormLabel>
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
                  <FormLabel>Product Description</FormLabel>
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
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(updatedImages) =>
                        field.onChange(updatedImages)
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="add new tag"
                        onChange={(tag) =>
                          field.onChange([...field.value, tag])
                        }
                        value={field.value}
                        onRemove={(tag) =>
                          field.onChange([
                            ...field.value.filter((item) => item !== tag),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collectionIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={collections || []}
                        value={(field.value || []).map((id) => {
                          const option = collections?.find(
                            (c) => c.value === id
                          );
                          return option ? option : { value: id, label: id };
                        })}
                        onChange={(newValue) => {
                          // Extract just the values (IDs) from the selected options
                          field.onChange(
                            newValue.map((option) => option.value)
                          );
                        }}
                        placeholder="Select collections..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="add new color"
                        onChange={(color) =>
                          field.onChange([...field.value, color])
                        }
                        value={field.value}
                        onRemove={(color) =>
                          field.onChange([
                            ...field.value.filter((item) => item !== color),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="add new size"
                        onChange={(size) =>
                          field.onChange([...field.value, size])
                        }
                        value={field.value}
                        onRemove={(size) =>
                          field.onChange([
                            ...field.value.filter((item) => item !== size),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default ProductForm;

// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import ImageUpload from "@/components/image-upload";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import {
//   createProductFormSchema,
//   TCreateProductFormSchema,
// } from "@/schemas/product-form-schema";
// import MultiText from "@/components/ui/multi-text";
// import { MultiSelect } from "@/components/ui/multi-select";
// import { useEffect, useState } from "react";
// import { getCollections } from "@/actions/collection-action";
// import { Collection } from "@prisma/client";

// const ProductForm = () => {
//   const [collections, setCollections] = useState<
//     {
//       value: string;
//       label: string;
//     }[]
//   >();
//   const router = useRouter();
//   const form = useForm<TCreateProductFormSchema>({
//     resolver: zodResolver(createProductFormSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       price: 0,
//       expense: 0,
//       media: [],
//       category: "",
//       collectionIds: [],
//       tags: [],
//       sizes: [],
//       colors: [],
//     },
//   });

//   //   destructing the important fields from form
//   const {
//     formState: { isSubmitting },
//     reset,
//     handleSubmit,
//   } = form;

//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         const collections = await getCollections();

//         if (collections.length) {
//           const newCollections = collections.map((collection: Collection) => ({
//             value: collection.id,
//             label: collection.title,
//           }));
//           setCollections(newCollections);
//         }
//       } catch (error) {
//         console.error("Error fetching collections:", error);
//       }
//     };

//     fetchCollections();
//   }, []);

//   //   onSubmit function
//   const onSubmit = async (values: TCreateProductFormSchema) => {
//     console.log(values);
//     // try {
//     //   const response = await fetch("/api/collections", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify(values),
//     //   });
//     //   const data = await response.json();
//     //   if (data.success) {
//     //     toast.success("Collection created successfully");
//     //     router.push("/collections");
//     //     reset();
//     //   }
//     // } catch (error) {
//     //   console.log("[ERROR at collection onSubmit]:", error);
//     //   toast.error("Something went wrong!");
//     // }
//   };

//   //   error handler
//   const onError = (errors: any) => console.log(errors);

//   console.log({
//     media: form.watch("media"),
//     line: 108,
//   });

//   return (
//     <div>
//       {/* form  */}
//       <div>
//         <Form {...form}>
//           <form
//             onSubmit={handleSubmit(onSubmit, onError)}
//             className="space-y-5"
//           >
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Aesthetic Pants" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       rows={5}
//                       placeholder="e.g. A collection of pants that are aesthetically pleasing"
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="media"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Images</FormLabel>
//                   <FormControl>
//                     <ImageUpload
//                       value={Array.isArray(field.value) ? field.value : []}
//                       onChange={(updatedMedia: string[]) => {
//                         field.onChange(updatedMedia); // Pass the updated array directly
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-1" />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Price ($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" placeholder="e.g. 1000" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="expense"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Cost ($)</FormLabel>
//                     <FormControl>
//                       <Input type="number" placeholder="e.g. 500" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <FormControl>
//                       <Input type="text" placeholder="category" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="tags"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Tags</FormLabel>
//                     <FormControl>
//                       <MultiText
//                         placeholder="add new tag"
//                         onChange={(tag) =>
//                           field.onChange([...field.value, tag])
//                         }
//                         value={field.value}
//                         onRemove={(tag) =>
//                           field.onChange([
//                             ...field.value.filter((item) => item !== tag),
//                           ])
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="collectionIds"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Collections</FormLabel>
//                     <FormControl>
//                       <MultiSelect
//                         options={collections || []}
//                         value={(field.value || []).map((id) => {
//                           const option = collections?.find(
//                             (c) => c.value === id
//                           );
//                           return option ? option : { value: id, label: id };
//                         })}
//                         onChange={(newValue) => {
//                           // Extract just the values (IDs) from the selected options
//                           field.onChange(
//                             newValue.map((option) => option.value)
//                           );
//                         }}
//                         placeholder="Select collections..."
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="colors"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Colors</FormLabel>
//                     <FormControl>
//                       <MultiText
//                         placeholder="add new color"
//                         onChange={(color) =>
//                           field.onChange([...field.value, color])
//                         }
//                         value={field.value}
//                         onRemove={(color) =>
//                           field.onChange([
//                             ...field.value.filter((item) => item !== color),
//                           ])
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="sizes"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Sizes</FormLabel>
//                     <FormControl>
//                       <MultiText
//                         placeholder="add new size"
//                         onChange={(size) =>
//                           field.onChange([...field.value, size])
//                         }
//                         value={field.value}
//                         onRemove={(size) =>
//                           field.onChange([
//                             ...field.value.filter((item) => item !== size),
//                           ])
//                         }
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="flex items-center gap-4">
//               <Button type="submit" disabled={isSubmitting}>
//                 Submit
//               </Button>
//               <Button
//                 type="button"
//                 variant={"ghost"}
//                 onClick={() => router.push("/collections")}
//                 disabled={isSubmitting}
//               >
//                 Discard
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
