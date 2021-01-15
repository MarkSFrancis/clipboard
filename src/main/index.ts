import {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
} from "electron";
import { history, toggleClipboardWatcher } from "./history";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.dock.hide?.();

const createWindow = () => {
  const window = new BrowserWindow({
    height: 0,
    width: 400,
    focusable: true,
    alwaysOnTop: true,
    titleBarStyle: "hidden",
    minimizable: false,
    maximizable: false,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  window.on("blur", () => window.close());
};

app.whenReady().then(() => {
  toggleClipboardWatcher(true);
  globalShortcut.register("CommandOrControl+Shift+V", () => {
    createWindow();
  });
});

app.on("window-all-closed", () => {
  // Do nothing
});

ipcMain.handle("get-history", () => {
  return [...history];
});

ipcMain.handle("copy", (event, text: string) => {
  clipboard.writeText(text);

  const window = BrowserWindow.fromWebContents(event.sender);
  window.close();
});

ipcMain.handle("loaded", (event, newHeight) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) return;

  const [width] = window.getSize();

  window.setSize(width, newHeight);
  window.show();
});

ipcMain.handle("close", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window.close();
});
