import React from "react";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import ProductForm from "../_components/product-form";
import { getSingleProduct } from "@/actions/product-action";
const EditProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const productDetails = await getSingleProduct(productId);
  const isProductExist = productDetails !== null;
  if (!isProductExist) {
    return redirect("/collections");
  }
  return (
    <section className="p-10">
      <div>
        <p className="text-heading2-bold text-gray-1">Edit Collection</p>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      <ProductForm initialData={productDetails!} />
    </section>
  );
};

export default EditProductPage;
