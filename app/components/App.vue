<template>
  <Page>
    <ActionBar title="Printer test"
               class="action-bar">
    </ActionBar>
    <GridLayout class="page"
                rows="auto, *, auto"
                columns="*">
      <GridLayout row="0"
                  rows="auto, auto"
                  columns="*,*">
        <Button col="0"
                row="0"
                class="btn btn-primary"
                text="Enable bluetooth"
                :isEnabled="!btEnabled"
                @tap="enableBluetooth"></Button>
        <Button v-if="!selected"
                col="1"
                row="0"
                class="btn btn-primary"
                text="Search Printers"
                @tap="searchPrinters"></Button>
        <Button v-if="selected"
                col="1"
                row="0"
                class="btn btn-primary"
                text="Disconnect"
                @tap="disconnect"></Button>
        <Label col="0"
               colSpan="2"
               row="1"
               :text="connected"
               horizontalAlignment="left"></Label>
      </GridLayout>

      <ListView row="1"
                class="list-group"
                v-if="!selected"
                @itemTap="connect">
        <v-template>
          <Label :text="`${item.modelName} (${item.portName})`"
                 class="list-group-item"></Label>
        </v-template>
      </ListView>

      <GridLayout row="2"
                  rows="auto, auto, auto, auto"
                  columns="*,*,*">

        <Button col="0"
                row="0"
                class="btn btn-primary"
                text="Simple Text"
                @tap="printTextSimple"></Button>
        <Button col="1"
                row="0"
                class="btn btn-primary"
                text="Sample receipt"
                @tap="printReceipt"></Button>
        <Button col="3"
                row="0"
                class="btn btn-primary"
                text="White text"
                @tap="printTextWhite"></Button>

        <Button col="0"
                row="1"
                class="btn btn-primary"
                text="Underline"
                @tap="printTextUnderline"></Button>
        <Button col="1"
                row="1"
                class="btn btn-primary"
                text="Bold"
                @tap="printTextBold"></Button>
        <Button col="3"
                row="1"
                class="btn btn-primary"
                text="Mini"
                @tap="printTextMini"></Button>

        <Button col="0"
                row="2"
                class="btn btn-primary"
                text="Double Text"
                @tap="printDoubleText"></Button>
        <Button col="1"
                row="2"
                class="btn btn-primary"
                text="Double width"
                @tap="printDoubleTextWidth"></Button>
        <Button col="2"
                row="2"
                class="btn btn-primary"
                text="Double Height"
                @tap="printDoubleTextHeight"></Button>

        <Button col="0"
                row="3"
                class="btn btn-primary"
                text="Left text"
                @tap="printTextLeft"></Button>
        <Button col="1"
                row="3"
                class="btn btn-primary"
                text="Center text"
                @tap="printTextCenter"></Button>
        <Button col="2"
                row="3"
                class="btn btn-primary"
                text="Right text"
                @tap="printTextRight"></Button>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
  import { Hprt } from "../lib/hprt/index.js";
  import { LoadingIndicator } from "nativescript-loading-indicator";

  export default {
    data() {
      return {
        text: 'Test print',
        selected: false,
        btEnabled: false,
        items: [],
      }
    },
    computed: {
      connected() {
        return this.selected ? '== PRINTER CONNECTED ==' : '== NO CONNECTION ==';
      }
    },
    created() {
      this.hprt = new Hprt();
      this.btEnabled = this.hprt.isBluetoothEnabled();
      this.loader = new LoadingIndicator();
    },
    methods: {
      enableBluetooth() {
        console.log("Enabling bluetooth...");
        this.loader.show();

        this.hprt.enableBluetooth().then((res) => {
          console.log("Enabled", res);
          this.btEnabled = true;
          this.loader.hide();
        }, (err) => {
          console.log("Error", err);
          this.loader.hide();
        });
      },
      searchPrinters() {
        this.hprt.searchPrinters().then(printers => {
          this.items = printers;
        });
      },
      connect(event) {
        this.loader.show();

        this.hprt.connect(event.item).then((res) => {
          alert('connect success');
          this.selected = true;
          this.loader.hide();
        }, (err) => {
          alert('connect failed. ' + err.message);
          this.loader.hide();
        })
      },
      disconnect() {
        this.hprt.disconnect().then((res) => {
          console.log("success", res);
          this.selected = false;
        }, (err) => {
          console.log("error", err)
        })
      },
      printTextSimple() {
        this.hprt.printTextSimple(this.text);
      },
      printText() {
        this.hprt.printText("Hello world", 1, 48, 0);
      },
      printDoubleText() {
        this.hprt.printTextDouble(this.text);
      },
      printDoubleTextWidth() {
        this.hprt.printTextDoubleWidth(this.text);
      },
      printDoubleTextHeight() {
        this.hprt.printTextDoubleHeight(this.text);
      },
      printTextUnderline() {
        this.hprt.printTextUnderline(this.text);
      },
      printTextBold() {
        this.hprt.printTextBold(this.text);
      },
      printTextMini() {
        this.hprt.printTextMini(this.text);
      },
      printTextWhite() {
        this.hprt.printTextWhite(this.text);
      },
      printTextLeft() {
        this.hprt.printTextLeft(this.text);
      },
      printTextCenter() {
        this.hprt.printTextCenter(this.text);
      },
      printTextRight() {
        this.hprt.printTextRight(this.text);
      },
      printReceipt() {
        // Sum this numbers to get attribute combination
        // Example: 
        // Double height: 16
        // Double Width: 32
        // Underline: 4
        // Bold: 2
        // Mini: 1
        // White text: 8

        let cart = [
          "Nativescript             $111.00",
          "Angular                  $222.00",
          "Typescript               $333.00",
          "HPRT                      $99.00"
        ];

        this.hprt.newLine();
        this.hprt.printText("Krushka Design", 1, 48, 0);
        this.hprt.printText("YOUR DEVELOPMENT AGENCY", 1, 1, 0);
        this.hprt.printTextCenter("-----");
        this.hprt.newLine();
        this.hprt.printTextSimple("Av Amsterdam 240, 4th floor");
        this.hprt.printTextSimple("06100, Condesa/Hipodromo");
        this.hprt.printTextSimple("Mexico City, Mexico");
        this.hprt.printTextSimple("Tel: +52 55 7589 6653");
        this.hprt.printTextSimple("Email: info@krushka.mx");
        this.hprt.newLine();
        this.hprt.printTextSimple("Date: 2017-09-01             #21");
        this.hprt.newLine();
        for (let index = 0; index < cart.length; index++) {
          this.hprt.printTextSimple(cart[index]);
          this.hprt.horizontalLine();
        }
        this.hprt.newLine();
        this.hprt.printTextSimple("Before tax              $1234.00");
        this.hprt.printTextSimple("Tax 16%                  $197.44");
        this.hprt.horizontalLine();
        this.hprt.printTextBold("Total                   $1431.44");
        this.hprt.newLine();
        this.hprt.printTextMini("Disclaimer: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eget ligula dapibus, scelerisque nisl eget, elementum mi.");
        this.hprt.newLine();
        this.hprt.printTextCenter("-----");
        this.hprt.printText("Thank you for your business", 1, 16, 0);
        this.hprt.newLine(2);
      }
    }
  }
</script>

<style scoped>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
  }
</style>
