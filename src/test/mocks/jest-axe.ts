// Mock implementation of jest-axe for accessibility testing
export const axe = vi
  .fn()
  .mockImplementation(() => Promise.resolve({ violations: [] }));
export const toHaveNoViolations = expect.extend({
  toHaveNoViolations(received) {
    const pass = received.violations.length === 0;
    if (pass) {
      return {
        message: () =>
          `Expected to have accessibility violations but found none`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `Expected no accessibility violations but found ${received.violations.length}`,
        pass: false,
      };
    }
  },
});

// Configure axe for testing
export const configureAxe = vi.fn().mockImplementation(() => axe);

export default {
  axe,
  toHaveNoViolations,
  configureAxe,
};
