import { formatTime, formatTimeInput } from "../utils/Time/time";

describe("Timer", () => {
  describe("formatTimeInput", () => {
    it("leaves well structured inputs alone (00:14)", () => {
      const input = "00:14";
      const expected = "00:14";
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });
    it("leaves well structured inputs alone (0)", () => {
      const input = "0";
      const expected = "00:00";
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });
    it("leaves well structures inputs alone (12:34)", () => {
      const input = "12:34";
      const expected = input;
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });
    it("leaves well structures inputs alone (1:06:34)", () => {
      const input = "1:06:34";
      const expected = "01:06:34";
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });

    describe("Adds missing colons", () => {
      it("appends colons for seconds", () => {
        const input = "34";
        const expected = "00:34";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
      it("appends colons for minutes", () => {
        const input = "13454";
        const expected = "01:34:54";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
      it("Does not appends colons for hours", () => {
        const input = "1213454";
        const expected = "121:34:54";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
    });

    describe("Replaces non-numerical values", () => {
      it("Strips letters", () => {
        const input = "1a2b3c";
        const expected = "01:23";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
      it("Leaves colons while stripping letters", () => {
        const input = "1a2b:3c"; // not 12:03 or 12:30
        const expected = "01:23";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
      it("Leaves colons while stripping letters/symbols", () => {
        const input = "15:31:!";
        const expected = "15:31";
        const out = formatTimeInput(input);
        expect(out).toBe(expected);
      });
    });

    it("Handles empty input", () => {
      const input = "";
      const expected = "00:00";
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });

    it("Works with unreasonably large values", () => {
      const input = "2231234";
      const expected = "223:12:34";
      const out = formatTimeInput(input);
      expect(out).toBe(expected);
    });
  });

  describe("formatTime", () => {
    it("formats with HH:SS for times under 1 hour", () => {
      const seconds = 61;
      const expected = "01:01";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
    it("formats with HH:MM:SS for exactly 1 hour", () => {
      const seconds = 3600;
      const expected = "01:00:00";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
    it("formats with MM:SS for the 1s case", () => {
      const seconds = 1;
      const expected = "00:01";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
    it("formats with MM:SS for the 0s case", () => {
      const seconds = 0;
      const expected = "00:00";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
    it("formats seconds into HH:MM:SS", () => {
      const seconds = 3661;
      const expected = "01:01:01";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
    it("doesn't truncate hours for unreasonably large inputs", () => {
      const seconds = 804455;
      const expected = "223:27:35";
      const out = formatTime(seconds);
      expect(out).toBe(expected);
    });
  });
});
