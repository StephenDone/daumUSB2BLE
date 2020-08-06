#!/usr/bin/env node

const EventEmitter = require('events');
'use strict';

const bleno = require('bleno')

var DEBUG = true // turn this on for debug information in console

const HeartRateService = require('./BLE/heart-rate-service');

class BLEServer extends EventEmitter {
  constructor (serverCallback) {
    super()

    this.name = 'Heart Rate Monitor'
    process.env['BLENO_DEVICE_NAME'] = this.name

    this.hrm = new HeartRateService()

    let self = this
    console.log(`[daumBLE.js] - ${this.name} - BLE server starting`)

    bleno.on('stateChange', (state) => {
      console.log(`[daumBLE.js] - ${this.name} - new state: ${state}`)

      if (state === 'poweredOn') {
        bleno.startAdvertising(self.name, [self.hrm.uuid])
      } else {
        console.log('Stopping...')
        bleno.stopAdvertising()
      }
    })

    bleno.on('advertisingStart', (error) => {
      console.log(`[daumBLE.js] - ${this.name} - advertisingStart: ${(error ? 'error ' + error : 'success')}`)

      if (!error) {
        bleno.setServices([self.hrm],
          (error) => {
            console.log(`[daumBLE.js] - ${this.name} - setServices: ${(error ? 'error ' + error : 'success')}`)
          })
      }
    })

    bleno.on('advertisingStartError', () => {
      console.log(`[daumBLE.js] - ${this.name} - advertisingStartError - advertising stopped`)
    })

    bleno.on('advertisingStop', error => {
      console.log(`[daumBLE.js] - ${this.name} - advertisingStop: ${(error ? 'error ' + error : 'success')}`)
    })

    bleno.on('servicesSet', error => {
      console.log(`[daumBLE.js] - ${this.name} - servicesSet: ${(error) ? 'error ' + error : 'success'}`)
    })

    bleno.on('accept', (clientAddress) => {
      console.log(`[daumBLE.js] - ${this.name} - accept - Client: ${clientAddress}`)
      self.emit('accept', clientAddress)
      bleno.updateRssi()
    })
    
    bleno.on('disconnect', (clientAddress) => {
      console.log(`[daumBLE.js] - ${this.name} - disconnect - Client: ${clientAddress}`)
      self.emit('disconnect', clientAddress)
      bleno.updateRssi()
    })

    bleno.on('rssiUpdate', (rssi) => {
      console.log(`[daumBLE.js] - ${this.name} - rssiUpdate: ${rssi}`)
    })
  }

  // Notify BLE services
  notify (event) {
    console.log(`BLE Server Notify()`)
    this.hrm.notify(event)
  }
}

module.exports = BLEServer