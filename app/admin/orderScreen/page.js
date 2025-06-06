"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

function BottomNavbar() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
            <Link href="/admin/dashboard" className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <span className="text-xs mt-1 text-gray-500">Home</span>
            </Link>

            <Link href="/admin/orderScreen" className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
                <span className="text-xs mt-1 text-gray-500">Cart</span>
            </Link>

            <Link href="/admin/logScreen" className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span className="text-xs mt-1 text-gray-500">History</span>
            </Link>

            <div className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
                <span className="text-xs mt-1 text-blue-500">Admin</span>
            </div>
        </nav>
    );
}

export default function OrderScreen() {
    const { isStaff, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!isLoading && !isStaff) {
            router.push("/");
        }
    }, [isStaff, isLoading, router]);

    useEffect(() => {
        if (isStaff) {
            fetchOrders();
        }
    }, [isStaff]);

    useEffect(() => {
        if (searchTerm) {
            const filtered = orders.filter((order) =>
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/admin/orders");
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === orderId ? { ...order, status: newStatus } : order
                    )
                );
                setFilteredOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.orderId === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (err) {
            console.error("Failed to update order status", err);
        }
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString("id-ID")} ${date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    const statusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in progress":
                return "bg-blue-100 text-blue-800";
            case "done":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (isLoading)
        return <div className="text-center mt-20">Loading...</div>;

    if (!isStaff)
        return <div className="text-center mt-20">Access Denied</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center shadow-sm">
                <Link href="/admin/dashboard">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-600 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </Link>
                <h1 className="text-lg font-semibold text-gray-900 ml-4">
                    Order Screen
                </h1>
            </div>

            {/* Search */}
            <div className="px-4 py-3 bg-white">
                <input
                    type="text"
                    placeholder="Search order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Order List */}
            <div className="px-4 space-y-4 mt-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {searchTerm ? "No matching orders." : "No orders found."}
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white p-4 rounded-xl shadow border border-gray-100"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {formatDateTime(order.createdAt)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        TX ID: {order.orderId}
                                    </p>

                                    {/* Items */}
                                    <div className="mt-3">
                                        <p className="text-sm font-semibold text-gray-800 mb-1">
                                            Items:
                                        </p>
                                        <ul className="space-y-1 text-sm text-gray-600">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    - {item.name} (Rp{item.price.toLocaleString("id-ID")})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Status Dropdown */}
                                <div className="flex flex-col items-end">
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(order.orderId, e.target.value)
                                        }
                                        className={`px-2 py-1 rounded text-xs font-semibold ${statusColor(
                                            order.status
                                        )} border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    >
                                        <option value="Pending">pending</option>
                                        <option value="In Progress">in progress</option>
                                        <option value="Done">done</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Navbar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-around shadow-lg border-t border-gray-200">
                <Link href="/admin/dashboard">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">Home</span>
                    </div>
                </Link>


                <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-xs mt-1 text-gray-500">Cart</span>
                </div>

                <Link href="/admin/logScreen">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-500">History</span>
                    </div>
                </Link>

                <Link href="/admin/stockScreen">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span className="text-xs mt-1 text-blue-500">Admin</span>
                    </div>
                </Link>
            </nav>
        </div>
    )
}
