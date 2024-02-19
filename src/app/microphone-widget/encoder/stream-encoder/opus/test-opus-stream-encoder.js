/*
 *  NodeJS test that reads and encodes pcm file in streams. Invoke as:
 *
 *    $ node test-opus-stream-encoder PCM_IN_FILE FLAC_OUT_FILE
 */

const args = process.argv;
const currentFolder = process.cwd()+'/';
const thisScriptFolder = args[1].match(/^.*\//)[0];
process.chdir(thisScriptFolder);

const fs = require('fs');
const { OpusStreamEncoder } = require('./opus-stream-encoder.js');
const encoder = new OpusStreamEncoder({ onEncode : onEncode, sampleRate : 48000});

const pcmInFile = args[2].startsWith('/')? args[2] : currentFolder+args[2];
const opusOutFile = args[3].startsWith('/')? args[3] : currentFolder+args[3];

const inFileStream = fs.createReadStream(pcmInFile, {start: 44, highWaterMark: 1280 * 3});
const outFileStream = fs.createWriteStream(opusOutFile);

// read file in 16k chunks and send to Opus encoder
let totalBytesEncoded = 0;

inFileStream.on('data', async data => {
  try {
    await encoder.ready;


    if (data.byteLength == 1280 * 3) {

//    console.log("Encoding chunk of", data.byteLength, "bytes");
//    encoder.encode(data);
//    f32 alternative
      var i, f = new Float32Array(data.byteLength / 2)
      for (i = 0; i < f.length; i++) {
        f[i] = data.readInt16LE (i * 2) / 32768;
      }
      encoder.encodeF32(f);
    }

  } catch (err) {
    showError(err);
    encoder.free();
    inFileStream.destroy(err);
  }
}).on('end', async _ => {
  await encoder.ready;
  encoder.free();
  if (!totalBytesEncoded) {
    console.error('File could not be decoded.')
  } else {
    console.log('ENCODED:', totalBytesEncoded, 'bytes.');
  }
}).on('error', err => {
  encoder.free();
  showError(err)
});

function onEncode(outChunk) {
//  console.log("Got chunk of", outChunk.byteLength, "bytes");
  totalBytesEncoded += outChunk.byteLength;
  outFileStream.write(Buffer.from(outChunk));
}

function showError(err) {
  console.error(err);
}
