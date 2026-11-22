"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw, 
  ChevronRight,
  Filter,
  Check,
  Building2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_status: string;
  subtotal_amount: number;
  created_at: string;
  order_items?: any[];
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(10);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    const supabase = createClient();

    if (!supabase) {
      // Fallback local mockup if Supabase credentials unavailable
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Orders with order_items
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData);
      }

      // 2. Fetch Customers Count
      const { count: custCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (custCount !== null) {
        setTotalCustomers(custCount);
      }

      // 3. Fetch Products Count
      const { count: prodCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (prodCount !== null) {
        setTotalProducts(prodCount);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick Status Updater Handler
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.subtotal_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.order_status === "Pending");
  const confirmedOrders = orders.filter((o) => o.order_status === "Confirmed" || o.order_status === "Processing");
  const deliveredOrders = orders.filter((o) => o.order_status === "Delivered");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "Confirmed":
      case "Processing":
        return "bg-sky-500/15 text-sky-400 border border-sky-500/30";
      case "Dispatched":
        return "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";
      case "Delivered":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Refresh Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange-400 uppercase tracking-widest block mb-1">
            Dispatch Yard Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Business & Logistics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-charcoal-800 hover:bg-brand-charcoal-700 text-slate-200 text-xs font-bold border border-brand-charcoal-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-orange-400" : ""}`} />
            <span>Refresh Live Data</span>
          </button>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white text-xs font-bold transition-all shadow-md"
          >
            <span>Manage All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Gross Revenue */}
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 relative overflow-hidden group hover:border-brand-orange-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Bookings Value</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-3">
            {formatCurrency(totalRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {orders.length} registered orders
          </span>
        </div>

        {/* Pending Bookings (Requires immediate dispatch action) */}
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Bookings</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-3">
            {pendingOrders.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Awaiting vehicle allocation
          </span>
        </div>

        {/* Confirmed / Active Loads */}
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Loads</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-400 mt-3">
            {confirmedOrders.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            In progress / loading
          </span>
        </div>

        {/* Customers Count */}
        <div className="p-5 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Directory</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-400 mt-3">
            {totalCustomers}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Registered site clients
          </span>
        </div>

      </div>

      {/* RECENT BOOKINGS TABLE (LIVE DATA FROM SUPABASE) */}
      <div className="bg-brand-charcoal-900 rounded-3xl border border-brand-charcoal-800 overflow-hidden shadow-xl space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-charcoal-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand-orange-500" />
              <span>Recent Customer Bookings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live orders submitted via customer storefront and WhatsApp
            </p>
          </div>

          <span className="text-xs text-slate-400 bg-brand-charcoal-800 px-3 py-1.5 rounded-xl border border-brand-charcoal-700">
            Total Orders in Cloud: <strong>{orders.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-orange-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Fetching live orders from Supabase...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No orders placed yet.</p>
            <p className="text-xs text-slate-500">
              Orders placed on the storefront will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Materials</th>
                  <th className="p-4">Site Location</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-charcoal-800/40 transition-colors">
                    
                    {/* Order Reference */}
                    <td className="p-4 font-mono font-bold text-brand-orange-400">
                      {order.order_reference}
                      <span className="text-[10px] text-slate-500 block font-sans">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <p className="font-bold text-white">{order.customer_name}</p>
                      <a href={`tel:${order.customer_phone}`} className="text-[11px] text-slate-400 hover:text-brand-orange-400">
                        {order.customer_phone}
                      </a>
                    </td>

                    {/* Materials */}
                    <td className="p-4 max-w-xs">
                      {order.order_items && order.order_items.length > 0 ? (
                        <div className="space-y-1">
                          {order.order_items.map((i: any, idx: number) => (
                            <span key={idx} className="block text-slate-200 font-medium">
                              • {i.quantity} {i.measurement_unit} {i.product_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">Materials on File</span>
                      )}
                    </td>

                    {/* Site Location */}
                    <td className="p-4 max-w-xs">
                      <p className="truncate text-slate-300" title={order.delivery_address}>
                        {order.delivery_address}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-black text-white">
                      {formatCurrency(Number(order.subtotal_amount))}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadge(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>

                    {/* Quick Status Updater Dropdown */}
                    <td className="p-4 text-right">
                      <select
                        value={order.order_status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="text-xs bg-brand-charcoal-800 text-slate-200 border border-brand-charcoal-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-orange-500"
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
        )}

      </div>

    </div>
  );
}
