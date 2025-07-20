import { test, expect } from '../fixtures/extendedTest';
import { testData, testHelpers } from '../fixtures/testData';

test.describe('Test Fixtures Verification', () => {
  test('test data fixtures are properly structured', async () => {
    // Verify test data structure
    expect(testData.flights.domestic.origin).toBe('LAX');
    expect(testData.flights.domestic.destination).toBe('JFK');
    expect(testData.users.testUser.email).toContain('@parkerfly.test');
    
    // Verify dynamic date generation
    const departureDate = testData.dates.getDepartureDate(30);
    const returnDate = testData.dates.getReturnDate(37);
    
    expect(departureDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(returnDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    // Verify helper functions
    const testEmail = testHelpers.generateTestEmail();
    expect(testEmail).toContain('@parkerfly.test');
    expect(testEmail).toMatch(/^e2e-test-\d+@parkerfly\.test$/);
    
    const futureDate = testHelpers.getFutureDate(15);
    expect(futureDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('flight search data fixture works', async ({ flightSearchData }) => {
    expect(flightSearchData.origin).toBe('LAX');
    expect(flightSearchData.destination).toBe('JFK');
    expect(flightSearchData.budget).toBe(800);
    
    // Verify dates are dynamic (not hardcoded)
    expect(flightSearchData.dates.departure).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(flightSearchData.dates.return).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    const departureDate = new Date(flightSearchData.dates.departure);
    const today = new Date();
    expect(departureDate.getTime()).toBeGreaterThan(today.getTime());
  });

  test('test email fixture generates unique emails', async ({ testUserEmail }) => {
    expect(testUserEmail).toContain('@parkerfly.test');
    expect(testUserEmail).toMatch(/^e2e-test-\d+@parkerfly\.test$/);
  });

  test('validation patterns work correctly', async () => {
    const requiredFieldPattern = testData.validation.errors.requiredField;
    const successPattern = testData.validation.success.flightSearch;
    
    expect(requiredFieldPattern.test('This field is required')).toBe(true);
    expect(requiredFieldPattern.test('cannot be empty')).toBe(true);
    expect(successPattern.test('flights found')).toBe(true);
    expect(successPattern.test('search results available')).toBe(true);
  });

  test('airport data is properly structured', async () => {
    expect(testData.airports.major.LAX.code).toBe('LAX');
    expect(testData.airports.major.LAX.city).toBe('Los Angeles');
    expect(testData.airports.nyc).toContain('JFK');
    expect(testData.airports.nyc).toContain('LGA');
    expect(testData.airports.nyc).toContain('EWR');
  });
});
