/**
 * Affiliate Links Utility
 * Generates tracking URLs for various e-commerce platforms.
 */

// Read from Environment Variables for easy management
export const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID || 'dailydineplus-20';

export const AFFILIATE_PLATFORMS = {
    AMAZON: 'amazon',
    BIGBASKET: 'bigbasket',
    INSTACART: 'instacart'
};

/**
 * Generates a search link for ingredients.
 * @param query The search query (e.g., "Organic Paneer")
 * @param platform The target platform
 */
export function getGroceryLink(query: string, platform: string = 'amazon'): string {
    const encodedQuery = encodeURIComponent(query);

    switch (platform) {
        case AFFILIATE_PLATFORMS.BIGBASKET:
            return `https://www.bigbasket.com/ps/?q=${encodedQuery}`;
        case AFFILIATE_PLATFORMS.INSTACART:
            return `https://www.instacart.com/store/s?k=${encodedQuery}`;
        default: // Amazon
            return `https://www.amazon.in/s?k=${encodedQuery}&tag=${AFFILIATE_TAG}`;
    }
}

/**
 * Generates an affiliate link for a specific SKU or search term.
 * Used for gear and supplements.
 */
export function getProductLink(searchTerm: string): string {
    const encoded = encodeURIComponent(searchTerm);
    return `https://www.amazon.in/s?k=${encoded}&tag=${AFFILIATE_TAG}`;
}

export const SUGGESTED_GEAR = {
    yoga: [
        { name: 'Eco-Friendly Yoga Mat', search: 'anti-slip yoga mat' },
        { name: 'Yoga Blocks (Set of 2)', search: 'yoga blocks cork' },
        { name: 'Yoga Strap', search: 'yoga strap stretching' }
    ],
    supplements: [
        { name: 'Vegan Protein Powder', search: 'vegan protein powder chocolate' },
        { name: 'Vitamin D3 K2', search: 'vitamin d3 k2 organic' },
        { name: 'Magnesium Glycinate', search: 'magnesium glycinate' }
    ]
};
