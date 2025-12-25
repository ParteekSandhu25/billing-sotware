// import React, { useState, useRef } from "react";

// export default function Billing() {
//   // ---------------- CUSTOMER STATE ----------------
//   const [mobile, setMobile] = useState("");
//   const [customer, setCustomer] = useState(null);
//   const [customerStatus, setCustomerStatus] = useState("idle"); 
//   // idle | found | not_found

//   const [customerForm, setCustomerForm] = useState({
//     name: "",
//     mobile: "",
//     address: ""
//   });

//   // ---------------- PRODUCT STATE ----------------
//   const [qrCode, setQrCode] = useState("");
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const qrInputRef = useRef(null);


//   // ---------------- BILL STATE ----------------
//   const [billItems, setBillItems] = useState([]);
//   const [totals, setTotals] = useState({
//     sub_total: 0,
//     gst_amount: 0,
//     total_amount: 0
//   });

//   // ================= CUSTOMER FLOW =================
//   const handleSearchCustomer = async () => {
//     if (!mobile) {
//       alert("Enter mobile number");
//       return;
//     }

//     const result = await window.api.getCustomerByMobile(mobile);

//     if (result) {
//       setCustomer(result);
//       setCustomerStatus("found");
//     } else {
//       setCustomer(null);
//       setCustomerStatus("not_found");
//       setCustomerForm({
//         name: "",
//         mobile,
//         address: ""
//       });
//     }
//   };

//   const handleCreateCustomer = async () => {
//     const { name, mobile, address } = customerForm;

//     if (!name || !mobile) {
//       alert("Name and mobile are required");
//       return;
//     }

//     const created = await window.api.createCustomer({
//       name,
//       mobile,
//       address
//     });

//     console.log("CREATED: ", created);

//     setCustomer(created);
//     setCustomerStatus("found");
//     setCustomerForm({ name: "", mobile: "", address: "" });
//   };

//   // ================= PRODUCT FLOW =================
//   const handleFetchProduct = async () => {
//     if (!qrCode) {
//       alert("Enter or scan QR code");
//       return;
//     }

//     const fetched = await window.api.getProductByQR(qrCode);

//     if (!fetched) {
//       alert("Product not found");
//       return;
//     }

//     setProduct(fetched);
//     setQrCode("");

//     // focus quantity OR QR (your choice)
//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);
//   };

//   const addProductToBill = () => {
//     if (!product || quantity <= 0) return;

//     let updatedItems = [...billItems];
//     const index = updatedItems.findIndex(
//       (i) => i.product_id === product.id
//     );

//     if (index >= 0) {
//       updatedItems[index].quantity += quantity;
//       updatedItems[index].total =
//         updatedItems[index].quantity * updatedItems[index].price;
//     } else {
//       updatedItems.push({
//         product_id: product.id,
//         product_name: product.name,
//         price: product.price,
//         gst_percent: product.gst_percent,
//         quantity,
//         total: product.price * quantity
//       });
//     }

//     setBillItems(updatedItems);
//     calculateTotals(updatedItems);

//     setProduct(null);
//     setQuantity(1);

//     // 🔥 AUTO-FOCUS BACK TO QR
//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);
//   };


//   const removeItem = (id) => {
//     const updated = billItems.filter((i) => i.product_id !== id);
//     setBillItems(updated);
//     calculateTotals(updated);
//   };

//   // ================= TOTALS =================
//   const calculateTotals = (items) => {
//     const sub_total = items.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );
//     const gst_amount = items.reduce(
//       (sum, i) =>
//         sum + (i.price * i.quantity * i.gst_percent) / 100,
//       0
//     );

//     setTotals({
//       sub_total,
//       gst_amount,
//       total_amount: sub_total + gst_amount
//     });
//   };

//   // ================= BILL GENERATION =================
//   const generateBill = async () => {
//     if (!customer) {
//       alert("Select or create customer first");
//       return;
//     }

//     if (billItems.length === 0) {
//       alert("Add products to bill");
//       return;
//     }

//     const bill_number = `BILL-${Date.now()}`;

//     const result = await window.api.createBill({
//       bill_number,
//       customer_id: customer.id,
//       items: billItems,
//       ...totals
//     });

//     console.log("RESULT", result);

//     if (!result) {
//       alert(result.error);
//       return;
//     }

//       // 🔹 Trigger printing here
//     await window.api.printBill({
//       bill_number: bill_number,
//       customer,
//       items: billItems, // make sure billItems is not empty
//       totals
//     });

//     console.log("***************************");
//     console.log("bill_number", bill_number);
//     console.log("bill_item", billItems);
//     console.log("totals", totals);
//     console.log("customer", customer);
//     console.log("***************************");


//     alert(`Bill ${bill_number} created successfully`);

//     // reset
//     setBillItems([]);
//     setCustomer(null);
//     setCustomerStatus("idle");
//     setMobile("");
//     setTotals({ sub_total: 0, gst_amount: 0, total_amount: 0 });

//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);

//   };

//   // ================= UI =================
//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Create Bill</h2>

//       {/* CUSTOMER SECTION */}
//       <h3>Customer</h3>

//       <input
//         placeholder="Mobile Number"
//         value={mobile}
//         onChange={(e) => setMobile(e.target.value)}
//       />
//       <button onClick={handleSearchCustomer} style={{ marginLeft: 10 }}>
//         Search
//       </button>

//       {customerStatus === "found" && customer && (
//         <p style={{ color: "green" }}>
//           Customer: <b>{customer.name}</b> ({customer.mobile})
//         </p>
//       )}

//       {customerStatus === "not_found" && (
//         <div style={{ marginTop: 15 }}>
//           <p style={{ color: "red" }}>Customer not found. Create new:</p>

//           {/* SAME FORM AS Customers.jsx */}
//           <input
//             placeholder="Name"
//             value={customerForm.name}
//             onChange={(e) =>
//               setCustomerForm({ ...customerForm, name: e.target.value })
//             }
//           />
//           <input
//             placeholder="Mobile"
//             value={customerForm.mobile}
//             disabled
//           />
//           <input
//             placeholder="Address"
//             value={customerForm.address}
//             onChange={(e) =>
//               setCustomerForm({ ...customerForm, address: e.target.value })
//             }
//           />

//           <button
//             onClick={handleCreateCustomer}
//             style={{ marginLeft: 10 }}
//           >
//             Create Customer
//           </button>
//         </div>
//       )}

//       <hr />

//       {/* PRODUCT SECTION */}
//       <h3>Add Product</h3>

//       <input
//         ref={qrInputRef}
//         placeholder="Scan / Enter QR Code"
//         value={qrCode}
//         onChange={(e) => setQrCode(e.target.value)}
//       />
//       <button onClick={handleFetchProduct} style={{ marginLeft: 10 }}>
//         Fetch
//       </button>

//       {product && (
//         <div style={{ marginTop: 10 }}>
//           <p>
//             {product.name} | ₹{product.price} | Stock: {product.quantity}
//           </p>
//           {
//             product.quantity <= 0 ? <p style={{ color: "red" }}>Out of Stock</p>: <div>
//             <input
//               type="number"
//               min="1"
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//             />
//             {quantity > product.quantity ? <p style={{ color: "red" }}>Quantity Exeeding Current Stock</p> : <button onClick={addProductToBill} style={{ marginLeft: 10 }}>
//               Add
//             </button>}
            
//           </div>
//           }
          
//         </div>
//       )}

//       <hr />

//       {/* BILL ITEMS */}
//       <h3>Bill Items</h3>

//       <table border="1" cellPadding="5">
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Price</th>
//             <th>GST %</th>
//             <th>Qty</th>
//             <th>Total</th>
//             <th />
//           </tr>
//         </thead>
//         <tbody>
//           {billItems.map((i) => (
//             <tr key={i.product_id}>
//               <td>{i.product_name}</td>
//               <td>{i.price}</td>
//               <td>{i.gst_percent}</td>
//               <td>{i.quantity}</td>
//               <td>{i.total}</td>
//               <td>
//                 <button onClick={() => removeItem(i.product_id)}>
//                   Remove
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h3>Totals</h3>
//       <p>Sub Total: ₹{totals.sub_total}</p>
//       <p>GST: ₹{totals.gst_amount}</p>
//       <p>Total: ₹{totals.total_amount}</p>

//       <button onClick={generateBill}>Generate Bill</button>
//     </div>
//   );
// }


// ***********************************************************************************

// import React, { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, UserPlus, Package, ShoppingCart, Trash2, Receipt, Check, X } from "lucide-react";

// export default function Billing() {
//   // ---------------- CUSTOMER STATE ----------------
//   const [mobile, setMobile] = useState("");
//   const [customer, setCustomer] = useState(null);
//   const [customerStatus, setCustomerStatus] = useState("idle"); 
//   // idle | found | not_found

//   const [customerForm, setCustomerForm] = useState({
//     name: "",
//     mobile: "",
//     address: ""
//   });

//   // ---------------- PRODUCT STATE ----------------
//   const [qrCode, setQrCode] = useState("");
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const qrInputRef = useRef(null);


//   // ---------------- BILL STATE ----------------
//   const [billItems, setBillItems] = useState([]);
//   const [totals, setTotals] = useState({
//     sub_total: 0,
//     gst_amount: 0,
//     total_amount: 0
//   });

//   // ================= CUSTOMER FLOW =================
//   const handleSearchCustomer = async () => {
//     if (!mobile) {
//       alert("Enter mobile number");
//       return;
//     }

//     const result = await window.api.getCustomerByMobile(mobile);

//     if (result) {
//       setCustomer(result);
//       setCustomerStatus("found");
//     } else {
//       setCustomer(null);
//       setCustomerStatus("not_found");
//       setCustomerForm({
//         name: "",
//         mobile,
//         address: ""
//       });
//     }
//   };

//   const handleCreateCustomer = async () => {
//     const { name, mobile, address } = customerForm;

//     if (!name || !mobile) {
//       alert("Name and mobile are required");
//       return;
//     }

//     const created = await window.api.createCustomer({
//       name,
//       mobile,
//       address
//     });

//     console.log("CREATED: ", created);

//     setCustomer(created);
//     setCustomerStatus("found");
//     setCustomerForm({ name: "", mobile: "", address: "" });
//   };

//   // ================= PRODUCT FLOW =================
//   const handleFetchProduct = async () => {
//     if (!qrCode) {
//       alert("Enter or scan QR code");
//       return;
//     }

//     const fetched = await window.api.getProductByQR(qrCode);

//     if (!fetched) {
//       alert("Product not found");
//       return;
//     }

//     setProduct(fetched);
//     setQrCode("");

//     // focus quantity OR QR (your choice)
//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);
//   };

//   const addProductToBill = () => {
//     if (!product || quantity <= 0) return;

//     let updatedItems = [...billItems];
//     const index = updatedItems.findIndex(
//       (i) => i.product_id === product.id
//     );

//     if (index >= 0) {
//       updatedItems[index].quantity += quantity;
//       updatedItems[index].total =
//         updatedItems[index].quantity * updatedItems[index].price;
//     } else {
//       updatedItems.push({
//         product_id: product.id,
//         product_name: product.name,
//         price: product.price,
//         gst_percent: product.gst_percent,
//         quantity,
//         total: product.price * quantity
//       });
//     }

//     setBillItems(updatedItems);
//     calculateTotals(updatedItems);

//     setProduct(null);
//     setQuantity(1);

//     // 🔥 AUTO-FOCUS BACK TO QR
//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);
//   };


//   const removeItem = (id) => {
//     const updated = billItems.filter((i) => i.product_id !== id);
//     setBillItems(updated);
//     calculateTotals(updated);
//   };

//   // ================= TOTALS =================
//   const calculateTotals = (items) => {
//     const sub_total = items.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );
//     const gst_amount = items.reduce(
//       (sum, i) =>
//         sum + (i.price * i.quantity * i.gst_percent) / 100,
//       0
//     );

//     setTotals({
//       sub_total,
//       gst_amount,
//       total_amount: sub_total + gst_amount
//     });
//   };

//   // ================= BILL GENERATION =================
//   const generateBill = async () => {
//     if (!customer) {
//       alert("Select or create customer first");
//       return;
//     }

//     if (billItems.length === 0) {
//       alert("Add products to bill");
//       return;
//     }

//     const bill_number = `BILL-${Date.now()}`;

//     const result = await window.api.createBill({
//       bill_number,
//       customer_id: customer.id,
//       items: billItems,
//       ...totals
//     });

//     console.log("RESULT", result);

//     if (!result) {
//       alert(result.error);
//       return;
//     }

//     // 🔹 Trigger printing here
//     await window.api.printBill({
//       bill_number: bill_number,
//       customer,
//       items: billItems, // make sure billItems is not empty
//       totals
//     });

//     console.log("***************************");
//     console.log("bill_number", bill_number);
//     console.log("bill_item", billItems);
//     console.log("totals", totals);
//     console.log("customer", customer);
//     console.log("***************************");


//     alert(`Bill ${bill_number} created successfully`);

//     // reset
//     setBillItems([]);
//     setCustomer(null);
//     setCustomerStatus("idle");
//     setMobile("");
//     setTotals({ sub_total: 0, gst_amount: 0, total_amount: 0 });

//     setTimeout(() => {
//       qrInputRef.current?.focus();
//     }, 0);

//   };

//   // ================= UI =================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h2 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Create Bill
//           </h2>
//           <p className="text-purple-300">Fast and efficient billing solution</p>
//         </motion.div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Column - Customer & Product */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* CUSTOMER SECTION */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
//                   <Search className="w-6 h-6 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white">Customer</h3>
//               </div>

//               <div className="flex gap-3 mb-4">
//                 <input
//                   className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
//                   placeholder="Mobile Number"
//                   value={mobile}
//                   onChange={(e) => setMobile(e.target.value)}
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleSearchCustomer}
//                   className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
//                 >
//                   Search
//                 </motion.button>
//               </div>

//               <AnimatePresence mode="wait">
//                 {customerStatus === "found" && customer && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl"
//                   >
//                     <div className="flex items-center gap-2 mb-2">
//                       <Check className="w-5 h-5 text-green-400" />
//                       <span className="text-green-300 font-semibold">Customer Found</span>
//                     </div>
//                     <p className="text-white">
//                       Customer: <b className="text-lg">{customer.name}</b> <span className="text-purple-300">({customer.mobile})</span>
//                     </p>
//                   </motion.div>
//                 )}

//                 {customerStatus === "not_found" && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     className="p-5 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-xl"
//                   >
//                     <div className="flex items-center gap-2 mb-4">
//                       <X className="w-5 h-5 text-red-400" />
//                       <p className="text-red-300 font-semibold">Customer not found. Create new:</p>
//                     </div>

//                     {/* SAME FORM AS Customers.jsx */}
//                     <div className="space-y-3">
//                       <input
//                         className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
//                         placeholder="Name"
//                         value={customerForm.name}
//                         onChange={(e) =>
//                           setCustomerForm({ ...customerForm, name: e.target.value })
//                         }
//                       />
//                       <input
//                         className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-purple-300 cursor-not-allowed"
//                         placeholder="Mobile"
//                         value={customerForm.mobile}
//                         disabled
//                       />
//                       <input
//                         className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
//                         placeholder="Address"
//                         value={customerForm.address}
//                         onChange={(e) =>
//                           setCustomerForm({ ...customerForm, address: e.target.value })
//                         }
//                       />

//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={handleCreateCustomer}
//                         className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
//                       >
//                         <UserPlus className="w-5 h-5" />
//                         Create Customer
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>

//             {/* PRODUCT SECTION */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
//                   <Package className="w-6 h-6 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white">Add Product</h3>
//               </div>

//               <div className="flex gap-3 mb-4">
//                 <input
//                   ref={qrInputRef}
//                   className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
//                   placeholder="Scan / Enter QR Code"
//                   value={qrCode}
//                   onChange={(e) => setQrCode(e.target.value)}
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleFetchProduct}
//                   className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
//                 >
//                   Fetch
//                 </motion.button>
//               </div>

//               <AnimatePresence>
//                 {product && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl">
//                       <p className="text-white mb-3">
//                         <span className="font-bold text-lg">{product.name}</span>
//                         <span className="text-purple-300"> | ₹{product.price} | Stock: {product.quantity}</span>
//                       </p>
                      
//                       {product.quantity <= 0 ? (
//                         <div className="flex items-center gap-2">
//                           <X className="w-5 h-5 text-red-400" />
//                           <p className="text-red-400 font-semibold">Out of Stock</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           <div className="flex gap-3 items-center">
//                             <input
//                               type="number"
//                               min="1"
//                               value={quantity}
//                               onChange={(e) => setQuantity(Number(e.target.value))}
//                               className="w-24 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
//                             />
//                             {quantity > product.quantity ? (
//                               <p className="text-red-400 font-semibold">Quantity Exceeding Current Stock</p>
//                             ) : (
//                               <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={addProductToBill}
//                                 className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all"
//                               >
//                                 Add
//                               </motion.button>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </div>

//           {/* Right Column - Bill Items & Summary */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="lg:col-span-1"
//           >
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl sticky top-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
//                   <ShoppingCart className="w-6 h-6 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-white">Bill Items</h3>
//               </div>

//               {/* BILL ITEMS TABLE */}
//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full text-white border-collapse">
//                   <thead>
//                     <tr className="border-b border-white/20">
//                       <th className="text-left py-3 px-2 text-purple-300 font-semibold text-sm">Product</th>
//                       <th className="text-right py-3 px-2 text-purple-300 font-semibold text-sm">Price</th>
//                       <th className="text-right py-3 px-2 text-purple-300 font-semibold text-sm">GST %</th>
//                       <th className="text-right py-3 px-2 text-purple-300 font-semibold text-sm">Qty</th>
//                       <th className="text-right py-3 px-2 text-purple-300 font-semibold text-sm">Total</th>
//                       <th className="py-3 px-2"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <AnimatePresence>
//                       {billItems.map((i) => (
//                         <motion.tr
//                           key={i.product_id}
//                           initial={{ opacity: 0, x: 20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -20 }}
//                           className="border-b border-white/10 hover:bg-white/5 transition-colors"
//                         >
//                           <td className="py-3 px-2 text-sm">{i.product_name}</td>
//                           <td className="text-right py-3 px-2 text-sm">{i.price}</td>
//                           <td className="text-right py-3 px-2 text-sm">{i.gst_percent}</td>
//                           <td className="text-right py-3 px-2 text-sm">{i.quantity}</td>
//                           <td className="text-right py-3 px-2 font-semibold text-sm">{i.total}</td>
//                           <td className="py-3 px-2 text-center">
//                             <motion.button
//                               whileHover={{ scale: 1.1 }}
//                               whileTap={{ scale: 0.9 }}
//                               onClick={() => removeItem(i.product_id)}
//                               className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
//                             >
//                               <Trash2 className="w-4 h-4 text-red-400" />
//                             </motion.button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </AnimatePresence>
//                   </tbody>
//                 </table>

//                 {billItems.length === 0 && (
//                   <div className="text-center py-8 text-purple-300">
//                     <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                     <p>No items in bill</p>
//                   </div>
//                 )}
//               </div>

//               {/* TOTALS */}
//               <div className="space-y-3 p-4 bg-white/10 rounded-xl border border-white/20 mb-6">
//                 <h3 className="text-xl font-bold text-white mb-3">Totals</h3>
//                 <div className="flex justify-between text-purple-300">
//                   <span>Sub Total:</span>
//                   <span className="font-semibold">₹{totals.sub_total}</span>
//                 </div>
//                 <div className="flex justify-between text-purple-300">
//                   <span>GST:</span>
//                   <span className="font-semibold">₹{totals.gst_amount}</span>
//                 </div>
//                 <div className="h-px bg-white/20 my-2"></div>
//                 <div className="flex justify-between text-white text-xl font-bold">
//                   <span>Total:</span>
//                   <span>₹{totals.total_amount}</span>
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={generateBill}
//                 className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
//               >
//                 <Receipt className="w-6 h-6" />
//                 Generate Bill
//               </motion.button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ***************************************************************************************
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Package, ShoppingCart, Trash2, Receipt, Check, X, Plus, Minus } from "lucide-react";

export default function Billing() {
  // ---------------- CUSTOMER STATE ----------------
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("idle"); 
  // idle | found | not_found

  const [customerForm, setCustomerForm] = useState({
    name: "",
    mobile: "",
    address: ""
  });

  // ---------------- PRODUCT STATE ----------------
  const [qrCode, setQrCode] = useState("");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const qrInputRef = useRef(null);


  // ---------------- BILL STATE ----------------
  const [billItems, setBillItems] = useState([]);
  const [totals, setTotals] = useState({
    sub_total: 0,
    gst_amount: 0,
    total_amount: 0
  });

  // ================= CUSTOMER FLOW =================
  const handleSearchCustomer = async () => {
    if (!mobile) {
      alert("Enter mobile number");
      return;
    }

    const result = await window.api.getCustomerByMobile(mobile);

    if (result) {
      setCustomer(result);
      setCustomerStatus("found");
    } else {
      setCustomer(null);
      setCustomerStatus("not_found");
      setCustomerForm({
        name: "",
        mobile,
        address: ""
      });
    }
  };

  const handleCreateCustomer = async () => {
    const { name, mobile, address } = customerForm;

    if (!name || !mobile) {
      alert("Name and mobile are required");
      return;
    }

    const created = await window.api.createCustomer({
      name,
      mobile,
      address
    });

    console.log("CREATED: ", created);

    setCustomer(created);
    setCustomerStatus("found");
    setCustomerForm({ name: "", mobile: "", address: "" });
  };

  // ================= PRODUCT FLOW =================
  const handleFetchProduct = async () => {
    if (!qrCode) {
      alert("Enter or scan QR code");
      return;
    }

    const fetched = await window.api.getProductByQR(qrCode);

    if (!fetched) {
      alert("Product not found");
      return;
    }

    setProduct(fetched);
    setQrCode("");

    // focus quantity OR QR (your choice)
    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);
  };

  const addProductToBill = () => {
    if (!product || quantity <= 0) return;

    let updatedItems = [...billItems];
    const index = updatedItems.findIndex(
      (i) => i.product_id === product.id
    );

    if (index >= 0) {
      updatedItems[index].quantity += quantity;
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].price;
    } else {
      updatedItems.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        gst_percent: product.gst_percent,
        quantity,
        total: product.price * quantity
      });
    }

    setBillItems(updatedItems);
    calculateTotals(updatedItems);

    setProduct(null);
    setQuantity(1);

    // 🔥 AUTO-FOCUS BACK TO QR
    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);
  };


  const removeItem = (id) => {
    const updated = billItems.filter((i) => i.product_id !== id);
    setBillItems(updated);
    calculateTotals(updated);
  };

  const getAvailableStockNumber = (id, currQuantity) => {
    const item = billItems.find((i) => i.product_id === id);
    if(!item) return currQuantity
    return currQuantity - item.quantity
  }

  const increaseQuantity = async (productId) => {
    const item = billItems.find((i) => i.product_id === productId);
    if (!item) return;

    // Fetch current product stock to check availability
    const currentProduct = await window.api.getProductById(productId);

    if (!currentProduct) {
      alert("Unable to fetch product details");
      return;
    }

    if (item.quantity >= currentProduct.quantity) {
      alert("Cannot exceed available stock");
      return;
    }

    const updated = billItems.map((i) =>
      i.product_id === productId
        ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
        : i
    );
    setBillItems(updated);
    calculateTotals(updated);
  };

  const decreaseQuantity = (productId) => {
    const item = billItems.find((i) => i.product_id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeItem(productId);
      return;
    }

    const updated = billItems.map((i) =>
      i.product_id === productId
        ? { ...i, quantity: i.quantity - 1, total: (i.quantity - 1) * i.price }
        : i
    );
    setBillItems(updated);
    calculateTotals(updated);
  };

  // ================= TOTALS =================
  const calculateTotals = (items) => {
    const sub_total = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const gst_amount = items.reduce(
      (sum, i) =>
        sum + (i.price * i.quantity * i.gst_percent) / 100,
      0
    );

    setTotals({
      sub_total,
      gst_amount,
      total_amount: sub_total + gst_amount
    });
  };

  // ================= BILL GENERATION =================
  const generateBill = async () => {
    if (!customer) {
      alert("Select or create customer first");
      return;
    }

    if (billItems.length === 0) {
      alert("Add products to bill");
      return;
    }

    const bill_number = `BILL-${Date.now()}`;

    const result = await window.api.createBill({
      bill_number,
      customer_id: customer.id,
      items: billItems,
      ...totals
    });

    console.log("RESULT", result);

    if (!result) {
      alert(result.error);
      return;
    }

    // 🔹 Trigger printing here
    await window.api.printBill({
      bill_number: bill_number,
      customer,
      items: billItems, // make sure billItems is not empty
      totals
    });

    console.log("***************************");
    console.log("bill_number", bill_number);
    console.log("bill_item", billItems);
    console.log("totals", totals);
    console.log("customer", customer);
    console.log("***************************");


    alert(`Bill ${bill_number} created successfully`);

    // reset
    setBillItems([]);
    setCustomer(null);
    setCustomerStatus("idle");
    setMobile("");
    setTotals({ sub_total: 0, gst_amount: 0, total_amount: 0 });

    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);

  };

  // ================= UI =================
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
            Create Bill
          </h2>
          <p className="text-slate-600">Fast and efficient billing solution</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Product */}
          <div className="lg:col-span-2 space-y-6">
            {/* CUSTOMER SECTION */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Customer</h3>
              </div>

              <div className="flex gap-3 mb-4">
                <input
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === '' || /^\d+$/.test(value)) {
                      setMobile(value);
                    }
                  }}
                  maxLength={10}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearchCustomer}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Search
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {customerStatus === "found" && customer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-semibold">Customer Found</span>
                    </div>
                    <p className="text-slate-800">
                      Customer: <b className="text-lg">{customer.name}</b> <span className="text-slate-600">({customer.mobile})</span>
                    </p>
                  </motion.div>
                )}

                {customerStatus === "not_found" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-300 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <X className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 font-semibold">Customer not found. Create new:</p>
                    </div>

                    {/* SAME FORM AS Customers.jsx */}
                    <div className="space-y-3">
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        placeholder="Name *"
                        value={customerForm.name}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, name: e.target.value })
                        }
                      />
                      <input
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-500 cursor-not-allowed"
                        placeholder="Mobile"
                        value={customerForm.mobile}
                        disabled
                      />
                      <input
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder="Address"
                        value={customerForm.address}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, address: e.target.value })
                        }
                      />

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateCustomer}
                        className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-5 h-5" />
                        Create Customer
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* PRODUCT SECTION */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Add Product</h3>
              </div>

              <div className="flex gap-3 mb-4">
                <input
                  ref={qrInputRef}
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Scan / Enter QR Code"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFetchProduct}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Fetch
                </motion.button>
              </div>

              <AnimatePresence>
                {product && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300 rounded-xl">
                      <p className="text-slate-800 mb-3">
                        <span className="font-bold text-lg">{product.name}</span>
                        <span className="text-slate-600"> | ₹{product.price} | Stock: {getAvailableStockNumber(product.id, product.quantity)}</span>
                      </p>
                      
                      {getAvailableStockNumber(product.id, product.quantity) <= 0 ? (
                        <div className="flex items-center gap-2">
                          <X className="w-5 h-5 text-red-600" />
                          <p className="text-red-700 font-semibold">Out of Stock</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-3 items-center">
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => setQuantity(Number(e.target.value))}
                              className="w-24 px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                            {quantity > product.quantity ? (
                              <p className="text-red-700 font-semibold">Quantity Exceeding Current Stock</p>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addProductToBill}
                                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/50 transition-all"
                              >
                                Add
                              </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Bill Items & Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-xl sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Bill Items</h3>
              </div>

              {/* BILL ITEMS TABLE */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-slate-800 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-slate-600 font-semibold text-sm">Product</th>
                      <th className="text-right py-3 px-2 text-slate-600 font-semibold text-sm">Price</th>
                      <th className="text-right py-3 px-2 text-slate-600 font-semibold text-sm">GST %</th>
                      <th className="text-center py-3 px-2 text-slate-600 font-semibold text-sm">Qty</th>
                      <th className="text-right py-3 px-2 text-slate-600 font-semibold text-sm">Total</th>
                      <th className="py-3 px-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {billItems.map((i) => (
                        <motion.tr
                          key={i.product_id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-2 text-sm">{i.product_name}</td>
                          <td className="text-right py-3 px-2 text-sm">{i.price}</td>
                          <td className="text-right py-3 px-2 text-sm">{i.gst_percent}</td>
                          <td className="text-center py-3 px-2">
                            <div className="flex items-center justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => decreaseQuantity(i.product_id)}
                                className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition-all"
                              >
                                <Minus className="w-3.5 h-3.5 text-red-600" />
                              </motion.button>
                              <span className="text-sm font-semibold min-w-[24px] text-center">{i.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => increaseQuantity(i.product_id)}
                                className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5 text-green-600" />
                              </motion.button>
                            </div>
                          </td>
                          <td className="text-right py-3 px-2 font-semibold text-sm">{i.total}</td>
                          <td className="py-3 px-2 text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(i.product_id)}
                              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {billItems.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No items in bill</p>
                  </div>
                )}
              </div>

              {/* TOTALS */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">Totals</h3>
                <div className="flex justify-between text-slate-600">
                  <span>Sub Total:</span>
                  <span className="font-semibold">₹{totals.sub_total}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST:</span>
                  <span className="font-semibold">₹{totals.gst_amount}</span>
                </div>
                <div className="h-px bg-slate-300 my-2"></div>
                <div className="flex justify-between text-slate-800 text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{totals.total_amount}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateBill}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
              >
                <Receipt className="w-6 h-6" />
                Generate Bill
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}