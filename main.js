const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const DATA_DIR  = path.join(os.homedir(), '.quotes');
const DATA_FILE = path.join(DATA_DIR, 'quotes.json');
const W = 420, H = 300;

let win = null;

function createWindow() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: W,
    height: H,
    x: sw - W - 20,
    y: sh - H - 20,
    frame: false,
    backgroundColor: '#0d0c0b',
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.handle('load', () => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
});

ipcMain.handle('save', (_, data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
});

ipcMain.on('quit', () => app.quit());

// Add-quote mode: bring to front so the user can type
ipcMain.handle('widget-add-mode', () => {
  if (!win || win.isDestroyed()) return;
  win.setAlwaysOnTop(true);
  win.focus();
});

// Return to passive widget behaviour after add mode ends
ipcMain.handle('widget-exit-add-mode', () => {
  if (!win || win.isDestroyed()) return;
  win.setAlwaysOnTop(false);
});
