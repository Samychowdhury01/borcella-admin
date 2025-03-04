"use client";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "clerkId",
    header: "Clerk ID",
    // cell: ({ row }) => (
    //   <Link href={`/orders/${row.original.id}`} className="hover:text-gray-1">
    //     {row.original.id}
    //   </Link>
    // ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
