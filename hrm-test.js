#!/usr/bin/env node
'use strict';

const BLEServer = require('./hrmBLE');

var DEBUG = true // turn this on for debug information in console

var bleServer = new BLEServer

var heartBeatTimer = setInterval(heartBeatEvent, 1000);
var beatOffset = 0

function heartBeatEvent() {
  var data={};
  data.rpm=90;
  data.power=100;
  data.hr=130 + beatOffset;

  beatOffset += 1;
  beatOffset %= 10;
  
  if (DEBUG) console.log('[server.js] - data:' + JSON.stringify(data))
  
  bleServer.notify(data)
}

//  clearInterval( heartBeatTimer )

