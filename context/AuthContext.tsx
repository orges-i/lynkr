import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [isNewUser]);

    const signUp = async (email: string, password: string, username: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });

            if (error) return { error };

            if (error) return { error };

            toast.success('🎉 Welcome to LYNKR! Your dashboard is ready.', {
                duration: 4000,
                position: 'top-center',
                style: {
                    background: '#10B981',
                    color: '#fff',
                    fontWeight: '600',
                    padding: '16px 24px',
                    borderRadius: '12px',
                },
            });

            return { error: null };
        } catch (error) {
            return { error: error as AuthError };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!error && data.user) {
                const username = data.user.user_metadata?.username || 'back';
                toast.success(`👋 Welcome back, ${username}!`, {
                    duration: 3000,
                    position: 'top-center',
                    style: {
                        background: '#6366F1',
                        color: '#fff',
                        fontWeight: '600',
                        padding: '16px 24px',
                        borderRadius: '12px',
                    },
                });
            }

            return { error };
        } catch (error) {
            return { error: error as AuthError };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        toast.success('👋 Logged out successfully', {
            duration: 2000,
            position: 'top-center',
        });
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
