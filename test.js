import test from 'ava'
import Canvas from 'canvas'
import HistogramCanvas from './lib/main'
import fs from 'fs'
import path from 'path'

const LENGTH = 2
const CANV_WIDTH = 60
const CANV_HEIGHT = 30

const blank = {
  red: makeArr(LENGTH),
  green: makeArr(LENGTH),
  blue: makeArr(LENGTH)
}

const filled = fillColors({}, ['red', 'green', 'blue'])

let testIndex = 0

function copyObj (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function copyArrVals (arr) {
  let copy = []
  for (let i = 0; i < arr.length; i++) {
    copy[i] = arr[i]
  }
  return copy
}

function makeArr (length, value) {
  value = value || 0
  let arr = []
  for (let i = 0; i < length; i++) {
    arr[i] = value
  }
  return arr
}

function fillColors (data, colors, length, value) {
  length = length || LENGTH
  value = value || 1
  let obj = copyObj(data)
  colors.forEach((color) => {
    obj[color] = makeArr(length, value)
  })
  return obj
}

function outputCanvasImage (stream, filename) {
  let dir = path.join(__dirname, 'tmp')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  let out = fs.createWriteStream(path.join(dir, filename))
  stream.on('data', chunk => {
    out.write(chunk)
  })
  stream.on('end', console.log)
}

/**
 *
 * @param t ava test
 * @param {CanvasPixelArray | Array} imageData  canvas pixel data
 * @param {string} onChannels Channels required to match onVal (e.g. 'rgb')
 * @param {string} [offChannels] Channels required to match offVal
 * @param {number} [onVal] default 255
 * @param {number} [offVal] default 0
 */
function testChannels (t, imageData, onChannels, offChannels, onVal, offVal) {
  onVal = onVal || 255
  offVal = offVal || 0
  let channels = {
    r: null,
    g: null,
    b: null,
    a: null
  }
  for (let channel in channels) {
    if (!channels.hasOwnProperty(channel)) continue
    let regex = new RegExp(channel)
    if (onChannels.match(regex)) {
      channels[channel] = 1
    } else if (offChannels.match(regex)) {
      channels[channel] = 0
    }
  }
  for (let i = 0; i < imageData.length; i += 4) {
    for (let channel in channels) {
      if (!channels.hasOwnProperty(channel)) continue
      let offset = 'rgba'.indexOf(channel)
      if (channels[channel] === 1) {
        t.true(imageData[i + offset] === onVal)
      } else if (channels[channel] === 0) {
        t.true(imageData[i + offset] === offVal)
      }
    }
  }
}

function getFullImageDataArray (canvas) {
  return canvas.getContext('2d').getImageData(0, 0, CANV_WIDTH, CANV_HEIGHT).data
}

test.beforeEach(t => {
  t.context.canvas = new Canvas(CANV_WIDTH, CANV_HEIGHT)
  t.context.histogram = new HistogramCanvas(t.context.canvas)
  t.context.index = testIndex += 1
})

test.afterEach.always(t => {
  let index = t.context.index
  outputCanvasImage(t.context.canvas.pngStream(), `test${index}.png`)
})

test('red only values', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  let red = fillColors(blank, ['red'])
  histogram.update(red)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ra', 'gb')
})

test('green only values', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  let green = fillColors(blank, ['green'])
  histogram.update(green)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ga', 'rb')
})

test('blue only values', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  let blue = fillColors(blank, ['blue'])
  histogram.update(blue)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ba', 'rg')
})

test('all values', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  histogram.update(filled)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'rgba')
})

test('only display red option on', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  histogram.green = false
  histogram.blue = false
  histogram.update(filled)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ra', 'gb')
})

test('only display green option on', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  histogram.red = false
  histogram.blue = false
  histogram.update(filled)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ga', 'rb')
})

test('only display blue option on', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  histogram.red = false
  histogram.green = false
  histogram.update(filled)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, 'ba', 'rg')
})

test('all display values off', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  histogram.red = false
  histogram.green = false
  histogram.blue = false
  histogram.update(filled)
  let data = getFullImageDataArray(canvas)
  testChannels(t, data, '', 'rgba')
})

test('half red, half green', t => {
  let canvas = t.context.canvas
  let histogram = t.context.histogram
  let vals = {
    red: [1, 1, 1, 0, 0],
    green: [0, 0, 1, 1, 1],
    blue: [0, 0, 0, 0, 0]
  }
  histogram.update(vals)
  let data = copyArrVals(getFullImageDataArray(canvas))
  // get first row and split it up
  data.splice(data.length / CANV_HEIGHT)
  let rightHalf = data.splice(data.length / 2)
  let leftHalf = data
  // Ignore pixels close to midpoint, might be blended
  let ignored = 2
  rightHalf = rightHalf.splice(ignored * 4)
  leftHalf.splice(leftHalf.length - (ignored * 4))
  testChannels(t, leftHalf, 'ra', 'gb')
  testChannels(t, rightHalf, 'ga', 'rb')
})
