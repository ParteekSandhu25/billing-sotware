// ../utils/printBillView.js

/**
 * Generates a professional invoice HTML for printing
 * @param {Object} billData - The bill/invoice data
 * @param {string} billData.bill_number - Invoice number
 * @param {string} billData.created_at - Invoice date
 * @param {Object} billData.customer - Customer details
 * @param {string} billData.customer.name - Customer name
 * @param {string} billData.customer.mobile - Customer mobile
 * @param {string} billData.customer.address - Customer address
 * @param {string} billData.customer.gstin - Customer GSTIN
 * @param {Array} billData.items - Array of invoice items
 * @param {number} billData.sub_total - Subtotal amount
 * @param {number} billData.gst_amount - GST amount
 * @param {number} billData.cash_discount - Cash discount amount (NEW)
 * @param {number} billData.total_amount - Total amount
 * @param {string} billData.payment_mode - Payment mode (CASH/CARD/UPI) (NEW)
 * @param {Object} companyInfo - Company/Business details (optional, uses default if not provided)
 * @param {string} companyInfo.name - Company name
 * @param {string} companyInfo.address - Company address
 * @param {string} companyInfo.mobile - Company mobile
 * @param {string} companyInfo.email - Company email
 * @param {string} companyInfo.gstin - Company GSTIN
 * @param {string} companyInfo.pan - Company PAN (optional)
 * @returns {string} HTML string for printing
 */
function generateInvoiceHTML(billData, companyInfo = null) {
  // Default company information
  const defaultCompanyInfo = {
    name: "G Hari Dewasi Safa House",
    address: "Shop Address Here, City - PIN Code",
    mobile: "+91 XXXXX XXXXX",
    email: "info@safahouse.com",
    gstin: "GSTIN NUMBER",
    pan: "PAN NUMBER"
  };

  // Use provided company info or default
  const company = companyInfo || defaultCompanyInfo;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
    };

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    let result = '';
    if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
    if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
    if (remainder > 0) result += convertLessThanThousand(remainder);

    return result.trim() + ' Rupees Only';
  };

  const itemsHTML = billData.items.map((item, index) => `
    <tr>
      <td style="padding: 10px 8px; text-align: center; border-right: 1px solid #dee2e6;">${index + 1}</td>
      <td style="padding: 10px 8px; border-right: 1px solid #dee2e6;">
        <div style="font-weight: 500; margin-bottom: 2px;">${item.product_name || item.description}</div>
        ${item.hsn_code ? `<div style="font-size: 11px; color: #6c757d;">HSN: ${item.hsn_code}</div>` : ''}
      </td>
      <td style="padding: 10px 8px; text-align: center; border-right: 1px solid #dee2e6;">${item.quantity}</td>
      <td style="padding: 10px 8px; text-align: right; border-right: 1px solid #dee2e6;">${formatCurrency(item.rate || item.price)}</td>
      <td style="padding: 10px 8px; text-align: right; border-right: 1px solid #dee2e6;">${item.discount || 0}%</td>
      <td style="padding: 10px 8px; text-align: center; border-right: 1px solid #dee2e6;">${item.gst_rate || item.gst_percent || 0}%</td>
      <td style="padding: 10px 8px; text-align: right; font-weight: 500;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  // Get cash discount value (default to 0 if not provided)
  const cashDiscount = billData.cash_discount || 0;
  
  // Get payment mode (default to CASH if not provided)
  const paymentMode = billData.payment_mode || 'CASH';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${billData.bill_number}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #212529;
          background: white;
        }

        .invoice-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 15mm;
          background: white;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0066cc;
        }

        .company-info {
          flex: 1;
        }

        .company-name {
          font-size: 26px;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .company-details {
          font-size: 12px;
          color: #495057;
          line-height: 1.6;
        }

        .invoice-title-section {
          text-align: right;
        }

        .invoice-title {
          font-size: 32px;
          font-weight: 700;
          color: #0066cc;
          margin-bottom: 5px;
        }

        .invoice-type {
          font-size: 11px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .invoice-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          gap: 20px;
        }

        .meta-box {
          flex: 1;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #0066cc;
        }

        .meta-title {
          font-size: 11px;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .meta-content {
          font-size: 12px;
          color: #212529;
        }

        .meta-content div {
          margin-bottom: 4px;
        }

        .meta-content strong {
          font-weight: 600;
        }

        .party-details {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }

        .party-box {
          flex: 1;
          padding: 15px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
        }

        .party-box h3 {
          font-size: 13px;
          color: #0066cc;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .party-name {
          font-size: 15px;
          font-weight: 700;
          color: #212529;
          margin-bottom: 8px;
        }

        .party-info {
          font-size: 12px;
          color: #495057;
          line-height: 1.6;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        }

        .items-table thead {
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
          color: white;
        }

        .items-table th {
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .items-table th:last-child {
          border-right: none;
        }

        .items-table tbody tr {
          border-bottom: 1px solid #dee2e6;
        }

        .items-table tbody tr:nth-child(even) {
          background: #f8f9fa;
        }

        .items-table tbody tr:hover {
          background: #e9ecef;
        }

        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 25px;
        }

        .totals-box {
          width: 400px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          border-bottom: 1px solid #dee2e6;
        }

        .total-row:last-child {
          border-bottom: none;
        }

        .total-row.subtotal {
          background: #f8f9fa;
        }

        .total-row.gst {
          background: #f8f9fa;
        }

        .total-row.discount {
          background: #fff3cd;
          color: #856404;
          font-weight: 600;
        }

        .total-row.grand-total {
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .total-label {
          font-weight: 500;
        }

        .total-value {
          font-weight: 600;
        }

        .payment-mode-badge {
          display: inline-block;
          padding: 6px 14px;
          background: #0066cc;
          color: white;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .amount-in-words {
          padding: 15px;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .amount-in-words strong {
          color: #856404;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .amount-in-words div {
          color: #212529;
          font-weight: 600;
          margin-top: 5px;
          font-size: 14px;
        }

        .terms-section {
          margin-bottom: 25px;
        }

        .terms-title {
          font-size: 13px;
          font-weight: 600;
          color: #0066cc;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .terms-content {
          font-size: 11px;
          color: #495057;
          line-height: 1.6;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .terms-content li {
          margin-bottom: 4px;
          margin-left: 20px;
        }

        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }

        .signature-box {
          text-align: center;
          flex: 1;
        }

        .signature-line {
          border-top: 2px solid #212529;
          margin-top: 60px;
          padding-top: 8px;
          font-weight: 600;
          color: #495057;
        }

        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 2px solid #0066cc;
          font-size: 11px;
          color: #6c757d;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .invoice-container {
            padding: 0;
            max-width: 100%;
          }

          .items-table tbody tr:hover {
            background: inherit !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <div class="company-info">
            <div class="company-name">${company.name}</div>
            <div class="company-details">
              ${company.address}<br>
              Phone: ${company.mobile}<br>
              Email: ${company.email}<br>
              ${company.gstin ? `GSTIN: <strong>${company.gstin}</strong><br>` : ''}
              ${company.pan ? `PAN: <strong>${company.pan}</strong>` : ''}
            </div>
          </div>
          <div class="invoice-title-section">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-type">Tax Invoice</div>
          </div>
        </div>

        <!-- Invoice Meta Info -->
        <div class="invoice-meta">
          <div class="meta-box">
            <div class="meta-title">Invoice Details</div>
            <div class="meta-content">
              <div><strong>Invoice No:</strong> ${billData.bill_number}</div>
              <div><strong>Date:</strong> ${formatDate(billData.created_at)}</div>
            </div>
          </div>
          <div class="meta-box">
            <div class="meta-title">Payment Information</div>
            <div class="meta-content">
              <div><strong>Payment Status:</strong> ${billData.payment_status || 'Paid'}</div>
              <div><strong>Payment Mode:</strong> <span class="payment-mode-badge">${paymentMode}</span></div>
            </div>
          </div>
        </div>

        <!-- Party Details -->
        <div class="party-details">
          <div class="party-box">
            <h3>Billed From</h3>
            <div class="party-name">${company.name}</div>
            <div class="party-info">
              ${company.address}<br>
              ${company.gstin ? `GSTIN: ${company.gstin}` : ''}
            </div>
          </div>
          <div class="party-box">
            <h3>Billed To</h3>
            <div class="party-name">${billData.customer.name || 'Walk-in Customer'}</div>
            <div class="party-info">
              ${billData.customer.address ? `${billData.customer.address}<br>` : ''}
              ${billData.customer.mobile ? `Phone: ${billData.customer.mobile}<br>` : ''}
              ${billData.customer.gstin ? `GSTIN: ${billData.customer.gstin}` : ''}
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">S.No</th>
              <th style="width: 35%;">Product / Description</th>
              <th style="width: 80px; text-align: center;">Qty</th>
              <th style="width: 100px; text-align: right;">Rate</th>
              <th style="width: 80px; text-align: right;">Disc%</th>
              <th style="width: 80px; text-align: center;">GST%</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row subtotal">
              <span class="total-label">Subtotal:</span>
              <span class="total-value">${formatCurrency(billData.sub_total)}</span>
            </div>
            <div class="total-row gst">
              <span class="total-label">GST Amount:</span>
              <span class="total-value">${formatCurrency(billData.gst_amount)}</span>
            </div>
            ${cashDiscount > 0 ? `
            <div class="total-row discount">
              <span class="total-label">Cash Discount (-):</span>
              <span class="total-value">- ${formatCurrency(cashDiscount)}</span>
            </div>
            ` : ''}
            <div class="total-row grand-total">
              <span class="total-label">Total Amount:</span>
              <span class="total-value">${formatCurrency(billData.total_amount)}</span>
            </div>
          </div>
        </div>

        <!-- Amount in Words -->
        <div class="amount-in-words">
          <strong>Amount in Words:</strong>
          <div>${numberToWords(Math.round(billData.total_amount))}</div>
        </div>

        <!-- Terms & Conditions -->
        <div class="terms-section">
          <div class="terms-title">Terms & Conditions</div>
          <div class="terms-content">
            <ul>
              <li>Payment is due within 30 days from the date of invoice.</li>
              <li>Please make checks payable to ${company.name}.</li>
              <li>Goods once sold will not be taken back or exchanged.</li>
              <li>All disputes are subject to local jurisdiction only.</li>
              <li>Interest @ 18% p.a. will be charged on delayed payments.</li>
            </ul>
          </div>
        </div>

        <!-- Signature -->
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Customer Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Authorized Signatory</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <strong>Thank you for your business!</strong><br>
          This is a computer-generated invoice and does not require a physical signature.
        </div>
      </div>

      <script>
        // Auto-print when loaded
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
}

module.exports = {
  generateInvoiceHTML
};