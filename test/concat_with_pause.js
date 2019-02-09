const Mixer = require('../dist').default
const Speaker = require('speaker')
const fs = require('fs')

// Audio files are all in 16-bit signed PCM format
const audioFiles = [
    './audio/one.wav',
    './audio/two.wav',
    './audio/three.wav',
    './audio/four.wav',
    './audio/five.wav',
]

let speaker = new Speaker()
let mixer = new Mixer()
mixer.pipe(speaker)

audioFiles.forEach((file, n) => {
    let stream = fs.createReadStream(file)
    let input = mixer.input({ delay: n * 1000 })

    stream.pipe(input)
})
