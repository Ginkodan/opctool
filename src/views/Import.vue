<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3">
          Metadaten
        </h1>
        <v-btn @click="readFile">Import</v-btn>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Projekt
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary lighten-2"
                  dark
                  fab
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-format-list-bulleted-square</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2">
                  Filename
                </v-card-title>
                <v-card-text>
                  <div
                    :key="item['[Header]']"
                    v-for="item in importData.metaData"
                  >
                    <strong> {{ item["[Header]"] }}</strong> :
                    {{ item["__EMPTY"] }}
                  </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">
                    Schliessen
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2">
            Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-checkbox
                  v-model="showAllRows"
                  :label="'Alle Spalten anzeigen'"
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox
                  v-model="checkbox2"
                  :label="`Checkbox 2: ${checkbox2.toString()}`"
                ></v-checkbox>
              </v-col>
              <v-col cols="12"> <v-btn>Fix UD</v-btn></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <div v-if="loaded">
          <v-card class="pa-2">
            <v-data-table
              dense
              key="$UserAddresse"
              :headers="headersFitered"
              :items="importData.opcData"
              :footer-props="{
                itemsPerPageOptions: [20, 50, 100, -1],
              }"
            >
            </v-data-table>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "import",

  data: () => ({
    loaded: false,
    dialog: false,
    showAllRows: false,
    checkbox2: true,
    headersFitered: [],
    importData: {
      headers: [
        {
          text: "",
          value: "",
        },
      ],
      opcData: {},
      metaData: {},
    },
  }),
  mounted() {
    this.importData = this.$store.state.project;
    if (this.importData.metaData != undefined) {
      this.filterHeaders();
      this.loaded = true;
    }
  },
  methods: {
    ...mapActions(["WRITE_PROJECT"]),

    readFile() {
      window.ipc.send("READ_FILE");
      window.ipc.on("READ_FILE", (payload) => {
        this.importData.headers = this.adjustHeaders(payload.headers);
        this.filterHeaders();
        this.importData.opcData = payload.opcData;
        this.importData.metaData = payload.metaData;
        this.WRITE_PROJECT(this.importData);
        this.loaded = true;
      });
    },
    adjustHeaders(headers) {
      const header = [];
      headers.forEach((element) => {
        header.push({
          text: element,
          value: element,
        });
      });
      return header;
    },
    filterHeaders() {
      this.headersFitered = this.importData.headers.filter((value) => {
        for (const i in this.$store.state.pointopc.settings.columns) {
          if (
            value.value == this.$store.state.pointopc.settings.columns[i].text
          ) {
            return TextTrackCue;
          }
        }
      });
    },
  },
  watch: {
    showAllRows(val) {
      if (!val) {
        this.filterHeaders();
      } else {
        this.headersFitered = this.importData.headers;
      }
    },
  },
};
</script>
