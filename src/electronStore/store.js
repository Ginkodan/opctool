const Store = require("electron-store");
const store = new Store();

const saveSettings = (payload) => store.set('pointopc', payload)
const readSettings = () => store.get('pointopc')


module.exports = {  saveSettings,
                    readSettings}