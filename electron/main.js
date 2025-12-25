// require("./services/product.service");
require("./services/ipcHandlers");


const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // if (process.env.VITE_DEV_SERVER_URL) {
  //   win.loadURL(process.env.VITE_DEV_SERVER_URL);
  // } else {
  //   win.loadFile(
  //     path.join(__dirname, "../renderer/dist/index.html")
  //   );
  // }
  win.loadURL("http://localhost:5173");


}

app.whenReady().then(createWindow);
