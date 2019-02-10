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
        protected mixingFunction: MixingFunction = mixer
    ) {
        super()

        this.lastReadTime = process.hrtime()
    }

    protected attachSilentInput () {
        let silence = new Silence(this.options)
        silence.pipe(this.input(this.options))
    }

    start () : this {
        this.attachSilentInput()

        return this
    }

    input (options: InputOptions = defaultAudioOptions) : Input {
        let input = new Input(this, options)
        this.inputs.push(input)

        input.on('end', () => {
            let index = this.inputs.indexOf(input)
            this.inputs.splice(index, 1)
        })

        return input
    }

    _read (size: number | undefined) {
        if (!size) {
            let timeSinceLastRead = process.hrtime(this.lastReadTime)
            this.lastReadTime = process.hrtime()

            let nanosecondsSinceLastRead = timeSinceLastRead[0] * NS_PER_SEC + timeSinceLastRead[1]
            let samples = nanosecondsSinceLastRead / NS_PER_SEC * this.options.samplingRate

            size = samples
        }
        
        this.inputs.forEach((input) => {
            let buffer = input.read(size)
            
            this.push(buffer)
        })
    }

}
