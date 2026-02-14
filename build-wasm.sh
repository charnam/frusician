#!/bin/sh

set -e

wasm-pack build all/nodegraph/nodes/MonoEchoNode --target web 

echo "All plugins built.";