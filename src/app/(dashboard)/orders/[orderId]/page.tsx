import { getOrderDetails } from "@/actions/order-actions"
import { redirect } from "next/navigation"
import { orderItemsColumn } from "./_components/order-item-cloumns"
import { DataTable } from "@/components/data-table"


const OrderDetailsPage = async ({ params }: { params: Promise<{ orderId: string }>}) => {
  const {orderId} = await params

  const orderDetails = await getOrderDetails(orderId)
  console.log(orderDetails?.products, 'product')
  if(!orderDetails){
    return redirect('/')
  }
  const { street, city, state, postalCode, country } = orderDetails.shippingAddress!

  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base font-bold">
        Order ID: <span className="text-base font-medium">{orderDetails.id}</span>
      </p>
      <p className="text-base font-bold">
        Customer name: <span className="text-base font-medium">{orderDetails.customer.name}</span>
      </p>
      <p className="text-base font-bold">
        Shipping address: <span className="text-base font-medium">{street}, {city}, {state}, {postalCode}, {country}</span>
      </p>
      <p className="text-base font-bold">
        Total Paid: <span className="text-base font-medium">${orderDetails.totalAmount}</span>
      </p>
      <p className="text-base font-bold">
        Shipping rate ID: <span className="text-base font-medium">{orderDetails.shippingRate}</span>
      </p>
      <DataTable columns={orderItemsColumn} data={orderDetails.products} searchKey="product"/>
    </div>
  )
}

export default OrderDetailsPage