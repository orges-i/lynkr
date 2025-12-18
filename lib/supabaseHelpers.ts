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
    theme: 'simple' | 'dark' | 'midnight' | 'sunset' | 'ocean' | 'forest' | 'pastel' | 'retro' | 'mint' | 'air' | 'custom';
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

export interface PricingPlan {
    id?: string;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta?: string;
    popular?: boolean;
    position?: number;
}

export interface Ticket {
    id?: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    category: 'bug' | 'feature';
    created_by?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface PlatformSettings {
    id?: string;
    maintenance_mode: boolean;
    registrations_enabled: boolean;
    updated_at?: string;
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

// -- Admin / Pricing Helpers --

/**
 * Fetch all pricing plans from the database. Falls back to an empty array on error.
 */
export const fetchPricingPlans = async (): Promise<PricingPlan[]> => {
    const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching pricing plans:', error);
        return [];
    }

    // Normalize shape
    return (data || []).map((p) => ({
        id: (p as any).id,
        name: (p as any).name,
        price: (p as any).price,
        period: (p as any).period || '/month',
        description: (p as any).description || '',
        features: (p as any).features || [],
        cta: (p as any).cta || 'Get Started',
        popular: Boolean((p as any).popular),
        position: (p as any).position ?? 0,
    }));
};

/**
 * Upsert a pricing plan (create or update).
 * Requires RLS policy to allow superadmin updates.
 */
export const upsertPricingPlan = async (plan: PricingPlan): Promise<PricingPlan | null> => {
    const payload = { ...plan };
    const { data, error } = await supabase
        .from('pricing_plans')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

    if (error) throw error;

    return data as PricingPlan;
};

/**
 * Fetch all profiles for SuperAdmin views.
 * Requires RLS policy to allow superadmin select on profiles.
 */
export const fetchProfilesForAdmin = async (): Promise<Profile[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, plan, role, avatar_url, created_at');

    if (error) {
        console.error('Error fetching profiles (admin):', error);
        return [];
    }

    return data || [];
};

/**
 * Count total page views from link_clicks (used for admin metrics).
 */
export const fetchPageViewsCount = async (): Promise<number> => {
    const { count, error } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting link clicks:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Fetch recent profiles (for activity feed).
 */
export const fetchRecentProfiles = async (limit = 5) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, created_at, plan')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent profiles:', error);
        return [];
    }
    return data || [];
};

/**
 * Fetch recent links (for activity feed).
 */
export const fetchRecentLinks = async (limit = 5) => {
    const { data, error } = await supabase
        .from('links')
        .select('id, title, created_at, profiles!inner(username)')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent links:', error);
        return [];
    }
    return data || [];
};

/**
 * Fetch all links for admin exports.
 */
export const fetchLinksForAdmin = async () => {
    const { data, error } = await supabase
        .from('links')
        .select('id, user_id, title, url, active, clicks_count, created_at');

    if (error) {
        console.error('Error fetching links (admin):', error);
        return [];
    }
    return data || [];
};

// -- Tickets (Requests & Bugs) --

export const fetchTickets = async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tickets:', error);
        return [];
    }
    return (data as Ticket[]) || [];
};

export const createTicket = async (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket | null> => {
    const payload = { ...ticket };
    const { data, error } = await supabase
        .from('tickets')
        .insert(payload)
        .select()
        .single();
    if (error) {
        console.error('Error creating ticket:', error);
        return null;
    }
    return data as Ticket;
};

export const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
    const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('Error updating ticket:', error);
        return null;
    }
    return data as Ticket;
};

// -- Platform Settings --

/**
 * Ensure we have a single settings row. Creates one if missing.
 */
const ensureSettingsRow = async (allowCreate = false): Promise<PlatformSettings | null> => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();

    // If we got data back, great.
    if (data) return data as PlatformSettings;

    // If there was no row and we shouldn't create, just return null quietly.
    if (error && (error.code === 'PGRST116' || error.message?.toLowerCase().includes('0 rows'))) {
        if (!allowCreate) return null;
    }

    // If we hit auth/RLS issues, bail quietly so public routes don't blow up.
    if (error && ['401', '42501'].includes(error.code || '')) {
        return null;
    }

    // Create a default row only when explicitly allowed (admin flows).
    if (allowCreate) {
        const { data: inserted, error: insertError } = await supabase
            .from('settings')
            .insert([{ maintenance_mode: false, registrations_enabled: true }])
            .select()
            .single();
        if (insertError) {
            console.error('Error creating settings row:', insertError);
            return null;
        }
        return inserted as PlatformSettings;
    }

    // Fallback
    return null;
};

export const fetchSettings = async (): Promise<PlatformSettings | null> => {
    return ensureSettingsRow(false);
};

export const updateSettings = async (updates: Partial<PlatformSettings>): Promise<PlatformSettings | null> => {
    const existing = await ensureSettingsRow(true);
    if (!existing || !existing.id) {
        console.error('No settings row found to update');
        return null;
    }

    const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating settings:', error);
        return null;
    }
    return data as PlatformSettings;
};
