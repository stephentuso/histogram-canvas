const defaultOptions = {
  x: null,
  y: null,
  width: null,
  height: null,
  red: true,
  green: true,
  blue: true,
  compositeOperation: 'screen'
}

export default class HistogramCanvas {
  /**
   * Create new HistogramCanvas
   *
   * @param canvas The canvas to draw the histogram on
   * @param options {object} Options to initialize
   */
  constructor (canvas, options) {
    this._canvas = canvas
    this._ctx = canvas.getContext('2d')
    this._data = null

    for (let key in defaultOptions) {
      if (!defaultOptions.hasOwnProperty(key)) continue
      this[key] = (options && options[key]) || defaultOptions[key]
    }
  }

  /**
   * Redraw the histogram
   *
   * @param data {object} Histogram data with red, green, and blue properties,
   *             each arrays of 256 integers
   * @param dontClear {boolean} If true, the canvas won't be cleared
   */
  update (data, dontClear) {
    if (data) {
      this._data = data
    }

    if (!this._data) {
      throw new Error('Histogram data is null')
    }

    if ((this.red && !this._data.red) ||
      (this.green && !this._data.green) ||
      (this.blue && !this._data.blue)) {
      throw new Error('Histogram data missing red, green, or blue component')
    }

    this._ctx.globalCompositeOperation = this.compositeOperation
    if (!dontClear) {
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }
    let max = Math.max.apply(null, data.red.concat(data.green, data.blue))

    if (this.red) {
      this._drawColorGraph(max, data.red, '#FF0000')
    }
    if (this.green) {
      this._drawColorGraph(max, data.green, '#00FF00')
    }
    if (this.blue) {
      this._drawColorGraph(max, data.blue, '#0000FF')
    }
  }

  _drawColorGraph (max, vals, color) {
    const graphHeight = this.height || this._canvas.height
    const graphWidth = this.width || this._canvas.width
    const graphX = this.x || 0
    const graphY = this.y || this._canvas.height

    let ctx = this._ctx
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(graphX, graphHeight)
    vals.forEach((val, i) => {
      let drawHeight = Math.round((val / max) * graphHeight)
      let drawX = graphX + (graphWidth / 256) * i
      ctx.lineTo(drawX, graphY - drawHeight)
      // ctx.fillRect(drawX, graphY, 0.5, percent * graphHeight)
    })
    ctx.lineTo(graphX + graphWidth, graphY)
    ctx.closePath()
    ctx.fill()
  }
}
