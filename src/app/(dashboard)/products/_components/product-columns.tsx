"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import Link from "next/link";
import { Collection, Product } from "@prisma/client";
import DeleteModal from "@/components/delete-modal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const productColumns: ColumnDef<
  Product & { collections: Collection[] }
>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Products",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) =>
      row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price ($)",
  },
  {
    accessorKey: "expense",
    header: "Cost ($)",
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-x-2">
        <Button asChild variant={"ghost"} className="hover:text-primary">
          <Link href={`/products/${row.original.id}`}>
            <PenIcon />
          </Link>
        </Button>
        <DeleteModal id={row.original.id} itemType="products" />
      </div>
    ),
  },
];
