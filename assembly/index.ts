// The entry file of your WebAssembly module.
import { Encoder, Sizer, Writer, Decoder} from "@wapc/as-msgpack"
import { log } from "./env";

const array: i32[] = [1, 2, 3, 45]
const map = new Map<string, Array<i32>>();
map.set("foo", [1, -1, 42]);
map.set("baz", [12412, -98987]);

function encode(writer: Writer): void {
  writer.writeString("ggg");
  writer.writeInt32(199);
  writer.writeArray(array, (writer: Writer, item: i32) => {
    writer.writeInt32(item);
  });
  writer.writeMap(
    map,
    (writer: Writer, key: string): void => {
      writer.writeString(key);
    },
    (writer: Writer, value: Array<i32>) => {
      writer.writeArray(value, (writer: Writer, item: i32) => {
        writer.writeInt32(item);
      });
    }
  );
}

export function test(): ArrayBuffer {
  const sizer = new Sizer();
  encode(sizer);
  const buffer = new ArrayBuffer(sizer.length);
  const encoder = new Encoder(buffer);
  encode(encoder);
  return buffer
}

export function testDecode(ptr: i32, len: i32): void {
  const buf = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    buf[i] = load<u8>(ptr + i)
  }
  const decoder = new Decoder(buf.buffer)
  decoder.readInt32()
  decoder.readInt32()
  decoder.readString()
}
