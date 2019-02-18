// Type definitions for pcm-util 3.0
// Project: https://github.com/audiojs/pcm-util
// Definitions by: Christopher Mühl <https://github.com/padarom>

declare module 'pcm-util' {
    interface PCMFormat {
        channels: number,
        sampleRate: number,
        interleaved: boolean,
        float: boolean,
        signed: boolean,
        bitDepth: number,
        byteOrder: string,
        max: number,
        min: number,
        samplesPerFrame: number,
        id: string
    }

    interface NormalizedPCMFormat extends PCMFormat {}

    const defaults: PCMFormat;
    function normalize(format: PCMFormat): NormalizedPCMFormat;
    function format(obj: string | ArrayBuffer | AudioBuffer): PCMFormat;
    function equal(a: PCMFormat, b: PCMFormat): boolean;
    function toAudioBuffer(buffer: any, format: PCMFormat): AudioBuffer;
    function toArrayBuffer(buffer: any, format: PCMFormat): ArrayBuffer;
    function convert(buffer: any, from: PCMFormat, to: PCMFormat): ArrayBuffer;
}

// Type definitions for audio-buffer-utils 5.1.1
// Project: https://github.com/audiojs/audio-buffer-utils
// Definitions by: Christopher Mühl <https://github.com/padarom>

declare module 'audio-buffer-utils' {
    import { PCMFormat } from 'pcm-util';

    type FromFormat = null 
        | number 
        | AudioBuffer 
        | object 
        | number[] 
        | Float32Array 
        | Float64Array 
        | Int8Array 
        | Uint8Array 
        | ArrayBuffer 
        | Buffer 
        | string;

    type ValueGenerator = (value: number, i: number, channel: number) => number;
    type MixFunction = (valA: number, valB: number, i: number, channel: number) => number;

    function create(data: FromFormat | FromFormat[], options: PCMFormat | number, sampleRate: number) : AudioBuffer;
    function shallow(buffer: AudioBuffer) : AudioBuffer;
    function clone(buffer: AudioBuffer) : AudioBuffer;
    function copy(fromBuffer: AudioBuffer, toBuffer: AudioBuffer, offset: number) : AudioBuffer;
    function slice(buffer: AudioBuffer, start: number, end: number) : AudioBuffer;
    function subbuffer(buffer: AudioBuffer, start: number, end: number, channels: number) : AudioBuffer;
    function concat(...buffers: AudioBuffer[]) : AudioBuffer;
    function repeat(buffer: AudioBuffer, times: number) : AudioBuffer;
    function reverse(buffer: AudioBuffer, target: AudioBuffer | undefined, start: number | undefined, end: number | undefined) : AudioBuffer;
    function invert(buffer: AudioBuffer, target: AudioBuffer | undefined, start: number | undefined, end: number | undefined) : AudioBuffer;
    function zero(buffer: AudioBuffer) : AudioBuffer;
    function noise(buffer: AudioBuffer) : AudioBuffer;
    function equal(...buffers: AudioBuffer[]) : boolean;
    function fill(buffer: AudioBuffer, target: AudioBuffer | undefined, value: number | ValueGenerator | undefined, start: number | undefined, end: number | undefined) : AudioBuffer;
    function pad(buffer: AudioBuffer | number, length: AudioBuffer | number, value: number) : AudioBuffer;
    function padLeft(buffer: AudioBuffer, length: number, value: number) : AudioBuffer;
    function padRight(buffer: AudioBuffer, length: number, value: number) : AudioBuffer;
    function shift(buffer: AudioBuffer, offset: number) : AudioBuffer;
    function rotate(buffer: AudioBuffer, offset: number) : AudioBuffer;
    function normalize(buffer: AudioBuffer, target: AudioBuffer | undefined, start: number, end: number) : AudioBuffer;
    function removeStatic(buffer: AudioBuffer, target: AudioBuffer | undefined, start: number, end: number) : AudioBuffer;
    function trim(buffer: AudioBuffer, threshold: number | undefined) : AudioBuffer;
    function trimLeft(buffer: AudioBuffer, threshold: number | undefined) : AudioBuffer;
    function trimRight(buffer: AudioBuffer, threshold: number | undefined) : AudioBuffer;
    function mix(bufferA: AudioBuffer, bufferB: AudioBuffer, ratio: number | MixFunction | undefined, offset: number | undefined) : AudioBuffer;
    function size(buffer: AudioBuffer) : number;
    function data(buffer: AudioBuffer, data: Float32Array[]) : Float32Array[];
}
