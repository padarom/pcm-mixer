import { AudioOptions, defaultAudioOptions } from './AudioOptions'
import Mixer from '.';
import { Duplex } from 'stream';

export interface InputOptions extends AudioOptions {
    delay?: number,
    volume?: number
}

export default class Input extends Duplex {

    constructor (protected mixer: Mixer, protected options: InputOptions = defaultAudioOptions) {
        super()

        this.pipe(mixer)
    }

    _read () {
        return
    }

    _write () {
        return
    }

}