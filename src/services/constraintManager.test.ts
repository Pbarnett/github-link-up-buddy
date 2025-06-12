
// src/services/constraintManager.test.ts
import { getNextRelaxation } from '@/services/constraintManager';
import profilesData from '@/config/constraintProfiles.json';
import { ConstraintProfiles, RelaxationStep } from '@/types/constraintProfiles'; // Ensure RelaxationStep is imported if used for typing `first`

const profiles = profilesData as ConstraintProfiles;

test('getNextRelaxation cycles correctly', () => {
  // Check if relaxations array exists and is not empty before accessing profiles.relaxations[0]
  if (profiles && profiles.relaxations && profiles.relaxations.length > 0) {
    const first: RelaxationStep = profiles.relaxations[0];
    expect(getNextRelaxation(0)).toEqual(first);
  } else {
    // If relaxations is empty or undefined, getNextRelaxation(0) should be null
    expect(getNextRelaxation(0)).toBeNull();
  }

  // Check behavior beyond the array length
  // Ensure profiles.relaxations exists before trying to get its length
  const length = (profiles && profiles.relaxations) ? profiles.relaxations.length : 0;
  expect(getNextRelaxation(length)).toBeNull();

  // Optional: Test with a negative index, should also return null due to the added checks
  expect(getNextRelaxation(-1)).toBeNull();

});
