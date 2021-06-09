const fs = require("fs");
const loader = require("@assemblyscript/loader/umd");
const imports = { env: {
    log: (v) => console.log("WASM: " + v),
  }
};
const wasmModule = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);
module.exports = wasmModule.exports;
