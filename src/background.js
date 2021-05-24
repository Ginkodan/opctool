"use strict";
import { app, protocol, Menu, dialog, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
const XLSX = require("xlsx");
const isDevelopment = process.env.NODE_ENV !== "production";
const electronStore = require("./electronStore/store");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

const template = [
  {
    label: "OPC",
    submenu: [
      {
        label: "import",
        click() {
          importExcel();
        },
      },
      { label: "export", click() {} },
    ],
  },
  {
    label: "dev",
    submenu: [
      { role: "toggleDevTools", label: "dev tools" },
      { role: "reload", label: "reload" },
      { role: "forceReload", label: "force reload" },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const importExcel = async function() {
  try {
    let o = await dialog.showOpenDialog({ properties: ["openFile"] });
    if (o.filePaths[0] != undefined) {
      let opcData = {
        metaData: {},
        headers: {},
        opcData: {},
      };
      const workbook = XLSX.readFile(o.filePaths[0]);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      opcData.headers = getHeader(worksheet);
      opcData.opcData = XLSX.utils.sheet_to_json(worksheet, {
        range: startData,
      });
      opcData.metaData = getMetaData(worksheet);
      return opcData;
    } else return;
  } catch (error) {
    console.log(error);
  }
};

ipcMain.on("SAVE_STORE", (event, payload) => {
  electronStore.saveSettings(payload);
});

ipcMain.on("READ_STORE", (event) => {
  console.log("reading settings...");
  event.reply("READ_STORE", electronStore.readSettings());
});

ipcMain.on("READ_FILE", (event, payload) => {
  importExcel().then((pay) => {
    event.reply("READ_FILE", pay);
  });
});

const headerDescriptor = "Name[1]";
let startData = null;

function getHeader(sheet) {
  const headers = [];
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  let C;
  for (let i = 0; i < range.e.r; i++) {
    if (sheet[XLSX.utils.encode_cell({ c: 0, r: i })].v == headerDescriptor) {
      startData = i;
    }
  }
  const R = startData;
  for (C = range.s.c; C <= range.e.c; ++C) {
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
    let hdr = "UNKNOWN " + C;
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    headers.push(hdr);
  }
  return headers;
}

function getMetaData(sheet) {
  return XLSX.utils.sheet_to_json(sheet, {
    range: { s: { c: 0, r: 0 }, e: { c: 26, r: startData - 1 } },
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
