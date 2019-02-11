import { InputInterface } from './Input'
import { AudioOptions } from './AudioOptions'
import createSilenceGenerator, { SilenceGenerator } from './SilenceGenerator'

export default class Silence implements InputInterface {

    public volume : number = 1

    protected silenceGenerator: SilenceGenerator

    constructor (protected options: AudioOptions) {
        this.silenceGenerator = createSilenceGenerator(options.bitDepth, options.channels, options.signed)
    }

    readSamples (size: number): Buffer {
        return this.silenceGenerator(size)
    }

}