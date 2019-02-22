require('globals'); // necessary to bootstrap tns modules on the new thread

    global.onmessage = function(msg) {
        var request = msg.data;
        var port = request.port;

        var result = connectPrinter(port);

        global.postMessage(result);
    }

    function connectPrinter(port) {
        let isPortOpen = HPRTAndroidSDK.HPRTPrinterHelper.PortOpen("Bluetooth,"+port.portName);
        
        return isPortOpen;
    }

    // does not handle errors with an `onerror` handler
    // errors will propagate directly to the main thread Worker instance

    // to handle errors implement the global.onerror handler:
    // global.onerror = function(err) {}