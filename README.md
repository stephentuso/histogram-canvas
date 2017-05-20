# histogram-canvas

[![npm](https://img.shields.io/npm/v/histogram-canvas.svg?style=flat-square)](https://www.npmjs.com/package/histogram-canvas)

![Preview Image](https://raw.githubusercontent.com/stephentuso/histogram-canvas/master/preview.png)

# Install

```
yarn add histogram-canvas
```

or

```
npm i --save histogram-canvas
```

# Usage

Import it:

```javascript
const HistogramCanvas = require('histogram-canvas')
```

The constructor takes a `Canvas` and an options object:

```javascript
let histogram = new HistogramCanvas(canvas, options)
```

# Methods

`update(data, dontClear)`

`data`: object with properties `red`, `green`, and `blue`, each arrays of numbers, representing the heights of the histogram bars. Can be any length.

`dontClear`: If true, the canvas will be cleared. Default: false

## Options

Can be passed in constructor options object and are available as properties on the instance.

Default value in parentheses:

`red: Boolean (true)` Whether or not to draw red graph.

`green: Boolean (true)` Whether or not to draw green graph.

`blue: Boolean (true)` Whether or not to draw blue graph.

`redColor: String ('#FF0000')` Color for drawing red data

`greenColor: String ('#00FF00)` Color for drawing green data

`blueColor: String ('#0000FF')` Color for drawing blue data

`compositeOperation: String ('screen')` See [options here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)

The following are for drawing the histogram at a specific location in the canvas. By default the histogram will fill the canvas.

`x: Number (0)`: X coordinate of left side of histogram

`y: Number (canvas.height)`: Y coordinate of bottom of histogram

`width: Number (canvas.width)`: Width of histogram

`height: Number (canvas.height)`: Height of histogram
