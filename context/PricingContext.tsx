import React, { createContext, useContext, useState } from 'react';

export interface Plan {
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
  updatePlan: (index: number, updatedPlan: Plan) => void;
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

  const updatePlan = (index: number, updatedPlan: Plan) => {
    const newPlans = [...plans];
    newPlans[index] = updatedPlan;
    setPlans(newPlans);
  };

  return (
    <PricingContext.Provider value={{ plans, updatePlan }}>
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