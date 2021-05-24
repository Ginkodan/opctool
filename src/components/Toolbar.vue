<template>
  <div>
    <v-toolbar dense>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>OPC conversion tool</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute temporary :mini-variant="mini">
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.href"
          >
            <v-list-item-icon>
              <v-icon color="primary">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="primary--text">{{
                item.title
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "toolbar",
  data: () => ({
    drawer: false,
    group: null,
    mini: false,
    items: [
      { title: "Import", href: "/import", icon: "mdi-application-import" },
      { title: "Export", href: "/export", icon: "mdi-application-export" },
      {
        title: "Einstellungen",
        href: "/settings",
        icon: "mdi-application-cog",
      },
    ],
  }),
};
</script>

<style></style>
