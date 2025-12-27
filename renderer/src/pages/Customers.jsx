// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../contexts/UserContext";
// import { 
//   Users, 
//   Edit,
//   Trash2,
//   Plus,
//   ExternalLink
// } from "lucide-react";
// import TableToolbar from "../components/TableToolbar";
// import Modal from "../components/Modal";
// import CustomerForm from "../components/CustomerForm";

// export default function Customers() {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const [customers, setCustomers] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState(null);

//   // Toolbar state
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 10;

//   const fetchCustomers = async () => {
//     const dbCustomers = await window.api.getAllCustomers();
//     setCustomers(dbCustomers || []);
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

// const handleAddOrUpdate = async (data) => {
//   try {
//     if (editingCustomer) {
//       await window.api.updateCustomer(editingCustomer.id, data);
//       setEditingCustomer(null);
//     } else {
//       await window.api.createCustomer(data);
//     }

//     // Only runs if NO error
//     setModalOpen(false);
//     fetchCustomers();

//   } catch (error) {
//     console.error(error);

//     // Show user-friendly message
//     if (error.message?.includes("UNIQUE constraint failed")) {
//       alert("A customer with this mobile number already exists.");
//     } else {
//       alert("Something went wrong. Please try again.");
//     }
//   }
// };

//   const handleEdit = (customer) => {
//     setEditingCustomer(customer);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!user || user.role !== "owner") return;
//     if (window.confirm("Are you sure you want to delete this customer?")) {
//       await window.api.deleteCustomer(id);
//       fetchCustomers();
//     }
//   };

//   // Filter, sort, paginate
//   const filtered = customers.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const sorted = [...filtered].sort((a, b) => {
//     switch (sort) {
//       case "oldest": return new Date(a.created_at) - new Date(b.created_at);
//       case "az": return a.name.localeCompare(b.name);
//       case "za": return b.name.localeCompare(a.name);
//       default: return new Date(b.created_at) - new Date(a.created_at);
//     }
//   });

//   const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
//   const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
//         >
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
//               <Users className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
//               Customers
//             </h2>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setModalOpen(true)}
//             className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Add Customer
//           </motion.button>
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
//             placeholder="Search customer..."
//           />
//         </motion.div>

//         {/* Customers Table */}
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
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">Name</th>
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">Mobile</th>
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">Address</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((c) => (
//                   <tr key={c.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
//                     <td 
//                       className="p-4 text-slate-800 font-semibold cursor-pointer hover:text-blue-600 transition-colors group"
//                       onClick={() => navigate(`/customer/${c.id}`)}
//                     >
//                       <span className="flex items-center gap-2">
//                         {c.name}
//                         <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </span>
//                     </td>
//                     <td className="p-4 text-slate-700">{c.mobile}</td>
//                     <td className="p-4 text-slate-700">{c.address}</td>
//                     <td className="p-4">
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={() => handleEdit(c)}
//                           className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
//                         >
//                           <Edit className="w-4 h-4" />
//                           Edit
//                         </button>
//                         {user.role === "owner" && (
//                           <button
//                             onClick={() => handleDelete(c.id)}
//                             className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center gap-2"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             Delete
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>

//         {/* Modal */}
//         <Modal
//           isOpen={modalOpen}
//           onClose={() => {
//             setModalOpen(false);
//             setEditingCustomer(null);
//           }}
//           title={editingCustomer ? "Edit Customer" : "Add Customer"}
//         >
//           <CustomerForm
//             initialData={editingCustomer}
//             onSubmit={handleAddOrUpdate}
//             onCancel={() => {
//               setModalOpen(false);
//               setEditingCustomer(null);
//             }}
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// }


// ******************************************************************************
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { 
  Users, 
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Loader2
} from "lucide-react";
import TableToolbar from "../components/TableToolbar";
import Modal from "../components/Modal";
import CustomerForm from "../components/CustomerForm";

export default function Customers() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Backend pagination state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Map sort values to database column names
      const sortMapping = {
        newest: { sortBy: "created_at", sortOrder: "DESC" },
        oldest: { sortBy: "created_at", sortOrder: "ASC" },
        az: { sortBy: "name", sortOrder: "ASC" },
        za: { sortBy: "name", sortOrder: "DESC" }
      };

      const { sortBy, sortOrder } = sortMapping[sort];

      const options = {
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
        search: search || undefined
      };

      console.log("📞 Fetching customers with options:", options);

      // Call backend with pagination, sorting, and search
      const result = await window.api.getAllCustomers(options);

      console.log("✅ Customers API response:", result);

      setCustomers(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchCustomers();
      } else {
        setPage(1); // This will trigger fetchCustomers via the page effect
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, sort]);

  // Fetch when page changes
  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleAddOrUpdate = async (data) => {
    try {
      if (editingCustomer) {
        await window.api.updateCustomer(editingCustomer.id, data);
        setEditingCustomer(null);
      } else {
        await window.api.createCustomer(data);
      }

      setModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error(error);

      if (error.message?.includes("UNIQUE constraint failed")) {
        alert("A customer with this mobile number already exists.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== "owner") return;
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await window.api.deleteCustomer(id);
      fetchCustomers();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Customers
              </h2>
              <p className="text-slate-600 text-sm mt-1">Total: {total} customers</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </motion.button>
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
            placeholder="Search customer by name, mobile, or email..."
          />
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600">Loading customers...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">Name</th>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">Mobile</th>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">Email</th>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">Address</th>
                    <th className="p-4 text-center text-sm font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((c) => (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                        <td 
                          className="p-4 text-slate-800 font-semibold cursor-pointer hover:text-blue-600 transition-colors group"
                          onClick={() => navigate(`/customer/${c.id}`)}
                        >
                          <span className="flex items-center gap-2">
                            {c.name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </td>
                        <td className="p-4 text-slate-700">{c.mobile}</td>
                        <td className="p-4 text-slate-700">{c.email || "-"}</td>
                        <td className="p-4 text-slate-700">{c.address || "-"}</td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(c)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            {user.role === "owner" && (
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-slate-500">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">No customers found</p>
                        <p className="text-sm">Try adjusting your search or add a new customer</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingCustomer(null);
          }}
          title={editingCustomer ? "Edit Customer" : "Add Customer"}
        >
          <CustomerForm
            initialData={editingCustomer}
            onSubmit={handleAddOrUpdate}
            onCancel={() => {
              setModalOpen(false);
              setEditingCustomer(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}