import { Readable } from "stream";
import { AudioOptions } from "./AudioOptions";

export default class Silence extends Readable {

    constructor (protected options: AudioOptions) {
        super()
    }

    _read (size: number) {
        let buffer = Buffer.allocUnsafe(size)

        let silence = this.options.signed ? 0 : (Math.pow(2, this.options.bitDepth) / 2)
        buffer.fill(silence)

        this.push(buffer)
    }
}