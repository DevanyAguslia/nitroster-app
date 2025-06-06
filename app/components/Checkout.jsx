import React from "react";
import { useRouter } from "next/navigation";

const Checkout = ({ cartItems }) => {
  const router = useRouter();

  const checkout = async () => {
    // Menyiapkan data untuk dikirim ke API
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      description: item.description,
      image: item.image
    }));

    // Menghitung total harga dari semua item
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const data = { items: items, totalAmount: totalAmount };

    try {
      const response = await fetch("/api/tokenizer", {
        method: "POST",
        body: JSON.stringify(data)
      });

      const requestData = await response.json();

      // Open Snap payment UI
      window.snap.pay(requestData.token, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          // Redirect to order history page after successful payment
          router.push("/thanks");
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
          // You can optionally redirect to order history or a waiting page
        },
        onError: function (result) {
          console.log("Payment error:", result);
          alert("Payment failed. Please try again.");
        },
        onClose: function () {
          // Handle case when customer closes the payment window
          console.log("Customer closed the payment window");
        }
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <button
        className="w-full bg-cyan-600 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors duration-200"
        onClick={checkout}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;