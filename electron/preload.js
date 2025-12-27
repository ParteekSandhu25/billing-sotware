// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // ===== USERS / AUTH =====
  getUserByUsername: (username) => ipcRenderer.invoke("getUserByUsername", username),
  loginUser: (username, password) => ipcRenderer.invoke("login-user", username, password),
  getAllUsers: (options) => ipcRenderer.invoke("getAllUsers", options),
  updateOwnerPassword: (data) => ipcRenderer.invoke("update-owner-password", data),
  updateStaffPassword: (data) => ipcRenderer.invoke("update-staff-password", data),

  // ===== CUSTOMERS =====
  getAllCustomers: (options) => ipcRenderer.invoke("getAllCustomers", options),
  getCustomerById: (id) => ipcRenderer.invoke("getCustomerById", id),
  createCustomer: (customer) => ipcRenderer.invoke("createCustomer", customer),
  updateCustomer: (id, customer) => ipcRenderer.invoke("updateCustomer", id, customer),
  deleteCustomer: (id) => ipcRenderer.invoke("deleteCustomer", id),
  getCustomerByMobile: (mobile) => ipcRenderer.invoke("getCustomerByMobile", mobile),
  getCustomerPurchaseHistory: (customerId, options) => 
    ipcRenderer.invoke("getCustomerPurchaseHistory", customerId, options),

  // ===== PRODUCTS =====
  getAllProducts: (options) => ipcRenderer.invoke("getAllProducts", options),
  getProductById: (id) => ipcRenderer.invoke("getProductById", id),
  getProductByQR: (qr) => ipcRenderer.invoke("getProductByQR", qr),
  createProduct: (product) => ipcRenderer.invoke("createProduct", product),
  updateProduct: (id, product) => ipcRenderer.invoke("updateProduct", id, product),
  deleteProduct: (id) => ipcRenderer.invoke("deleteProduct", id),

  // ===== BILLS =====
  getAllBills: (options) => ipcRenderer.invoke("getAllBills", options),
  getBillItems: (billId) => ipcRenderer.invoke("getBillItems", billId),
  createBill: (bill) => ipcRenderer.invoke("createBill", bill),
  printBill: (bill) => ipcRenderer.invoke("printBill", bill),

  // ===== DASHBOARD =====
  getDashboardStats: () => ipcRenderer.invoke("getDashboardStats"),

  // ===== REPORTS =====
  getDailySales: () => ipcRenderer.invoke("get-daily-sales"),
  getTotalSales: () => ipcRenderer.invoke("get-total-sales"),
  exportDailyReport: () => ipcRenderer.invoke("export-daily-report"),
  exportTotalReport: () => ipcRenderer.invoke("export-total-report"),
});

// *************************************************************************

// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("api", {
//   // User
//   getUserByUsername: (username) => ipcRenderer.invoke("getUserByUsername", username),
//   getAllUsers: () => ipcRenderer.invoke("getAllUsers"),
//   updateOwnerPassword: (password) => ipcRenderer.invoke("update-owner-password", password),
//   updateStaffPassword: (password) => ipcRenderer.invoke("update-staff-password", password),
//   loginUser: (username, password) => ipcRenderer.invoke("login-user", username, password),

//   // Customers
//   getAllCustomers: () => ipcRenderer.invoke("getAllCustomers"),
//   createCustomer: (data) => ipcRenderer.invoke("createCustomer", data),
//   updateCustomer: (id, data) => ipcRenderer.invoke("updateCustomer", id, data),
//   deleteCustomer: (id) => ipcRenderer.invoke("deleteCustomer", id),
//   getCustomerByMobile: (mobile) => ipcRenderer.invoke("getCustomerByMobile", mobile),
//   createCustomer: (data) => ipcRenderer.invoke("createCustomer", data),
//   getCustomerById: (id) => ipcRenderer.invoke("getCustomerById", id),
//   getCustomerPurchaseHistory: (id) => ipcRenderer.invoke("getCustomerPurchaseHistory", id),
  
//   // Products
//   getAllProducts: () => ipcRenderer.invoke("getAllProducts"),
//   createProduct: (data) => ipcRenderer.invoke("createProduct", data),
//   updateProduct: (id, data) => ipcRenderer.invoke("updateProduct", id, data),
//   deleteProduct: (id) => ipcRenderer.invoke("deleteProduct", id),
//   getProductByQR: (qr) => ipcRenderer.invoke("getProductByQR", qr),
//   getProductById: (id) => ipcRenderer.invoke("getProductById", id),

//   // Bills
//   getAllBills: () => ipcRenderer.invoke("getAllBills"),
//   createBill: (data) => ipcRenderer.invoke("createBill", data),
//   getBillItems: (billId) => ipcRenderer.invoke("getBillItems", billId),
//   createBill: (data) => ipcRenderer.invoke("createBill", data),
//   printBill: (data) => ipcRenderer.invoke("printBill", data),
//   getDailySales: () => ipcRenderer.invoke("get-daily-sales"),
//   getTotalSales: () => ipcRenderer.invoke("get-total-sales"),
//   exportDailyReport: () => ipcRenderer.invoke("export-daily-report"),
//   exportTotalReport: () => ipcRenderer.invoke("export-total-report"),

//   // Dashboard
//   getDashboardStats: () => ipcRenderer.invoke("getDashboardStats")
// });
