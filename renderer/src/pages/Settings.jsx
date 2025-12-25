import React, { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Key, CheckCircle, AlertCircle } from "lucide-react";

export default function Settings() {
  const { user } = useUser();

  const [ownerOld, setOwnerOld] = useState("");
  const [ownerNew, setOwnerNew] = useState("");

  const [staffOld, setStaffOld] = useState("");
  const [staffNew, setStaffNew] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const updateOwnerPassword = async () => {
    setMsg("");
    setError("");

    const res = await window.api.updateOwnerPassword({
      oldPassword: ownerOld,
      newPassword: ownerNew
    });

    if (res?.error) {
      setError(res.error);
      return;
    }

    setMsg("Owner password updated successfully");
    setOwnerOld("");
    setOwnerNew("");
  };

  const updateStaffPassword = async () => {
    setMsg("");
    setError("");

    const res = await window.api.updateStaffPassword({
      oldPassword: staffOld,
      newPassword: staffNew
    });

    if (res?.error) {
      setError(res.error);
      return;
    }

    setMsg("Staff password updated successfully");
    setStaffOld("");
    setStaffNew("");
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
            Admin Settings
          </h2>
          <p className="text-slate-600">Manage passwords and security settings</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Owner Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Update Owner Password</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={ownerOld}
                    onChange={(e) => setOwnerOld(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={ownerNew}
                    onChange={(e) => setOwnerNew(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={updateOwnerPassword}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Update Owner Password
              </motion.button>
            </div>
          </motion.div>

          {/* Staff Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Update Staff Password</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={staffOld}
                    onChange={(e) => setStaffOld(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 text-sm font-semibold mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={staffNew}
                    onChange={(e) => setStaffNew(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={updateStaffPassword}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Update Staff Password
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {(error || msg) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto mt-6"
            >
              {error && (
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-xl">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-300 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-semibold">{error}</p>
                  </div>
                </div>
              )}
              
              {msg && (
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-xl">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-semibold">{msg}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}