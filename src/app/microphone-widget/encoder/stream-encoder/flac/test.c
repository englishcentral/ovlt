#include "flac_stream_encoder.h"
#include <stdio.h>

int main()
{
    char *inbuf;
    FILE *fin;
    int nread;

    FlacStreamEncoder *encoder = flac_stream_encoder_create(1024, 48000);
    inbuf = flac_stream_encoder_get_in(encoder);
    fin = fopen("IEEESpectrum_2012.02.02_26Koller1.wav", "rb");
    fseek(fin, 44, SEEK_SET);
    while (!feof(fin)) {
         nread = fread(inbuf, 1, 2048, fin);
         flac_stream_encoder_process(encoder, nread, 0);
         flac_stream_encoder_pull(encoder);
    }
    return 0;
}
