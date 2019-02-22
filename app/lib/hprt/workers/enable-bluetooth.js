require('globals'); // necessary to bootstrap tns modules on the new thread

    global.onmessage = function(msg) {

        var result = enableBluetooth();

        global.postMessage(result);
    }

    function enableBluetooth() {
        let mBluetoothAdapter = android.bluetooth.BluetoothAdapter.getDefaultAdapter();

        if (mBluetoothAdapter == null) {
            return { success: false, message: "Bluetooth NOT support", enabled: false}
        }
        else {
            if (mBluetoothAdapter.isEnabled()) {
                if (mBluetoothAdapter.isDiscovering()) {
                    return { success: true, message: "Bluetooth is currently in device discovery process.", enabled: false};
                } else {
                    return { success: true, message: "Bluetooth is enabled", enabled: true}
                }
            }
            else {
                mBluetoothAdapter.enable();
                return { success: true, message: "", enabled: false};
            }
        }



        // mBluetoothAdapter.enable();

        // return true;
    }

    // does not handle errors with an `onerror` handler
    // errors will propagate directly to the main thread Worker instance

    // to handle errors implement the global.onerror handler:
    // global.onerror = function(err) {}