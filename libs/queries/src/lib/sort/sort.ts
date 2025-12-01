export type SortOption = 'distance' | 'recently-added' | 'rating' | 'name' | 'established';

export const VALID_SORT_OPTIONS: SortOption[] = ['distance', 'recently-added', 'rating', 'name', 'established'];

export const DEFAULT_SORT_OPTION: SortOption = 'distance';

/**
 * Parses and validates a sort option from URL search params
 * @param sortParam - The raw sort parameter from URL
 * @returns A valid SortOption, defaulting to 'distance' if invalid
 */
export function parseSortOption(sortParam?: string | null): SortOption {
  if (sortParam && VALID_SORT_OPTIONS.includes(sortParam as SortOption)) {
    return sortParam as SortOption;
  }
  return DEFAULT_SORT_OPTION;
}

/**
 * Get GROQ order clause based on sort option
 * Note: 'distance' sorting is done client-side after fetching
 */
export function getOrderClause(sortBy: SortOption): string {
  switch (sortBy) {
    case 'recently-added':
      return '| order(_createdAt desc)';
    case 'rating':
      return '| order(coalesce(math::avg(reviews[].rating), 0) desc)';
    case 'name':
      return '| order(lower(name) asc)';
    case 'established':
      return '| order(established desc)';
    case 'distance':
    default:
      return '';
  }
}
