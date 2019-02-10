/**
 * 
 */
export type MixingFunction = (inputs: Buffer[]) => Buffer

export default function mixingFunction (inputs: Buffer[]) : Buffer {
    return inputs[0]
}