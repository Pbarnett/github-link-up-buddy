export interface HardConstraints {
  stops: number;
  carry_on: boolean;
  price_ceiling: string; // e.g., "budget", "budget * 1.2"
}

export interface RelaxationStep {
  stops?: number;
  maxLayoverHrs?: number;
  price_ceiling?: string;
  // Add other potential relaxation fields here if they become apparent
}

export interface ConstraintProfiles {
  hard: HardConstraints;
  relaxations: RelaxationStep[];
  version: string;
}

// Optional: If you want to directly import the JSON with types,
// you might also need a .d.ts file or tsconfig changes for JSON module resolution,
// but providing the interfaces separately is a good first step for type safety.
// For example, in code:
// import profilesData from '@/config/constraintProfiles.json';
// const profiles: ConstraintProfiles = profilesData;
