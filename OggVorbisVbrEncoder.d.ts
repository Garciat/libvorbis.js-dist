/// <reference path="../../src/Emscripten.d.ts" />
/// <reference path="../../src/LibVorbisNative.d.ts" />
/// <reference path="NativeOggVorbisVbrEncoder.d.ts" />
declare module LibVorbis {
    interface OggVorbisVbrEncoderOptions {
        channels: number;
        sampleRate: number;
        quality: number;
        onData?: (buffer: ArrayBuffer) => any;
    }
    class OggVorbisVbrEncoder {
        private module;
        private handle;
        private chunks;
        private onData;
        constructor(module: NativeOggVorbisVbrEncoder, options: OggVorbisVbrEncoderOptions);
        /**
         * Instantiates a new native module and returns the encoder once
         * the native module is done loading.
         */
        static create(moduleOptions: Emscripten.EmscriptenModuleOptions, encoderOptions: OggVorbisVbrEncoderOptions, callback: (encoder: OggVorbisVbrEncoder) => any): void;
        /**
         * Performs a encoding step on the provided PCM channel data.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         * @param samples The number of samples in each buffer.
         */
        encode(channelData: Float32Array[], samples: number): void;
        /**
         * Finalizes the OGG Vorbis stream, producing an OGG Vorbis audio Blob.
         */
        finish(): Blob;
        private flush();
    }
}
