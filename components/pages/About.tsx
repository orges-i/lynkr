import React from 'react';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-20">
       {/* Hero */}
       <div className="max-w-7xl mx-auto px-6 mb-24">
          <Reveal>
             <h1 className="text-5xl md:text-7xl font-bold mb-8">We are building the <br/> future of identity.</h1>
             <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed">
               LYNKR was born from a simple observation: content creators are the new media companies, 
               but their tools are stuck in 2015. We're here to change that with design-first software.
             </p>
          </Reveal>
       </div>

       {/* Image */}
       <Reveal width="100%" className="mb-24">
         <div className="w-full h-[400px] md:h-[600px] bg-zinc-900 relative overflow-hidden">
            <img src="https://picsum.photos/1920/800?grayscale" alt="Office" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
         </div>
       </Reveal>

       {/* Values */}
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {[
            { title: 'Craftsmanship', desc: 'We sweat the small details. If it isn\'t pixel-perfect, it doesn\'t ship.' },
            { title: 'Simplicity', desc: 'Complexity is failure. We build tools that feel invisible.' },
            { title: 'Creator First', desc: 'We only succeed when our users succeed. Their brand always comes before ours.' }
          ].map((v, i) => (
             <Reveal key={i} delay={i * 100}>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{v.desc}</p>
             </Reveal>
          ))}
       </div>

       {/* CTA */}
       <div className="max-w-7xl mx-auto px-6 text-center bg-surface border border-white/5 rounded-3xl p-12 md:p-24">
          <Reveal>
             <h2 className="text-3xl font-bold mb-6">Want to help us build?</h2>
             <p className="text-zinc-400 mb-8 max-w-xl mx-auto">We are a small, remote-first team funded by the world's best investors. Check out our open roles.</p>
             <Button>View Careers</Button>
          </Reveal>
       </div>
    </div>
  );
};

export default About;