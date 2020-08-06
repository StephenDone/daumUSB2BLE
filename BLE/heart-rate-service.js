const Bleno = require('bleno')
const HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic')
const StaticReadCharacteristic = require('./static-read-characteristic')

class HeartRateService extends Bleno.PrimaryService {
  constructor () {
    let heartRateMeasurement = new HeartRateMeasurementCharacteristic()
    super({
      uuid: '180D',
      characteristics: [
        heartRateMeasurement,
        new StaticReadCharacteristic('2A38', 'Body Sensor Location', [0x01])
      ]
    })

    this.heartRateMeasurement = heartRateMeasurement
  }

  notify (event) {
    console.log(`Heart Rate Service Notify()`)
    
    this.heartRateMeasurement.notify(event)
    return this.RESULT_SUCCESS
  }
}

module.exports = HeartRateService
