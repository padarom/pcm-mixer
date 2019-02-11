import { Readable } from 'stream'
import Input, { InputInterface, InputOptions } from './Input'
import { AudioOptions, defaultAudioOptions } from './AudioOptions'
import mixer, { MixingFunction } from './mixingFunction'
import SilentInput from './SilentInput'

const NS_PER_SEC = 1e9

export default class Mixer extends Readable {

    protected inputs: InputInterface[] = []

    protected lastReadTime: [number, number]

    protected mixingFunction: MixingFunction

    constructor (
        protected options: AudioOptions,
        mixingFunction: MixingFunction | undefined
    ) {
        super()

        this.lastReadTime = process.hrtime()
        this.options = { ...defaultAudioOptions, ...options }

        this.mixingFunction = typeof mixingFunction === 'undefined' ? mixer(this.options) : mixingFunction
    }

    start () : this {
        this.inputs.push(new SilentInput(this.options))

        return this
    }

    input (options: InputOptions) : Input {
        let input = new Input(this, { ...this.options, ...options })
        this.inputs.push(input)

        return input
    }

    _read (size: number | undefined = undefined) {
        if (typeof size === 'undefined') {
            let timeSinceLastRead = process.hrtime(this.lastReadTime)
            this.lastReadTime = process.hrtime()

            let nanosecondsSinceLastRead = timeSinceLastRead[0] * NS_PER_SEC + timeSinceLastRead[1]
            let samples = nanosecondsSinceLastRead / NS_PER_SEC * this.options.samplingRate

            size = Math.floor(samples)
        }

        let buffers = this.inputs.map(input => {
            let [buffer, ended] = input.readSamples(size as number, this.lastReadTime)
            
            if (ended) {
                this.inputs.splice(this.inputs.indexOf(input), 1)
            }

            return [buffer, input.volume]
        }) as [Buffer, number][]
        
        let mixedBuffer = this.mixingFunction(buffers, size)
        this.push(mixedBuffer)
    }

}
