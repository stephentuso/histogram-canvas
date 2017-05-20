# histogram-canvas

[![npm](https://img.shields.io/npm/v/histogram-canvas.svg)](https://www.npmjs.com/package/histogram-canvas) [![Build Status](https://travis-ci.org/stephentuso/histogram-canvas.svg?branch=master&style=flat-square)](https://travis-ci.org/stephentuso/histogram-canvas)

![Preview Image](https://raw.githubusercontent.com/stephentuso/histogram-canvas/master/preview.png)

## Install

```
yarn add histogram-canvas
```

or

```
npm i --save histogram-canvas
```

## Usage

Import it:

```javascript
const HistogramCanvas = require('histogram-canvas')
```

or include the standalone file, which is attached on each [release](https://github.com/stephentuso/histogram-canvas/releases) or found in the `dist` folder when downloaded from the npm registry:

```html
<script src="path/to/histogram-canvas.min.js"></script>
```

The constructor takes a `Canvas` and an optional options object:

```javascript
let histogram = new HistogramCanvas(canvas, options)
```

## Methods

`update(data, dontClear)`

 - `data` Object<br>
    Object with properties `red`, `green`, and `blue`, each arrays of numbers, representing the heights of the histogram bars. Arrays can be any length.

 - `dontClear` Boolean (false)<br>
    If true, the canvas will be cleared.

## Options

Can be passed in constructor options object and are available as properties on the instance.

Default values are in parentheses.

 - `red` Boolean (true)<br>
    Whether or not to draw red graph.

 - `green` Boolean (true)<br>
    Whether or not to draw green graph.

 - `blue` Boolean (true)<br>
    Whether or not to draw blue graph.

 - `redColor` String ('#FF0000')<br>
    Color for drawing red data

 - `greenColor` String ('#00FF00)<br>
    Color for drawing green data

 - `blueColor` String ('#0000FF')<br>
    Color for drawing blue data

 - `compositeOperation` String ('screen')<br>
    See [options here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

The following are for drawing the histogram at a specific location in the canvas. By default the histogram will fill the canvas.

 - `x` Number (0)<br>
    X coordinate of left side of histogram

 - `y` Number (canvas.height)<br>
    Y coordinate of bottom of histogram

 - `width` Number (canvas.width)<br>
    Width of histogram

 - `height` Number (canvas.height)<Br>
    Height of histogram

## License

MIT © Stephen Tuso
