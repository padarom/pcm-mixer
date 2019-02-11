# PCM Mixer
Library that allows you to mix live PCM streams by adding a correct amount of silence in between incoming stream data. Useful for when you need to combine audio streams from multiple people that come in at different times and aren't synced.

##### Todo
- [ ] When input data is requested, but not enough data is available yet, the input returns only silent output. This is noticeable as periods of silence in between streams.
- [ ] Support for float PCM streams
- [ ] Verify functionality with different bitdepths
- [ ] End input on stream `end` event

### Installation
```
$ npm install pcm-mixer --save
```

### Usage
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

mixer.start().pipe(speaker)
```

Once a stream that is piped to an input emits an `end` event, that input is automatically removed from the mixer. Keep in mind, that the mixer always has a silent input attached and as such doesn't emit an `end` event itself.

Also have a look at the [test directory](https://github.com/padarom/pcm-mixer/tree/master/test) for some examples.
