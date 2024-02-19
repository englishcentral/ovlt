// Dont' use ES6 features like const, let, arrow functions. Emcc minification
// will fail. Used old-school JS.
Module['FlacStreamEncoder'] = FlacStreamEncoder;

// nodeJS only
if ('undefined' !== typeof global && exports) {
  module.exports.FlacStreamEncoder = FlacStreamEncoder;
}

// Pass options to create new encoder. Only currently supports options.onEncode
// onEncode will receive encoded byte chunks
function FlacStreamEncoder(options) {
  if ('function' !== typeof options.onEncode)
    throw Error('onEncode callback is required.');
  // set as read-only
  Object.defineProperty(this, 'onEncode', {value: options.onEncode});
  Object.defineProperty(this, 'blockSize', {value: options.blockSize});
  Object.defineProperty(this, 'sampleRate', {value: options.sampleRate});
}

// Emscripten will resolve this promise when Wasm is instantiated
FlacStreamEncoder.prototype.ready = new Promise(function(resolve, reject) {
  // queue the promise to resolve within Emscripten's init loop
  addOnPreMain(function() {
    var api = {
      HEAPU8: HEAPU8,
      createEncoder: cwrap('flac_stream_encoder_create', null, ['number', 'number']),
      finalizeEncoder: cwrap('flac_stream_encoder_finalize', null, ['number']), // Finalize encoder and write remainingm chunk
      freeEncoder: cwrap('flac_stream_encoder_free', null, ['number']),
      getInPtr: cwrap('flac_stream_encoder_get_in', 'number', ['number']),
      getOutPtr: cwrap('flac_stream_encoder_get_out', 'number', ['number']),
      encode: cwrap('flac_stream_encoder_process', null, ['number', 'number', 'number']), // Encode data
      pull: cwrap('flac_stream_encoder_pull', 'number', ['number']) // Pull encoded data
    }
    // make api read-only
    Object.freeze(api);
    Object.defineProperty(FlacStreamEncoder.prototype, 'api', {value: api});
    resolve();
  });
});

/*
  Decodes audio and calls onEncode with Audio object.
 */
FlacStreamEncoder.prototype.encode = function(uint8array) {
  if (!(uint8array instanceof Uint8Array))
    throw Error('Data to decode must be Uint8Array');

  if (!this._encoderPointer) {
    this._encoderPointer = this.api.createEncoder(this.blockSize, this.sampleRate);
    this._inPtr = this.api.getInPtr(this._encoderPointer);
    this._outPtr = this.api.getOutPtr(this._encoderPointer);
  }

  var outBytes, outArray;
  this.api.HEAPU8.set(uint8array, this._inPtr);
  this.api.encode(this._encoderPointer, uint8array.byteLength, 0);

  outBytes = this.api.pull(this._encoderPointer);
  outArray = new Uint8Array(this.api.HEAPU8.buffer, this._outPtr, outBytes);
  this.onEncode(outArray);
}

FlacStreamEncoder.prototype.encodeF32 = function(float32array) {
  if (!(float32array instanceof Float32Array))
    throw Error('Data to decode must be Float32Array');

  if (!this._encoderPointer) {
    this._encoderPointer = this.api.createEncoder(this.blockSize, this.sampleRate);
    this._inPtr = this.api.getInPtr(this._encoderPointer);
    this._outPtr = this.api.getOutPtr(this._encoderPointer);
  }

  var outBytes, outArray;
  this.api.HEAPU8.set(new Uint8Array(float32array.buffer), this._inPtr);
  this.api.encode(this._encoderPointer, float32array.byteLength, 1);

  outBytes = this.api.pull(this._encoderPointer);
  outArray = new Uint8Array(this.api.HEAPU8.buffer, this._outPtr, outBytes);
  this.onEncode(outArray);
}

FlacStreamEncoder.prototype.free = function() {

  if (this._encoderPointer) {
    this.api.finalizeEncoder(this._encoderPointer);

    var outBytes, outArray;
    outBytes = this.api.pull(this._encoderPointer);
    outArray = new Uint8Array(this.api.HEAPU8.buffer, this._outPtr, outBytes);
    this.onEncode(outArray);

    this.api.freeEncoder(this._encoderPointer);
  }
}
