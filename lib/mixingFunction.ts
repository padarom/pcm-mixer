import { AudioOptions } from './AudioOptions'

export type MixingFunction = (inputs: [Buffer, number][], length: number | undefined) => Buffer

export default function createMixingFunction (options: AudioOptions) : MixingFunction {
    let positiveBits = options.bitDepth - (options.signed ? 1 : 0)
    let max = (1 << positiveBits) - 1
    let min = options.signed ? -max - 1 : 0    

    return (inputs: [Buffer, number][], length: number | undefined) : Buffer => {
        if (typeof length === 'undefined' && inputs.length) {
            length = inputs[0].length
        }
        
        let buffer = Buffer.allocUnsafe(length as number)
        for (let i = 0; i < (length as number); i++) {
            let value = inputs.reduce((previousValue, input) => {
                return previousValue + (input[0][i] * input[1])
            }, 0)
    
            buffer[i] = Math.min(Math.max(value, min), max)
        }
    
        return buffer
    }
}
