import { getAllOrders } from "@/actions/order-actions";
import { DataTable } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { orderColumns } from "./_components/order-columns";

const OrdersPage = async () => {
  const orders = await getAllOrders();
  return (
    <section className="p-10">
      {/* title and separator */}
      <div>
        <p className="text-heading2-bold text-gray-1"> Orders</p>

        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      {/* table to show the order list */}
      <div>
        <DataTable columns={orderColumns} data={orders} searchKey="id" />
      </div>
    </section>
  );
};

export default OrdersPage;
