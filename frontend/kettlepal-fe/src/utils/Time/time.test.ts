import { isValidDateFormat } from "./time";

describe("isValidDateFormat", () => {
  it("Returns true for 2023-05-15", () => {
    expect(isValidDateFormat("2023-05-15")).toBe(true);
  });
  it("Returns true for 2000-01-01", () => {
    expect(isValidDateFormat("2000-01-01")).toBe(true);
  });
  it("Returns true for 2024-02-29 (leap year)", () => {
    expect(isValidDateFormat("2024-01-01")).toBe(true);
  });
  it("Returns false foryear 2023-02-29 (non leap year)", () => {
    expect(isValidDateFormat("2023-02-29")).toBe(false);
  });
  it("Returns false for year 2023-13-15 (bad month)", () => {
    expect(isValidDateFormat("2023-13-15")).toBe(false);
  });
  it("Returns false for 2023-05-15  (extra space)", () => {
    expect(isValidDateFormat("2023-05-15 ")).toBe(false);
  });
  it("Returns false for 2023/05/15  (wrong separator)", () => {
    expect(isValidDateFormat("2023/05/15")).toBe(false);
  });
  it("Returns false for 20230515  (no separator)", () => {
    expect(isValidDateFormat("20230515")).toBe(false);
  });
  it("Returns false for 2023-0515  (missing separator)", () => {
    expect(isValidDateFormat("2023-0515")).toBe(false);
  });
});
