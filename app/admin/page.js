"use client";

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, isStaff, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isLoading && !isStaff) {
      router.push('/');
    }
  }, [isStaff, isLoading, router]);

  useEffect(() => {
    if (isStaff) {
      fetchAllOrders();
    }
  }, [isStaff]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isStaff) return <div>Access denied</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="border p-4 rounded">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Total:</strong> Rp{order.totalAmount.toLocaleString('id-ID')}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}