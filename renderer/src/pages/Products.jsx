// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useUser } from "../contexts/UserContext";
// import { 
//   Package, 
//   Search, 
//   ChevronLeft, 
//   ChevronRight,
//   Edit,
//   Trash2,
//   Plus
// } from "lucide-react";
// import TableToolbar from "../components/TableToolbar";
// import Modal from "../components/Modal";
// import ProductForm from "../components/ProductForm";

// export default function Products() {
//   const { user } = useUser();
//   const [products, setProducts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Pagination/Search/Sort state
//   const [search, setSearch] = useState("");
//   const [sort, setSort] = useState("newest");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 10;

//   const fetchProducts = async () => {
//     const dbProducts = await window.api.getAllProducts();
//     setProducts(dbProducts || []);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleAddOrUpdate = async (data) => {
//     if (editingProduct) {
//       await window.api.updateProduct(editingProduct.id, data);
//       setEditingProduct(null);
//     } else {
//       await window.api.createProduct(data);
//     }
//     setModalOpen(false);
//     fetchProducts();
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!user || user.role !== "owner") return;
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       await window.api.deleteProduct(id);
//       fetchProducts();
//     }
//   };

//   // Filtered, sorted, paginated
//   const filtered = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
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
//             <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
//               <Package className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               Products
//             </h2>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setModalOpen(true)}
//             className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Add Product
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
//             placeholder="Search product..."
//           />
//         </motion.div>

//         {/* Products Table */}
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
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">QR Code</th>
//                   <th className="p-4 text-left text-sm font-bold text-slate-700">SKU</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Price</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">GST %</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Qty</th>
//                   <th className="p-4 text-center text-sm font-bold text-slate-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((p) => (
//                   <tr key={p.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
//                     <td className="p-4 text-slate-800 font-semibold">{p.name}</td>
//                     <td className="p-4 text-slate-700">{p.qr_code}</td>
//                     <td className="p-4 text-slate-700">{p.sku}</td>
//                     <td className="p-4 text-center text-slate-700">₹{p.price}</td>
//                     <td className="p-4 text-center text-slate-700">{p.gst_percent}%</td>
//                     <td className="p-4 text-center font-bold text-slate-900">{p.quantity}</td>
//                     <td className="p-4">
//                       <div className="flex gap-2 justify-center">
//                         <button
//                           onClick={() => handleEdit(p)}
//                           className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
//                         >
//                           <Edit className="w-4 h-4" />
//                           Edit
//                         </button>
//                         {user.role === "owner" && (
//                           <button
//                             onClick={() => handleDelete(p.id)}
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
//             setEditingProduct(null);
//           }}
//           title={editingProduct ? "Edit Product" : "Add Product"}
//         >
//           <ProductForm
//             initialData={editingProduct}
//             onSubmit={handleAddOrUpdate}
//             onCancel={() => {
//               setModalOpen(false);
//               setEditingProduct(null);
//             }}
//           />
//         </Modal>
//       </div>
//     </div>
//   );
// }



// *************************************************************************************
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { 
  Package, 
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import TableToolbar from "../components/TableToolbar";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Backend pagination state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Map sort values to database column names
      const sortMapping = {
        newest: { sortBy: "created_at", sortOrder: "DESC" },
        oldest: { sortBy: "created_at", sortOrder: "ASC" },
        az: { sortBy: "name", sortOrder: "ASC" },
        za: { sortBy: "name", sortOrder: "DESC" },
        priceHighLow: { sortBy: "price", sortOrder: "DESC" },
        priceLowHigh: { sortBy: "price", sortOrder: "ASC" },
        gstHighLow: { sortBy: "gst_percent", sortOrder: "DESC" },
        gstLowHigh: { sortBy: "gst_percent", sortOrder: "ASC" },
        stockHighLow: { sortBy: "quantity", sortOrder: "DESC" },
        stockLowHigh: { sortBy: "quantity", sortOrder: "ASC" }
      };

      const { sortBy, sortOrder } = sortMapping[sort];

      // Call backend with pagination, sorting, and search
      const result = await window.api.getAllProducts({
        page,
        limit: PAGE_SIZE,
        sortBy,
        sortOrder,
        search: search || undefined
      });

      setProducts(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchProducts();
      } else {
        setPage(1); // This will trigger fetchProducts via the page effect
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, sort]);

  // Fetch when page changes
  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleAddOrUpdate = async (data) => {
    try {
      if (editingProduct) {
        await window.api.updateProduct(editingProduct.id, data);
        setEditingProduct(null);
      } else {
        await window.api.createProduct(data);
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!user || user.role !== "owner") return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await window.api.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. It may be used in existing bills.");
      }
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
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Products
              </h2>
              <p className="text-slate-600 text-sm mt-1">Total: {total} products</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
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
            placeholder="Search product by name, QR code, or SKU..."
            sortOptions={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "az", label: "Name: A → Z" },
              { value: "za", label: "Name: Z → A" },
              { value: "priceHighLow", label: "Price: High → Low" },
              { value: "priceLowHigh", label: "Price: Low → High" },
              { value: "gstHighLow", label: "GST: High → Low" },
              { value: "gstLowHigh", label: "GST: Low → High" },
              { value: "stockHighLow", label: "Stock: High → Low" },
              { value: "stockLowHigh", label: "Stock: Low → High" }
            ]}
          />
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600">Loading products...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">Name</th>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">QR Code</th>
                    <th className="p-4 text-left text-sm font-bold text-slate-700">SKU</th>
                    <th className="p-4 text-center text-sm font-bold text-slate-700">Price</th>
                    <th className="p-4 text-center text-sm font-bold text-slate-700">GST %</th>
                    <th className="p-4 text-center text-sm font-bold text-slate-700">Stock</th>
                    <th className="p-4 text-center text-sm font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p) => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 text-slate-800 font-semibold">{p.name}</td>
                        <td className="p-4 text-slate-700">{p.qr_code || "-"}</td>
                        <td className="p-4 text-slate-700">{p.sku || "-"}</td>
                        <td className="p-4 text-center text-slate-700">₹{parseFloat(p.price).toFixed(2)}</td>
                        <td className="p-4 text-center text-slate-700">{p.gst_percent}%</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                            p.quantity === 0 
                              ? 'bg-red-100 text-red-700 border border-red-300' 
                              : p.quantity < 10 
                              ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                              : 'bg-green-100 text-green-700 border border-green-300'
                          }`}>
                            {p.quantity === 0 && <AlertCircle className="w-3 h-3" />}
                            {p.quantity}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(p)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            {user.role === "owner" && (
                              <button
                                onClick={() => handleDelete(p.id)}
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
                      <td colSpan="7" className="text-center py-12 text-slate-500">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">No products found</p>
                        <p className="text-sm">Try adjusting your search or add a new product</p>
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
            setEditingProduct(null);
          }}
          title={editingProduct ? "Edit Product" : "Add Product"}
        >
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleAddOrUpdate}
            onCancel={() => {
              setModalOpen(false);
              setEditingProduct(null);
            }}
          />
        </Modal>
      </div>
    </div>
  );
}