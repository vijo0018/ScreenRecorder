import { app, BrowserWindow } from "electron";
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
         nodeIntegration: true
      }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // open the DevTools.
  mainWindow.webContents.openDevTools();
};

// this method will be called when Electron has finished
// initialization and is ready to create browser windows.
// some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// in this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
