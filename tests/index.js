const msgpack = require("@msgpack/msgpack")
const myModule = require("..");
const iterations = 1000000

console.log("start encoding in wasm")
const startEncodingWasm = new Date().getTime()
for (let i = 0; i < iterations; i++) {
    myModule.test()
}
console.log((new Date().getTime()) - startEncodingWasm)

const dataSet = [2345199, 123456789, "google"]
const b = msgpack.encode(dataSet)
;(new Uint8Array(myModule.memory.buffer)).set(b.slice(1), 0)
console.log("start decoding in wasm")
const startDecodingWasm = new Date().getTime()
for (let i = 0; i < iterations; i++) {
    myModule.testDecode(0, b.byteLength - 1)
}
console.log((new Date().getTime()) - startDecodingWasm)

const ptr = myModule.test()
const len = new Uint32Array(myModule.memory.buffer.slice(ptr - 4, ptr))[0]
const data = new Uint8Array(myModule.memory.buffer.slice(ptr, ptr + len))

console.log("start encoding in JS")
const startEncodingJs = new Date().getTime()
for (let i = 0; i < iterations; i++) {
    msgpack.encode(dataSet)
}
console.log((new Date().getTime()) - startEncodingJs)

console.log("start decoding in JS")
const startMsgpack = new Date().getTime()
for (let i = 0; i < iterations; i++) {
    msgpack.decodeMulti(data)
}
console.log((new Date().getTime()) - startMsgpack)
