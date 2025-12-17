import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  LogOut, 
  Search, 
  Check, 
  Trash2, 
  Ban, 
  Save, 
  LayoutGrid, 
  Gem, 
  Sliders, 
  Sun, 
  Moon, 
  Download, 
  TrendingUp, 
  Activity, 
  CreditCard, 
  Globe, 
  FileText,
  Lock,
  Bell,
  Zap,
  Banknote,
  Fingerprint,
  HardDrive,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Bug,
  FileDown,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  PieChart,
  Home,
  X,
  FileJson,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { Button } from '../ui/Button';
import { usePricing, Plan } from '../../context/PricingContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// -- Types --
interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Pro' | 'Agency';
  status: 'Active' | 'Inactive';
  joined: string;
}

interface BugTicket {
  id: string;
  title: string;
  description: string; // Added description
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

type TabType = 'users' | 'pricing' | 'analytics' | 'settings' | 'reports' | 'bugs';

// -- Mock Data --
const mockUsers: AdminUser[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?u=1', plan: 'Pro', status: 'Active', joined: 'Oct 12, 2023' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@skynet.com', avatar: 'https://i.pravatar.cc/150?u=2', plan: 'Agency', status: 'Active', joined: 'Nov 01, 2023' },
  { id: '3', name: 'John Doe', email: 'john@doe.com', avatar: 'https://i.pravatar.cc/150?u=3', plan: 'Free', status: 'Inactive', joined: 'Jan 15, 2024' },
  { id: '4', name: 'Emily Chen', email: 'emily@design.co', avatar: 'https://i.pravatar.cc/150?u=4', plan: 'Pro', status: 'Active', joined: 'Feb 20, 2024' },
  { id: '5', name: 'Michael Scott', email: 'michael@dunder.com', avatar: 'https://i.pravatar.cc/150?u=5', plan: 'Free', status: 'Active', joined: 'Mar 10, 2024' },
];

const mockTicketsData: BugTicket[] = [
  { id: 'BUG-1042', title: 'Payment gateway timeout on checkout', description: 'Users reporting 504 errors when using Stripe in EU region.', priority: 'Critical', status: 'In Progress', date: 'Oct 24, 2023' },
  { id: 'BUG-1041', title: 'Dark mode flickering on Safari', description: 'Header blinks white on page load when system theme is dark.', priority: 'Medium', status: 'Open', date: 'Oct 23, 2023' },
  { id: 'BUG-1039', title: 'Typo in pricing page', description: 'It says "Unlimted" instead of "Unlimited" on the Pro plan card.', priority: 'Low', status: 'Resolved', date: 'Oct 20, 2023' },
];

// -- Sub-Components --

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-500 text-xs font-bold uppercase tracking-wider">Live Data</span>
           </div>
           <h2 className="text-3xl md:text-4xl font-bold mb-2">Platform Overview</h2>
           <p className="text-secondary">Real-time insights into platform performance.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex border-dashed">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         {[
           { 
             label: 'Total Revenue', 
             value: '$45,231', 
             change: '+20.1%', 
             icon: Banknote, 
             gradient: 'from-emerald-500/20 to-green-600/20',
             textCol: 'text-emerald-500',
             border: 'border-emerald-500/20'
           },
           { 
             label: 'Active Subs', 
             value: '2,350', 
             change: '+15.2%', 
             icon: Zap, 
             gradient: 'from-amber-500/20 to-orange-600/20',
             textCol: 'text-amber-500',
             border: 'border-amber-500/20'
           },
           { 
             label: 'Total Users', 
             value: '12,450', 
             change: '+8.4%', 
             icon: Users, 
             gradient: 'from-blue-500/20 to-indigo-600/20',
             textCol: 'text-blue-500',
             border: 'border-blue-500/20'
           },
           { 
             label: 'Page Views', 
             value: '1.2M', 
             change: '+42.3%', 
             icon: Activity, 
             gradient: 'from-purple-500/20 to-pink-600/20',
             textCol: 'text-purple-500',
             border: 'border-purple-500/20'
           },
         ].map((stat, i) => (
           <div key={i} className="group bg-surface border border-border p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-32 rounded-full bg-gradient-to-br ${stat.gradient} blur-3xl opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-6 relative">
                 <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} ${stat.textCol} border ${stat.border}`}>
                    <stat.icon className="w-6 h-6" />
                 </div>
                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${stat.textCol} bg-surfaceHighlight border border-border`}>
                    <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
                 </span>
              </div>
              <div className="relative">
                <h3 className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-sm text-secondary font-medium">{stat.label}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xl font-bold">Revenue Growth</h3>
                <select className="bg-surfaceHighlight border border-border rounded-lg text-xs px-3 py-1.5 outline-none text-secondary">
                    <option>This Year</option>
                    <option>Last Year</option>
                </select>
            </div>
            
            {/* Scrollable container for mobile swipe */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
               <div className="h-72 min-w-[600px] flex items-end justify-between gap-3 relative z-10">
                  {[40, 60, 45, 70, 65, 85, 80, 95, 75, 90, 85, 100].map((h, i) => (
                     <div key={i} className="w-full h-full flex flex-col justify-end group cursor-pointer">
                        <div 
                           className="w-full bg-gradient-to-t from-indigo-600/80 to-violet-500 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-purple-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                           style={{ height: `${h}%` }}
                        ></div>
                     </div>
                  ))}
               </div>
               
               <div className="flex justify-between text-xs font-medium text-secondary mt-6 pt-4 border-t border-border min-w-[600px]">
                  <span className="truncate w-full text-center">Jan</span>
                  <span className="truncate w-full text-center">Feb</span>
                  <span className="truncate w-full text-center">Mar</span>
                  <span className="truncate w-full text-center">Apr</span>
                  <span className="truncate w-full text-center">May</span>
                  <span className="truncate w-full text-center">Jun</span>
                  <span className="truncate w-full text-center">Jul</span>
                  <span className="truncate w-full text-center">Aug</span>
                  <span className="truncate w-full text-center">Sep</span>
                  <span className="truncate w-full text-center">Oct</span>
                  <span className="truncate w-full text-center">Nov</span>
                  <span className="truncate w-full text-center">Dec</span>
               </div>
            </div>

            {/* Grid Lines - Fixed background */}
            <div className="absolute inset-0 top-24 px-8 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-border border-t border-dashed"></div>
                <div className="w-full h-px bg-border border-t border-dashed"></div>
                <div className="w-full h-px bg-border border-t border-dashed"></div>
                <div className="w-full h-px bg-border border-t border-dashed"></div>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 relative z-10">Recent Activity</h3>
            <div className="space-y-6 overflow-y-auto flex-1 pr-2 relative z-10">
               {[
                 { user: 'Sarah Connor', action: 'Upgraded to Agency', time: '2m ago', icon: Gem, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                 { user: 'John Doe', action: 'Created new account', time: '15m ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                 { user: 'Emily Chen', action: 'Downgraded plan', time: '1h ago', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                 { user: 'Mike Ross', action: 'Reported an issue', time: '3h ago', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
                 { user: 'Alex Rivera', action: 'Logged in', time: '5h ago', icon: Lock, color: 'text-green-500', bg: 'bg-green-500/10' },
               ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                     <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0 border border-transparent group-hover:border-${item.color.split('-')[1]}-500/30 transition-colors`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-primary">{item.user}</p>
                        <p className="text-xs text-secondary mt-0.5">{item.action}</p>
                        <p className="text-[10px] text-secondary/50 mt-1 font-mono">{item.time}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
   const [users, setUsers] = useState<AdminUser[]>(mockUsers);
   const [searchTerm, setSearchTerm] = useState('');

   const toggleStatus = (id: string) => {
      setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
   };

   const deleteUser = (id: string) => {
      if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
         setUsers(users.filter(u => u.id !== id));
      }
   };

   const exportCSV = () => {
      const headers = ["ID", "Name", "Email", "Plan", "Status", "Joined"];
      const rows = users.map(u => [u.id, u.name, u.email, u.plan, u.status, u.joined]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "lynkr_users_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

   return (
      <div className="max-w-7xl mx-auto animate-fade-in pb-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
               <h2 className="text-3xl font-bold mb-1">User Management</h2>
               <p className="text-secondary">Manage access and account status.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative group w-full sm:w-auto">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-indigo-500 transition-colors" />
                   <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none w-full sm:w-64 transition-all shadow-sm"
                   />
                </div>
                <Button variant="outline" size="md" className="gap-2 border-dashed w-full sm:w-auto" onClick={exportCSV}>
                   <FileText className="w-4 h-4" /> Export CSV
                </Button>
            </div>
         </div>

         <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="bg-surfaceHighlight/50 border-b border-border text-left text-xs font-bold text-secondary uppercase tracking-wider">
                        <th className="px-8 py-5">User Profile</th>
                        <th className="px-6 py-5">Status</th>
                        <th className="px-6 py-5">Current Plan</th>
                        <th className="px-6 py-5">Joined Date</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-surfaceHighlight/30 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500">
                                     <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-surface" />
                                 </div>
                                 <div>
                                    <div className="font-bold text-primary text-sm">{user.name}</div>
                                    <div className="text-xs text-secondary">{user.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                 user.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                 {user.status}
                              </span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                  {user.plan === 'Agency' && <Gem className="w-3.5 h-3.5 text-purple-500" />}
                                  {user.plan === 'Pro' && <Zap className="w-3.5 h-3.5 text-indigo-500" />}
                                  <span className="text-sm font-medium">{user.plan}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-sm text-secondary font-mono">
                              {user.joined}
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                    onClick={() => toggleStatus(user.id)}
                                    className="p-2 rounded-lg hover:bg-surfaceHighlight text-secondary hover:text-orange-500 transition-colors border border-transparent hover:border-border" 
                                    title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                 >
                                    {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                 </button>
                                 <button 
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                                    title="Delete User"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden">
               {filteredUsers.map(user => (
                  <div key={user.id} className="p-4 border-b border-border last:border-0 flex flex-col gap-4">
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-surface" />
                           </div>
                           <div>
                              <div className="font-bold text-sm text-primary">{user.name}</div>
                              <div className="text-xs text-secondary">{user.email}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 bg-surfaceHighlight px-2 py-1 rounded-lg border border-border">
                           {user.plan === 'Agency' && <Gem className="w-3 h-3 text-purple-500" />}
                           {user.plan === 'Pro' && <Zap className="w-3 h-3 text-indigo-500" />}
                           <span className="text-xs font-bold">{user.plan}</span>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                           user.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                           {user.status}
                        </span>
                        <span className="text-xs text-secondary font-mono">{user.joined}</span>
                     </div>

                     <div className="flex gap-2 mt-2">
                        <Button 
                           variant="secondary" 
                           size="sm" 
                           className="flex-1 text-xs" 
                           onClick={() => toggleStatus(user.id)}
                        >
                           {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <button 
                           onClick={() => deleteUser(user.id)}
                           className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const PricingEditor: React.FC<{ plan: Plan; onSave: (p: Plan) => void }> = ({ plan, onSave }) => {
   // ... (No Changes)
   const [editedPlan, setEditedPlan] = useState<Plan>(plan);
   const [isDirty, setIsDirty] = useState(false);

   const handleChange = (field: keyof Plan, value: any) => {
      setEditedPlan({ ...editedPlan, [field]: value });
      setIsDirty(true);
   };

   const handleFeatureChange = (index: number, value: string) => {
      const newFeatures = [...editedPlan.features];
      newFeatures[index] = value;
      setEditedPlan({ ...editedPlan, features: newFeatures });
      setIsDirty(true);
   };

   const handleSave = () => {
      onSave(editedPlan);
      setIsDirty(false);
   };

   return (
      <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
         {plan.popular && <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-full pointer-events-none"></div>}
         
         <div className="flex justify-between items-center mb-8">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${plan.popular ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-surfaceHighlight text-secondary border-border'}`}>
               {editedPlan.name} Tier
            </span>
            {isDirty && <span className="flex items-center text-xs text-orange-500 font-bold animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></div> Unsaved</span>}
         </div>

         <div className="space-y-6 flex-1">
            <div className="group">
               <label className="text-xs font-bold text-secondary uppercase mb-2 block">Plan Name</label>
               <input 
                  type="text" 
                  value={editedPlan.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
               />
            </div>
            <div className="flex gap-4">
               <div className="flex-1">
                  <label className="text-xs font-bold text-secondary uppercase mb-2 block">Price</label>
                  <input 
                     type="text" 
                     value={editedPlan.price}
                     onChange={e => handleChange('price', e.target.value)}
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold text-lg"
                  />
               </div>
               <div className="flex-1">
                   <label className="text-xs font-bold text-secondary uppercase mb-2 block">Period</label>
                   <input 
                     type="text" 
                     value={editedPlan.period}
                     onChange={e => handleChange('period', e.target.value)}
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                  />
               </div>
            </div>
            <div>
               <label className="text-xs font-bold text-secondary uppercase mb-2 block">Description</label>
               <textarea 
                  value={editedPlan.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none resize-none"
                  rows={2}
               />
            </div>

            <div>
               <label className="text-xs font-bold text-secondary uppercase mb-3 block">Features</label>
               <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {editedPlan.features.map((feat, i) => (
                     <div key={i} className="flex gap-3 items-center group">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <input 
                           type="text" 
                           value={feat}
                           onChange={e => handleFeatureChange(i, e.target.value)}
                           className="w-full bg-transparent border-b border-border border-dashed text-sm pb-1 focus:border-indigo-500 focus:border-solid outline-none transition-all"
                        />
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="pt-8 mt-8 border-t border-border">
            <Button 
               className="w-full gap-2 py-6 text-base" 
               variant={isDirty ? 'primary' : 'secondary'} 
               onClick={handleSave}
               disabled={!isDirty}
            >
               <Save className="w-4 h-4" /> {isDirty ? 'Save Changes' : 'Saved'}
            </Button>
         </div>
      </div>
   );
};

const PricingManagement: React.FC = () => {
    // ... (No Changes)
   const { plans, updatePlan } = usePricing();

   return (
      <div className="max-w-7xl mx-auto animate-fade-in pb-12">
         <div className="mb-10">
            <h2 className="text-3xl font-bold mb-1">Pricing Plans</h2>
            <p className="text-secondary">Update pricing, features, and descriptions live.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
               <PricingEditor key={index} plan={plan} onSave={(updated) => updatePlan(index, updated)} />
            ))}
         </div>
      </div>
   );
};

const AdminSettings: React.FC = () => {
    // ... (No Changes)
   const [maintenanceMode, setMaintenanceMode] = useState(false);
   const [registrations, setRegistrations] = useState(true);

   return (
      <div className="max-w-5xl mx-auto animate-fade-in pb-12">
         <div className="mb-10">
            <h2 className="text-3xl font-bold mb-1">System Settings</h2>
            <p className="text-secondary">Configure global platform parameters.</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface border border-border rounded-3xl p-8 lg:col-span-2">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><Globe className="w-5 h-5" /></div>
                  Platform Controls
               </h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background/50">
                     <div className="pr-4">
                        <p className="font-bold mb-1">Maintenance Mode</p>
                        <p className="text-xs text-secondary leading-relaxed">Disable access for all users except admins. Useful for updates.</p>
                     </div>
                     <button 
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative shrink-0 ${maintenanceMode ? 'bg-indigo-500 shadow-inner' : 'bg-surfaceHighlight border border-border'}`}
                     >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background/50">
                     <div className="pr-4">
                        <p className="font-bold mb-1">New Registrations</p>
                        <p className="text-xs text-secondary leading-relaxed">Allow new users to create accounts on the platform.</p>
                     </div>
                     <button 
                        onClick={() => setRegistrations(!registrations)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative shrink-0 ${registrations ? 'bg-green-500 shadow-inner' : 'bg-surfaceHighlight border border-border'}`}
                     >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${registrations ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2.5">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Fingerprint className="w-5 h-5" /></div>
                  Security
               </h3>
               <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-2xl hover:border-purple-500/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-surfaceHighlight rounded-lg text-secondary group-hover:text-purple-500 transition-colors"><Shield className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-bold">Admin 2FA</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider mt-0.5">Enabled</p>
                         </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-secondary" />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-background/50 border border-border rounded-2xl hover:border-purple-500/30 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-surfaceHighlight rounded-lg text-secondary group-hover:text-purple-500 transition-colors"><Bell className="w-5 h-5" /></div>
                         <div>
                            <p className="text-sm font-bold">Login Alerts</p>
                            <p className="text-xs text-secondary mt-0.5">Notify on new IP</p>
                         </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-secondary" />
                   </div>
               </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-8">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2.5">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><HardDrive className="w-5 h-5" /></div>
                  Data & Logs
               </h3>
               <div className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col justify-between h-[160px]">
                   <div>
                      <p className="text-sm font-bold text-red-500 mb-1">Flush System Cache</p>
                      <p className="text-xs text-red-500/70 leading-relaxed">Clear all temporary server-side caches and logs. Use this if users report outdated content.</p>
                   </div>
                   <Button size="sm" className="bg-red-500 text-white hover:bg-red-600 border-none w-full shadow-lg shadow-red-500/20">
                     <Trash2 className="w-4 h-4 mr-2" /> Clear Cache
                   </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

const ReportsCenter: React.FC = () => {
   const [selectedReport, setSelectedReport] = useState<any>(null);

   const handleDownload = (type: 'CSV' | 'PDF' | 'JSON') => {
      alert(`Downloading ${selectedReport.title} as ${type}...`);
      setSelectedReport(null);
   };

   return (
      <div className="max-w-5xl mx-auto animate-fade-in pb-12 relative">
         <div className="mb-10">
            <h2 className="text-3xl font-bold mb-1">Reports Center</h2>
            <p className="text-secondary">Download system logs and performance reports.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
               { title: 'Monthly Revenue Report', date: 'Oct 2023', size: '2.4 MB', type: 'PDF' },
               { title: 'User Churn Analysis', date: 'Q3 2023', size: '1.1 MB', type: 'CSV' },
               { title: 'System Error Logs', date: 'Last 7 Days', size: '45.2 MB', type: 'JSON' },
               { title: 'Platform Usage Stats', date: 'Sep 2023', size: '8.5 MB', type: 'PDF' },
            ].map((report, i) => (
               <div key={i} className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-surfaceHighlight rounded-xl text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <FileText className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="font-bold text-primary">{report.title}</h3>
                        <p className="text-xs text-secondary">{report.date} • {report.size}</p>
                     </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-dashed" onClick={() => setSelectedReport(report)}>
                     <Download className="w-4 h-4" />
                  </Button>
               </div>
            ))}
         </div>

         {/* Download Modal */}
         {selectedReport && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedReport(null)}></div>
               <div className="bg-surface border border-border rounded-3xl p-8 w-full max-w-md relative z-10 animate-fade-in shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold">Download Report</h3>
                     <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-secondary mb-8">Choose a format for <strong>{selectedReport.title}</strong>.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                     <button onClick={() => handleDownload('CSV')} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-green-500/50 hover:bg-green-500/5 transition-all group text-left">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg group-hover:scale-110 transition-transform"><FileSpreadsheet className="w-5 h-5" /></div>
                        <div>
                           <p className="font-bold">CSV Format</p>
                           <p className="text-xs text-secondary">Best for Excel/Sheets</p>
                        </div>
                     </button>
                     <button onClick={() => handleDownload('PDF')} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-red-500/50 hover:bg-red-500/5 transition-all group text-left">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:scale-110 transition-transform"><File className="w-5 h-5" /></div>
                         <div>
                           <p className="font-bold">PDF Document</p>
                           <p className="text-xs text-secondary">Best for presentation</p>
                        </div>
                     </button>
                     <button onClick={() => handleDownload('JSON')} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group text-left">
                         <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg group-hover:scale-110 transition-transform"><FileJson className="w-5 h-5" /></div>
                         <div>
                           <p className="font-bold">JSON Data</p>
                           <p className="text-xs text-secondary">Best for programmatic use</p>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const BugTracker: React.FC = () => {
   const [tickets, setTickets] = useState(mockTicketsData);
   const [selectedTicket, setSelectedTicket] = useState<BugTicket | null>(null);

   const handleSaveTicket = (updatedTicket: BugTicket) => {
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      setSelectedTicket(null);
   };

   return (
      <div className="max-w-7xl mx-auto animate-fade-in pb-12 relative">
         <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl font-bold mb-1">Feature Requests & Bugs</h2>
               <p className="text-secondary">Track user reported issues and feedback.</p>
            </div>
            {/* Mobile optimized button */}
            <Button className="shrink-0 p-3 sm:px-6 sm:py-3 h-auto">
               <Bug className="w-5 h-5 sm:mr-2" /> 
               <span className="hidden sm:inline">Report Issue</span>
            </Button>
         </div>

         <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
               <table className="w-full min-w-[700px]">
                  <thead>
                     <tr className="bg-surfaceHighlight/50 border-b border-border text-left text-xs font-bold text-secondary uppercase tracking-wider">
                        <th className="px-6 py-4">Ticket ID</th>
                        <th className="px-6 py-4">Issue Title</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {tickets.map((ticket) => (
                        <tr 
                           key={ticket.id} 
                           className="hover:bg-surfaceHighlight/30 transition-colors cursor-pointer"
                           onClick={() => setSelectedTicket(ticket)}
                        >
                           <td className="px-6 py-4 font-mono text-sm text-secondary">{ticket.id}</td>
                           <td className="px-6 py-4 font-medium text-primary">{ticket.title}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                 ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-500' :
                                 ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-500' :
                                 ticket.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                 'bg-green-500/10 text-green-500'
                              }`}>
                                 {ticket.priority}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-sm font-medium">{ticket.status}</span>
                           </td>
                           <td className="px-6 py-4 text-right text-sm text-secondary">{ticket.date}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Ticket Edit Modal */}
         {selectedTicket && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}></div>
               <div className="bg-surface border border-border rounded-3xl p-8 w-full max-w-lg relative z-10 animate-fade-in shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                     <div>
                        <div className="text-xs font-mono text-secondary mb-1">{selectedTicket.id}</div>
                        <h3 className="text-xl font-bold">Edit Ticket</h3>
                     </div>
                     <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                     <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-2 block">Title</label>
                        <input 
                           type="text" 
                           value={selectedTicket.title}
                           onChange={(e) => setSelectedTicket({...selectedTicket, title: e.target.value})}
                           className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-2 block">Description</label>
                        <textarea 
                           rows={4}
                           value={selectedTicket.description}
                           onChange={(e) => setSelectedTicket({...selectedTicket, description: e.target.value})}
                           className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none resize-none"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-secondary uppercase mb-2 block">Priority</label>
                           <select 
                              value={selectedTicket.priority}
                              onChange={(e) => setSelectedTicket({...selectedTicket, priority: e.target.value as any})}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                           >
                              <option>Low</option>
                              <option>Medium</option>
                              <option>High</option>
                              <option>Critical</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-secondary uppercase mb-2 block">Status</label>
                           <select 
                              value={selectedTicket.status}
                              onChange={(e) => setSelectedTicket({...selectedTicket, status: e.target.value as any})}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                           >
                              <option>Open</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                     <Button onClick={() => handleSaveTicket(selectedTicket)}>Save Changes</Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const SuperAdmin: React.FC = () => {
    // ... (No Changes)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const { theme, toggleTheme } = useTheme();

  // Login State - Pre-filled
  const [email, setEmail] = useState('admin@lynkr.com');
  const [password, setPassword] = useState('password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-300">
         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
         
         <div className="w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-2xl relative z-10 animate-fade-in backdrop-blur-sm">
            <div className="flex justify-center mb-6">
               <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl shadow-lg flex items-center justify-center transform rotate-3">
                  <Shield className="w-10 h-10 text-white" />
               </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">Super Admin</h1>
            <p className="text-secondary text-center mb-8">Restricted access area. Authorized personnel only.</p>

            <form onSubmit={handleLogin} className="space-y-4">
               <div>
                  <label className="text-xs font-bold uppercase text-secondary tracking-wider mb-1 block">Admin Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-primary shadow-sm"
                    placeholder="admin@lynkr.com"
                  />
               </div>
               <div>
                  <label className="text-xs font-bold uppercase text-secondary tracking-wider mb-1 block">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-primary shadow-sm"
                    placeholder="••••••••"
                  />
               </div>
               <Button className="w-full py-7 mt-4 text-lg shadow-indigo-500/25 shadow-lg" type="submit">
                 Authenticate Access
               </Button>
            </form>
            <div className="mt-8 text-center">
               <Link to="/" className="text-sm text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2">
                 <LogOut className="w-4 h-4" /> Return to Site
               </Link>
            </div>
         </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'analytics': return <AnalyticsDashboard />;
      case 'users': return <UserManagement />;
      case 'pricing': return <PricingManagement />;
      case 'settings': return <AdminSettings />;
      case 'reports': return <ReportsCenter />;
      case 'bugs': return <BugTracker />;
      default: return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex transition-colors duration-300 font-sans selection:bg-indigo-500/30">
       {/* Admin Sidebar */}
       <aside className="w-20 lg:w-72 border-r border-border flex flex-col bg-surface fixed h-full z-20 transition-all duration-300">
          <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-border">
             <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div className="ml-3 hidden lg:block">
                <span className="font-bold text-xl tracking-tight block leading-none">LYNKR</span>
                <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">Admin</span>
             </div>
          </div>
          
          <nav className="flex-1 py-8 space-y-2 px-4">
             {[
               { id: 'analytics', icon: LayoutGrid, label: 'Overview' },
               { id: 'users', icon: Users, label: 'User Management' },
               { id: 'pricing', icon: Gem, label: 'Pricing Plans' },
               { id: 'reports', icon: FileDown, label: 'Reports & Data' },
               { id: 'bugs', icon: Bug, label: 'Requests & Bugs' },
               { id: 'settings', icon: Sliders, label: 'Settings' },
             ].map((item) => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    activeTab === item.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20' 
                    : 'text-secondary hover:bg-surfaceHighlight hover:text-primary'
                  }`}
               >
                  <item.icon className={`w-5 h-5 lg:mr-3 mx-auto lg:mx-0 relative z-10 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden lg:block font-medium relative z-10">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-shimmer"></div>
                  )}
               </button>
             ))}
          </nav>

          <div className="p-4 border-t border-border space-y-3">
             <Link to="/" className="w-full flex items-center justify-center lg:justify-start p-3.5 text-secondary hover:bg-surfaceHighlight hover:text-primary rounded-xl transition-colors border border-transparent hover:border-border">
                <Home className="w-5 h-5 lg:mr-3" />
                <span className="hidden lg:block font-medium">Back to Home</span>
             </Link>
             <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-center lg:justify-start p-3.5 text-secondary hover:bg-surfaceHighlight hover:text-primary rounded-xl transition-colors border border-transparent hover:border-border"
             >
                {theme === 'dark' ? <Sun className="w-5 h-5 lg:mr-3" /> : <Moon className="w-5 h-5 lg:mr-3" />}
                <span className="hidden lg:block font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
             </button>
             <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center lg:justify-start p-3.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                <LogOut className="w-5 h-5 lg:mr-3" />
                <span className="hidden lg:block font-medium">Logout</span>
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 ml-20 lg:ml-72 p-6 lg:p-12 overflow-y-auto bg-background/50">
          {renderContent()}
       </main>
    </div>
  );
};

export default SuperAdmin;