#!/bin/bash

emcc \
-O3 -o flac-stream-encoder.js \
-s NO_DYNAMIC_EXECUTION=1 \
-s NO_FILESYSTEM=1 \
-s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap']" \
-s EXPORTED_FUNCTIONS="[ \
  '_flac_stream_encoder_create' \
  , '_flac_stream_encoder_free' \
  , '_flac_stream_encoder_finalize' \
  , '_flac_stream_encoder_get_in' \
  , '_flac_stream_encoder_get_out' \
  , '_flac_stream_encoder_process' \
  , '_flac_stream_encoder_pull' \
]" \
--pre-js 'emscripten-pre.js' \
--post-js 'emscripten-post.js' \
-I ../../flac-1.3.3-emscripten/include \
-I ../resample \
flac_stream_encoder.c ../resample/resample.c \
../../flac-1.3.3-emscripten/src/libFLAC/.libs/libFLAC-static.a -lm

#-s SAFE_HEAP=1 \
#-s ASSERTIONS=1 \
#node test-flac-stream-encoder.js test.wav test.flac
