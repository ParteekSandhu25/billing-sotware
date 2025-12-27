import React, { createContext, useState, useContext, useRef } from "react";

// Create the context
const BillingContext = createContext();

// Custom hook to use the billing context
export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
};

// Provider component
export const BillingProvider = ({ children }) => {
  // ---------------- CUSTOMER STATE ----------------
  const [mobile, setMobile] = useState("");
  const [customer, setCustomer] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("idle");
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
  const [cashDiscount, setCashDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [shouldPrint, setShouldPrint] = useState(true);
  const [totals, setTotals] = useState({
    sub_total: 0,
    gst_amount: 0,
    cash_discount: 0,
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

    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);
  };

  const addProductToBill = () => {
    if (!product || quantity <= 0) return;

    let updatedItems = [...billItems];
    const index = updatedItems.findIndex((i) => i.product_id === product.id);

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
    calculateTotals(updatedItems, cashDiscount);

    setProduct(null);
    setQuantity(1);

    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);
  };

  const removeItem = (id) => {
    const updated = billItems.filter((i) => i.product_id !== id);
    setBillItems(updated);
    calculateTotals(updated, cashDiscount);
  };

  const getAvailableStockNumber = (id, currQuantity) => {
    const item = billItems.find((i) => i.product_id === id);
    if (!item) return currQuantity;
    return currQuantity - item.quantity;
  };

  const increaseQuantity = async (productId) => {
    const item = billItems.find((i) => i.product_id === productId);
    if (!item) return;

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
    calculateTotals(updated, cashDiscount);
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
    calculateTotals(updated, cashDiscount);
  };

  // ================= DISCOUNT & PAYMENT =================
  const handleCashDiscountChange = (discount) => {
    const discountValue = parseFloat(discount) || 0;
    setCashDiscount(discountValue);
    calculateTotals(billItems, discountValue);
  };

  // ================= TOTALS =================
  const calculateTotals = (items, discount = 0) => {
    const sub_total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const gst_amount = items.reduce(
      (sum, i) => sum + (i.price * i.quantity * i.gst_percent) / 100,
      0
    );
    const cash_discount = parseFloat(discount) || 0;
    const total_amount = sub_total + gst_amount - cash_discount;

    setTotals({
      sub_total,
      gst_amount,
      cash_discount,
      total_amount: total_amount > 0 ? total_amount : 0
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

    if (totals.total_amount <= 0) {
      alert("Total amount must be greater than zero");
      return;
    }

    const bill_number = `BILL-${Date.now()}`;

    const result = await window.api.createBill({
      bill_number,
      customer_id: customer.id,
      items: billItems,
      sub_total: totals.sub_total,
      gst_amount: totals.gst_amount,
      cash_discount: totals.cash_discount,
      total_amount: totals.total_amount,
      payment_mode: paymentMode
    });

    console.log("RESULT", result);

    if (!result) {
      alert(result.error);
      return;
    }

    // Print bill only if checkbox is checked
    if (shouldPrint) {
      await window.api.printBill({
        bill_number: bill_number,
        customer,
        items: billItems,
        totals: {
          ...totals,
          payment_mode: paymentMode
        }
      });
    }

    console.log("***************************");
    console.log("bill_number", bill_number);
    console.log("bill_item", billItems);
    console.log("totals", totals);
    console.log("payment_mode", paymentMode);
    console.log("customer", customer);
    console.log("should_print", shouldPrint);
    console.log("***************************");

    alert(`Bill ${bill_number} created successfully`);

    // reset
    resetBillingState();
  };

  const resetBillingState = () => {
    setBillItems([]);
    setCustomer(null);
    setCustomerStatus("idle");
    setMobile("");
    setCashDiscount(0);
    setPaymentMode("CASH");
    setShouldPrint(true);
    setTotals({ 
      sub_total: 0, 
      gst_amount: 0, 
      cash_discount: 0, 
      total_amount: 0 
    });
    setProduct(null);
    setQuantity(1);
    setQrCode("");

    setTimeout(() => {
      qrInputRef.current?.focus();
    }, 0);
  };

  // Context value
  const value = {
    // Customer state
    mobile,
    setMobile,
    customer,
    setCustomer,
    customerStatus,
    setCustomerStatus,
    customerForm,
    setCustomerForm,
    handleSearchCustomer,
    handleCreateCustomer,

    // Product state
    qrCode,
    setQrCode,
    product,
    setProduct,
    quantity,
    setQuantity,
    qrInputRef,
    handleFetchProduct,
    addProductToBill,

    // Bill state
    billItems,
    setBillItems,
    totals,
    setTotals,
    removeItem,
    getAvailableStockNumber,
    increaseQuantity,
    decreaseQuantity,
    calculateTotals,

    // Discount & Payment
    cashDiscount,
    setCashDiscount,
    handleCashDiscountChange,
    paymentMode,
    setPaymentMode,
    shouldPrint,
    setShouldPrint,

    // Bill generation
    generateBill,
    resetBillingState
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};