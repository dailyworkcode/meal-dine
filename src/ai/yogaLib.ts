/**
 * A curated library of yoga pose images to ensure accuracy and performance.
 * Maps common yoga pose names to high-quality static images.
 */

const YOGA_IMAGE_MAP: Record<string, string> = {
    // Basic / Standing
    'mountain': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'tadasana': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'tree': 'https://images.unsplash.com/photo-1552196564-97214ca6f50b?q=80&w=800&auto=format&fit=crop',
    'vrikshasana': 'https://images.unsplash.com/photo-1552196564-97214ca6f50b?q=80&w=800&auto=format&fit=crop',
    'triangle': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    'trikonasana': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',

    // Floor / Stretching
    'downward-facing-dog': 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?q=80&w=800&auto=format&fit=crop',
    'adho-mukha-svanasana': 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?q=80&w=800&auto=format&fit=crop',
    'child': 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=800&auto=format&fit=crop',
    'balasana': 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?q=80&w=800&auto=format&fit=crop',
    'cobra': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'bhujangasana': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'cat-cow': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop',
    'marjaryasana': 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800&auto=format&fit=crop',

    // Strength
    'plank': 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=800&auto=format&fit=crop',
    'chair': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'utkatasana': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'warrior': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    'virabhadrasana': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',

    // Relaxation
    'corpse': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'shavasana': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
};

const DEFAULT_YOGA_IMAGE = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&fit=crop&auto=format';

/**
 * Gets a high-quality yoga pose image based on the pose name.
 * Uses fuzzy matching to handle variations.
 * 
 * @param poseName The name of the yoga pose (English or Sanskrit)
 * @returns A URL to a static image/GIF
 */
export function getYogaPoseImage(poseName: string): string {
    const normalized = poseName.toLowerCase().replace(/[^a-z]/g, '-');

    // 1. Direct match
    if (YOGA_IMAGE_MAP[normalized]) {
        return YOGA_IMAGE_MAP[normalized];
    }

    // 2. Keyword match
    for (const [key, url] of Object.entries(YOGA_IMAGE_MAP)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return url;
        }
    }

    // 3. Fallback
    return DEFAULT_YOGA_IMAGE;
}
