/// <reference path="Emscripten.d.ts" />
/// <reference path="LibVorbisNative.d.ts" />
/// <reference path="NativeOggVorbisVbrEncoder.ts" />
var LibVorbis;
(function (LibVorbis) {
    var OggVorbisVbrEncoder = (function () {
        function OggVorbisVbrEncoder(module, options) {
            this.module = module;
            this.handle = this.module.create(options.channels, options.sampleRate, options.quality);
            this.chunks = [];
            this.onData = options.onData || (function () { });
            this.module.writeHeaders(this.handle);
        }
        /**
         * Instantiates a new native module and returns the encoder once
         * the native module is done loading.
         */
        OggVorbisVbrEncoder.create = function (moduleOptions, encoderOptions, callback) {
            LibVorbisNative.makeRawNativeModule(moduleOptions, function (rawModule) {
                var module = LibVorbis.NativeOggVorbisVbrEncoder.fromRawNativeModule(rawModule);
                var encoder = new OggVorbisVbrEncoder(module, encoderOptions);
                callback(encoder);
            });
        };
        /**
         * Performs a encoding step on the provided PCM channel data.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         * @param samples The number of samples in each buffer.
         */
        OggVorbisVbrEncoder.prototype.encode = function (channelData, samples) {
            this.module.prepareAnalysisBuffers(this.handle, samples);
            for (var ch = 0; ch < channelData.length; ++ch) {
                var data = channelData[ch];
                var bufferPtr = this.module.getAnalysisBuffer(this.handle, ch);
                this.module.rawModule.HEAPF32.set(data, bufferPtr >> 2);
            }
            this.module.encode(this.handle);
            this.flush();
        };
        /**
         * Finalizes the OGG Vorbis stream, producing an OGG Vorbis audio Blob.
         */
        OggVorbisVbrEncoder.prototype.finish = function () {
            this.module.finish(this.handle);
            this.flush();
            this.module.destroy(this.handle);
            this.module = null;
            return new Blob(this.chunks, { type: 'audio/ogg' });
        };
        OggVorbisVbrEncoder.prototype.flush = function () {
            var dataPointer = this.module.getData(this.handle);
            var dataLength = this.module.getDataLength(this.handle);
            if (dataLength === 0)
                return;
            var chunk = this.module.rawModule.HEAPU8.subarray(dataPointer, dataPointer + dataLength);
            var data = new Uint8Array(chunk); // copy
            var buffer = data.buffer;
            this.module.clearData(this.handle);
            this.chunks.push(buffer);
            this.onData(buffer);
        };
        return OggVorbisVbrEncoder;
    })();
    LibVorbis.OggVorbisVbrEncoder = OggVorbisVbrEncoder;
})(LibVorbis || (LibVorbis = {}));
