#include <assert.h>
#include <stdio.h>
#include <arpa/inet.h>

#include "opus_stream_encoder.h"

OpusStreamEncoder *opus_stream_encoder_create(int sample_rate)
{
    int error;
    OpusStreamEncoder *encoder;

    assert (sample_rate > 16000);

    encoder = malloc(sizeof(OpusStreamEncoder));

    encoder->encoder = opus_encoder_create(16000, 1, OPUS_APPLICATION_VOIP, &error);
    assert(encoder->encoder != NULL);

    opus_encoder_ctl(encoder->encoder, OPUS_SET_BITRATE(40000));
    opus_encoder_ctl(encoder->encoder, OPUS_SET_COMPLEXITY(0));
    opus_encoder_ctl(encoder->encoder, OPUS_SET_SIGNAL(OPUS_SIGNAL_VOICE));

    encoder->resampler = speex_resampler_init(1, sample_rate, 16000, 1 /* quality */, &error);

    return encoder;
}

void opus_stream_encoder_free(OpusStreamEncoder *encoder)
{
    opus_encoder_destroy(encoder->encoder);
    speex_resampler_destroy(encoder->resampler);
    free(encoder);
}

char *opus_stream_encoder_get_in(OpusStreamEncoder *encoder)
{
    return encoder->inbuf;
}

char *opus_stream_encoder_get_out(OpusStreamEncoder *encoder)
{
    return encoder->outbuf;
}

int opus_stream_encoder_process(OpusStreamEncoder *encoder, int input_size, int is_float)
{
    int res;
    opus_uint32 hres;
    spx_uint32_t input_samples, resampled_samples;

    if (is_float) {
        input_samples = input_size / sizeof(float);
        resampled_samples = BUFFER_SIZE / sizeof(float);

        speex_resampler_process_float(encoder->resampler, 0,
                                      (float *)encoder->inbuf, &input_samples, (float *)encoder->resampbuf,
                                      &resampled_samples);
        assert (resampled_samples == 640);
        res = opus_encode_float(encoder->encoder, (float *)encoder->resampbuf, resampled_samples, (unsigned char *)encoder->outbuf + HEADER_SIZE, BUFFER_SIZE - HEADER_SIZE);
    } else {
        input_samples = input_size / sizeof(spx_int16_t);
        resampled_samples = BUFFER_SIZE / sizeof(spx_int16_t);

        speex_resampler_process_int(encoder->resampler, 0,
                                    (spx_int16_t*)encoder->inbuf, &input_samples, (spx_int16_t*)encoder->resampbuf,
                                    &resampled_samples);
        assert (resampled_samples == 640);
        res = opus_encode(encoder->encoder, (opus_int16 *)encoder->resampbuf, resampled_samples, (unsigned char *)encoder->outbuf + HEADER_SIZE, BUFFER_SIZE - HEADER_SIZE);
    }

    // Add simple header for opus_demo for opus_demo decoder
    hres = htonl(res);
    memcpy(encoder->outbuf, &hres, 4);
    return res + HEADER_SIZE;
}
