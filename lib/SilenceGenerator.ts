export type SilenceGenerator = (size: number) => Buffer

export default function createSilenceGenerator (bitDepth: number, channels: number, signed: boolean) : SilenceGenerator {
    return (size: number) : Buffer => {
        let silentBuffer = Buffer.allocUnsafe(size * channels)
        let silence = signed ? 0 : (Math.pow(2, bitDepth) / 2)
    
        silentBuffer.fill(silence)
        return silentBuffer
    }
} 