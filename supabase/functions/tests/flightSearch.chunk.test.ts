import { describe, it, expect } from "vitest";
// Adjust the import path based on the actual location of generateDateSegments if it's not default export or path is different
import { generateDateSegments } from "../flight-search/index"; // Assuming it's exported from here

describe("generateDateSegments", () => {
  it("should create correct segments for a range longer than segmentDurationDays", () => {
    const overallStart = new Date("2024-07-01T00:00:00.000Z");
    const overallEnd = new Date("2024-08-30T00:00:00.000Z"); // Approx 60 days
    const segmentDurationDays = 14;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);

    // Expected: 60 days / 14 days/segment = 4 full segments, 1 partial segment of 4 days
    // (July 1-14, July 15-28, July 29-Aug 11, Aug 12-25, Aug 26-30) -> 5 segments
    // Let's verify counts and dates carefully.
    // July: 31 days. August: 31 days.
    // Segment 1: 2024-07-01 to 2024-07-14 (14 days)
    // Segment 2: 2024-07-15 to 2024-07-28 (14 days)
    // Segment 3: 2024-07-29 to 2024-08-11 (14 days)
    // Segment 4: 2024-08-12 to 2024-08-25 (14 days)
    // Segment 5: 2024-08-26 to 2024-08-30 (5 days, not 4. Aug 26,27,28,29,30)
    expect(segments.length).toBe(5);

    // Check first segment
    expect(segments[0].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[0].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-14");

    // Check last segment
    expect(segments[4].segmentStart.toISOString().slice(0, 10)).toBe("2024-08-26");
    expect(segments[4].segmentEnd.toISOString().slice(0, 10)).toBe("2024-08-30");
  });

  it("should create a single segment for a range shorter than segmentDurationDays", () => {
    const overallStart = new Date("2024-07-01T00:00:00.000Z");
    const overallEnd = new Date("2024-07-05T00:00:00.000Z"); // 5 days
    const segmentDurationDays = 14;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);

    expect(segments.length).toBe(1);
    expect(segments[0].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[0].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-05");
  });

  it("should create correct segments for a range that is an exact multiple of segmentDurationDays", () => {
    const overallStart = new Date("2024-07-01T00:00:00.000Z");
    const overallEnd = new Date("2024-07-28T00:00:00.000Z"); // 28 days
    const segmentDurationDays = 14;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);

    expect(segments.length).toBe(2);
    expect(segments[0].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[0].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-14");
    expect(segments[1].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-15");
    expect(segments[1].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-28");
  });

  it("should handle a single day range correctly", () => {
    const overallStart = new Date("2024-07-01T00:00:00.000Z");
    const overallEnd = new Date("2024-07-01T00:00:00.000Z"); // 1 day
    const segmentDurationDays = 14;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);

    expect(segments.length).toBe(1);
    expect(segments[0].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[0].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-01");
  });

  it("should handle overallEnd date being before overallStart date (empty array)", () => {
    const overallStart = new Date("2024-07-10T00:00:00.000Z");
    const overallEnd = new Date("2024-07-01T00:00:00.000Z");
    const segmentDurationDays = 14;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);
    expect(segments.length).toBe(0);
  });

  it("should handle segmentDurationDays of 1", () => {
    const overallStart = new Date("2024-07-01T00:00:00.000Z");
    const overallEnd = new Date("2024-07-03T00:00:00.000Z"); // 3 days
    const segmentDurationDays = 1;
    const segments = generateDateSegments(overallStart, overallEnd, segmentDurationDays);

    expect(segments.length).toBe(3);
    expect(segments[0].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[0].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-01");
    expect(segments[1].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-02");
    expect(segments[1].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-02");
    expect(segments[2].segmentStart.toISOString().slice(0, 10)).toBe("2024-07-03");
    expect(segments[2].segmentEnd.toISOString().slice(0, 10)).toBe("2024-07-03");
  });
});
