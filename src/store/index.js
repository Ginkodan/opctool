import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pointopc: {},
    project: {}
  },
  mutations: {
    setStore(state, pointopc) {
      state.pointopc = pointopc;
    },
    setSettings(state, settings) {
      state.pointopc.settings = settings;
    },
    setProject(state, project) {
      state.project = project
    }
  },
  actions: {
    SAVE_STORE({ commit, state }, data) {
      commit("setStore", data);
      window.ipc.send("SAVE_STORE", state);
    },
    READ_STORE({ commit }) {
      window.ipc.send("READ_STORE");
      window.ipc.on("READ_STORE", (payload) => {
        commit("setStore", payload);
      });
      commit("setStore");
    },
    SAVE_SETTINGS({ commit, state }, data) {
      commit("setSettings", data);
      console.log(state.pointopc);
      window.ipc.send("SAVE_STORE", state.pointopc);
    },
    READ_SETTINGS({ commit }) {
      window.ipc.send("READ_SETTINGS");
      window.ipc.on("READ_SETTINGS", (payload) => {
        commit("setStore", payload);
      });
    },
    WRITE_PROJECT({commit}, data) {
      commit("setProject", data)
    }
  },
});
