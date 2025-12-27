// import React, { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Receipt, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight,
//   Eye,
//   Printer,
//   X,
//   ShoppingBag,
//   Percent
// } from "lucide-react";
// import TableToolbar from "../components/TableToolbar";
// import Modal from "../components/Modal";
// import { PaymentBadge } from "../components/PaymentBadge";

// const PAGE_SIZE = 8;


// // TableToolbar Component
// // function TableToolbar({ search, setSearch, sort, setSort, page, setPage, totalPages, placeholder }) {
// //   return (
// //     <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-lg mb-6">
// //       <div className="flex flex-col md:flex-row gap-4 items-center">
// //         {/* Search */}
// //         <div className="flex-1 w-full relative">
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
// //           <input
// //             type="text"
// //             placeholder={placeholder}
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //           />
// //         </div>

// //         {/* Sort */}
// //         <select
// //           value={sort}
// //           onChange={(e) => setSort(e.target.value)}
// //           className="px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //         >
// //           <option value="newest">Newest First</option>
// //           <option value="oldest">Oldest First</option>
// //           <option value="az">Customer A-Z</option>
// //           <option value="za">Customer Z-A</option>
// //         </select>

// //         {/* Pagination */}
// //         <div className="flex items-center gap-2">
// //           <button
// //             onClick={() => setPage(Math.max(1, page - 1))}
// //             disabled={page === 1}
// //             className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
// //           >
// //             <ChevronLeft className="w-5 h-5 text-slate-600" />
// //           </button>
// //           <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold">
// //             {page} / {totalPages || 1}
// //           </span>
// //           <button
// //             onClick={() => setPage(Math.min(totalPages, page + 1))}
// //             disabled={page === totalPages || totalPages === 0}
// //             className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
// //           >
// //             <ChevronRight className="w-5 h-5 text-slate-600" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// export default function BillList() {
//   const [bills, setBills] = useState([]);
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [selectedBillItems, setSelectedBillItems] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");

//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);

//   const fetchBills = async () => {
//     const data = await window.api.getAllBills();
//     setBills(data || []);
//   };

//   const viewBill = async (bill) => {
//     const billList = await window.api.getBillItems(bill.bill_id);
//     setSelectedBill(bill);
//     setSelectedBillItems(billList || []);
//     setModalTitle(`Bill Details - ${bill.bill_number}`);
//     setModalOpen(true);
//   };

//   const rePrintBill = async (bill) => {
//     const billList = await window.api.getBillItems(bill.bill_id);
//     await window.api.printBill({
//       bill_number: bill.bill_number,
//       customer: {
//         id: bill.customer_id,
//         name: bill.customer_name,
//         mobile: bill.customer_mobile,
//         email: bill.customer_email,
//         address: bill.customer_address,
//         gst_number: bill.customer_gst_number,
//         created_at: bill.customer_created_at,
//       },
//       items: billList,
//       totals: {
//         sub_total: bill.sub_total,
//         gst_amount: bill.gst_amount,
//         cash_discount: bill.cash_discount || 0,
//         total_amount: bill.total_amount,
//         payment_mode: bill.payment_mode || "CASH"
//       },
//     });
//   };

//   useEffect(() => {
//     fetchBills();
//   }, []);

//   // 🔍 Filtering
//   const filteredBills = useMemo(() => {
//     return bills.filter((b) =>
//       `${b.bill_number} ${b.customer_name || ""}`
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   }, [bills, search]);

//   // ↕️ Sorting
//   const sortedBills = useMemo(() => {
//     const list = [...filteredBills];
//     switch (sort) {
//       case "newest":
//         return list.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );
//       case "oldest":
//         return list.sort(
//           (a, b) => new Date(a.created_at) - new Date(b.created_at)
//         );
//       case "az":
//         return list.sort((a, b) =>
//           (a.customer_name || "").localeCompare(b.customer_name || "")
//         );
//       case "za":
//         return list.sort((a, b) =>
//           (b.customer_name || "").localeCompare(a.customer_name || "")
//         );
//       default:
//         return list;
//     }
//   }, [filteredBills, sort]);

//   // 📄 Pagination
//   const totalPages = Math.ceil(sortedBills.length / PAGE_SIZE);
//   const paginatedBills = sortedBills.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
//               <Receipt className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               All Bills
//             </h2>
//           </div>
//           <p className="text-slate-600">View and manage all billing records</p>
//         </motion.div>

//         {/* Toolbar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//         >
//           <TableToolbar
//             search={search}
//             setSearch={setSearch}
//             sort={sort}
//             setSort={setSort}
//             page={page}
//             setPage={setPage}
//             totalPages={totalPages}
//             placeholder="Search by bill number or customer"
//           />
//         </motion.div>

//         {/* Bills Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
//         >
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
//                 <tr>
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">Bill No</th>
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">Customer</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Sub Total</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">GST</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Discount</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Total</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Payment</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedBills.map((b) => (
//                   <tr key={b.bill_id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
//                     <td className="p-4 text-slate-800 font-semibold">{b.bill_number}</td>
//                     <td className="p-4 text-slate-700">{b.customer_name || "Walk-in"}</td>
//                     <td className="p-4 text-center text-slate-700">₹{parseFloat(b.sub_total).toFixed(2)}</td>
//                     <td className="p-4 text-center text-slate-700">₹{parseFloat(b.gst_amount).toFixed(2)}</td>
//                     <td className="p-4 text-center">
//                       {b.cash_discount > 0 ? (
//                         <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
//                           <Percent className="w-3 h-3" />
//                           ₹{parseFloat(b.cash_discount).toFixed(2)}
//                         </span>
//                       ) : (
//                         <span className="text-slate-400">-</span>
//                       )}
//                     </td>
//                     <td className="p-4 text-center font-bold text-slate-900">₹{parseFloat(b.total_amount).toFixed(2)}</td>
//                     <td className="p-4 text-center">
//                       <PaymentBadge mode={b.payment_mode} />
//                     </td>
//                     <td className="p-4">
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
//                           onClick={() => viewBill(b)}
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                         <button
//                           className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
//                           onClick={() => rePrintBill(b)}
//                         >
//                           <Printer className="w-4 h-4" />
//                           Reprint
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {paginatedBills.length === 0 && (
//             <div className="text-center py-12 text-slate-500">
//               <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
//               <p className="text-lg font-semibold">No bills found</p>
//               <p className="text-sm">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </motion.div>

//         {/* Modal for Bill Details */}
//         <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
//           {selectedBill && (
//             <div className="space-y-6">
//               {/* Bill Summary */}
//               <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
//                 <div>
//                   <p className="text-sm text-slate-600 mb-1">Customer</p>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {selectedBill.customer_name || "Walk-in Customer"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600 mb-1">Date</p>
//                   <p className="text-lg font-semibold text-slate-800">
//                     {new Date(selectedBill.created_at).toLocaleDateString('en-IN')}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600 mb-1">Payment Mode</p>
//                   <PaymentBadge mode={selectedBill.payment_mode} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-600 mb-1">Bill Status</p>
//                   <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
//                     Paid
//                   </span>
//                 </div>
//               </div>

//               {/* Bill Items */}
//               <div>
//                 <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
//                   <ShoppingBag className="w-5 h-5" />
//                   Bill Items
//                 </h4>
//                 <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-white border-b-2 border-slate-200">
//                         <tr>
//                           <th className="p-3 text-left text-sm font-bold text-slate-700">Product</th>
//                           <th className="p-3 text-center text-sm font-bold text-slate-700">Price</th>
//                           <th className="p-3 text-center text-sm font-bold text-slate-700">GST %</th>
//                           <th className="p-3 text-center text-sm font-bold text-slate-700">Qty</th>
//                           <th className="p-3 text-center text-sm font-bold text-slate-700">Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedBillItems.map((item, i) => (
//                           <tr key={i} className="border-b border-slate-100 bg-white hover:bg-blue-50/50 transition-colors">
//                             <td className="p-3 text-slate-800 font-medium">{item.product_name}</td>
//                             <td className="p-3 text-center text-slate-700">₹{parseFloat(item.price).toFixed(2)}</td>
//                             <td className="p-3 text-center text-slate-700">{item.gst_percent}%</td>
//                             <td className="p-3 text-center text-slate-700">{item.quantity}</td>
//                             <td className="p-3 text-center font-bold text-slate-900">₹{parseFloat(item.total).toFixed(2)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {/* Bill Totals */}
//               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                 <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 border-b border-slate-200">
//                   <h4 className="font-bold text-slate-800">Bill Summary</h4>
//                 </div>
//                 <div className="p-4 space-y-2">
//                   <div className="flex justify-between text-slate-700">
//                     <span>Sub Total:</span>
//                     <span className="font-semibold">₹{parseFloat(selectedBill.sub_total).toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-slate-700">
//                     <span>GST Amount:</span>
//                     <span className="font-semibold">₹{parseFloat(selectedBill.gst_amount).toFixed(2)}</span>
//                   </div>
//                   {selectedBill.cash_discount > 0 && (
//                     <div className="flex justify-between text-amber-700 font-semibold">
//                       <span className="flex items-center gap-1">
//                         <Percent className="w-4 h-4" />
//                         Cash Discount:
//                       </span>
//                       <span>- ₹{parseFloat(selectedBill.cash_discount).toFixed(2)}</span>
//                     </div>
//                   )}
//                   <div className="h-px bg-slate-300 my-2"></div>
//                   <div className="flex justify-between text-xl font-bold text-slate-900">
//                     <span>Grand Total:</span>
//                     <span>₹{parseFloat(selectedBill.total_amount).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal>
//       </div>
//     </div>
//   );
// }



// *****************************************************************************
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Receipt, 
  Eye,
  Printer,
  ShoppingBag,
  Percent,
  Loader2,
  Calendar,
  Filter
} from "lucide-react";
import TableToolbar from "../components/TableToolbar";
import Modal from "../components/Modal";
import { PaymentBadge } from "../components/PaymentBadge";

export default function BillList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedBillItems, setSelectedBillItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Backend pagination state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 8;

  // Filter states
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const fetchBills = async () => {
    setLoading(true);
    try {
      // Map sort values to database column names
      const sortMapping = {
        newest: { sortBy: "b.created_at", sortOrder: "DESC" },
        oldest: { sortBy: "b.created_at", sortOrder: "ASC" },
        az: { sortBy: "c.name", sortOrder: "ASC" },
        za: { sortBy: "c.name", sortOrder: "DESC" },
        priceHighLow: { sortBy: "b.total_amount", sortOrder: "DESC" },
        priceLowHigh: { sortBy: "b.total_amount", sortOrder: "ASC" }
      };

      const { sortBy, sortOrder } = sortMapping[sort];

      // Build date range object if both dates are set
      const dateRangeFilter = 
        dateRange.start && dateRange.end 
          ? { start: dateRange.start, end: dateRange.end } 
          : undefined;

      // Build filters object
      const filters = {};
      if (paymentFilter !== "ALL") {
        filters["b.payment_mode"] = paymentFilter;
      }

      // Call backend with pagination, sorting, and search
      const result = await window.api.getAllBills({
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
        search: search || undefined,
        dateRange: dateRangeFilter,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      });

      setBills(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchBills();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, sort, dateRange, paymentFilter]);

  // Fetch when page changes
  useEffect(() => {
    fetchBills();
  }, [page]);

  const viewBill = async (bill) => {
    try {
      const billList = await window.api.getBillItems(bill.bill_id);
      setSelectedBill(bill);
      setSelectedBillItems(billList || []);
      setModalTitle(`Bill Details - ${bill.bill_number}`);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching bill items:", error);
      alert("Failed to load bill details");
    }
  };

  const rePrintBill = async (bill) => {
    try {
      const billList = await window.api.getBillItems(bill.bill_id);
      await window.api.printBill({
        bill_number: bill.bill_number,
        created_at: bill.created_at,
        customer: {
          id: bill.customer_id,
          name: bill.customer_name,
          mobile: bill.customer_mobile,
          email: bill.customer_email,
          address: bill.customer_address,
          gst_number: bill.customer_gst_number,
          created_at: bill.customer_created_at,
        },
        items: billList,
        totals: {
          sub_total: bill.sub_total,
          gst_amount: bill.gst_amount,
          cash_discount: bill.cash_discount || 0,
          total_amount: bill.total_amount,
          payment_mode: bill.payment_mode || "CASH"
        },
      });
    } catch (error) {
      console.error("Error printing bill:", error);
      alert("Failed to print bill");
    }
  };

  const clearAllFilters = () => {
    setDateRange({ start: "", end: "" });
    setPaymentFilter("ALL");
    setSearch("");
  };

  const hasActiveFilters = dateRange.start || dateRange.end || paymentFilter !== "ALL" || search;

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
            <div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                All Bills
              </h2>
              <p className="text-slate-600 text-sm mt-1">Total: {total} bills</p>
            </div>
          </div>
          <p className="text-slate-600">View and manage all billing records</p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-lg mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-semibold text-slate-700">Filters</span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-auto px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                <label className="text-sm font-medium text-slate-700">Date Range:</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">Payment Method:</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>
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
            placeholder="Search by bill number, customer name, or mobile..."
            sortOptions={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "priceHighLow", label: "Price: High → Low" },
              { value: "priceLowHigh", label: "Price: Low → High" },
              { value: "az", label: "Customer: A → Z" },
              { value: "za", label: "Customer: Z → A" }
            ]}
          />
        </motion.div>

        {/* Bills Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600">Loading bills...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="p-4 text-left text-sm font-bold text-slate-700">Bill No</th>
                      <th className="p-4 text-left text-sm font-bold text-slate-700">Date</th>
                      <th className="p-4 text-left text-sm font-bold text-slate-700">Customer</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">Sub Total</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">GST</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">Discount</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">Total</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">Payment</th>
                      <th className="p-4 text-center text-sm font-bold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.length > 0 ? (
                      bills.map((b) => (
                        <tr key={b.bill_id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 text-slate-800 font-semibold">{b.bill_number}</td>
                          <td className="p-4 text-slate-700 text-sm">
                            {new Date(b.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-4 text-slate-700">{b.customer_name || "Walk-in"}</td>
                          <td className="p-4 text-center text-slate-700">₹{parseFloat(b.sub_total).toFixed(2)}</td>
                          <td className="p-4 text-center text-slate-700">₹{parseFloat(b.gst_amount).toFixed(2)}</td>
                          <td className="p-4 text-center">
                            {b.cash_discount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                                <Percent className="w-3 h-3" />
                                ₹{parseFloat(b.cash_discount).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-4 text-center font-bold text-slate-900">₹{parseFloat(b.total_amount).toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <PaymentBadge mode={b.payment_mode} />
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                                onClick={() => viewBill(b)}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
                                onClick={() => rePrintBill(b)}
                              >
                                <Printer className="w-4 h-4" />
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-12 text-slate-500">
                          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-semibold">No bills found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </motion.div>

        {/* Modal for Bill Details */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
          {selectedBill && (
            <div className="space-y-6">
              {/* Bill Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Customer</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {selectedBill.customer_name || "Walk-in Customer"}
                  </p>
                  {selectedBill.customer_mobile && (
                    <p className="text-sm text-slate-600">{selectedBill.customer_mobile}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-slate-800">
                    {new Date(selectedBill.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedBill.created_at).toLocaleTimeString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Mode</p>
                  <PaymentBadge mode={selectedBill.payment_mode} />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Bill Status</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                    Paid
                  </span>
                </div>
              </div>

              {/* Bill Items */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Bill Items
                </h4>
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
                            <td className="p-3 text-center text-slate-700">₹{parseFloat(item.price).toFixed(2)}</td>
                            <td className="p-3 text-center text-slate-700">{item.gst_percent}%</td>
                            <td className="p-3 text-center text-slate-700">{item.quantity}</td>
                            <td className="p-3 text-center font-bold text-slate-900">₹{parseFloat(item.total).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bill Totals */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 border-b border-slate-200">
                  <h4 className="font-bold text-slate-800">Bill Summary</h4>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Sub Total:</span>
                    <span className="font-semibold">₹{parseFloat(selectedBill.sub_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>GST Amount:</span>
                    <span className="font-semibold">₹{parseFloat(selectedBill.gst_amount).toFixed(2)}</span>
                  </div>
                  {selectedBill.cash_discount > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <Percent className="w-4 h-4" />
                        Cash Discount:
                      </span>
                      <span>- ₹{parseFloat(selectedBill.cash_discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-300 my-2"></div>
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span>₹{parseFloat(selectedBill.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}