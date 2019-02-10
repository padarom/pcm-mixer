import { AudioOptions, defaultAudioOptions } from './AudioOptions'
import Mixer from '.';
import { Duplex, Writable, Transform } from 'stream';

export interface InputOptions extends AudioOptions {
    delay?: number,
    volume?: number
}

export default class Input extends Transform {

    protected buffer: Buffer = Buffer.allocUnsafe(0)

    constructor (protected mixer: Mixer, protected options: InputOptions = defaultAudioOptions) {
        super()
    }

    _transform (chunk: Buffer, encoding: any, next: any) {
        this.push(chunk)

        console.log('Writing chunk', chunk)

        next()
    }

}