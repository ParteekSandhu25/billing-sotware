import React, { useEffect, useState } from "react";

export default function InvoicePrint() {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Electron preload sends invoice data
    window.api.onInvoiceData((data) => {
      setInvoice(data);
      setTimeout(() => {
        window.api.printInvoice(); // trigger print
      }, 500);
    });
  }, []);

  if (!invoice) return null;

  const { bill, customer, items } = invoice;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>TAX INVOICE</h2>

      <hr />

      <p><b>Bill No:</b> {bill.bill_number}</p>
      <p><b>Date:</b> {new Date(bill.created_at).toLocaleString()}</p>

      <hr />

      <p><b>Customer:</b> {customer.name}</p>
      <p><b>Mobile:</b> {customer.mobile}</p>

      <table width="100%" border="1" cellPadding="5" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>GST %</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.product_name}</td>
              <td>{i.quantity}</td>
              <td>₹{i.price}</td>
              <td>{i.gst_percent}%</td>
              <td>₹{i.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ textAlign: "right" }}>
        Total: ₹{bill.total_amount}
      </h3>
    </div>
  );
}
