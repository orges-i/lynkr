import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';
import { usePricing } from '../context/PricingContext';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { plans } = usePricing();

  return (
    <div className="py-24 bg-surface" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Simple pricing.</h2>
            <p className="text-secondary text-lg mb-8">Start for free, upgrade when you need to.</p>
            
            <div className="inline-flex items-center p-1 bg-surfaceHighlight rounded-full border border-border">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                onClick={() => setIsAnnual(true)}
              >
                Yearly <span className="text-xs text-green-500 ml-1">-20%</span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Reveal key={index} delay={index * 100} className="h-full" width="100%">
              <div className={`h-full p-8 rounded-3xl border flex flex-col relative transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-surfaceHighlight dark:bg-zinc-900 border-primary/20 shadow-2xl' 
                  : 'bg-background border-border hover:border-primary/10'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-background text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {isAnnual && plan.price !== '$0' 
                        ? '$' + (parseInt(plan.price.replace('$','')) * 0.8).toFixed(0) 
                        : plan.price}
                    </span>
                    <span className="text-secondary">{plan.period}</span>
                  </div>
                  <p className="text-secondary text-sm mt-4">{plan.description}</p>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-surfaceHighlight dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 border border-border">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-secondary text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  variant={plan.popular ? 'primary' : 'secondary'} 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
