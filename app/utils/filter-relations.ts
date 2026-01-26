/**
 * Filters out redundant relation paths by removing any path that is a prefix of another path.
 * This helps optimize OData queries by only including the most specific relations needed.
 *
 * @param relations - Array of relation path strings (e.g., ['details', 'details.tax', 'details.tax_condition.filters'])
 * @returns Filtered array with redundant prefixes removed
 *
 * @example
 * filterRelations(['details', 'details.tax', 'details.tax_condition', 'details.tax_condition.filters'])
 * // Returns: ['details.tax', 'details.tax_condition.filters']
 */
export function filterRelations(relations: string[]): string[] {
	if (!relations || relations.length === 0) {
		return [];
	}

	// Sort relations by length (shortest first) to make comparison easier
	const sortedRelations = [...relations].sort((a, b) => a.length - b.length);
	const result: string[] = [];

	for (const relation of sortedRelations) {
		// Check if this relation is a prefix of any relation already in the result
		const isPrefixOfExisting = result.some((existingRelation) => existingRelation.startsWith(relation + '.') || existingRelation === relation);

		// Check if this relation is a prefix of any other relation in the input
		const isPrefixOfOther = relations.some((otherRelation) => otherRelation !== relation && otherRelation.startsWith(relation + '.'));

		// Only add if it's not a prefix of any other relation
		if (!isPrefixOfOther && !isPrefixOfExisting) {
			result.push(relation);
		}
	}

	return result;
}
