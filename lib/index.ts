import { Readable } from 'stream'
import Input, { InputOptions } from './Input'
import { AudioOptions, defaultAudioOptions } from './AudioOptions'
import mixer, { MixingFunction } from './mixingFunction'
import Silence from './Silence'

const NS_PER_SEC = 1e9

export default class Mixer extends Readable {

    protected inputs: Input[] = []

    protected lastReadTime: [number, number]

    constructor (
        protected options: AudioOptions = defaultAudioOptions,
        protected mixingFunction: MixingFunction = mixer(options)
    ) {
        super()

        this.lastReadTime = process.hrtime()
    }

    input (options: InputOptions) : Input {
        let input = new Input(this, { ...this.options, ...options })
        this.inputs.push(input)

        input.on('end', () => {
            let index = this.inputs.indexOf(input)
            this.inputs.splice(index, 1)
        })

        return input
    }

    _read (size: number | undefined) {
        if (typeof size === 'undefined') {
            let timeSinceLastRead = process.hrtime(this.lastReadTime)
            this.lastReadTime = process.hrtime()

            let nanosecondsSinceLastRead = timeSinceLastRead[0] * NS_PER_SEC + timeSinceLastRead[1]
            let samples = nanosecondsSinceLastRead / NS_PER_SEC * this.options.samplingRate

            size = samples
        }
        
        let buffers = this.inputs.map(input => [input.readSamples(size as number, this.lastReadTime), input.options.volume]) as [Buffer, number][]
        
        let mixedBuffer = this.mixingFunction(buffers, size)
        this.push(mixedBuffer)
    }

}
