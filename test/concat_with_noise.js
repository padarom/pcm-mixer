const Mixer = require('../dist').default
const Speaker = require('speaker')
const fs = require('fs')

// Audio files are all in 16-bit signed PCM format
const audioFiles = [
    './audio/whitenoise.pcm',
    './audio/one.pcm',
]

let speaker = new Speaker()
let mixer = new Mixer()
mixer.start().pipe(speaker)

audioFiles.forEach((file, n) => {
    let stream = fs.createReadStream(file)
    let input = mixer.input({ volume: n == 0 ? 0.1 : 3})

    stream.pipe(input)
})
