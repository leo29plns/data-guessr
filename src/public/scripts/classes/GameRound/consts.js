export const STATUSES = /** @type {const} */ ({
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

/**
 * @typedef {typeof STATUSES[keyof typeof STATUSES]} Status
 */

export const SCORE_THRESHOLDS = [
  { limit: 100, score: 5000 },
  { limit: 2000, score: 4000 },
  { limit: 10000, score: 2500 },
  { limit: 30000, score: 1200 },
  { limit: 60000, score: 500 },
  { limit: 100000, score: 250 },
];
