<template>
  <v-app>
    <Toolbar />
    <router-view></router-view>
  </v-app>
</template>

<script>
import Toolbar from "@/components/Toolbar.vue";
import { mapActions } from 'vuex';
export default {
  components: { Toolbar },
  mounted() {
        this.READ_STORE();
  },
  methods: {
    ...mapActions(['READ_STORE'])
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
