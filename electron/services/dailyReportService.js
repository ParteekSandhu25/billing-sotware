const cron = require("node-cron");
const nodemailer = require("nodemailer");
const dbPromise = require("../db/sqlite");
require("dotenv").config();

// ===== EMAIL CONFIG =====
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.REPORT_EMAIL,       // owner email
    pass: process.env.REPORT_EMAIL_PASS   // app password
  }
});

// ===== FETCH DAILY REPORT =====
async function getDailySalesReport() {
  try {
    const db = await dbPromise;

    const today = new Date().toISOString().split("T")[0];

    const rows = await db.all(`
      SELECT 
        b.bill_number,
        b.total_amount,
        b.sub_total,
        b.gst_amount,
        b.created_at,
        c.name AS customer_name,
        c.mobile AS customer_mobile
      FROM bills b
      LEFT JOIN customers c ON c.id = b.customer_id
      WHERE DATE(b.created_at) = ?
      ORDER BY b.created_at DESC
    `, [today]);

    const totalSales = rows.reduce((sum, r) => sum + r.total_amount, 0);
    const totalGST = rows.reduce((sum, r) => sum + r.gst_amount, 0);
    const totalSubTotal = rows.reduce((sum, r) => sum + r.sub_total, 0);

    return { 
      rows, 
      totalSales, 
      totalGST,
      totalSubTotal,
      date: today,
      billCount: rows.length 
    };
  } catch (error) {
    console.error("Error fetching daily sales report:", error);
    throw error;
  }
}

// ===== SEND EMAIL =====
async function sendDailyReportEmail(report) {
  try {
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Daily Sales Report - ${report.date}
        </h2>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><b>Total Bills:</b> ${report.billCount}</p>
          <p style="margin: 5px 0;"><b>Sub Total:</b> ₹${report.totalSubTotal.toFixed(2)}</p>
          <p style="margin: 5px 0;"><b>Total GST:</b> ₹${report.totalGST.toFixed(2)}</p>
          <p style="margin: 5px 0; font-size: 18px; color: #16a34a;">
            <b>Total Sales:</b> ₹${report.totalSales.toFixed(2)}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #2563eb; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Bill No</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Customer</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Mobile</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Time</th>
            </tr>
          </thead>
          <tbody>
    `;

    report.rows.forEach((r, index) => {
      const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
      const time = new Date(r.created_at).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      html += `
        <tr style="background: ${bgColor};">
          <td style="padding: 10px; border: 1px solid #ddd;">${r.bill_number}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${r.customer_name || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${r.customer_mobile || 'N/A'}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">₹${r.total_amount.toFixed(2)}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
        
        <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <p style="margin: 0; color: #92400e;">
            <b>Note:</b> This is an automated daily sales report generated at midnight.
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Billing System" <${process.env.REPORT_EMAIL}>`,
      to: process.env.OWNER_EMAIL,
      subject: `📊 Daily Sales Report - ${report.date} (₹${report.totalSales.toFixed(2)})`,
      html
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// ===== MANUAL TEST FUNCTION =====
async function sendTestReport() {
  try {
    console.log("📧 Generating test sales report...");
    const report = await getDailySalesReport();

    if (report.rows.length === 0) {
      console.log("ℹ️ No sales today. Creating sample report...");
      // Still send email to test configuration
      report.rows = [{
        bill_number: "TEST-001",
        customer_name: "Test Customer",
        customer_mobile: "1234567890",
        total_amount: 1000,
        created_at: new Date().toISOString()
      }];
      report.totalSales = 1000;
      report.totalGST = 180;
      report.totalSubTotal = 820;
      report.billCount = 1;
    }

    await sendDailyReportEmail(report);
    console.log("✅ Test report sent successfully!");
  } catch (err) {
    console.error("❌ Test report failed:", err);
  }
}

// ===== CRON JOB (12:00 AM DAILY) =====
function startDailyReportCron() {
  console.log("🕐 Daily report cron job initialized");
  
  // Schedule for midnight (00:00) every day
cron.schedule("40 18 * * *", async () => {
    try {
      console.log("📧 Generating daily sales report at midnight...");

      const report = await getDailySalesReport();

      if (report.rows.length === 0) {
        console.log("ℹ️ No sales today. Skipping email.");
        return;
      }

      await sendDailyReportEmail(report);
      console.log("✅ Daily sales report emailed successfully");
    } catch (err) {
      console.error("❌ Daily report cron failed:", err);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Change to your timezone
  });

  console.log("✅ Cron job scheduled: Daily report will be sent at 12:00 AM");
}

module.exports = {
  startDailyReportCron,
  sendTestReport,
  getDailySalesReport
};