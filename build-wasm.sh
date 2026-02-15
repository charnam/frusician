#!/bin/sh

set -e

wasm-pack build all/nodegraph/nodes/MonoEchoNode --target web
wasm-pack build all/nodegraph/nodes/VibratoNode --target web

echo "All plugins built.";
