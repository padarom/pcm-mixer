# PCM Mixer
Library that allows you to mix live PCM streams by adding a correct amount of silence in between incoming stream data. Useful for when you need to combine audio streams from multiple people that come in at different times and aren't synced.

#### Todo
- [ ] When input data is requested, but not enough data is available yet, the input returns only silent output. This is noticeable as periods of silence in between streams.
- [ ] Add support for float PCM streams
- [ ] Verify functionality with different bitdepths and channel count
- [ ] Verify timing

## Installation
```
$ npm install pcm-mixer --save
```

## Usage
```js
const Mixer = require('pcm-mixer').default
const Speaker = require('speaker') // If you want to output to your speaker

let mixer = new Mixer({
    bitDepth: 32
})

let firstInput = mixer.input({ volume: 0.2 })
let secondInput = mixer.input() // Default volume is 1.0

somehowRetreiveStream().pipe(firstInput)
somehowRetreiveAnotherStream().pipe(secondInput)

let speaker = new Speaker({ bitDepth: 32 })
mixer.start().pipe(speaker)
```

Once a stream that is piped to an input emits an `unpipe` event, that input is automatically removed from the mixer. Keep in mind that the mixer always has a silent input attached and as such doesn't emit an `end` event itself.

Also have a look at the [test directory](https://github.com/padarom/pcm-mixer/tree/master/test) for some examples.

### Mixer options
The Mixer constructor optionally accepts two parameters: `audioOptions` and `mixingFunction`.

#### audioOptions
| Option | Description | Default |
| ------ | ----------- | ------- |
| channels | The number of channels in the output | `2` |
| bitDepth | The bit depth of the audio stream | `16` |
| samplingRate | The sampling rate to be used for timing purposes | `44100` (44.1 kHz) |
| float | Determines if the output should be a float PCM stream | `false` |
| signed | Determines if the output should be a signed PCM stream | `true` |

These audio options are also used as default values for inputs, although you can override these for each input individually.

Currently it is not supported to have inputs with different options than the mixer, as there is not yet a normalization of the input values (e.g. conversion of 32-bit samples to 16-bit samples).

#### mixingFunction
A function that takes in an array with entries of type `[Buffer, number]` for each currently attached input as its first parameter. The number corresponds to the volume of the input.

An example mixing function could look like this:
```js
function mixingFunction (inputs, length) {
    let buffer = Buffer.allocUnsafe(length)
    for (let i = 0; i < length; i++) {
        let value = inputs.reduce((previousValue, input) => {
            return previousValue + (input[0][i] * input[1])
        }, 0)

        buffer[i] = Math.min(Math.max(value, -32768), 32767)
    }

    return buffer
}
```
