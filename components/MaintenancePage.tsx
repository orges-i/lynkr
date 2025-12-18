import React from 'react';
const MaintenancePage: React.FC<{ loading?: boolean }> = ({ loading }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center bg-surface border border-border rounded-3xl p-10 shadow-2xl">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-2xl mb-6">
          {loading ? '…' : '🛠️'}
        </div>
        <h1 className="text-2xl font-bold mb-3">
          {loading ? 'Checking system status…' : 'We’re doing a quick upgrade'}
        </h1>
        <p className="text-secondary mb-6">
          {loading
            ? 'Hang tight while we load the latest settings.'
            : 'Maintenance mode is enabled. Only admins can access the app right now.'}
        </p>
        {!loading && (
          <div className="flex items-center justify-center gap-3 text-sm text-secondary">
            <span>Need help?</span>
            <a
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-surfaceHighlight text-primary border border-border hover:border-primary/40 transition-colors"
              href="mailto:admin@lynkr.com"
            >
              Contact Admin
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
