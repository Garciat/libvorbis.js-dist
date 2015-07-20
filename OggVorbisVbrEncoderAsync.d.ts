/// <reference path="OggVorbisVbrEncoder.d.ts" />
/// <reference path="OggVorbisVbrEncoderAsyncWorker.d.ts" />
declare module LibVorbis {
    interface OggVorbisVbrEncoderAsyncOptions {
        libraryResolver(libraryName: string): string;
        encoderOptions: OggVorbisVbrEncoderOptions;
        moduleOptions: Emscripten.EmscriptenModuleOptions;
    }
    class OggVorbisVbrEncoderAsync {
        private onLoaded;
        private onData;
        private onFinished;
        private worker;
        private chunks;
        constructor(options: OggVorbisVbrEncoderAsyncOptions, onLoaded: (encoder: OggVorbisVbrEncoderAsync) => any, onData?: (buffer: ArrayBuffer, encoder: OggVorbisVbrEncoderAsync) => any, onFinished?: (audio: Blob, encoder: OggVorbisVbrEncoderAsync) => any);
        /**
         * Performs a encoding step on the provided PCM channel data.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         * @param samples The number of samples in each buffer.
         */
        encode(channelData: Float32Array[], samples: number): void;
        /**
         * Finalizes the OGG Vorbis stream, producing an OGG Vorbis audio Blob.
         *
         * @param onFinished A callback for the resulting audio Blob.
         */
        finish(onFinished?: (audio: Blob) => any): void;
        private onWorkerLoaded(message);
        private onWorkerData(message);
        private onWorkerFinished(message);
        private handleWorkerMessage;
    }
}
