import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  History, 
  Receipt, 
  Calendar,
  ShoppingBag,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail
} from "lucide-react";

export default function CustomerHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("newest");
  const PAGE_SIZE = 5; // Show 5 bills per page

  // Fetch customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await window.api.getCustomerById(id);
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };
    fetchCustomer();
  }, [id]);

  // Fetch purchase history with pagination
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const sortMapping = {
        newest: { sortBy: "b.created_at", sortOrder: "DESC" },
        oldest: { sortBy: "b.created_at", sortOrder: "ASC" },
        highest: { sortBy: "b.total_amount", sortOrder: "DESC" },
        lowest: { sortBy: "b.total_amount", sortOrder: "ASC" }
      };

      const { sortBy, sortOrder } = sortMapping[sort];

      const options = {
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder
      };

      console.log("📞 Fetching purchase history with options:", options);

      const result = await window.api.getCustomerPurchaseHistory(id, options);

      console.log("✅ Purchase history API response:", result);

      setHistory(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("❌ Error fetching purchase history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchHistory();
      } else {
        setPage(1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sort]);

  // Fetch when page changes
  useEffect(() => {
    fetchHistory();
  }, [page, id]);

  // Group by bill
  const grouped = history.reduce((acc, item) => {
    acc[item.bill_id] ||= {
      bill_id: item.bill_id,
      bill_number: item.bill_number,
      total_amount: item.total_amount,
      created_at: item.created_at,
      items: []
    };
    acc[item.bill_id].items.push(item);
    return acc;
  }, {});

  const bills = Object.values(grouped);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-white/90 backdrop-blur-lg border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-slate-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Customer Info Card */}
        {customer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{customer.name}</h3>
                  <div className="flex flex-col gap-1 mt-2">
                    {customer.mobile && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{customer.mobile}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-slate-600 mb-1">Total Purchases</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {total}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
              <History className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Purchase History
            </h2>
          </div>
          <p className="text-slate-600">Complete transaction history for this customer</p>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <span className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bills List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <span className="ml-3 text-slate-600">Loading purchase history...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {bills.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-slate-200 shadow-xl text-center"
              >
                <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-xl text-slate-600 font-semibold">No purchase history found</p>
                <p className="text-sm text-slate-500 mt-2">This customer hasn't made any purchases yet</p>
              </motion.div>
            ) : (
              bills.map((bill, index) => (
                <motion.div
                  key={bill.bill_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  {/* Bill Header */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b-2 border-violet-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-slate-800">
                            Bill #{bill.bill_number}
                          </h4>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm">
                              {new Date(bill.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                        <DollarSign className="w-5 h-5 text-white" />
                        <span className="text-2xl font-bold text-white">
                          ₹{parseFloat(bill.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bill Items Table */}
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                          <tr>
                            <th className="p-4 text-left text-sm font-bold text-slate-700">Product</th>
                            <th className="p-4 text-center text-sm font-bold text-slate-700">Qty</th>
                            <th className="p-4 text-center text-sm font-bold text-slate-700">Price</th>
                            <th className="p-4 text-center text-sm font-bold text-slate-700">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-violet-50/50 transition-colors">
                              <td className="p-4 text-slate-800 font-semibold">{item.product_name}</td>
                              <td className="p-4 text-center text-slate-700">{item.quantity}</td>
                              <td className="p-4 text-center text-slate-700">₹{parseFloat(item.price).toFixed(2)}</td>
                              <td className="p-4 text-center font-bold text-slate-900">₹{parseFloat(item.total).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Bill Total */}
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-end">
                      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl px-6 py-3">
                        <span className="text-slate-600 font-semibold mr-3">Bill Total:</span>
                        <span className="text-2xl font-bold text-violet-700">
                          ₹{parseFloat(bill.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-lg rounded-xl p-3 border border-slate-200 shadow-lg">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}