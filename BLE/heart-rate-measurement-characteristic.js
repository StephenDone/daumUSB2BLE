var Bleno = require('bleno')
const config = require('config-yml') // Use config for yaml config files in Node.js projects
var DEBUG = config.DEBUG.BLE

class HeartRateMeasurementCharacteristic extends Bleno.Characteristic {
  constructor () {
    super({
      uuid: '2A37',
      value: null,
      properties: ['notify'],
      descriptors: [
      ]
    })
    this._updateValueCallback = null
  }

  onSubscribe (maxValueSize, updateValueCallback) {
    if (DEBUG) console.log('[heart-rate-measurement-characteristic.js] - client subscribed')
    this._updateValueCallback = updateValueCallback
    return this.RESULT_SUCCESS
  }

  onUnsubscribe () {
    if (DEBUG) console.log('[heart-rate-measurement-characteristic.js] - client unsubscribed')
    this._updateValueCallback = null
    return this.RESULT_UNLIKELY_ERROR
  }

  notify (event) {
    console.log(`Heart Rate Measurement Notify()`)

    if ('hr' in event) {
      var heartRate = event.hr
      if (DEBUG) console.log('[heart-rate-measurement-characteristic.js] - hr: ' + heartRate )

      // flags byte then hrm byte
      var buffer = new Buffer.alloc(2)

      // flags all zero indicates 8-bit heart rate value and nothing else.
      buffer.writeUInt8(0x00, 0)
      
      buffer.writeUInt8(heartRate, 1)

      if (this._updateValueCallback) {
        this._updateValueCallback(buffer)
      }
    } 
    
    return this.RESULT_SUCCESS
  }
}

module.exports = HeartRateMeasurementCharacteristic
