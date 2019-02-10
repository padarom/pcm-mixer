export interface AudioOptions {
    channels: number,
    bitDepth: number,
    samplingRate: number,
    float: boolean,
    signed: boolean,
}

export const defaultAudioOptions: AudioOptions = {
    channels: 2,
    bitDepth: 16,
    samplingRate: 44100,
    float: false,
    signed: true,
}