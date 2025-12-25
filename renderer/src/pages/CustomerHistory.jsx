import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  History, 
  Receipt, 
  Calendar,
  ShoppingBag,
  DollarSign
} from "lucide-react";

export default function CustomerHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.api.getCustomerPurchaseHistory(id).then(setHistory);
  }, [id]);

  // Group by bill
  const grouped = history.reduce((acc, item) => {
    acc[item.bill_id] ||= {
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
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

        {/* Bills List */}
        <div className="space-y-6">
          {bills.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-slate-200 shadow-xl text-center"
            >
              <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-xl text-slate-600 font-semibold">No purchase history found</p>
            </motion.div>
          ) : (
            bills.map((bill, index) => (
              <motion.div
                key={bill.bill_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
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
                            {new Date(bill.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                      <span className="text-2xl font-bold text-white">
                        ₹{bill.total_amount}
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
                            <td className="p-4 text-center text-slate-700">₹{item.price}</td>
                            <td className="p-4 text-center font-bold text-slate-900">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bill Total */}
                  <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-end">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl px-6 py-3">
                      <span className="text-slate-600 font-semibold mr-3">Bill Total:</span>
                      <span className="text-2xl font-bold text-violet-700">₹{bill.total_amount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}