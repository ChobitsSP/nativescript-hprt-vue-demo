import * as utils from "tns-core-modules/utils/utils";
// import * as application from "tns-core-modules/application";
import {
  Observable
} from "rxjs";

// import {
//   HPRTPrinter
// } from "./hprt.common";

const ConnectWorker = require("nativescript-worker-loader!./workers/connect-printer.js");
const BluetoothWorker = require("nativescript-worker-loader!./workers/enable-bluetooth.js");

// const HPRTPrinterHelper: any = HPRTAndroidSDK.HPRTPrinterHelper;

const HPRTPrinterHelper = HPRTAndroidSDK.HPRTPrinterHelper;

export class Hprt {
  constructor() {
    this.encoding = java.nio.charset.Charset.forName("UTF-8");
    this.HPRTPrinterHelper = new HPRTAndroidSDK.HPRTPrinterHelper(
      utils.ad.getApplicationContext(),
      "MPT-II"
    );
    this.mBluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();
  }

  async enableBluetooth(timeout) {
    return new Promise((resolve, reject) => {
      let wait = timeout ? timeout : 6000;

      // let enableBluetoothWorker = new Worker("./workers/enable-bluetooth");
      let enableBluetoothWorker = new BluetoothWorker();

      enableBluetoothWorker.postMessage({});

      enableBluetoothWorker.onmessage = function (msg) {
        enableBluetoothWorker.terminate();
        if (msg.data.success) {
          if (msg.data.enabled) {
            resolve();
          }
        } else {
          reject(msg.data.message);
        }
      };

      enableBluetoothWorker.onerror = function (err) {
        console.log(
          `An unhandled error occurred in worker: ${err.filename}, line: ${
            err.lineno
          } :`
        );
        console.log(err.message);
        reject(err.message);
      };
      //this.mBluetoothAdapter.enable();

      this.listenToBluetoothEnabled().subscribe(enabled => {
        if (enabled) {
          resolve();
        }
      });
    });
  }

  isBluetoothEnabled() {
    return this.mBluetoothAdapter.isEnabled() && this.mBluetoothAdapter != null ?
      true :
      false;
  }

  isBluetoothEnabledPromise() {
    return new Promise((resolve, reject) => {
      if (
        this.mBluetoothAdapter.isEnabled() &&
        this.mBluetoothAdapter != null
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  searchPrinters() {
    return new Promise((resolve, reject) => {
      let BluetoothDevice = android.bluetooth.BluetoothDevice;
      let mBtAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();
      let pairedDevices = mBtAdapter.getBondedDevices();

      let printers = [];

      if (pairedDevices.size() > 0) {
        let pairedDevicesArr = pairedDevices.toArray();

        for (let i = 0; i < pairedDevicesArr.length; i++) {
          let device = "" + pairedDevicesArr[i]; // TODO: Figure out why this is not string
          let deviceObj = mBtAdapter.getRemoteDevice(device);
          printers.push(
            new HPRTPrinter(deviceObj.getAddress(), deviceObj.getName())
          );
        }
      }

      resolve(printers);
    });
  }

  connect(portSetting) {
    return new Promise((resolve, reject) => {
      try {
        // let connectPrinterWorker = new Worker("./workers/connect-printer");

        let connectPrinterWorker = new ConnectWorker();

        connectPrinterWorker.postMessage({
          port: portSetting
        });

        connectPrinterWorker.onmessage = function (msg) {
          connectPrinterWorker.terminate();

          if (msg == -1) {
            reject("No ports open");
          } else {
            resolve();
          }
        };

        connectPrinterWorker.onerror = function (err) {
          console.log(
            `An unhandled error occurred in worker: ${err.filename}, line: ${
              err.lineno
            } :`
          );
          console.log(err.message);
          reject(err.message);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      try {
        HPRTAndroidSDK.HPRTPrinterHelper.PortClose();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  isConnected() {
    return HPRTAndroidSDK.HPRTPrinterHelper.IsOpened();
  }

  // Print methods
  printTextSimple(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 0, 0); // Reset all to 0
    }
    return true;
  }

  printText(
    text,
    alignment,
    attribute,
    textSize
  ) {
    let align = alignment || 0;
    let attr = attribute || 0;
    let txtSize = textSize || 0;

    // let data = Array.create("byte", 1);
    // data[0] = "0x1b,0x40";
    // HPRTAndroidSDK.HPRTPrinterHelper.WriteData(data);

    //this.LanguageEncode();

    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, align, attr, txtSize);
    }

    return true;
  }

  printTextDouble(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 48, 0);
    }
    return true;
  }

  printTextDoubleHeight(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 16, 0);
    }
    return true;
  }

  printTextDoubleWidth(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 32, 0);
    }
    return true;
  }

  printTextUnderline(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 4, 0);
    }
    return true;
  }

  printTextBold(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 2, 0);
    }
    return true;
  }

  printTextMini(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 1, 0);
    }
    return true;
  }

  printTextWhite(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 8, 0);
    }
    return true;
  }

  printTextLeft(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 0, 0, 0);
    }
    return true;
  }

  printTextCenter(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 1, 0, 0);
    }
    return true;
  }

  printTextRight(text) {
    if (text) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(text, 2, 0, 0);
    }
    return true;
  }

  /**
   *
   * @param {string} param0
   * @param {number} param1
   * @param {number} param2
   * @param {number} param3
   * @memberof Hprt
   */
  printQRCode(param0, param1, param2, param3) {
    if (param0) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintQRCode(param0, param1, param2, param3);
    }
  }

  newLine(lines) {
    let line = lines || 1;

    for (let i = 0; i < line; i++) {
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText("\n");
    }
    return true;
  }

  horizontalLine() {
    let line = "--------------------------------";
    HPRTAndroidSDK.HPRTPrinterHelper.PrintText(line, 0, 0, 0);
    return true;
  }

  testPrint() {
    return new Promise((resolve, reject) => {
      // Working
      // let data = this.toBytes("----NATIVESCRIPT--FUCK--YEAH----");
      // let bData = Array.create("byte", 3);
      // bData = data;
      // let print = this.printer.WriteData(bData, bData.length);

      // New
      let strPrintText = "Hello world";
      HPRTAndroidSDK.HPRTPrinterHelper.PrintText(strPrintText + "\n", 0, 0, 0);

      resolve();
    });
  }

  toBytes(val) {
    return new java.lang.String(val).getBytes(this.encoding);
  }

  LanguageEncode() {
    try {
      let PFun = new HPRTAndroidSDK.PublicFunction(
        utils.ad.getApplicationContext()
      );
      let sLanguage = PFun.ReadSharedPreferencesData("Codepage")
        .split(",")[1]
        .toString();
      let sLEncode = "gb2312";
      let intLanguageNum = 0;

      sLEncode = PFun.getLanguageEncode(sLanguage);
      intLanguageNum = PFun.getCodePageIndex(sLanguage);

      HPRTAndroidSDK.HPRTPrinterHelper.SetCharacterSet(intLanguageNum);
      HPRTAndroidSDK.HPRTPrinterHelper.LanguageEncode = sLEncode;

      return sLEncode;
    } catch (e) {
      console.log("Error in LanguageEncode()");
      return "";
    }
  }

  getEncodedString(val) {
    let parts = val;
    // if it's not a string assume it's a byte array already
    if (typeof val === "string") {
      parts = val.split(",");

      if (parts[0].indexOf("x") == -1) {
        return null;
      }
    }

    var result = Array.create("byte", parts.length);

    for (var i = 0; i < parts.length; i++) {
      result[i] = parts[i];
    }
    return result;

    //return new java.lang.String(value).getBytes(this.encoding);
  }

  AfterPrintAction() {
    try {
      //let PFun = new PublicFunction(utils.ad.getApplicationContext());

      // if(PFun.ReadSharedPreferencesData("Cashdrawer").equals("2") && PrinterProperty.Cashdrawer)
      // 	HPRTPrinterHelper.OpenCashdrawer(0);
      // if(PFun.ReadSharedPreferencesData("Buzzer").equals("2") && PrinterProperty.Buzzer)
      // 	HPRTPrinterHelper.BeepBuzzer(1,10,10);

      // iFeed=Integer.valueOf(PFun.ReadSharedPreferencesData("Feeds"));
      // ArrayAdapter arrFeeds;
      // arrFeeds = new ArrayAdapter<String>(context,android.R.layout.simple_spinner_item);
      // arrFeeds=ArrayAdapter.createFromResource(context, R.array.feeds_list, android.R.layout.simple_spinner_item);
      // arrFeeds.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
      // iFeed=(Integer.valueOf(arrFeeds.getItem(iFeed).toString().replace("mm", "")));
      // HPRTPrinterHelper.PrintAndFeed(iFeed*4);
      // if(PFun.ReadSharedPreferencesData("Cut").equals("2") && PrinterProperty.Cut)

      // 	HPRTPrinterHelper.CutPaper(HPRTPrinterHelper.HPRT_PARTIAL_CUT,PrinterProperty.CutSpacing);
      // else
      // 	HPRTPrinterHelper.PrintAndFeed(PrinterProperty.TearSpacing);
      HPRTPrinterHelper.PrintAndFeed(TearSpacing);
    } catch (e) {
      console.log("AfterPrintAction", e);
    }
  }

  // Credits: https://www.nativescript.org/blog/controlling-robots-with-nativescript-bluetooth
  listenToBluetoothEnabled() {
    return new Observable(observer => {
      this.isBluetoothEnabledPromise().then(enabled => observer.next(enabled));

      let intervalHandle = setInterval(() => {
        this.isBluetoothEnabledPromise().then(enabled =>
          observer.next(enabled)
        );
      }, 1000);

      // stop checking every second on unsubscribe
      return () => clearInterval(intervalHandle);
    }).distinctUntilChanged();
  }
}

const TearSpacing = 0;

// export class PrinterProperty {
//   static Barcode = "";
//   static PrintableWidth = 0;
//   static Cut = false;
//   static CutSpacing = 0;
//   static TearSpacing = 0;
//   static ConnectType = 0;
//   static Cashdrawer = false;
//   static Buzzer = false;
//   static Pagemode = false;
//   static PagemodeArea = "";
//   static GetRemainingPower = false;
//   static SampleReceipt = true;
//   static StatusMode = 0;
// }