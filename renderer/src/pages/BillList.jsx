import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Receipt, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Printer,
  X,
  ShoppingBag
} from "lucide-react";

const PAGE_SIZE = 8;

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// TableToolbar Component
function TableToolbar({ search, setSearch, sort, setSort, page, setPage, totalPages, placeholder }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Customer A-Z</option>
          <option value="za">Customer Z-A</option>
        </select>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [selectedBillItems, setSelectedBillItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const fetchBills = async () => {
    const data = await window.api.getAllBills();
    setBills(data || []);
  };

  const viewBill = async (billId, billNumber) => {
    const billList = await window.api.getBillItems(billId);
    setSelectedBillItems(billList || []);
    setModalTitle(`Bill Items - ${billNumber}`);
    setModalOpen(true);
  };

  const rePrintBill = async (billId, bill_number, customer, totals) => {
    const billList = await window.api.getBillItems(billId);
    await window.api.printBill({
      bill_number,
      customer,
      items: billList,
      totals,
    });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // 🔍 Filtering
  const filteredBills = useMemo(() => {
    return bills.filter((b) =>
      `${b.bill_number} ${b.customer_name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [bills, search]);

  // ↕️ Sorting
  const sortedBills = useMemo(() => {
    const list = [...filteredBills];
    switch (sort) {
      case "newest":
        return list.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "az":
        return list.sort((a, b) =>
          (a.customer_name || "").localeCompare(b.customer_name || "")
        );
      case "za":
        return list.sort((a, b) =>
          (b.customer_name || "").localeCompare(a.customer_name || "")
        );
      default:
        return list;
    }
  }, [filteredBills, sort]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedBills.length / PAGE_SIZE);
  const paginatedBills = sortedBills.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              All Bills
            </h2>
          </div>
          <p className="text-slate-600">View and manage all billing records</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TableToolbar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            placeholder="Search by bill number or customer"
          />
        </motion.div>

        {/* Bills Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="p-4 text-left text-sm font-bold text-slate-700">Bill No</th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700">Customer</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-700">Sub Total</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-700">GST</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-700">Total</th>
                  <th className="p-4 text-center text-sm font-bold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBills.map((b) => (
                  <tr key={b.bill_id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-slate-800 font-semibold">{b.bill_number}</td>
                    <td className="p-4 text-slate-700">{b.customer_name || "Walk-in"}</td>
                    <td className="p-4 text-center text-slate-700">₹{b.sub_total}</td>
                    <td className="p-4 text-center text-slate-700">₹{b.gst_amount}</td>
                    <td className="p-4 text-center font-bold text-slate-900">₹{b.total_amount}</td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                          onClick={() => viewBill(b.bill_id, b.bill_number)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
                          onClick={() =>
                            rePrintBill(
                              b.bill_id,
                              b.bill_number,
                              {
                                id: b.customer_id,
                                name: b.customer_name,
                                mobile: b.customer_mobile,
                                email: b.customer_email,
                                address: b.customer_address,
                                gst_number: b.customer_gst_number,
                                created_at: b.customer_created_at,
                              },
                              {
                                sub_total: b.sub_total,
                                gst_amount: b.gst_amount,
                                total_amount: b.total_amount,
                              }
                            )
                          }
                        >
                          <Printer className="w-4 h-4" />
                          Reprint
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modal for Bill Items */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3 text-left text-sm font-bold text-slate-700">Product</th>
                    <th className="p-3 text-center text-sm font-bold text-slate-700">Price</th>
                    <th className="p-3 text-center text-sm font-bold text-slate-700">GST %</th>
                    <th className="p-3 text-center text-sm font-bold text-slate-700">Qty</th>
                    <th className="p-3 text-center text-sm font-bold text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBillItems.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 bg-white hover:bg-blue-50/50 transition-colors">
                      <td className="p-3 text-slate-800 font-medium">{item.product_name}</td>
                      <td className="p-3 text-center text-slate-700">₹{item.price}</td>
                      <td className="p-3 text-center text-slate-700">{item.gst_percent}%</td>
                      <td className="p-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="p-3 text-center font-bold text-slate-900">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}