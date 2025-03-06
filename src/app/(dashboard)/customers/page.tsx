import { getAllCustomers } from "@/actions/customer-action";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";

import { redirect } from "next/navigation";
import React from "react";
import { customerColumns } from "./_components/customer-columns";
import { auth } from "@/auth";

const CustomersPage = async () => {
        const session = await auth();
          const userId = session?.user?.id;

  if (!userId || !session) {
    return redirect("/");
  }

  const customers = await getAllCustomers();
  return (
    <section className="px-10 py-5">
      {/* title and separator */}
      <div>
        <p className="text-heading2-bold text-gray-1"> Customers</p>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      {/* table to show the order list */}
      <div>
        <DataTable columns={customerColumns} data={customers} searchKey="id" />
      </div>
    </section>
  );
};

export default CustomersPage;
