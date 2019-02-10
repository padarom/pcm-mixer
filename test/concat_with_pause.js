const Mixer = require('../dist').default
const Speaker = require('speaker')
const fs = require('fs')

// Audio files are all in 16-bit signed PCM format
const audioFiles = [
    './audio/one.pcm',
    './audio/two.pcm',
    './audio/three.pcm',
    './audio/four.pcm',
    './audio/five.pcm',
    './audio/whitenoise.pcm',
]

let speaker = new Speaker()
let mixer = new Mixer()
mixer.start().pipe(speaker)
/*
audioFiles.forEach((file, n) => {
    let stream = fs.createReadStream(file)
    let input = mixer.input({ delay: n * 2000 })

    stream.pipe(input)
})
*/
