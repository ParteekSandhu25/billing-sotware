import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, QrCode, Tag, DollarSign, Percent, Hash, Save, X } from "lucide-react";

export default function ProductForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    qr_code: "",
    sku: "",
    price: 0,
    gst_percent: 0,
    quantity: 0,
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      name: "",
      qr_code: "",
      sku: "",
      price: 0,
      gst_percent: 0,
      quantity: 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl w-full max-w-4xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="md:col-span-2">
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            Product Name *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* QR Code Input */}
        <div>
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            QR Code *
          </label>
          <div className="relative">
            <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="Enter QR code"
              value={form.qr_code}
              onChange={(e) => setForm({ ...form, qr_code: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* SKU Input */}
        <div>
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            SKU *
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="Enter SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            Price (₹) *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="0.00"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* GST Percent Input */}
        <div>
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            GST (%) *
          </label>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="0"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.gst_percent}
              onChange={(e) =>
                setForm({ ...form, gst_percent: Number(e.target.value) })
              }
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Quantity Input */}
        <div className="md:col-span-2">
          <label className="block text-slate-600 text-sm font-semibold mb-2">
            Quantity (Stock) *
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              placeholder="0"
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Product
        </motion.button>
      </div>
    </motion.div>
  );
}