#!/bin/sh

rm -f out
bun run compile-static
bun build index.ts --compile --outfile out
rm -f static.json
