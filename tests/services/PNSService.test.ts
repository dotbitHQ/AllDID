import { defaultCreateInstanceOptions } from "../../src/createInstance";
import { PnsService } from "../../src/services/PnsService";

describe("PNSService", () => {
  const pnsService = new PnsService(defaultCreateInstanceOptions.pns);

  describe("isSupported", () => {
    it("support abc.dot", () => {
      expect(pnsService.isSupported("abc.dot")).toBe(true);
    });
    it("do not  support abc.dot", () => {
      expect(pnsService.isSupported("ccc.dot")).toBe(false);
    });
  });
});
