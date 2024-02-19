var buffer = new Float32Array(0);
var currentSize = 0;
var BUFFER_SIZE = 2048;

var resetBuffer = function() {
    buffer = new Float32Array(0);
    currentSize = 0;
};

var setBufferSize = function(bufferSize) {
    BUFFER_SIZE = bufferSize;
};

var onmessage = function(event) {
    if (!event.data || !event.data.command) {
        postMessage("webworker error, invalid data");
    }

    switch (event.data.command) {
        case "setBufferSize":
            this.setBufferSize(event.data.bufferSize);
            break;
        case "appendBuffer":
            currentSize += event.data.buffer.length;
            var newBuffer = new Float32Array(currentSize);
            newBuffer.set(buffer, 0);
            newBuffer.set(event.data.buffer, buffer.length);
            buffer = newBuffer;

            if (currentSize >= BUFFER_SIZE) {
                postMessage({buffer: buffer});
                resetBuffer();
            }
            break;
        case "stop":
            postMessage({buffer: buffer});
            resetBuffer();
            break;
    }
};

