const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const isDev = process.env.NODE_ENV === "development";
const path = require("path");

mainWindow.loadURL(
  isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../out/index.html")}`
);


  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
