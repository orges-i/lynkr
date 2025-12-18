import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchPricingPlans, upsertPricingPlan, PricingPlan } from '../lib/supabaseHelpers';

export interface Plan {
  id?: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface PricingContextType {
  plans: Plan[];
  updatePlan: (index: number, updatedPlan: Plan) => Promise<void>;
  refreshPlans: () => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const initialPlans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started.',
    features: ['Unlimited links', 'Basic analytics', 'Standard themes', 'LYNKR branding'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For growing creators and pros.',
    features: ['Everything in Free', 'Custom branding', 'Advanced analytics', 'Email collection', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Agency',
    price: '$29',
    period: '/month',
    description: 'Manage multiple accounts.',
    features: ['Everything in Pro', 'Unlimited pages', 'Team members', 'API Access', 'Dedicated manager'],
    cta: 'Contact Sales',
    popular: false
  }
];

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);

  const refreshPlans = useCallback(async () => {
    const remotePlans = await fetchPricingPlans();
    if (remotePlans.length > 0) {
      setPlans(remotePlans);
    } else {
      setPlans(initialPlans);
    }
  }, []);

  useEffect(() => {
    refreshPlans();
  }, []);

  const updatePlan = async (index: number, updatedPlan: Plan) => {
    const previousPlans = [...plans];
    const existingId = previousPlans[index]?.id;

    // Optimistic update
    setPlans((prev) => {
      const next = [...prev];
      next[index] = updatedPlan;
      return next;
    });

    try {
      await upsertPricingPlan({ ...updatedPlan, id: existingId });
      await refreshPlans();
    } catch (e) {
      // Revert to previous state on failure
      setPlans(previousPlans);
      throw e;
    }
  };

  return (
    <PricingContext.Provider value={{ plans, updatePlan, refreshPlans }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
