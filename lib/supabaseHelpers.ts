import { supabase } from './supabase';

// -- Types --

export interface Profile {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    cover_image_url?: string;
    plan: 'free' | 'pro' | 'agency';
    role?: 'user' | 'superadmin';
    created_at?: string;
}

export interface Link {
    id: string;
    user_id: string;
    title: string;
    url: string;
    active: boolean;
    position: number;
    clicks_count?: number;
    thumbnail_url?: string;
    created_at?: string;
}

export interface AppearanceSettings {
    user_id: string;
    theme: 'simple' | 'dark' | 'midnight' | 'sunset' | 'ocean' | 'forest' | 'pastel' | 'retro' | 'custom';
    button_style: 'rounded' | 'square' | 'pill' | 'hard';
    button_fill: 'solid' | 'outline' | 'ghost';
    button_shadow: 'none' | 'soft' | 'hard';
    font: 'sans' | 'serif' | 'mono' | 'montserrat' | 'lato' | 'oswald' | 'playfair' | 'outfit';
    custom_theme_url?: string;
    font_color?: string; // 'auto' | '#000000' | '#ffffff'
    seo_title?: string;
    seo_description?: string;
    show_brand_tag?: boolean;
}

// -- Profile Functions --

/**
 * Fetch a user's profile by their ID.
 */
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
    return data;
};

/**
 * Update a user's profile.
 */
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// -- Link Functions --

/**
 * Fetch all links for a specific user, ordered by position.
 */
export const fetchUserLinks = async (userId: string): Promise<Link[]> => {
    const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching links:', error);
        return [];
    }
    return data || [];
};

/**
 * Create a new link for a user.
 */
export const createLink = async (userId: string, link: { title: string; url: string; position: number }) => {
    const { data, error } = await supabase
        .from('links')
        .insert([
            {
                user_id: userId,
                title: link.title,
                url: link.url,
                position: link.position,
                active: true,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update an existing link.
 */
export const updateLink = async (linkId: string, updates: Partial<Link>) => {
    const { data, error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', linkId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Delete a link.
 */
export const deleteLink = async (linkId: string) => {
    const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

    if (error) throw error;
};

/**
 * Reorder links by updating their positions in bulk.
 * Note: This can be optimized, but handling it via loop is simplest for now.
 */
export const updateLinkPositions = async (links: { id: string; position: number }[]) => {
    // Option 1: Loop updates (simpler for small lists)
    for (const link of links) {
        await supabase
            .from('links')
            .update({ position: link.position })
            .eq('id', link.id);
    }

    // Option 2: RPC call if we had a stored procedure (better for perf)
};

// -- Appearance Functions --

/**
 * Fetch appearance settings for a user.
 * If not found, returns default settings (or creates them if you prefer).
 */
export const fetchAppearanceSettings = async (userId: string): Promise<AppearanceSettings | null> => {
    const { data, error } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        // It's possible the user hasn't set settings yet, so we return null or handle gracefully
        // console.log('No appearance settings found or error:', error.message);
        return null;
    }
    return data;
};

/**
 * Update or Insert appearance settings.
 */
export const updateAppearance = async (userId: string, settings: Partial<AppearanceSettings>) => {
    // Upsert is best here: update if exists, insert if not
    const { data, error } = await supabase
        .from('appearance_settings')
        .upsert({ user_id: userId, ...settings })
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Fetch a public profile and its appearance settings by username.
 * Used for the public profile page.
 */
export const fetchPublicProfileByUsername = async (username: string): Promise<{ profile: Profile; appearance: AppearanceSettings } | null> => {
    // 1. Get Profile (Case-insensitive match)
    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', username)
        .maybeSingle();

    if (pError || !profile) return null;

    // 2. Get Appearance
    const { data: appearance, error: aError } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', profile.id)
        .single();

    if (aError) {
        // Fallback to defaults if no settings found
        return {
            profile,
            appearance: {
                user_id: profile.id,
                theme: 'simple',
                button_style: 'rounded',
                button_fill: 'solid',
                button_shadow: 'none',
                font: 'sans'
            }
        };
    }

    return { profile, appearance };
};

/**
 * Fetch ONLY active links for a public profile.
 */
export const fetchPublicLinksByUserId = async (userId: string): Promise<Link[]> => {
    const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching public links:', error);
        return [];
    }
    return data || [];
};


// -- Storage Functions --

/**
 * Upload an image (avatar or cover) to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export const uploadImage = async (
    file: File,
    bucket: 'avatars' | 'covers' | 'links',
    userId: string
): Promise<string | null> => {
    // 1. Create a unique file path: userId/timestamp-filename
    // Sanitize filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 2. Upload
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
            upsert: true
        });

    if (uploadError) {
        console.error(`Error uploading to ${bucket}:`, uploadError);
        return null;
    }

    // 3. Get Public URL
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
};
/**
 * Track a link click by calling the increment_link_clicks RPC.
 */
export const trackLinkClick = async (linkId: string): Promise<void> => {
    const { error } = await supabase.rpc('increment_link_clicks', {
        link_id_input: linkId
    });

    if (error) {
        console.error('Error tracking link click:', error);
    }
};
