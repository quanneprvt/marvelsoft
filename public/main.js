const { app, BrowserWindow } = require("electron");

const createApp = () => {
  const newWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  newWindow.loadURL("http://localhost:8081");
};

const quitApp = () => {
  app.quit();
};

const recreateApp = () => {
  if (BrowserWindow.getAllWindows().length === 0) createApp();
};

app.on("ready", createApp);
app.on("window-all-closed", quitApp);
app.on("activate", recreateApp);
