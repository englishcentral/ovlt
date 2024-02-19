#include <stdlib.h>
#include <string.h>
#include <opus.h>
#include "resample.h"

#define BUFFER_SIZE 8000
#define HEADER_SIZE 8

// Main persistenc object.  Pass this to decode()
typedef struct {
  OpusEncoder *encoder;
  SpeexResamplerState *resampler;

  char inbuf[BUFFER_SIZE];
  char resampbuf[BUFFER_SIZE];
  char outbuf[BUFFER_SIZE];

  int out_offset;
} OpusStreamEncoder;

OpusStreamEncoder *opus_stream_encoder_create(int sample_rate);
void opus_stream_encoder_free(OpusStreamEncoder *encoder);

char *opus_stream_encoder_get_in(OpusStreamEncoder *encoder);
char *opus_stream_encoder_get_out(OpusStreamEncoder *encoder);

int opus_stream_encoder_process(OpusStreamEncoder *encoder, int input_size, int is_float);
