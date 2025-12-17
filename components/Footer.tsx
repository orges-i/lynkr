import React from 'react';
import { Twitter, Instagram, Github, Linkedin, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background pt-24 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* CTA Section */}
        <div className="flex flex-col items-center text-center mb-24 relative isolate">
          {/* Enhanced glow behind CTA for visual impact */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] -z-10"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-primary">Ready to stand out?</h2>
          <p className="text-secondary text-xl mb-10 max-w-2xl">
            Join thousands of creators building their future with LYNKR.
            No credit card required.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="xl" className="min-w-[200px] shadow-lg shadow-indigo-500/20">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-border pt-12">
          <div className="col-span-2 md:col-span-1">
             <Link to="/" className="text-xl font-bold tracking-tight text-primary flex items-center gap-2 mb-4">
               LYNKR
             </Link>
             <p className="text-secondary text-sm">
               The premium link-in-bio tool for those who value craftsmanship.
             </p>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/showcase" className="hover:text-primary transition-colors">Showcase</Link></li>
              <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/legal" className="hover:text-primary transition-colors">Legal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="text-secondary hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-secondary hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary">
          <p>© {currentYear} LYNKR Inc. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <Link to="/legal" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/legal" className="hover:text-primary">Terms of Service</Link>
            <Link to="/superadmin" className="p-2 rounded-full hover:bg-surfaceHighlight text-secondary hover:text-primary transition-colors" title="Admin Access">
               <Shield className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;