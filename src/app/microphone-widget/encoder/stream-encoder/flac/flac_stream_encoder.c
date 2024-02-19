#include <FLAC/metadata.h>
#include <FLAC/stream_encoder.h>
#include <assert.h>

#include "flac_stream_encoder.h"

FLAC__StreamEncoderWriteStatus write_callback(const FLAC__StreamEncoder *encoder, const FLAC__byte buffer[], size_t bytes, unsigned samples, unsigned current_frame, void *client_data)
{
    FlacStreamEncoder *enc = (FlacStreamEncoder *)client_data;

    assert (enc->out_offset + bytes < BUFFER_SIZE);
    memcpy(enc->outbuf + enc->out_offset, buffer, bytes);
    enc->out_offset += bytes;
    return 0;
}


FlacStreamEncoder *flac_stream_encoder_create(int block_size, int sample_rate)
{
    int error;

    assert (block_size < BUFFER_SIZE);
    assert (sample_rate >= 16000);

    FlacStreamEncoder *encoder = malloc(sizeof(FlacStreamEncoder));
    encoder->encoder = FLAC__stream_encoder_new();

    FLAC__stream_encoder_set_compression_level(encoder->encoder, 2);
    FLAC__stream_encoder_set_channels(encoder->encoder, 1);
    FLAC__stream_encoder_set_bits_per_sample(encoder->encoder, 16);
    FLAC__stream_encoder_set_sample_rate(encoder->encoder, 16000);
    FLAC__stream_encoder_set_blocksize(encoder->encoder, block_size);
    FLAC__stream_encoder_set_metadata(encoder->encoder, NULL, 0);

    FLAC__stream_encoder_init_stream(encoder->encoder, write_callback, NULL, NULL, NULL, encoder);

    encoder->resampler = speex_resampler_init(1, sample_rate, 16000, 1 /* quality */, &error);

    return encoder;
}

void flac_stream_encoder_finalize(FlacStreamEncoder *encoder)
{
    FLAC__stream_encoder_finish(encoder->encoder);
}

void flac_stream_encoder_free(FlacStreamEncoder *encoder)
{
    FLAC__stream_encoder_delete(encoder->encoder);
    speex_resampler_destroy(encoder->resampler);
    free(encoder);
}

char *flac_stream_encoder_get_in(FlacStreamEncoder *encoder)
{
    return encoder->inbuf;
}

char *flac_stream_encoder_get_out(FlacStreamEncoder *encoder)
{
    return encoder->outbuf;
}

void flac_stream_encoder_process(FlacStreamEncoder *encoder, int input_size, int is_float)
{
    spx_uint32_t i, input_samples, resampled_samples;
    assert (input_size < INPUT_BUFFER_SIZE);

    if (is_float) {
        input_samples = input_size / sizeof(float);
        resampled_samples = INPUT_BUFFER_SIZE / sizeof(float);

        speex_resampler_process_float(encoder->resampler, 0,
                                      (float *)encoder->inbuf, &input_samples, (float *)encoder->resampbuf,
                                      &resampled_samples);

        for(i = 0; i < resampled_samples; i++) {
            encoder->pcm[i] = (FLAC__int32)((((float *)encoder->resampbuf)[i]) * 32768);
        }
    } else {
        input_samples = input_size / sizeof(spx_int16_t);
        resampled_samples = INPUT_BUFFER_SIZE / sizeof(spx_int16_t);

        speex_resampler_process_int(encoder->resampler, 0,
                                    (spx_int16_t*)encoder->inbuf, &input_samples, (spx_int16_t*)encoder->resampbuf,
                                    &resampled_samples);
        for(i = 0; i < resampled_samples; i++) {
            encoder->pcm[i] = (FLAC__int32)(((spx_int16_t *)encoder->resampbuf)[i]);
        }
    }
    FLAC__stream_encoder_process_interleaved(encoder->encoder, encoder->pcm, resampled_samples);
}

int flac_stream_encoder_pull(FlacStreamEncoder *encoder)
{
    int res;
    res = encoder->out_offset;
    encoder->out_offset = 0;
    return res;
}
