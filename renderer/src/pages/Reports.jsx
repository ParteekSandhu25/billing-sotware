import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";

export default function Reports() {
  const { user } = useUser();
  const [daily, setDaily] = useState(null);
  const [total, setTotal] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user?.role !== "owner") return;

    window.api.getDailySales().then(setDaily);
    window.api.getTotalSales().then(setTotal);
  }, [user]);

  const exportDaily = async () => {
    setMsg("");
    const res = await window.api.exportDailyReport();

    if (res?.error) setMsg(res.error);
    else if (!res?.cancelled) setMsg("Daily report exported successfully");
  };

  const exportTotal = async () => {
    setMsg("");
    const res = await window.api.exportTotalReport();

    if (res?.error) setMsg(res.error);
    else if (!res?.cancelled) setMsg("Total report exported successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reports
          </h2>
          <p className="text-slate-600">Track your sales performance and analytics</p>
        </motion.div>

        {/* Sales Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Today's Sales</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Bills</p>
                    <p className="text-3xl font-bold text-slate-800">{daily?.total_bills || 0}</p>
                  </div>
                  <FileText className="w-10 h-10 text-blue-500 opacity-50" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-slate-800">₹{daily?.total_sales || 0}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500 opacity-50" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Sales Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Overall Sales</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Bills</p>
                    <p className="text-3xl font-bold text-slate-800">{total?.total_bills || 0}</p>
                  </div>
                  <FileText className="w-10 h-10 text-purple-500 opacity-50" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-slate-800">₹{total?.total_sales || 0}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-indigo-500 opacity-50" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Export Reports</h3>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportDaily}
              className="px-6 py-3 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Daily Report
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportTotal}
              className="px-6 py-3 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Total Report
            </motion.button>
          </div>

          {msg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${
                msg.includes("error") || msg.includes("Error")
                  ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-300"
                  : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
              }`}
            >
              {msg.includes("error") || msg.includes("Error") ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <p
                className={`font-semibold ${
                  msg.includes("error") || msg.includes("Error")
                    ? "text-red-700"
                    : "text-green-700"
                }`}
              >
                {msg}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}