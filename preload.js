const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  load:              ()     => ipcRenderer.invoke('load'),
  save:              (data) => ipcRenderer.invoke('save', data),
  quit:              ()     => ipcRenderer.send('quit'),
  widgetAddMode:     ()     => ipcRenderer.invoke('widget-add-mode'),
  widgetExitAddMode: ()     => ipcRenderer.invoke('widget-exit-add-mode'),
});
