"use client";

import { ProductOrder } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const orderItemsColumn: ColumnDef<
  ProductOrder & {
    product: {
      id: string;
      title: string;
    };
  }
>[] = [
  {
    accessorKey: "productId",
    header: "Product",
    cell: ({ row }) => {
      return (
        <Link
          href={`/products/${row.original.product.id}`}
          className="hover:text-gray-1"
        >
          {row.original.product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];
