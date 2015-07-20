/// <reference path="OggVorbisVbrEncoder.ts" />
var LibVorbis;
(function (LibVorbis) {
    var OggVorbisVbrEncoderAsyncWorker = (function () {
        function OggVorbisVbrEncoderAsyncWorker(channel) {
            var _this = this;
            this.channel = channel;
            this.handleEncoderLoaded = function (encoder) {
                _this.encoder = encoder;
                var message = {
                    kind: 'loaded'
                };
                _this.channel.postMessage(message);
            };
            this.handleEncoderData = function (buffer) {
                var message = {
                    kind: 'data',
                    buffer: buffer
                };
                _this.channel.postMessage(message, [buffer]);
            };
            this.handleChannelMessage = function (ev) {
                var command = ev.data;
                switch (command.kind) {
                    case 'init':
                        _this.onInitCommand(command);
                        break;
                    case 'encode':
                        _this.onEncodeCommand(command);
                        break;
                    case 'finish':
                        _this.onFinishCommand(command);
                        break;
                }
            };
        }
        OggVorbisVbrEncoderAsyncWorker.prototype.run = function () {
            this.channel.addEventListener('message', this.handleChannelMessage);
        };
        OggVorbisVbrEncoderAsyncWorker.prototype.onInitCommand = function (command) {
            importScripts(command.moduleUri, command.nativeEncoderUri, command.encoderUri);
            command.encoderOptions.onData = this.handleEncoderData;
            LibVorbis.OggVorbisVbrEncoder.create(command.moduleOptions, command.encoderOptions, this.handleEncoderLoaded);
        };
        OggVorbisVbrEncoderAsyncWorker.prototype.onEncodeCommand = function (command) {
            var channelData = command.buffers.map(function (b) { return new Float32Array(b); });
            this.encoder.encode(channelData, command.samples);
        };
        OggVorbisVbrEncoderAsyncWorker.prototype.onFinishCommand = function (command) {
            this.encoder.finish();
            var message = {
                kind: 'finished'
            };
            this.channel.postMessage(message);
        };
        return OggVorbisVbrEncoderAsyncWorker;
    })();
    LibVorbis.OggVorbisVbrEncoderAsyncWorker = OggVorbisVbrEncoderAsyncWorker;
})(LibVorbis || (LibVorbis = {}));
new LibVorbis.OggVorbisVbrEncoderAsyncWorker(self).run();
