const {contextBridge, ipcRenderer } = require('electron')

ipcRenderer.on('opcdata', (event, header, data, metaData) => {
  console.log(header, data, metaData)
})


const validChannels = ['READ_FILE', 'WRITE_FILE','SAVE_STORE', 'READ_STORE'];
contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if(validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel, func) => {
      if(validChannels.includes(channel)){
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
)