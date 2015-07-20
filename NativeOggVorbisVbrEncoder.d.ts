declare module LibVorbis {
    type VbrEncoderStateHandle = number;
    interface NativeOggVorbisVbrEncoder {
        rawModule: Emscripten.EmscriptenModule;
        /**
         * Creates a new VBR Encoder state object.
         *
         * @param channels The number of channels to encode.
         * @param sampleRate The sample rate for this encoding session.
         * @param quality A value between -0.1 and 1.0.
         */
        create(channels: number, sampleRate: number, quality: number): VbrEncoderStateHandle;
        /**
         * Writes initial OGG Vorbis headers, including metadata.
         *
         * This MUST be called before analysis begins.
         *
         * This call MAY fill an OGG frame; remember to flush the data buffer.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        writeHeaders(handle: VbrEncoderStateHandle): void;
        /**
         * A request to the Vorbis encoder to reserve enough space for analysis.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         * @param samples The number of samples for this analysis step.
         */
        prepareAnalysisBuffers(handle: VbrEncoderStateHandle, samples: number): void;
        /**
         * Returns a native pointer to a buffer corresponding to the specified
         * channel to which PCM data must be written for analysis.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         * @param channel The channel (0-indexed).
         */
        getAnalysisBuffer(handle: VbrEncoderStateHandle, channel: number): Emscripten.RawPointer;
        /**
         * Performs analysis and encoding on the analysis buffers.
         *
         * This call MAY fill an OGG frame; remember to flush the data buffer.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        encode(handle: VbrEncoderStateHandle): void;
        /**
         * Returns a native pointer to the output data buffer.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        getData(handle: VbrEncoderStateHandle): Emscripten.RawPointer;
        /**
         * Returns the amount of data in the buffer.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        getDataLength(handle: VbrEncoderStateHandle): number;
        /**
         * Resets the buffer so it can be reused by the encoder.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        clearData(handle: VbrEncoderStateHandle): void;
        /**
         * Performs finalizing of the OGG Vorbis stream.
         *
         * This call MAY fill an OGG frame; remember to flush the data buffer.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        finish(handle: VbrEncoderStateHandle): void;
        /**
         * Frees the VBR Encoder state object.
         *
         * @param handle A pointer to a native Vorbis VBR Encoder state object.
         */
        destroy(handle: VbrEncoderStateHandle): void;
    }
    module NativeOggVorbisVbrEncoder {
        function fromRawNativeModule(module: Emscripten.EmscriptenModule): NativeOggVorbisVbrEncoder;
    }
}
