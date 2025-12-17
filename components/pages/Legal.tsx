import React from 'react';
import { Reveal } from '../ui/Reveal';

const Legal: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
      <Reveal>
        <h1 className="text-4xl font-bold mb-12">Terms of Service & Privacy</h1>
        
        <div className="prose prose-invert prose-lg text-zinc-400">
          <h3 className="text-white font-bold text-xl mb-4">1. Introduction</h3>
          <p className="mb-8">
            Welcome to LYNKR. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our website.
          </p>

          <h3 className="text-white font-bold text-xl mb-4">2. User Accounts</h3>
          <p className="mb-8">
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <h3 className="text-white font-bold text-xl mb-4">3. Content Liability</h3>
          <p className="mb-8">
             You are responsible for the content you post on your LYNKR page. We reserve the right to remove any content that violates our community guidelines, is illegal, or is deemed inappropriate by our moderation team.
          </p>

          <h3 className="text-white font-bold text-xl mb-4">4. Privacy Policy</h3>
          <p className="mb-8">
             We respect your privacy. We collect only the data necessary to provide our services. We do not sell your personal data to third parties. For analytics, we use aggregated, anonymous data to help you understand your audience.
          </p>

          <h3 className="text-white font-bold text-xl mb-4">5. Changes</h3>
          <p className="mb-8">
             We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          
          <p className="text-sm text-zinc-600 mt-12 pt-12 border-t border-white/10">
             Last updated: October 2024
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default Legal;