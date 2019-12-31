#!/bin/sh

version=$1

# Concat all .js sources
cat \
	src/jsmpeg.js \
	src/video-element.js \
	src/player.js \
	src/buffer.js \
	src/ajax.js \
	src/fetch.js \
	src/ajax-progressive.js \
	src/websocket.js \
	src/ts.js \
	src/decoder.js \
	src/mpeg1.js \
	src/mpeg1-wasm.js \
	src/mp2.js \
	src/mp2-wasm.js \
	src/webgl.js \
	src/canvas2d.js \
	src/webaudio.js \
	src/wasm-module.js \
	> jsmpeg.js

# Append the .wasm module to the .js source as base64 string
echo "JSMpeg.WASM_BINARY_INLINED='$(cat jsmpeg-wasm.base64)';" \
	>> jsmpeg.js

cp jsmpeg.js example/jsmpeg.js

if [ version ]
then
	mkdir -p dist
	cp jsmpeg.js dist/jsmpeg-${version}.js
fi

echo "build completed"
