/// <reference path="OggVorbisVbrEncoder.ts" />
/// <reference path="OggVorbisVbrEncoderAsyncWorker.ts" />
var LibVorbis;
(function (LibVorbis) {
    var OggVorbisVbrEncoderAsync = (function () {
        function OggVorbisVbrEncoderAsync(options, onLoaded, onData, onFinished) {
            var _this = this;
            this.onLoaded = onLoaded;
            this.onData = onData;
            this.onFinished = onFinished;
            this.handleWorkerMessage = function (event) {
                var message = event.data;
                switch (message.kind) {
                    case 'loaded':
                        _this.onWorkerLoaded(message);
                        break;
                    case 'data':
                        _this.onWorkerData(message);
                        break;
                    case 'finished':
                        _this.onWorkerFinished(message);
                        break;
                }
            };
            this.worker = new Worker(options.libraryResolver('OggVorbisVbrEncoderAsyncWorker'));
            this.chunks = [];
            this.onData = onData || (function () { });
            this.onFinished = onFinished || (function () { });
            this.worker.addEventListener('message', this.handleWorkerMessage);
            var command = {
                kind: 'init',
                moduleUri: options.libraryResolver('LibVorbisNative'),
                nativeEncoderUri: options.libraryResolver('NativeOggVorbisVbrEncoder'),
                encoderUri: options.libraryResolver('OggVorbisVbrEncoder'),
                encoderOptions: options.encoderOptions,
                moduleOptions: options.moduleOptions
            };
            this.worker.postMessage(command);
        }
        /**
         * Performs a encoding step on the provided PCM channel data.
         *
         * @param channelData An array of PCM data buffers (one for each channel).
         * @param samples The number of samples in each buffer.
         */
        OggVorbisVbrEncoderAsync.prototype.encode = function (channelData, samples) {
            var buffers = channelData.map(function (b) { return b.buffer; });
            var command = {
                kind: 'encode',
                buffers: buffers,
                samples: samples
            };
            this.worker.postMessage(command, buffers);
        };
        /**
         * Finalizes the OGG Vorbis stream, producing an OGG Vorbis audio Blob.
         *
         * @param onFinished A callback for the resulting audio Blob.
         */
        OggVorbisVbrEncoderAsync.prototype.finish = function (onFinished) {
            if (onFinished)
                this.onFinished = onFinished;
            var command = {
                kind: 'finish'
            };
            this.worker.postMessage(command);
        };
        OggVorbisVbrEncoderAsync.prototype.onWorkerLoaded = function (message) {
            this.onLoaded(this);
        };
        OggVorbisVbrEncoderAsync.prototype.onWorkerData = function (message) {
            var dataMessage = message;
            this.chunks.push(dataMessage.buffer);
            this.onData(dataMessage.buffer, this);
        };
        OggVorbisVbrEncoderAsync.prototype.onWorkerFinished = function (message) {
            this.worker.terminate();
            this.worker = null;
            var audio = new Blob(this.chunks, { type: 'audio/ogg' });
            this.onFinished(audio, this);
        };
        return OggVorbisVbrEncoderAsync;
    })();
    LibVorbis.OggVorbisVbrEncoderAsync = OggVorbisVbrEncoderAsync;
})(LibVorbis || (LibVorbis = {}));
