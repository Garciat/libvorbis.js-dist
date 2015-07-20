// <reference path="Emscripten.d.ts" />
var LibVorbis;
(function (LibVorbis) {
    var NativeOggVorbisVbrEncoder;
    (function (NativeOggVorbisVbrEncoder) {
        function fromRawNativeModule(module) {
            return {
                rawModule: module,
                create: module.cwrap('encoder_create_vbr', 'number', ['number', 'number', 'number']),
                writeHeaders: module.cwrap('encoder_write_headers', null, ['number']),
                prepareAnalysisBuffers: module.cwrap('encoder_prepare_analysis_buffers', null, ['number', 'number']),
                getAnalysisBuffer: module.cwrap('encoder_get_analysis_buffer', 'number', ['number', 'number']),
                encode: module.cwrap('encoder_encode', null, ['number']),
                getData: module.cwrap('encoder_get_data', 'number', ['number']),
                getDataLength: module.cwrap('encoder_get_data_len', 'number', ['number']),
                clearData: module.cwrap('encoder_clear_data', null, ['number']),
                finish: module.cwrap('encoder_finish', null, ['number']),
                destroy: module.cwrap('encoder_destroy', null, ['number'])
            };
        }
        NativeOggVorbisVbrEncoder.fromRawNativeModule = fromRawNativeModule;
    })(NativeOggVorbisVbrEncoder = LibVorbis.NativeOggVorbisVbrEncoder || (LibVorbis.NativeOggVorbisVbrEncoder = {}));
})(LibVorbis || (LibVorbis = {}));
