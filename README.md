# Network interfaces change

[![Build Status](https://travis-ci.org/airtame/network-interfaces-change.svg?branch=master)](https://travis-ci.org/airtame/network-interfaces-change)

> Get notified on any changes in network interfaces

Node.js doesn't provide an easy way to watch for network interface changes on your system.

This library aims to solve that by continuously matching the network interfaces (default 1 times per second) to their previous states. You can also filter the interface network to only watch a subset.

## Usage

```js
const NetworkChangeNotifier = require('network-change-notifier');
const notifier = new NetworkChangeNotifier();

notifier.on('network-change', () => console.log('network interfaces changed'));
```

You can provide a filter, to only be notified if any interface changes that matches a certain criteria

```js
const NetworkChangeNotifier = require('network-change-notifier');
const notifier = new NetworkChangeNotifier({
  filter: network => network.internal,
  // only check every 5 seconds (default 1 second)
  updateInterval: 5000,
});

notifier.on('network-change', () => console.log('internal network interfaces changed'));
```

a typical network object looks like this

```json
{
  "address": "127.0.0.1",
  "netmask": "255.0.0.0",
  "family": "IPv4",
  "mac": "00:00:00:00:00:00",
  "internal": true,
  "cidr": "127.0.0.1/8"
}
```

## Test

```sh
npm test
```
