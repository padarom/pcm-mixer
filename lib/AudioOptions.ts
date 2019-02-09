export interface AudioOptions {
    channels: number,
    bitDepth: number,
    samplingRate: number
}

export const defaultAudioOptions: AudioOptions = {
    channels: 2,
    bitDepth: 16,
    samplingRate: 44100 
}