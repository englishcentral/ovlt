#include <stdlib.h>
#include <string.h>
#include <FLAC/metadata.h>
#include <FLAC/stream_encoder.h>

#include "resample.h"

#define BUFFER_SIZE 4000
#define INPUT_BUFFER_SIZE 16000

// Main persistenc object.  Pass this to decode()
typedef struct {
  FLAC__StreamEncoder *encoder;
  SpeexResamplerState *resampler;

  char inbuf[INPUT_BUFFER_SIZE];
  char resampbuf[INPUT_BUFFER_SIZE];
  FLAC__int32 pcm[INPUT_BUFFER_SIZE];

  char outbuf[BUFFER_SIZE];

  int out_offset;
} FlacStreamEncoder;

FlacStreamEncoder *flac_stream_encoder_create(int block_size, int sample_rate);
void flac_stream_encoder_finalize(FlacStreamEncoder *encoder);
void flac_stream_encoder_free(FlacStreamEncoder *encoder);

char *flac_stream_encoder_get_in(FlacStreamEncoder *encoder);
char *flac_stream_encoder_get_out(FlacStreamEncoder *encoder);

void flac_stream_encoder_process(FlacStreamEncoder *encoder, int input_size, int is_float);
int flac_stream_encoder_pull(FlacStreamEncoder *encoder);
