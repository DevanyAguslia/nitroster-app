import React from "react";

const Checkout = ({ cartItems }) => {
  const checkout = async () => {
    // Menyiapkan data untuk dikirim ke API
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    // Menghitung total harga dari semua item
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const data = {
      items: items,
      totalAmount: totalAmount
    };

    const response = await fetch("/api/tokenizer", {
      method: "POST",
      body: JSON.stringify(data)
    });

    const requestData = await response.json();
    window.snap.pay(requestData.token);
  };

  return (
    <div className="flex items-center justify-between">
      <button
        className="w-full rounded bg-indigo-500 p-4 text-sm font-medium text-white transition"
        onClick={checkout}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;