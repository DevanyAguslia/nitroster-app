import Midtrans from "midtrans-client"
import { NextResponse } from "next/server"

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT
})

export async function POST(request) {
  const { items, totalAmount } = await request.json()

  // Membuat ID transaksi unik (bisa disesuaikan dengan kebutuhan)
  const transactionId = "TX-" + new Date().getTime()

  // Menyiapkan array item_details untuk Midtrans
  const itemDetails = items.map(item => ({
    id: item.id.toString(),
    name: item.name,
    price: item.price,
    quantity: item.quantity
  }))

  let parameter = {
    item_details: itemDetails,
    transaction_details: {
      order_id: transactionId,
      gross_amount: totalAmount
    }
  }

  const token = await snap.createTransactionToken(parameter)
  console.log(token)
  return NextResponse.json({ token })
}