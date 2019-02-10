import { Duplex } from 'stream'
import Input, { InputOptions } from './Input'
import { AudioOptions, defaultAudioOptions } from './AudioOptions'

export default class Mixer extends Duplex {

    constructor (protected options: AudioOptions = defaultAudioOptions) {
        super()
    }

    input (options: InputOptions = defaultAudioOptions) : Input {
        return new Input(this, options)
    }

    _read () {
        return
    }

    _write (chunk: Buffer, encoding: any, next: any) {
        this.push(chunk)
        next()
    }

}
