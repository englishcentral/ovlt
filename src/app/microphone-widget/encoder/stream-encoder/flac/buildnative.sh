#!/bin/bash

gcc \
-O2 -g -o test \
-I ../../flac-1.3.3/include \
-I ../resample \
test.c flac_stream_encoder.c ../resample/resample.c \
../../flac-1.3.3/src/libFLAC/.libs/libFLAC-static.a -lm
