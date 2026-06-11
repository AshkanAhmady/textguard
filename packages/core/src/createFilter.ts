import {
    FilterOptions,
    TextGuardInstance,
} from "./types";

export function createFilter(
    options: FilterOptions,
): TextGuardInstance {
    return {
        hasBadWord(_text: string) {
            return false;
        },

        findBadWords(_text: string) {
            return [];
        },

        filter(text: string) {
            return {
                originalText: text,
                filteredText: text,
                matches: [],
            };
        },
    };
}