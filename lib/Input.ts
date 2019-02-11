import { AudioOptions, defaultAudioOptions } from './AudioOptions'
import Mixer from '.'
import { Writable } from 'stream'
import createSilenceGenerator, { SilenceGenerator } from './SilenceGenerator'

export interface InputOptions extends AudioOptions {
    volume: number
}

type hrtime = [number, number]
export type InputInterface = {
    volume : number,
    readSamples (size: number, time: hrtime) : [Buffer, boolean]
}

const NS_PER_SEC = 1e9

export default class Input extends Writable implements InputInterface {

    protected buffer: Buffer = Buffer.allocUnsafe(0)

    protected lastRead: hrtime = [0, 0]

    protected silence: SilenceGenerator

    protected unpiped = false

    public volume: number

    constructor (protected mixer: Mixer, public options: InputOptions) {
        super()

        this.options = { ...defaultAudioOptions, volume: 1, ...options }
        this.volume = this.options.volume
        this.silence = createSilenceGenerator(this.options.bitDepth, this.options.channels, this.options.signed)

        this.on('unpipe', this.onUnpipe.bind(this))
    }

    onUnpipe () {
        this.unpiped = true
    }

    readSamples (size: number, time: hrtime) : [Buffer, boolean] {
        this.lastRead = time

        if (this.buffer.length < size) {
            let drainedBuffer = Buffer.concat([this.buffer, this.silence(size - this.buffer.length)])
            this.buffer = this.buffer.slice(this.buffer.length)
            
            return [drainedBuffer, this.unpiped]
        }

        let buffer = this.buffer.slice(0, size)
        this.buffer = this.buffer.slice(size)

        return [buffer, false]
    }

    _write (chunk: Buffer, encoding: any, next: any) {
        let timeDifference = process.hrtime(this.lastRead)
        let timeDifferenceInNs = timeDifference[0] * NS_PER_SEC + timeDifference[1]

        const { channels, samplingRate } = this.options

        let samplesInChunk = chunk.length / channels
        let samplesRequired = Math.floor(timeDifferenceInNs / NS_PER_SEC * samplingRate)

        if (samplesInChunk < samplesRequired) {
            this.buffer = Buffer.concat([this.buffer, this.silence(samplesRequired - samplesInChunk)])
        }

        this.buffer = Buffer.concat([this.buffer, chunk])

        next()
    }

}