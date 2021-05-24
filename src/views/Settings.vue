<template>
  <v-container>
    <v-card>
      <v-card-title class="headline grey lighten-2">Einstellungen</v-card-title>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    Status Texte
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >Mapping Status Texte
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-text>
                <v-dialog v-model="stDialog">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="secondary lighten-2"
                      dark
                      fab
                      small
                    >
                      <v-icon>mdi-format-list-bulleted-square</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-data-table
                      dense
                      :headers="stateTexts.headers"
                      :items="stateTexts.units"
                      class="elevation-1"
                    >
                    </v-data-table>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    User Adresse
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >Vorlage für User Adresses
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-text>
                <v-dialog v-model="udDialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="secondary lighten-2"
                      dark
                      fab
                      small
                    >
                      <v-icon>mdi-format-list-bulleted-square</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Rule Editor</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="6">
                            <v-text-field
                              label="Maxilmale Zeichenlänge"
                              required
                              v-model="settings.length"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-select
                              :items="['_', '-', '\'']"
                              label="Delimeter"
                              required
                              v-model="settings.delimeter"
                            ></v-select>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="Ungültige Zeichen"
                              required
                              v-model="settings.forbidden"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="Zelle in Tabelle"
                              required
                              v-model="settings.cell"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-divider class="mx-4"></v-divider>
                          </v-col>
                          <v-col cols="12">
                            Test
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              label="Test input"
                              v-model="testValue"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <v-text-field
                              disabled
                              label="Test output"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="udDialog = false"
                      >
                        Close
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="udSave()">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    Zellen für Export
                  </v-list-item-title>
                  <v-list-item-subtitle
                    >Diese Zellen werden im Export beachtet
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-card-text>
                <v-dialog v-model="coDialog" width="800">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      color="secondary lighten-2"
                      dark
                      fab
                      small
                    >
                      <v-icon>mdi-format-list-bulleted-square</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="6"
                          v-for="column in settings.columns"
                          :key="column.i"
                        >
                          <v-text-field v-model="column.text"> </v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn
                        @click="
                          settings.columns.push({
                            i: settings.columns.length,
                            text: '',
                          })
                        "
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn @click="settings.columns.pop(1)">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="coDialog = false"
                      >
                        Close
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="udSave()">
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loaded: false,
      udDialog: false,
      stDialog: false,
      coDialog: false,
      settings: {
        length: "",
        delimeter: "",
        forbidden: "",
        cell: "",
        columns: [],
      },
      testValue: "xxxx-xxx-xxx-xxxx-xx",
      vuexSettings: this.$store.state.pointopc.settings,
      stateTexts: this.$store.state.pointopc.stateTexts,
    };
  },
  async mounted() {
    this.settings = this.vuexSettings;
  },
  methods: {
    ...mapActions(["SAVE_STORE", "READ_STORE", "SAVE_SETTINGS"]),

    udSave() {
      this.SAVE_SETTINGS(this.settings);
      this.udDialog = false;
      this.coDialog = false;
    },
  },
};
</script>

<style></style>
