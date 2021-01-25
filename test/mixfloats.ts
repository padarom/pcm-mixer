import Mixer from "../lib";

const aop = {
  channels: 2,
  bitDepth: 32,
  samplingRate: 44100,
  float: true,
  signed: true,
};
const floatSum = (
  inputs: [Buffer, number][],
  length: number | undefined
): Buffer => {
  if (typeof length === "undefined" && inputs.length) {
    length = inputs[0].length;
  }

  let buffer = Buffer.allocUnsafe(length as number);
  let summingView = new DataView(buffer.buffer);
  const inputViews: DataView[] = inputs.map(
    ([buffer, volume]) => new DataView(buffer.buffer)
  );

  for (let i = 0; i < summingView.byteLength - 4; i += 4) {
    let value = inputs.reduce((previousValue, input, index) => {
      return previousValue + inputViews[index].getFloat32(i, true) * input[1];
    }, 0);

    summingView.setFloat32(i, value, true);
  }

  return buffer;
};
const m = new Mixer(aop, floatSum);
const track1 = m.input({
  volume: 0.5,
  ...aop,
});
const track2 = m.input({
  volume: 0.5,
  ...aop,
});

const fss = require("fs").createWriteStream("output.pcm");
setInterval(() => {
  const d = m.read((44100 * 2 * 4) / 10);
  fss.write(d); //.write(fss);
}, 100);

const dv = new DataView(Buffer.allocUnsafe(2048).buffer);
for (let i = 0; i < 2048; i += 4) {
  dv.setFloat32(i, Math.random(), true);
}

setInterval(() => {
  track1.write(new Uint8Array(dv.buffer));
}, 400);

setInterval(() => {
  track2.write(new Uint8Array(dv.buffer));
}, 300);
m.start();

setTimeout(() => {
  process.exit(0);
}, 2000);
