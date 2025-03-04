import { getOrderDetails } from "@/actions/order-actions";
import { redirect } from "next/navigation";
import { orderItemsColumn } from "./_components/order-item-cloumns";
import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Box, HandCoins, MapPinHouse, Receipt, UserRound } from "lucide-react";

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  const orderDetails = await getOrderDetails(orderId);

  if (!orderDetails) {
    return redirect("/");
  }
  const { street, city, state, postalCode, country } =
    orderDetails.shippingAddress!;

  return (
    <section className=" p-10 ">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold text-gray-1"> Order Details</p>
        </div>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      <Card className="flex flex-col gap-5 p-3">
        <div className="text-base font-bold flex items-center gap-x-1">
          <Box />
         <p> Order ID:{" "}
         <span className="text-base font-medium">{orderDetails.id}</span></p>
        </div>
        <div className="text-base font-bold flex items-center gap-x-1">
          <UserRound />
          <p>Customer name:{" "}
          <span className="text-base font-medium">
            {orderDetails.customer.name}
          </span></p>
        </div>
        <div className="text-base font-bold flex items-center gap-x-1">
          <MapPinHouse />
         <p> Shipping address:{" "}
          <span className="text-base font-medium">
            {street}, {city}, {state}, {postalCode}, {country}
          </span></p>
        </div>
        <div className="text-base font-bold flex items-center gap-x-1">
          <Receipt />
          <p>
            {" "}
            Total Paid:{" "}
            <span className="text-base font-medium">
              ${orderDetails.totalAmount}
            </span>
          </p>
        </div>
        <div className="text-base font-bold flex items-center gap-x-1">
          <HandCoins />
          <p>Shipping rate ID:{" "}
          <span className="text-base font-medium">
            {orderDetails.shippingRate}
          </span></p>
        </div>
      </Card>
      <DataTable
        columns={orderItemsColumn}
        data={orderDetails.products}
        searchKey="product"
      />
    </section>
  );
};

export default OrderDetailsPage;
