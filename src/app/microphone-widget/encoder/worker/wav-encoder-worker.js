var writeUtfBytes = function(view, offset, s) {
    var l = s.length;
    for (var i = 0; i < l; i++) {
        view.setUint8(offset + i, s.charCodeAt(i));
    }
};

var onmessage = function(event) {
    if (!event.data) {
        throw new TypeError("webworker error, invalid data");
    }
    if (event.data.command && event.data.command === "stop") {
        return;
    }

    var chunks = event.data.chunks;
    var bufferLength = event.data.bufferLength;
    var firstChunk = event.data.firstChunk;
    var sampleRate = event.data.sampleRate;

    var pcmBuffer = new Float32Array(bufferLength);
    var offset = 0;
    var l = chunks.length;
    for (var i = 0; i < l; i++) {
        var chunk = chunks[i];
        pcmBuffer.set(chunk, offset);
        offset += chunk.length;
    }

    // create the wavBuffer and view to create the .WAV file
    var wavBuffer = firstChunk ? new ArrayBuffer(44 + pcmBuffer.length * 2) : new ArrayBuffer(pcmBuffer.length * 2);
    var wavView = new DataView(wavBuffer);
    var index = firstChunk ? 44 : 0;

    if (firstChunk) {
        // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
        writeUtfBytes(wavView, 0, "RIFF");
        wavView.setUint32(4, 44 + pcmBuffer.length * 2, true);
        writeUtfBytes(wavView, 8, "WAVE");
        writeUtfBytes(wavView, 12, "fmt ");
        wavView.setUint32(16, 16, true);
        wavView.setUint16(20, 1, true);
        wavView.setUint16(22, 1, true);
        wavView.setUint32(24, sampleRate, true);
        wavView.setUint32(28, sampleRate * 4, true);
        wavView.setUint16(32, 4, true);
        wavView.setUint16(34, 16, true);
        writeUtfBytes(wavView, 36, "data");
        wavView.setUint32(40, pcmBuffer.length * 2, true);
    }

    // write the PCM samples converting from float32 to uint16
    var lng = pcmBuffer.length;
    for (var j = 0; j < lng; j++) {
        var s = Math.max(-1, Math.min(1, pcmBuffer[j]));
        wavView.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        //wavView.setInt16(index, pcmBuffer[i] * 0x7FFF, true);
        index += 2;
    }

    postMessage(wavView.buffer);
};
