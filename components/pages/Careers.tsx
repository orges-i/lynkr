import React from 'react';
import { Reveal } from '../ui/Reveal';
import { ArrowRight, MapPin } from 'lucide-react';

const jobs = [
  { role: 'Senior Frontend Engineer', dept: 'Engineering', loc: 'Remote (US/EU)' },
  { role: 'Product Designer', dept: 'Design', loc: 'Remote (US)' },
  { role: 'Growth Marketing Manager', dept: 'Marketing', loc: 'New York, NY' },
  { role: 'Customer Success Specialist', dept: 'Support', loc: 'Remote (Anywhere)' },
];

const Careers: React.FC = () => {
  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-6">
      <Reveal className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Work at LYNKR</h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
          Join a team of designers and engineers obsessed with quality.
        </p>
      </Reveal>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <Reveal key={index} delay={index * 100} width="100%">
            <div className="group flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-surface border border-white/5 rounded-2xl hover:bg-zinc-900 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-white mb-2">{job.role}</h3>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                   <span className="font-medium text-indigo-400">{job.dept}</span>
                   <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                Apply Now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Careers;