const expect = require("chai").expect;
const sinon = require("sinon");

const NetworkChangeNotifier = require("../src/network-change");

const networksFixture = require("./fixtures/networks.json");
const externalNetworksFixture = require("./fixtures/only-externals.json");
const internalNetworksFixture = require("./fixtures/only-internals.json");

// mocking
const os = require("os");
os.networkInterfaces = () => networksFixture;

describe("NetworkChangeNotifier()", () => {
  describe("#getInterfacesSerialized()", () => {
    it("should return only external networks when filter is provided", () => {
      const notifier = new NetworkChangeNotifier({
        filter: network => !network.internal
      });
      const candidate = notifier.getInterfacesSerialized();
      const expected = JSON.stringify(externalNetworksFixture);

      expect(candidate).to.equals(expected);
    });

    it("should return only internal networks when filter is provided", () => {
      const notifier = new NetworkChangeNotifier({
        filter: network => network.internal
      });
      const candidate = notifier.getInterfacesSerialized();
      const expected = JSON.stringify(internalNetworksFixture);

      expect(candidate).to.equals(expected);
    });
  });

  describe("events", () => {
    it("should not emit 'network-change' event if network interfaces has not changed", done => {
      const notifier = new NetworkChangeNotifier({ intervals: 0 });
      const spy = sinon.fake();
      notifier.on("network-change", spy);

      setTimeout(() => {
        expect(spy.calledOnce).to.equal(false);
        done();
      });
    });

    it("should emit 'network-change' event when network interfaces changes", done => {
      const notifier = new NetworkChangeNotifier({ intervals: 0 });
      const spy = sinon.fake();
      notifier.on("network-change", spy);
      os.networkInterfaces = () => 1;

      setTimeout(() => {
        expect(spy.calledOnce).to.equal(true);
        done();
      });
    });
  });
});
