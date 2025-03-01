import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { productColumns } from "./_components/product-columns";
import { getProducts } from "@/actions/product-action";

const ProductsPage = async () => {
  const products = await getProducts();
console.log(products)
  return (
    <section className="p-10">
      {/* title and new collection add button */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold text-gray-1"> Products</p>
          <Button asChild>
            <Link href="/products/new" className="flex items-center gap-x-2">
              <Plus className="size-5" />
              Create Product
            </Link>
          </Button>
        </div>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>

      {/* table to show the collection list */}
      <div>
        <DataTable
          columns={productColumns}
          data={products}
          searchKey="title"
        />
      </div>
    </section>
  );
};

export default ProductsPage;