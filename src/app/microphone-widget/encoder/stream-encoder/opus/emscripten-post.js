// Dont' use ES6 features like const, let, arrow functions. Emcc minification
// will fail. Used old-school JS.
Module['OpusStreamEncoder'] = OpusStreamEncoder;

// nodeJS only
if ('undefined' !== typeof global && exports) {
  module.exports.OpusStreamEncoder = OpusStreamEncoder;
}

// Pass options to create new encoder. Only currently supports options.onEncode
// onEncode will receive encoded byte chunks
function OpusStreamEncoder(options) {
  if ('function' !== typeof options.onEncode)
    throw Error('onEncode callback is required.');
  // set as read-only
  Object.defineProperty(this, 'onEncode', {value: options.onEncode});
  Object.defineProperty(this, 'sampleRate', {value: options.sampleRate});
}

// Emscripten will resolve this promise when Wasm is instantiated
OpusStreamEncoder.prototype.ready = new Promise(function(resolve, reject) {
  // queue the promise to resolve within Emscripten's init loop
  addOnPreMain(function() {
    var api = {
      HEAPU8: HEAPU8,
      createEncoder: cwrap('opus_stream_encoder_create', null, ['number']),
      freeEncoder: cwrap('opus_stream_encoder_free', null, ['number']),
      getInPtr: cwrap('opus_stream_encoder_get_in', 'number', ['number']),
      getOutPtr: cwrap('opus_stream_encoder_get_out', 'number', ['number']),
      encode: cwrap('opus_stream_encoder_process', 'number', ['number', 'number'])
    }
    // make api read-only
    Object.freeze(api);
    Object.defineProperty(OpusStreamEncoder.prototype, 'api', {value: api});
    resolve();
  });
});

/*
  Decodes audio and calls onEncode with Audio object.
 */
OpusStreamEncoder.prototype.encode = function(uint8array) {
  if (!(uint8array instanceof Uint8Array))
    throw Error('Data to decode must be Uint8Array');

  if (!this._encoderPointer) {
    this._encoderPointer = this.api.createEncoder(this.sampleRate);
    this._inPtr = this.api.getInPtr(this._encoderPointer);
    this._outPtr = this.api.getOutPtr(this._encoderPointer);
  }

  this.api.HEAPU8.set(uint8array, this._inPtr);
  var outBytes = this.api.encode(this._encoderPointer, uint8array.byteLength, 0);
  var outArray = new Uint8Array(this.api.HEAPU8.buffer, this._outPtr, outBytes);
  this.onEncode(outArray);
}

OpusStreamEncoder.prototype.encodeF32 = function(float32array) {
  if (!(float32array instanceof Float32Array))
    throw Error('Data to decode must be Float32Array');

  if (!this._encoderPointer) {
    this._encoderPointer = this.api.createEncoder(this.sampleRate);
    this._inPtr = this.api.getInPtr(this._encoderPointer);
    this._outPtr = this.api.getOutPtr(this._encoderPointer);
  }

  var outBytes, outArray;
  this.api.HEAPU8.set(new Uint8Array(float32array.buffer), this._inPtr);
  var outBytes = this.api.encode(this._encoderPointer, float32array.byteLength, 1);
  var outArray = new Uint8Array(this.api.HEAPU8.buffer, this._outPtr, outBytes);
  this.onEncode(outArray);
}


OpusStreamEncoder.prototype.free = function() {
  if (this._encoderPointer) {
    this.api.freeEncoder(this._encoderPointer);
  }
}
