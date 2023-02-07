import { PnsService } from "../../src/services/PnsService";
import { defaultCreateInstanceOptions } from "../../src/createInstance";

describe("PnsService", () => {
  const testDomain = "gavinwood000.dot";
  const pnsService = new PnsService(defaultCreateInstanceOptions.pns);

  describe("isSupported", () => {
    it("support abc.dot", () => {
      expect(pnsService.isSupported("abc.dot")).toBe(true);
    });
    it("do not support abc.dot", () => {
      expect(pnsService.isSupported("abc.bit")).toBe(false);
    });

    it("test gavinwood000.dot tokenId", async () => {
      expect(await pnsService.tokenId(testDomain)).toBe(
        "0x92c0a11cdc79a5c4ee5fa2333f488a3870371fc1d12a75ab72fb2e939a4e6c71"
      );
    });

    it("test gavinwood000.dot owner address", async () => {
      expect(await pnsService.owner(testDomain)).toBe(
        "0x0b23E3588c906C3F723C58Ef4d6baEe7840A977c"
      );
    });

    it(`abcvqovoq.dot tokenId is not registered`, async () => {
      expect(await pnsService.isRegistered("abcvqovoq.dot")).toBe(false);
    });

    it("gavinwood000.dot exist", async () => {
      expect(await pnsService.isRegistered(testDomain)).toBe(true);
    });

    it("gavinwood000.dot record key=ETH", async () => {
      expect(await pnsService.record("gavin000.dot", "ETH")).toEqual({
        key: "ETH",
        label: "",
        subtype: "",
        ttl: 0,
        type: "",
        value: "",
      });
    });

    it("gavinwood000.dot records key includes BTC,ETH", async () => {
      expect(await pnsService.records("gavin000.dot", ["BTC", "ETH"])).toEqual([
        { key: "BTC", label: "", subtype: "", ttl: 0, type: "", value: "BTC" },
        { key: "ETH", label: "", subtype: "", ttl: 0, type: "", value: "ETH" },
      ]);
    });
  });
});
