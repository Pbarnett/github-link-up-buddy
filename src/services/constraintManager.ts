// src/services/constraintManager.ts
// Import the raw JSON; requires resolveJsonModule in tsconfig
import profilesData from '@/config/constraintProfiles.json';
import { RelaxationStep, ConstraintProfiles } from '@/types/constraintProfiles';

// Cast to our TS interface if necessary
const profiles = profilesData as ConstraintProfiles;

/**
 * Returns the next relaxation step, or null if none remain.
 */
export function getNextRelaxation(
  step: number
): RelaxationStep | null {
  // Ensure step is a valid index and profiles.relaxations exists
  if (profiles && profiles.relaxations && step >= 0 && step < profiles.relaxations.length) {
    return profiles.relaxations[step];
  }
  return null;
}
