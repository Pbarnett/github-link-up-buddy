
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Helper: Fills out base fields for TripRequestForm tests.
 * Usage: Call after rendering the form; this fills all fields except dates (these should be set separately if needed).
 */
export const fillBaseFormFields = async (options: { earliestDateStr?: string, latestDateStr?: string } = {}) => {
  // Destination
  const destinationCombobox = await screen.findByRole('combobox', { name: /destination/i });
  await userEvent.clear(destinationCombobox);
  await userEvent.type(destinationCombobox, 'LAX');

  // Departure Airport
  const departureInput = await screen.findByPlaceholderText(/e\.g\. SFO, BOS/i);
  await userEvent.clear(departureInput);
  await userEvent.type(departureInput, 'SFO');

  // Budget
  const budgetInput = await screen.findByLabelText(/budget/i);
  await userEvent.clear(budgetInput);
  await userEvent.type(budgetInput, '1200');

  // Durations
  const minDurationInput = await screen.findByLabelText(/minimum trip duration/i);
  await userEvent.clear(minDurationInput);
  await userEvent.type(minDurationInput, '5');
  const maxDurationInput = await screen.findByLabelText(/maximum trip duration/i);
  await userEvent.clear(maxDurationInput);
  await userEvent.type(maxDurationInput, '10');
};

/**
 * Helper: Simulates picking a date from a ShadCN-style Calendar popover.
 * @param datePickerTriggerText Accessible label or regex for the date popover button.
 * @param dateToSelect JS Date to pick from the calendar.
 */
export const selectDateInCalendar = async (datePickerTriggerText: RegExp | string, dateToSelect: Date) => {
  const user = userEvent.setup();
  const datePickerButton = await screen.findByRole('button', { name: datePickerTriggerText });
  await user.click(datePickerButton);

  // Try to pick a day button matching the date (may need adjustment per UI calendar lib)
  const dayButtons = await screen.findAllByRole('button', { name: (name) => name === String(dateToSelect.getDate()) });
  await user.click(dayButtons[0]);
};
