#!/bin/sh

trap 'kill 0' EXIT
bun --cwd backend dev &  
bun --cwd frontend dev &  
wait