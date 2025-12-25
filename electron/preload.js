// const { contextBridge, ipcRenderer } = require("electron");

// // contextBridge.exposeInMainWorld("api", {
// //   getProductByQR: (qr) =>
// //     ipcRenderer.invoke("get-product-by-qr", qr),

// //   getCustomerByMobile: (mobile) =>
// //     ipcRenderer.invoke("get-customer-by-mobile", mobile),

// //   createBill: (bill) =>
// //     ipcRenderer.invoke("create-bill", bill)
// // });

// contextBridge.exposeInMainWorld("api", {
//   addProduct: (data) => ipcRenderer.invoke("add-product", data),
//   getProducts: () => ipcRenderer.invoke("get-products"),
//   updateProduct: (data) => ipcRenderer.invoke("update-product", data),
//   deleteProduct: (id) => ipcRenderer.invoke("delete-product", id)
// });



// *************************************************************************

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // User
  getUserByUsername: (username) => ipcRenderer.invoke("getUserByUsername", username),
  // updateUserPassword: (userId, newPassword) => ipcRenderer.invoke("updateUserPassword", userId, newPassword),
  getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
  updateOwnerPassword: (password) => ipcRenderer.invoke("update-owner-password", password),
  updateStaffPassword: (password) => ipcRenderer.invoke("update-staff-password", password),
  loginUser: (username, password) => ipcRenderer.invoke("login-user", username, password),

  // Customers
  getAllCustomers: () => ipcRenderer.invoke("getAllCustomers"),
  createCustomer: (data) => ipcRenderer.invoke("createCustomer", data),
  updateCustomer: (id, data) => ipcRenderer.invoke("updateCustomer", id, data),
  deleteCustomer: (id) => ipcRenderer.invoke("deleteCustomer", id),
  getCustomerByMobile: (mobile) => ipcRenderer.invoke("getCustomerByMobile", mobile),
  createCustomer: (data) => ipcRenderer.invoke("createCustomer", data),
  getCustomerById: (id) => ipcRenderer.invoke("getCustomerById", id),
  getCustomerPurchaseHistory: (id) => ipcRenderer.invoke("getCustomerPurchaseHistory", id),
  


  // Products
  getAllProducts: () => ipcRenderer.invoke("getAllProducts"),
  createProduct: (data) => ipcRenderer.invoke("createProduct", data),
  updateProduct: (id, data) => ipcRenderer.invoke("updateProduct", id, data),
  deleteProduct: (id) => ipcRenderer.invoke("deleteProduct", id),
  getProductByQR: (qr) => ipcRenderer.invoke("getProductByQR", qr),
  getProductById: (id) => ipcRenderer.invoke("getProductById", id),



  // Bills
  getAllBills: () => ipcRenderer.invoke("getAllBills"),
  createBill: (data) => ipcRenderer.invoke("createBill", data),
  getBillItems: (billId) => ipcRenderer.invoke("getBillItems", billId),
  createBill: (data) => ipcRenderer.invoke("createBill", data),
  printBill: (data) => ipcRenderer.invoke("printBill", data),
  getDailySales: () => ipcRenderer.invoke("get-daily-sales"),
  getTotalSales: () => ipcRenderer.invoke("get-total-sales"),
  exportDailyReport: () => ipcRenderer.invoke("export-daily-report"),
  exportTotalReport: () => ipcRenderer.invoke("export-total-report"),


  // Dashboard
  getDashboardStats: () => ipcRenderer.invoke("getDashboardStats")
});
