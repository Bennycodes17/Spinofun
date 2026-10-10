import { SPINO_CONFIG, WheelSegment } from "@/config/spino";

export interface SpinResult {
  segmentIndex: number;
  segment: WheelSegment;
  amountWonUsd: number;
  label: string;
  totalSegments: number;
  anglePerSegment: number;
  targetAngle: number; // Center angle of winning slice in degrees (0 = top)
}

/**
 * Server-authoritative weighted random selection
 * Guaranteed to run on server FIRST before returning to client
 */
export function determineWeightedOutcome(segments: WheelSegment[]): SpinResult {
  if (!segments || segments.length === 0) {
    throw new Error("No wheel segments provided");
  }

  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);
  const random = Math.random() * totalWeight;

  let accumulated = 0;
  let winningIndex = 0;

  for (let i = 0; i < segments.length; i++) {
    accumulated += segments[i].weight;
    if (random <= accumulated) {
      winningIndex = i;
      break;
    }
  }

  const winningSegment = segments[winningIndex];
  const totalSegments = segments.length;
  const anglePerSegment = 360 / totalSegments;

  // The angle for each segment i (centered)
  // Segment 0 starts at 0 deg, its center is anglePerSegment / 2
  const targetAngle = winningIndex * anglePerSegment + anglePerSegment / 2;

  return {
    segmentIndex: winningIndex,
    segment: winningSegment,
    amountWonUsd: winningSegment.amountUsd,
    label: winningSegment.label,
    totalSegments,
    anglePerSegment,
    targetAngle,
  };
}

/**
 * Gets segments for a given holding tier
 */
export function getSegmentsForTier(tier: 1 | 2 | 3): WheelSegment[] {
  if (tier === 3) return [...SPINO_CONFIG.TIERS.TIER_3.segments];
  if (tier === 2) return [...SPINO_CONFIG.TIERS.TIER_2.segments];
  return [...SPINO_CONFIG.TIERS.TIER_1.segments];
}

/**
 * Gets segments for X community spin
 */
export function getCommunitySegments(): WheelSegment[] {
  return [...SPINO_CONFIG.COMMUNITY_SEGMENTS];
}
