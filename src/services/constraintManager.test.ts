import { getNextRelaxation } from '@/services/constraintManager';
import profiles from '@/config/constraintProfiles.json';

test('getNextRelaxation cycles correctly', () => {
  expect(getNextRelaxation(0)).toEqual(profiles.relaxations[0]);
  expect(getNextRelaxation(profiles.relaxations.length)).toBeNull();
});
