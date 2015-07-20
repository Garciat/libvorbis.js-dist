/// <reference path="OggVorbisVbrEncoder.d.ts" />
declare module LibVorbis {
    interface WorkerMessage {
        kind: string;
    }
    interface LoadedMessage extends WorkerMessage {
    }
    interface DataMessage extends WorkerMessage {
        buffer: ArrayBuffer;
    }
    interface FinishedMessage extends WorkerMessage {
    }
    interface WorkerCommand {
        kind: string;
    }
    interface InitCommand extends WorkerCommand {
        moduleUri: string;
        nativeEncoderUri: string;
        encoderUri: string;
        moduleOptions: Emscripten.EmscriptenModuleOptions;
        encoderOptions: OggVorbisVbrEncoderOptions;
    }
    interface EncodeCommand extends WorkerCommand {
        buffers: ArrayBuffer[];
        samples: number;
    }
    interface FinishCommand extends WorkerCommand {
    }
    class OggVorbisVbrEncoderAsyncWorker {
        private channel;
        private encoder;
        constructor(channel: Worker);
        run(): void;
        private handleEncoderLoaded;
        private handleEncoderData;
        private onInitCommand(command);
        private onEncodeCommand(command);
        private onFinishCommand(command);
        private handleChannelMessage;
    }
}
