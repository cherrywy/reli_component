export default class Canvas {
  constructor (domId, options) {
    window.fabric.Object.prototype.cornerColor = 'yellow'
    window.fabric.Object.prototype.cornerSize = 8
    window.fabric.Object.prototype.borderColor = 'yellow'
    window.fabric.Object.prototype.transparentCorners = false
    window.fabric.Object.prototype.borderScaleFactor = 0.2
    window.fabric.Object.prototype.borderOpacityWhenMoving = 0.8
    // 修正 fabric 默认 toObject 方法不返回自定义字段的问题
    window.fabric.Object.prototype.toObject = (function (toObject) {
      return function (properties) {
        return window.fabric.util.object.extend(toObject.call(this, properties), {
          data: this.data,
          id: this.id
        })
      }
    })(window.fabric.Object.prototype.toObject)

    let canvas = new window.fabric.Canvas(domId, {
      backgroundColor: 'transparent',
      uniScaleTransform: true,
      selection: false
    })
    if (options.height) canvas.setHeight(options.height)
    if (options.width) canvas.setWidth(options.width)
    if (options.backgroundImage) {
      canvas.setBackgroundImage(options.backgroundImage, canvas.renderAll.bind(canvas), {
        width: canvas.width,
        height: canvas.height
      })
    }
    return canvas
  }
}
