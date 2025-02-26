"use client";
import { Collection, Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteCollection from "./delete-collection";

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
    cell: ({ row }) => <DeleteCollection id={row.original.id}/>
  },
];
