<meta charset="utf-8"/>

# `Conway's Game of Life in Rust + WASM`

> An exersise in Rust and WASM implementing [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)


## Pre-requisites
* [Make sure you have Rust (v 1.30 and up) installed](https://www.rust-lang.org/tools/install)
* [Make sure you have wasm-pack installed](https://rustwasm.github.io/wasm-pack/installer/)
* [Make sure you have npm installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* Make sure you have the `wasm32-unknown-unknown` target (run `rustup target list | grep wasm`)

## Setup
* Go to the `www` folder and run `npm i` in order to install all Javascript dependencies
* Go to the game's root folder and run `wasm-pack build`
   > This will install all dependencies needed for compiling the game to wasm (it takes some time)
* Link the wasm module to npm by going into the newly generated folder `pkg` and running `npm link`. Then go to the `www` folder and run `npm link wasm-game-of-life`

## Running the game
* Go to the `www` folder and run `npm start`
