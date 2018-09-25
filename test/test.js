// @ts-nocheck
const { describe, it, beforeEach, afterEach } = require('mocha');
const expect = require('chai').expect;
const sinon = require('sinon');
const NetworkChangeNotifier = require('../src/network-change');

const networksFixture = require('./fixtures/networks.json');
const externalNetworksFixture = require('./fixtures/only-externals.json');
const internalNetworksFixture = require('./fixtures/only-internals.json');

// mocking
const os = require('os');
os.networkInterfaces = () => networksFixture;

describe('NetworkChangeNotifier()', () => {
  describe('#getInterfacesSerialized()', () => {
    it('should return only external networks when filter is provided', () => {
      const notifier = new NetworkChangeNotifier({
        filter: network => !network.internal,
      });
      const candidate = notifier.getInterfacesSerialized();
      const expected = JSON.stringify(externalNetworksFixture);
      notifier.stop();

      expect(candidate).to.equals(expected);
    });

    it('should return only internal networks when filter is provided', () => {
      const notifier = new NetworkChangeNotifier({
        filter: network => network.internal,
      });
      const candidate = notifier.getInterfacesSerialized();
      const expected = JSON.stringify(internalNetworksFixture);
      notifier.stop();

      expect(candidate).to.equals(expected);
    });
  });

  describe('defaults', () => {
    let notifier;

    beforeEach(() => {
      notifier = new NetworkChangeNotifier();
    });

    it('should have an update interval of 1000', () => {
      const candidate = notifier.updateInterval;
      const expected = 1000;

      expect(candidate).to.be.equal(expected);
    });

    it('should have a filter method', () => {
      const candidate = typeof notifier.filter;
      const expected = 'function';

      expect(candidate).to.be.equals(expected);
    });

    it('should previousInterfaces set to current interfaces', () => {
      const candidate = notifier.previousInterfaces;
      const expected = notifier.getInterfacesSerialized();

      expect(candidate).to.be.equals(expected);
    });

    afterEach(() => {
      notifier.stop();
    });
  });

  describe('class', () => {
    it('should have interval after calling start', done => {
      const notifier = new NetworkChangeNotifier({ updateInterval: 0 });
      notifier.start();

      setTimeout(() => {
        expect(typeof notifier.interval).to.equal('object');
        notifier.stop();
        done();
      }, 10);
    });

    it('should call start in constructor', () => {
      const spy = sinon.spy();
      const stub = sinon.stub(NetworkChangeNotifier.prototype, 'start').callsFake(spy);

      const notifier = new NetworkChangeNotifier({ updateInterval: 0 });
      notifier.stop();

      expect(spy.calledOnce).to.equals(true);
      stub.restore();
    });

    it('should clear interval on stop', () => {
      const notifier = new NetworkChangeNotifier({ updateInterval: 0 });
      notifier.stop();

      expect(notifier.interval).to.equals(null);
    });
  });

  describe('events', () => {
    it("should not emit 'network-change' event if network interfaces has not changed", done => {
      const notifier = new NetworkChangeNotifier({ updateInterval: 0 });
      const spy = sinon.fake();
      notifier.on('network-change', spy);

      setTimeout(() => {
        expect(spy.calledOnce).to.equal(false);
        notifier.stop();
        done();
      });
    });

    it("should emit 'network-change' event when network interfaces changes", done => {
      const notifier = new NetworkChangeNotifier({ updateInterval: 0 });
      const spy = sinon.fake();
      notifier.on('network-change', spy);
      os.networkInterfaces = () => 1;

      setTimeout(() => {
        expect(spy.calledOnce).to.equal(true);
        notifier.stop();
        done();
      });
    });
  });
});
