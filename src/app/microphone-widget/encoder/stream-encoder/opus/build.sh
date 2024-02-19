#!/bin/bash

# Opus build
# emconfigure ./configure --disable-asm --disable-rtcd --disable-stack-protector --disable-hardening --enable-fixed-point

emcc \
-O3 -o opus-stream-encoder.js \
-s NO_DYNAMIC_EXECUTION=1 \
-s NO_FILESYSTEM=1 \
-s EXTRA_EXPORTED_RUNTIME_METHODS="['cwrap']" \
-s EXPORTED_FUNCTIONS="[ \
  '_opus_stream_encoder_create' \
  , '_opus_stream_encoder_free' \
  , '_opus_stream_encoder_get_in' \
  , '_opus_stream_encoder_get_out' \
  , '_opus_stream_encoder_process' \
]" \
--pre-js 'emscripten-pre.js' \
--post-js 'emscripten-post.js' \
-I ../../opus-1.3.1-emscripten/include \
-I ../resample \
opus_stream_encoder.c ../resample/resample.c \
../../opus-1.3.1-emscripten/.libs/libopus.a

#-s SAFE_HEAP=1 \
#
#node test-opus-stream-encoder.js test.wav test.opus
#opus_demo -d 16000 1 test.opus test.raw
