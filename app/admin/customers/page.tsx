"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, Phone, MapPin, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (data) setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Directory</h1>
          <p className="text-xs text-slate-400">View customer booking history and contact numbers</p>
        </div>

        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-charcoal-800 text-xs font-bold border border-brand-charcoal-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-800">
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 text-xs px-4 py-2.5 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange-500"
        />
      </div>

      <div className="bg-brand-charcoal-900 rounded-2xl border border-brand-charcoal-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-brand-charcoal-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Primary Phone</th>
                <th className="p-4">Alternate Phone</th>
                <th className="p-4">Site Address</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">First Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-charcoal-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-brand-charcoal-800/40">
                  <td className="p-4 font-bold text-white">{c.full_name}</td>
                  <td className="p-4 text-brand-orange-400 font-mono">
                    <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{c.alternate_phone || "—"}</td>
                  <td className="p-4 max-w-xs truncate">{c.default_address || "—"}</td>
                  <td className="p-4 font-bold text-white">{c.total_orders || 1}</td>
                  <td className="p-4 text-slate-400">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
