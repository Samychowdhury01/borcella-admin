"use client";
import { Customer, Order } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const orderColumns: ColumnDef<
  Order & {
    customer: Customer;
    _count: {
      products: number;
    };
  }
>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="hover:text-gray-1"
      >
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    accessorKey: "_count.products",
    header: "Products",
  },
  {
    accessorKey: "totalAmount",
    header: "Total ($)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <p>{format(row.original.createdAt, "MMM do, yyyy")}</p>
    ),
  },
];
