
import { transformAmadeusToOffers } from "./flightApi";

describe("flightApi", () => {
  test("transformAmadeusToOffers maps correctly", () => {
    const mockResponse = {
      data: [
        {
          itineraries: [
            {
              duration: "PT7H30M",
              segments: [
                {
                  carrierCode: "AA",
                  number: "123",
                  departure: {
                    at: "2023-07-01T08:30:00"
                  },
                  arrival: {
                    at: "2023-07-01T11:45:00"
                  }
                }
              ]
            },
            {
              segments: [
                {
                  departure: {
                    at: "2023-07-08T09:00:00"
                  },
                  arrival: {
                    at: "2023-07-08T12:15:00"
                  }
                }
              ]
            }
          ],
          price: {
            total: "429.99"
          }
        }
      ]
    };

    const tripRequestId = "test-trip-id";
    const result = transformAmadeusToOffers(mockResponse, tripRequestId);

    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      trip_request_id: tripRequestId,
      airline: "AA",
      flight_number: "123",
      departure_date: "2023-07-01",
      departure_time: "08:30",
      return_date: "2023-07-08",
      return_time: "12:15",
      duration: "PT7H30M",
      price: 429.99,
    });
  });

  test("transformAmadeusToOffers handles empty data", () => {
    expect(transformAmadeusToOffers({ data: [] }, "test-id")).toEqual([]);
    expect(transformAmadeusToOffers({ data: null }, "test-id")).toEqual([]);
  });
});
