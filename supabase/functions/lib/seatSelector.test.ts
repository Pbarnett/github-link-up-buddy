// supabase/functions/lib/seatSelector.test.ts
import { describe, it, expect } from 'vitest'; // Or Jest equivalent
import { selectSeat } from './seatSelector'; // Adjust path if needed

// Helper to create mock seat objects easily
const createMockSeat = (
    number: string,
    typeFeatures: string[], // e.g., ['AISLE'], ['WINDOW'], [] for MIDDLE
    price: number,
    available = true
) => ({
    seatNumber: number, // Property name used by selectSeat logic for the seat's identifier
    available,
    features: typeFeatures, // Property name used by selectSeat logic for type determination
    pricing: { total: String(price) }, // Property name used by selectSeat logic for price
    // Other properties like `travelerPricing` or `column` are not directly used by the provided selectSeat function,
    // but `facilities` was mentioned in earlier versions. The user's final selectSeat uses `features`.
});

// Helper to create a mock segment with seats, matching the structure selectSeat iterates through
const createMockSegment = (seats: unknown[]) => ({
    decks: [{ // selectSeat: for (const deck of segment.decks)
        rows: [{ // selectSeat: for (const row of deck.rows)
            seats // selectSeat: for (const seat of row.seats)
        }]
    }]
});

describe('selectSeat', () => {
    const baseFare = 100;

    it('should return null if seatMap is null, undefined, or has no flightSegments property', () => {
        expect(selectSeat(null, baseFare, 200, true)).toBeNull();
        // @ts-expect-error testing invalid input
        expect(selectSeat(undefined, baseFare, 200, true)).toBeNull();
        expect(selectSeat({}, baseFare, 200, true)).toBeNull(); // No flightSegments
        // @ts-expect-error testing invalid input
        expect(selectSeat({ flightSegments: null }, baseFare, 200, true)).toBeNull(); // flightSegments is null
        // @ts-expect-error testing invalid input
        expect(selectSeat({ flightSegments: "not_an_array" }, baseFare, 200, true)).toBeNull(); // flightSegments not an array
    });

    it('should return null if seatMap.flightSegments is an empty array (no seats to process)', () => {
        const mockSeatMapEmptySegments = { flightSegments: [] };
        expect(selectSeat(mockSeatMapEmptySegments, baseFare, 200, true)).toBeNull();
    });


    it('should return null if remainingBudget <= 0', () => {
        const mockSeatMap = { flightSegments: [createMockSegment([createMockSeat('1A', ['AISLE'], 10)])] };
        // Remaining budget is 0 (100 - 100)
        expect(selectSeat(mockSeatMap, baseFare, baseFare, true)).toBeNull();
        // Remaining budget is -10 (90 - 100)
        expect(selectSeat(mockSeatMap, baseFare, baseFare - 10, true)).toBeNull();
    });

    it('should pick the cheapest AISLE seat if available within budget', () => {
        const seats = [
            createMockSeat('2C', ['AISLE'], 20), // Chosen: Cheapest AISLE
            createMockSeat('1B', ['WINDOW'], 10),
            createMockSeat('3A', ['AISLE'], 30),
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 25, true); // budget 125, remaining 25
        expect(result).toEqual({ seatNumber: '2C', seatType: 'AISLE', price: 20 });
    });

    it('should pick the cheapest WINDOW seat if no AISLE available within budget', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 50), // AISLE, but too expensive
            createMockSeat('2B', ['WINDOW'], 20), // Chosen: Cheapest WINDOW in budget
            createMockSeat('3C', ['WINDOW'], 30), // WINDOW, but more expensive
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 25, true); // budget 125, remaining 25
        expect(result).toEqual({ seatNumber: '2B', seatType: 'WINDOW', price: 20 });
    });

    it('should pick the cheapest MIDDLE seat if allowMiddle is true and only MIDDLE available in budget', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 50),
            createMockSeat('2B', ['WINDOW'], 50),
            createMockSeat('3C', [], 20), // MIDDLE, Chosen
            createMockSeat('4D', [], 30), // MIDDLE, more expensive
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 25, true); // budget 125, remaining 25
        expect(result).toEqual({ seatNumber: '3C', seatType: 'MIDDLE', price: 20 });
    });

    it('should return null if allowMiddle is false and only MIDDLE seats are available under budget', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 50),
            createMockSeat('2B', ['WINDOW'], 50),
            createMockSeat('3C', [], 20), // MIDDLE, in budget
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        expect(selectSeat(mockSeatMap, baseFare, baseFare + 25, false)).toBeNull(); // budget 125, remaining 25, no middle
    });

    it('should return null if no seats are available within budget', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 50),
            createMockSeat('2B', ['WINDOW'], 60),
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        expect(selectSeat(mockSeatMap, baseFare, baseFare + 25, true)).toBeNull(); // budget 125, remaining 25
    });

    it('should handle seats with price 0 correctly when remaining budget allows', () => {
        const seats = [createMockSeat('1A', ['AISLE'], 0)];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        // Test with remaining budget > 0
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 10, true); // budget 110, remaining 10
        expect(result).toEqual({ seatNumber: '1A', seatType: 'AISLE', price: 0 });

        // Test with remaining budget = 0. User's code `remainingBudget <=0` returns null.
        // If a free seat IS desired when remainingBudget is exactly 0, the condition in selectSeat should be `remainingBudget < 0`.
        // Based on current code:
        expect(selectSeat(mockSeatMap, baseFare, baseFare, true)).toBeNull();
    });

    it('should prioritize AISLE > WINDOW > MIDDLE when all are same priced and under budget', () => {
        const seats = [
            createMockSeat('2A', [], 15), // Middle
            createMockSeat('2B', ['WINDOW'], 15), // Window
            createMockSeat('2C', ['AISLE'], 15), // Aisle - Chosen
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 20, true); // budget 120, remaining 20
        expect(result).toEqual({ seatNumber: '2C', seatType: 'AISLE', price: 15 });
    });

    it('should ignore unavailable seats', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 10, false), // Unavailable Aisle
            createMockSeat('1B', ['WINDOW'], 15, true), // Available, Chosen
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 20, true); // budget 120, remaining 20
        expect(result).toEqual({ seatNumber: '1B', seatType: 'WINDOW', price: 15 });
    });

    it('should return null if all available seats are of disallowed types', () => {
        const seats = [
            createMockSeat('1A', [], 10, true), // Middle
            createMockSeat('1B', [], 15, true), // Middle
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        // Budget allows, but allowMiddle is false
        expect(selectSeat(mockSeatMap, baseFare, baseFare + 20, false)).toBeNull();
    });

    it('should correctly parse string prices from seat.pricing.total', () => {
        const seats = [
            createMockSeat('1A', ['AISLE'], 20.55), // Price as number, converted to string by createMockSeat
        ];
        const mockSeatMap = { flightSegments: [createMockSegment(seats)] };
        const result = selectSeat(mockSeatMap, baseFare, baseFare + 25, true); // budget 125, remaining 25
        expect(result).toEqual({ seatNumber: '1A', seatType: 'AISLE', price: 20.55 });
    });
});
