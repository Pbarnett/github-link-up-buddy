import profiles from '@/config/constraintProfiles.json';
// Assuming RelaxationStep is the correct type from the previously created file.
// Adjust path if necessary, e.g., '../types/constraintProfiles'.
import { RelaxationStep } from '@/types/constraintProfiles';

/**
 * Returns the next relaxation rule, or null if no more.
 */
export function getNextRelaxation(
  step: number
): RelaxationStep | null {
  // Ensure that profiles.relaxations is treated as RelaxationStep[]
  const relaxations: RelaxationStep[] = profiles.relaxations;
  return relaxations[step] ?? null;
}
