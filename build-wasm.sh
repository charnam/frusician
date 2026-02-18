#!/bin/sh

set -e

TARGET="web";

wasm-pack build all/lib/ArrayMath --target $TARGET

wasm-pack build all/nodegraph/nodes/InstrumentNodes/ChipInstrumentNode --target $TARGET

wasm-pack build all/nodegraph/nodes/MonoEchoNode --target $TARGET
wasm-pack build all/nodegraph/nodes/VibratoNode --target $TARGET

echo "All plugins built.";
