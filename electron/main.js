// require("./services/ipcHandlers");
// require("./services/dailyReportService")

// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js")
//     }
//   });

//   // if (process.env.VITE_DEV_SERVER_URL) {
//   //   win.loadURL(process.env.VITE_DEV_SERVER_URL);
//   // } else {
//   //   win.loadFile(
//   //     path.join(__dirname, "../renderer/dist/index.html")
//   //   );
//   // }
//   win.loadURL("http://localhost:5173");


// }

// app.whenReady().then(createWindow);

// ****************************************************************************************
// const { app, BrowserWindow } = require("electron");
// const path = require("path");

// // IPC handlers
// require("./services/ipcHandlers");

// // Daily report scheduler
// require("./services/dailyReportService");

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js")
//     }
//   });

//   // DEV
//   win.loadURL("http://localhost:5173");

//   // PROD
//   // win.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
// }

// app.whenReady().then(() => {
//   createWindow();
// });

// // Mac support
// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
require("dotenv").config();
require("./services/ipcHandlers");
const { startDailyReportCron, sendTestReport } = require("./services/dailyReportService");

const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools(); // Open dev tools in development
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }

  // Create application menu
  createMenu();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Create application menu with test report option
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        { role: "quit" }
      ]
    },
    {
      label: "Reports",
      submenu: [
        {
          label: "Send Test Report",
          click: async () => {
            console.log("Sending test report...");
            try {
              await sendTestReport();
              // You can show a dialog to user if needed
            } catch (error) {
              console.error("Failed to send test report:", error);
            }
          }
        },
        { type: "separator" },
        {
          label: "Check Email Configuration",
          click: () => {
            console.log("Email Config:");
            console.log("REPORT_EMAIL:", process.env.REPORT_EMAIL);
            console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);
            console.log("REPORT_EMAIL_PASS:", process.env.REPORT_EMAIL_PASS ? "✓ Set" : "✗ Not set");
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Initialize app
app.whenReady().then(() => {
  createWindow();

  // Start the daily report cron job
  console.log("🚀 Starting daily report service...");
  startDailyReportCron();

  // Verify email configuration
  if (!process.env.REPORT_EMAIL || !process.env.REPORT_EMAIL_PASS || !process.env.OWNER_EMAIL) {
    console.warn("⚠️ WARNING: Email configuration is incomplete!");
    console.warn("Please set REPORT_EMAIL, REPORT_EMAIL_PASS, and OWNER_EMAIL in your .env file");
  } else {
    console.log("✅ Email configuration loaded successfully");
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle IPC for manual report trigger (optional)
ipcMain.handle("send-test-report", async () => {
  try {
    await sendTestReport();
    return { success: true };
  } catch (error) {
    console.error("Error sending test report:", error);
    return { success: false, error: error.message };
  }
});