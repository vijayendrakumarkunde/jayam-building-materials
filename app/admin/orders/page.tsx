"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, Filter, RefreshCw, Phone, MapPin, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.order_status === statusFilter;
    const matchSearch =
      !search ||
      o.order_reference?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone?.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-xs text-slate-400">View, search, and update customer material bookings</p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-xs font-bold border border-brand-charcoal-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by reference, name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs px-4 py-2.5 pl-9 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-brand-charcoal-800 text-white border border-brand-charcoal-700 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-orange-500"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Materials</th>
                <th className="p-4">Delivery Site</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-charcoal-800">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-brand-charcoal-800/40">
                  <td className="p-4 font-mono font-bold text-brand-orange-400">
                    {o.order_reference}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{o.customer_name}</p>
                    <p className="text-slate-400">{o.customer_phone}</p>
                  </td>
                  <td className="p-4">
                    {o.order_items?.map((item: any, idx: number) => (
                      <span key={idx} className="block text-slate-200">
                        {item.quantity} {item.measurement_unit} {item.product_name}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 max-w-xs truncate">{o.delivery_address}</td>
                  <td className="p-4 font-black text-white">{formatCurrency(Number(o.subtotal_amount))}</td>
                  <td className="p-4 font-bold uppercase text-[10px] text-brand-orange-400">
                    {o.order_status}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={o.order_status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className="text-xs bg-brand-charcoal-800 text-slate-200 border border-brand-charcoal-700 rounded-lg px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
