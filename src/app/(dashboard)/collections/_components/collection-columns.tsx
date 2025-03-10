"use client";
import { Collection, Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import Link from "next/link";
import DeleteModal from "@/components/delete-modal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const CollectionColumns: ColumnDef<
  Collection & { products: Product[] }
>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <p>{row.original.products.length}</p>,
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-x-2">
        <Button asChild variant={"ghost"} className="hover:text-primary">
          <Link href={`/collections/${row.original.id}`}>
          <PenIcon/>
          </Link>
        </Button>
        <DeleteModal id={row.original.id} itemType="collections"/>
      </div>
    )
  },
];
