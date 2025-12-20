import React, { useEffect, useState } from 'react';
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
   Sparkles,
   ChevronRight,
   AlertTriangle,
   Bug,
   FileDown,
   ClipboardList,
   AlertCircle,
   CheckCircle2,
   PieChart,
   Eye,
   Home,
   X,
   FileJson,
   FileSpreadsheet,
   File,
   Link2,
   Menu
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Button } from '../ui/Button';
import { usePricing, Plan } from '../../context/PricingContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import {
   fetchProfilesForAdmin,
   fetchPageViewsCount,
   fetchRecentLinks,
   fetchRecentProfiles,
   fetchTickets,
   createTicket,
   updateTicket,
   Ticket,
   fetchLinksForAdmin,
   updateUserPlan,
   setUserStatus,
   deleteUserWithData,
    fetchUserDetails,
    fetchAdminMetricDeltas
} from '../../lib/supabaseHelpers';

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

type ActivityKind = 'profile' | 'link';

interface ActivityItem {
   id: string;
   title: string;
   subtitle: string;
   time: string;
   kind: ActivityKind;
}

interface AdminMetrics {
   revenue: string;
   activeSubs: number;
   totalUsers: number;
   pageViews: number;
   revenueChange?: string;
   subsChange?: string;
   usersChange?: string;
   viewsChange?: string;
}

const formatRelativeTime = (isoDate: string) => {
   const date = new Date(isoDate);
   const now = new Date();
   const diff = Math.max(0, now.getTime() - date.getTime());

   const minutes = Math.floor(diff / (1000 * 60));
   if (minutes < 1) return 'just now';
   if (minutes < 60) return `${minutes}m ago`;

   const hours = Math.floor(minutes / 60);
   if (hours < 24) return `${hours}h ago`;

   const days = Math.floor(hours / 24);
   if (days < 7) return `${days}d ago`;

   return date.toLocaleDateString();
};

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

const AnalyticsDashboard: React.FC<{ metrics?: AdminMetrics; activity: ActivityItem[]; loading: boolean; onExport?: () => void; }> = ({ metrics, activity, loading, onExport }) => {
   const safeMetrics: AdminMetrics = metrics || { revenue: '$0', activeSubs: 0, totalUsers: 0, pageViews: 0, revenueChange: '+0%', subsChange: '+0%', usersChange: '+0%', viewsChange: '+0%' };
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
            <Button variant="outline" size="sm" className="hidden sm:flex border-dashed" onClick={onExport}>
               <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
               {
                  label: 'Total Revenue',
                  value: loading ? '-' : safeMetrics.revenue,
                  change: safeMetrics.revenueChange || '+0%',
                  icon: Banknote,
                  gradient: 'from-emerald-500/20 to-green-600/20',
                  textCol: 'text-emerald-500',
                  border: 'border-emerald-500/20'
               },
               {
                  label: 'Active Subs',
                  value: loading ? '-' : safeMetrics.activeSubs.toLocaleString(),
                  change: safeMetrics.subsChange || '+0%',
                  icon: Zap,
                  gradient: 'from-amber-500/20 to-orange-600/20',
                  textCol: 'text-amber-500',
                  border: 'border-amber-500/20'
               },
               {
                  label: 'Total Users',
                  value: loading ? '-' : safeMetrics.totalUsers.toLocaleString(),
                  change: safeMetrics.usersChange || '+0%',
                  icon: Users,
                  gradient: 'from-blue-500/20 to-indigo-600/20',
                  textCol: 'text-blue-500',
                  border: 'border-blue-500/20'
               },
               {
                  label: 'Page Views',
                  value: loading ? '-' : safeMetrics.pageViews.toLocaleString(),
                  change: safeMetrics.viewsChange || '+0%',
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
                     {loading ? (
                        <div className="w-24 h-6 rounded-md bg-white/10 animate-pulse mb-2" />
                     ) : (
                        <h3 className="text-3xl font-bold mb-1 tracking-tight">{stat.value}</h3>
                     )}
                     <p className="text-sm text-secondary font-medium">{stat.label}</p>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-8 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-center mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                     <h3 className="text-xl font-bold">Revenue Growth</h3>
                     <span className="text-[10px] uppercase font-bold bg-surfaceHighlight px-2 py-1 rounded-full border border-border text-secondary">Sample data</span>
                  </div>
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
                  {activity.length === 0 && !loading && (
                     <p className="text-secondary text-sm">No recent activity yet.</p>
                  )}
                  {activity.map((item) => {
                     const isProfile = item.kind === 'profile';
                     const color = isProfile ? 'text-blue-500' : 'text-purple-500';
                     const bg = isProfile ? 'bg-blue-500/10' : 'bg-purple-500/10';
                     const IconComp = isProfile ? Users : Link2;
                     return (
                        <div key={item.id} className="flex items-start gap-4 group">
                           <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0 border border-transparent transition-colors`}>
                              <IconComp className={`w-4 h-4 ${color}`} />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-primary">{item.title}</p>
                              <p className="text-xs text-secondary mt-0.5">{item.subtitle}</p>
                              <p className="text-[10px] text-secondary/50 mt-1 font-mono">{formatRelativeTime(item.time)}</p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>
   );
};

const UserManagement: React.FC<{
   users: AdminUser[];
   loading: boolean;
   onToggleStatus: (id: string, next: 'Active' | 'Inactive') => Promise<void>;
   onDeleteUser: (id: string) => Promise<void>;
   onChangePlan: (id: string, plan: 'Free' | 'Pro' | 'Agency') => Promise<void>;
   onViewUser: (id: string) => void;
}> = ({ users, loading, onToggleStatus, onDeleteUser, onChangePlan, onViewUser }) => {
   const [localUsers, setLocalUsers] = useState<AdminUser[]>(users);
   const [searchTerm, setSearchTerm] = useState('');
   const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

   useEffect(() => {
      setLocalUsers(users);
   }, [users]);

   const toggleStatus = async (id: string) => {
      const current = localUsers.find(u => u.id === id)?.status || 'Inactive';
      const next = current === 'Active' ? 'Inactive' : 'Active';
      setLocalUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
      await onToggleStatus(id, next);
   };

   const deleteUser = async (id: string) => {
      const target = localUsers.find(u => u.id === id);
      if (target) setConfirmDelete({ id, name: target.name });
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

   const filteredUsers = localUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

   return (
      <>
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
                     id="admin-search-users"
                     name="admin-search-users"
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

         {loading && (
            <div className="bg-surface border border-border rounded-3xl p-6 mb-6 text-secondary">
               Loading users...
            </div>
         )}

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
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${user.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                 }`}>
                                 <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                 {user.status}
                              </span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                 <select
                                    value={user.plan}
                                    onChange={(e) => onChangePlan(user.id, e.target.value as 'Free' | 'Pro' | 'Agency')}
                                    className="bg-surfaceHighlight border border-border rounded-lg text-xs px-3 py-1.5 outline-none text-primary"
                                 >
                                    <option>Free</option>
                                    <option>Pro</option>
                                    <option>Agency</option>
                                 </select>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-sm text-secondary font-mono">
                              {user.joined}
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={() => onViewUser(user.id)}
                                    className="p-2 rounded-lg hover:bg-surfaceHighlight text-secondary hover:text-indigo-500 transition-colors border border-transparent hover:border-border"
                                    title="View details"
                                 >
                                    <Eye className="w-4 h-4" />
                                 </button>
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
                           <select
                              value={user.plan}
                              onChange={(e) => onChangePlan(user.id, e.target.value as 'Free' | 'Pro' | 'Agency')}
                              className="bg-transparent text-xs font-bold outline-none"
                           >
                              <option>Free</option>
                              <option>Pro</option>
                              <option>Agency</option>
                           </select>
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                           }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                           {user.status}
                        </span>
                        <span className="text-xs text-secondary font-mono">{user.joined}</span>
                     </div>

                     <div className="flex gap-2 mt-2">
                        <Button
                           variant="outline"
                           size="sm"
                           className="flex-1 text-xs"
                           onClick={() => onViewUser(user.id)}
                        >
                           View
                        </Button>
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
      {confirmDelete && (
         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl w-full max-w-md p-6 relative">
               <button className="absolute top-3 right-3 text-secondary hover:text-primary" onClick={() => setConfirmDelete(null)}>
                  <X className="w-5 h-5" />
               </button>
               <h3 className="text-lg font-bold mb-2">Delete User</h3>
               <p className="text-sm text-secondary mb-4">Are you sure you want to delete <span className="font-semibold text-primary">{confirmDelete.name}</span>? This action cannot be undone.</p>
               <div className="flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  <Button
                     variant="secondary"
                     size="sm"
                     className="bg-red-500 text-white border-red-500 hover:bg-red-600"
                     onClick={async () => {
                        setLocalUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
                        await onDeleteUser(confirmDelete.id);
                        setConfirmDelete(null);
                     }}
                  >
                     Delete
                  </Button>
               </div>
            </div>
         </div>
      )}
      </>
   );
};

const PricingEditor: React.FC<{ plan: Plan; onSave: (p: Plan) => Promise<void> }> = ({ plan, onSave }) => {
   const [editedPlan, setEditedPlan] = useState<Plan>(plan);
   const [isDirty, setIsDirty] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   useEffect(() => {
      setEditedPlan(plan);
      setIsDirty(false);
   }, [plan]);

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

   const handleAddFeature = () => {
      setEditedPlan({ ...editedPlan, features: [...editedPlan.features, ''] });
      setIsDirty(true);
   };

   const handleRemoveFeature = (index: number) => {
      const newFeatures = editedPlan.features.filter((_, i) => i !== index);
      setEditedPlan({ ...editedPlan, features: newFeatures });
      setIsDirty(true);
   };

   const handleSave = async () => {
      try {
         setIsSaving(true);
         await onSave(editedPlan);
         setIsDirty(false);
         toast.success('Plan saved');
      } catch (e: any) {
         toast.error(e?.message || 'Failed to save plan');
      } finally {
         setIsSaving(false);
      }
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
                  id={`plan-name-${editedPlan.id || 'new'}`}
                  name="plan-name"
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
                     id={`plan-price-${editedPlan.id || 'new'}`}
                     name="plan-price"
                     type="text"
                     value={editedPlan.price}
                     onChange={e => handleChange('price', e.target.value)}
                     className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none font-bold text-lg"
                  />
               </div>
               <div className="flex-1">
                  <label className="text-xs font-bold text-secondary uppercase mb-2 block">Period</label>
                  <input
                     id={`plan-period-${editedPlan.id || 'new'}`}
                     name="plan-period"
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
                        <button
                           type="button"
                           onClick={() => handleRemoveFeature(i)}
                           className="text-secondary hover:text-red-500 transition-colors"
                           title="Remove feature"
                        >
                           <X className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
                  <button
                     type="button"
                     onClick={handleAddFeature}
                     className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                  >
                     + Add Feature
                  </button>
                </div>
              </div>
         </div>

         <div className="pt-8 mt-8 border-t border-border">
            <Button
               className="w-full gap-2 py-6 text-base"
               variant={isDirty ? 'primary' : 'secondary'}
               onClick={handleSave}
               disabled={!isDirty || isSaving}
            >
               <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
            </Button>
         </div>
      </div>
   );
};

const PricingManagement: React.FC = () => {
   // ... (No Changes)
   const { plans, updatePlan, refreshPlans } = usePricing();

   useEffect(() => {
      refreshPlans();
   }, [refreshPlans]);

   return (
      <div className="max-w-7xl mx-auto animate-fade-in pb-12">
         <div className="mb-10">
            <h2 className="text-3xl font-bold mb-1">Pricing Plans</h2>
            <p className="text-secondary">Update pricing, features, and descriptions live.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
               <PricingEditor key={plan.id || index} plan={plan} onSave={(updated) => updatePlan(index, updated)} />
            ))}
         </div>
      </div>
   );
};

const AdminSettings: React.FC = () => {
   const { maintenanceMode, registrationsEnabled, saveSettings } = useSettings();
   const [maintenance, setMaintenance] = useState(maintenanceMode);
   const [registrations, setRegistrations] = useState(registrationsEnabled);

   useEffect(() => {
      setMaintenance(maintenanceMode);
   }, [maintenanceMode]);

   useEffect(() => {
      setRegistrations(registrationsEnabled);
   }, [registrationsEnabled]);

   const toggleMaintenance = async () => {
      const next = !maintenance;
      setMaintenance(next);
      const ok = await saveSettings({ maintenance_mode: next });
      if (!ok) {
         toast.error('Failed to update maintenance mode');
         setMaintenance(!next);
      }
   };

   const toggleRegistrations = async () => {
      const next = !registrations;
      setRegistrations(next);
      const ok = await saveSettings({ registrations_enabled: next });
      if (!ok) {
         toast.error('Failed to update registrations');
         setRegistrations(!next);
      }
   };

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
                        onClick={toggleMaintenance}
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
                        onClick={toggleRegistrations}
                       className={`w-14 h-8 rounded-full transition-all duration-300 relative shrink-0 ${registrations ? 'bg-green-500 shadow-inner' : 'bg-surfaceHighlight border border-border'}`}
                    >
                       <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${registrations ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                 </div>
               </div>
            </div>

         </div>
      </div>
   );
};

const ReportsCenter: React.FC<{ users: AdminUser[]; links: any[]; tickets: Ticket[] }> = ({ users, links, tickets }) => {
   const exportCSV = (rows: any[], columns: string[], filename: string) => {
      const header = columns.join(',');
      const body = rows.map(r => columns.map(c => `"${(r[c] ?? '').toString().replace(/\"/g, '""')}"`).join(',')).join('\n');
      const csvContent = [header, body].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
   };

   const exportPDF = async (sections: { title: string; rows: string[][]; headers: string[] }[], filename: string) => {
      const doc = new jsPDF();
      const colWidth = 48;
      const truncate = (text: string, len = 14) => {
         if (!text) return '';
         return text.length > len ? text.slice(0, len) + '...' : text;
      };

      sections.forEach((section, idx) => {
         let y = 12;
         if (idx > 0) doc.addPage();
         doc.setFontSize(14);
         doc.text(section.title, 10, y);
         y += 6;
         doc.setFontSize(9);
         section.headers.forEach((h, i) => doc.text(h, 10 + i * colWidth, y));
         y += 5;
         section.rows.forEach(row => {
            row.forEach((cell, i) => {
               const text = truncate((cell || '').toString());
               doc.text(text, 10 + i * colWidth, y);
            });
            y += 6;
            if (y > 280) {
               doc.addPage();
               y = 12;
            }
         });
      });
      doc.save(filename);
   };

   const handleDownloadUsersCSV = () => {
      const cols = ['id', 'name', 'email', 'plan', 'status', 'joined'];
      exportCSV(users, cols, 'users.csv');
   };
   const handleDownloadLinksCSV = () => {
      const cols = ['id', 'user_id', 'title', 'url', 'active', 'clicks_count'];
      exportCSV(links, cols, 'links.csv');
   };
   const handleDownloadTicketsCSV = () => {
      const cols = ['id', 'title', 'priority', 'status', 'category', 'created_at'];
      exportCSV(tickets, cols, 'tickets.csv');
   };

   const handleDownloadUsersPDF = () => {
      const headers = ['ID', 'Name', 'Email', 'Plan', 'Status'];
      const rows = users.slice(0, 50).map(u => [u.id, u.name, u.email, u.plan, u.status]);
      exportPDF([{ title: 'Users', headers, rows }], 'users.pdf');
   };
   const handleDownloadLinksPDF = () => {
      const headers = ['ID', 'Title', 'URL', 'Clicks'];
      const rows = links.slice(0, 50).map((l: any) => [l.id, l.title, l.url, (l.clicks_count || 0).toString()]);
      exportPDF([{ title: 'Links', headers, rows }], 'links.pdf');
   };
   const handleDownloadTicketsPDF = () => {
      const headers = ['ID', 'Title', 'Priority', 'Status'];
      const rows = tickets.slice(0, 50).map(t => [t.id || '', t.title, t.priority, t.status]);
      exportPDF([{ title: 'Tickets', headers, rows }], 'tickets.pdf');
   };

   return (
      <div className="max-w-5xl mx-auto animate-fade-in pb-12 relative">
         <div className="mb-10 flex items-center justify-between">
            <div>
               <h2 className="text-3xl font-bold mb-1">Reports Center</h2>
               <p className="text-secondary">Download quick exports for users, links, and tickets.</p>
            </div>
            <Button variant="outline" size="sm" className="border-dashed" onClick={handleDownloadUsersPDF}>
               <Download className="w-4 h-4 mr-2" /> Export Summary PDF
            </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-indigo-500" />
                  <div>
                     <h3 className="font-bold text-primary">Users</h3>
                     <p className="text-xs text-secondary">Export user list</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-dashed" onClick={handleDownloadUsersCSV}>CSV</Button>
                  <Button variant="secondary" size="sm" className="flex-1" onClick={handleDownloadUsersPDF}>PDF</Button>
               </div>
            </div>
            <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  <div>
                     <h3 className="font-bold text-primary">Links</h3>
                     <p className="text-xs text-secondary">Export links with clicks</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-dashed" onClick={handleDownloadLinksCSV}>CSV</Button>
                  <Button variant="secondary" size="sm" className="flex-1" onClick={handleDownloadLinksPDF}>PDF</Button>
               </div>
            </div>
            <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <Bug className="w-6 h-6 text-indigo-500" />
                  <div>
                     <h3 className="font-bold text-primary">Tickets</h3>
                     <p className="text-xs text-secondary">Export requests & bugs</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-dashed" onClick={handleDownloadTicketsCSV}>CSV</Button>
                  <Button variant="secondary" size="sm" className="flex-1" onClick={handleDownloadTicketsPDF}>PDF</Button>
               </div>
            </div>
         </div>
      </div>
   );
};

const BugTracker: React.FC = () => {
   const [tickets, setTickets] = useState<Ticket[]>([]);
   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
   const [loading, setLoading] = useState(true);
   const [creating, setCreating] = useState(false);

   const loadTickets = async () => {
      setLoading(true);
      const data = await fetchTickets();
      setTickets(data);
      setLoading(false);
   };

   useEffect(() => {
      loadTickets();
   }, []);

   const handleSaveTicket = async (updatedTicket: Ticket) => {
      setCreating(true);
      const saved = updatedTicket.id
         ? await updateTicket(updatedTicket.id, updatedTicket)
         : await createTicket(updatedTicket);

      if (saved) {
         setSelectedTicket(null);
         await loadTickets();
      }
      setCreating(false);
   };

   const handleQuickUpdate = async (id: string, updates: Partial<Ticket>) => {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)); // optimistic
      await updateTicket(id, updates);
      await loadTickets();
   };

   const handleMarkDone = async (id: string) => {
      await handleQuickUpdate(id, { status: 'closed' });
   };

   const openNewTicket = () => {
      setSelectedTicket({
         title: '',
         description: '',
         priority: 'medium',
         status: 'open',
         category: 'bug'
      });
   };

   return (
      <div className="max-w-7xl mx-auto animate-fade-in pb-12 relative">
         <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl font-bold mb-1">Feature Requests & Bugs</h2>
               <p className="text-secondary">Track user reported issues and feedback.</p>
            </div>
            {/* Mobile optimized button */}
            <Button className="shrink-0 p-3 sm:px-6 sm:py-3 h-auto" onClick={openNewTicket}>
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
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {loading && (
                        <>
                           {[...Array(3)].map((_, i) => (
                              <tr key={i} className="animate-pulse">
                                 <td className="px-6 py-4">
                                    <div className="h-3 w-16 bg-white/10 rounded"></div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="h-3 w-40 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-24 bg-white/5 rounded"></div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="h-5 w-16 bg-white/10 rounded-full"></div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="h-3 w-20 bg-white/10 rounded"></div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="h-3 w-16 bg-white/10 rounded ml-auto"></div>
                                 </td>
                              </tr>
                           ))}
                        </>
                     )}
                     {!loading && tickets.length === 0 && (
                        <tr>
                           <td className="px-6 py-6 text-secondary text-sm" colSpan={5}>No tickets yet. Click “Report Issue” to create one.</td>
                        </tr>
                     )}
                     {!loading && tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').map((ticket) => (
                        <tr
                           key={ticket.id}
                           className="hover:bg-surfaceHighlight/30 transition-colors cursor-pointer"
                           onClick={() => setSelectedTicket(ticket)}
                        >
                           <td className="px-6 py-4 font-mono text-sm text-secondary">{ticket.id?.slice(0,8) || 'NEW'}</td>
                           <td className="px-6 py-4 font-medium text-primary">{ticket.title}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ticket.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                                 ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                                    ticket.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                       'bg-green-500/10 text-green-500'
                                 }`}>
                                 {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-sm font-medium capitalize">{ticket.status.replace('_', ' ')}</span>
                           </td>
                           <td className="px-6 py-4 text-right text-sm text-secondary flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                              <button
                                 className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                 title="Mark as done"
                                 onClick={() => handleMarkDone(ticket.id || '')}
                              >
                                 <Check className="w-4 h-4" />
                              </button>
                              <span>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Finished Tickets */}
         <div className="mt-10 bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
               <div>
                  <h3 className="font-bold">Finished</h3>
                  <p className="text-secondary text-sm">Resolved / Closed tickets.</p>
               </div>
            </div>
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
                     {loading && (
                        <tr className="animate-pulse">
                           <td className="px-6 py-4"><div className="h-3 w-16 bg-white/10 rounded"></div></td>
                           <td className="px-6 py-4"><div className="h-3 w-40 bg-white/10 rounded mb-2"></div><div className="h-3 w-24 bg-white/5 rounded"></div></td>
                           <td className="px-6 py-4"><div className="h-5 w-16 bg-white/10 rounded-full"></div></td>
                           <td className="px-6 py-4"><div className="h-3 w-20 bg-white/10 rounded"></div></td>
                           <td className="px-6 py-4 text-right"><div className="h-3 w-16 bg-white/10 rounded ml-auto"></div></td>
                        </tr>
                     )}
                     {!loading && tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length === 0 && (
                        <tr>
                           <td className="px-6 py-6 text-secondary text-sm" colSpan={5}>No finished tickets yet.</td>
                        </tr>
                     )}
                     {!loading && tickets.filter(t => t.status === 'closed' || t.status === 'resolved').map(ticket => (
                        <tr key={ticket.id} className="hover:bg-surfaceHighlight/20 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                           <td className="px-6 py-4 font-mono text-sm text-secondary">{ticket.id?.slice(0,8) || 'NEW'}</td>
                           <td className="px-6 py-4 font-medium text-primary">{ticket.title}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${ticket.priority === 'critical' ? 'bg-red-500/10 text-red-500' :
                                 ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                                    ticket.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                       'bg-green-500/10 text-green-500'
                                 }`}>
                                 {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm font-medium capitalize">{ticket.status.replace('_', ' ')}</td>
                           <td className="px-6 py-4 text-right text-sm text-secondary">{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Ticket Create/Edit Modal */}
         {selectedTicket && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}></div>
               <div className="bg-surface border border-border rounded-3xl p-8 w-full max-w-lg relative z-10 animate-fade-in shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                     <div>
                        <div className="text-xs font-mono text-secondary mb-1">{selectedTicket.id || 'NEW TICKET'}</div>
                        <h3 className="text-xl font-bold">{selectedTicket.id ? 'Edit Ticket' : 'Create Ticket'}</h3>
                     </div>
                     <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>

                     <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                     <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-2 block">Title</label>
                        <input
                           id="ticket-title"
                           name="ticket-title"
                           type="text"
                           value={selectedTicket.title}
                           onChange={(e) => setSelectedTicket({ ...selectedTicket, title: e.target.value })}
                           className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-secondary uppercase mb-2 block">Description</label>
                        <textarea
                           rows={4}
                           value={selectedTicket.description}
                           onChange={(e) => setSelectedTicket({ ...selectedTicket, description: e.target.value })}
                           className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none resize-none"
                        />
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div>
                           <label className="text-xs font-bold text-secondary uppercase mb-2 block">Priority</label>
                           <select
                              value={selectedTicket.priority}
                              onChange={(e) => setSelectedTicket({ ...selectedTicket, priority: e.target.value as any })}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                           >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-secondary uppercase mb-2 block">Status</label>
                           <select
                              value={selectedTicket.status}
                              onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value as any })}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                           >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-secondary uppercase mb-2 block">Type</label>
                           <select
                              value={selectedTicket.category}
                              onChange={(e) => setSelectedTicket({ ...selectedTicket, category: e.target.value as any })}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                           >
                              <option value="bug">Bug</option>
                              <option value="feature">Feature</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3">
                     <Button variant="ghost" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                     <Button onClick={() => handleSaveTicket(selectedTicket)} disabled={creating || !selectedTicket.title.trim()}>{creating ? 'Saving...' : 'Save'}</Button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const SuperAdmin: React.FC = () => {
   useEffect(() => {
      if (typeof window !== 'undefined') {
         window.scrollTo({ top: 0, behavior: 'auto' });
      }
   }, []);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<TabType>('analytics');
   const { theme, toggleTheme } = useTheme();
   const { user } = useAuth();
   const navigate = useNavigate();
   const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
   const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
      revenue: '$0',
      activeSubs: 0,
      totalUsers: 0,
      pageViews: 0,
      revenueChange: '+0%',
      subsChange: '+0%',
      usersChange: '+0%',
      viewsChange: '+0%'
   });
   const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
   const [adminLoading, setAdminLoading] = useState(false);
   const [adminLinks, setAdminLinks] = useState<any[]>([]);
   const [adminTickets, setAdminTickets] = useState<Ticket[]>([]);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
   const [selectedUserDetails, setSelectedUserDetails] = useState<{ profile: any; linksCount: number } | null>(null);
   const [userDetailLoading, setUserDetailLoading] = useState(false);

   // Login State
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loginLoading, setLoginLoading] = useState(false);

   // Check auth on mount or user change
   React.useEffect(() => {
      // Restore last active tab
      const savedTab = sessionStorage.getItem('admin-active-tab') as TabType | null;
      if (savedTab) setActiveTab(savedTab);
      checkAdminAccess();
   }, [user]);

   React.useEffect(() => {
      if (isAuthenticated) {
         loadAdminData();
      }
   }, [isAuthenticated]);

   const checkAdminAccess = async () => {
      try {
         setLoading(true);

         // Use existing user from context or hydrate from stored session
         let sessionUser = user;
         if (!sessionUser) {
            const { data } = await supabase.auth.getSession();
            sessionUser = data.session?.user || null;
         }

         if (!sessionUser) {
            setIsAuthenticated(false);
            return;
         }

         // Check if the current user is a superadmin
         const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionUser.id)
            .single();

         if (error) throw error;

         setIsAuthenticated(profile?.role === 'superadmin');
      } catch (err) {
         console.error('Error checking role:', err);
         setIsAuthenticated(false);
      } finally {
         setLoading(false);
      }
   };

   const loadAdminData = async () => {
      if (!user) return;
      setAdminLoading(true);
      try {
         const profiles = await fetchProfilesForAdmin();

         const mappedUsers: AdminUser[] = (profiles || []).map((p) => ({
            id: p.id,
            name: p.username || p.email || 'User',
            email: p.email || 'unknown',
            avatar: p.avatar_url || '/assets/originalavatar.jpg',
            plan: (p.plan || 'free').toLowerCase() === 'agency' ? 'Agency' : (p.plan || 'free').toLowerCase() === 'pro' ? 'Pro' : 'Free',
            status: p.is_active === false ? 'Inactive' : 'Active',
            joined: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '-'
         }));

         const activeSubs = profiles.filter((p) => (p.plan || '').toLowerCase() !== 'free').length;
         const pageViews = await fetchPageViewsCount();
         const deltas = await fetchAdminMetricDeltas();
         const pctChange = (curr: number, prev: number) => {
            if (prev <= 0) return curr > 0 ? '+100%' : '+0%';
            const val = ((curr - prev) / prev) * 100;
            return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
         };
         const dv = deltas || { totalUsers: profiles.length, prevUsers: profiles.length, pageViews7d: pageViews, pageViewsPrev7d: pageViews, activeSubs, activeSubsPrev: activeSubs };

         setAdminUsers(mappedUsers);
         setAdminMetrics({
            revenue: '$0',
            activeSubs,
            totalUsers: profiles.length,
            pageViews,
            revenueChange: '+0%',
            subsChange: pctChange(dv.activeSubs, dv.activeSubsPrev),
            usersChange: pctChange(profiles.length, dv.prevUsers),
            viewsChange: pctChange(dv.pageViews7d, dv.pageViewsPrev7d)
         });

         const [recentProfiles, recentLinks, linksForAdmin, ticketsForAdmin] = await Promise.all([
            fetchRecentProfiles(6),
            fetchRecentLinks(6),
            fetchLinksForAdmin(),
            fetchTickets()
         ]);

         const profileActivities: ActivityItem[] = (recentProfiles || []).map((p) => ({
            id: `profile-${p.id}`,
            title: p.username || 'New user',
            subtitle: 'Joined LYNKR',
            time: p.created_at,
            kind: 'profile'
         }));

         const linkActivities: ActivityItem[] = (recentLinks || []).map((l: any) => ({
            id: `link-${l.id}`,
            title: l.profiles?.username || 'Someone',
            subtitle: `Created link: ${l.title || 'Untitled'}`,
            time: l.created_at,
            kind: 'link'
         }));

         const merged = [...profileActivities, ...linkActivities].sort((a, b) => {
            const aTime = a.time ? new Date(a.time).getTime() : 0;
            const bTime = b.time ? new Date(b.time).getTime() : 0;
            return bTime - aTime;
         });

         setActivityFeed(merged.slice(0, 8));
         setAdminLinks(linksForAdmin || []);
         setAdminTickets(ticketsForAdmin || []);
      } catch (err) {
         console.error('Admin data load failed', err);
         toast.error('Failed to load admin data');
      } finally {
         setAdminLoading(false);
      }
   };

   const handleToggleStatus = async (id: string, next: 'Active' | 'Inactive') => {
      setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
      const updated = await setUserStatus(id, next === 'Active');
      if (!updated) {
         toast.error('Failed to update status');
         setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, status: next === 'Active' ? 'Inactive' : 'Active' } : u));
      }
   };

   const handleChangePlan = async (id: string, plan: 'Free' | 'Pro' | 'Agency') => {
      setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, plan } : u));
      const payload = await updateUserPlan(id, plan.toLowerCase() as any);
      if (!payload) {
         toast.error('Failed to update plan');
         // revert fetch
         loadAdminData();
      }
   };

   const handleDeleteUser = async (id: string) => {
      const ok = await deleteUserWithData(id);
      if (!ok) {
         toast.error('Failed to delete user');
         return;
      }
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted');
   };

   const handleViewUser = async (id: string) => {
      setSelectedUserId(id);
      setUserDetailLoading(true);
      const details = await fetchUserDetails(id);
      if (details) setSelectedUserDetails(details);
      setUserDetailLoading(false);
   };

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginLoading(true);

      try {
         // 1. Sign in
         const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
         });

         if (authError) throw authError;

         // 2. Check role immediately after sign in
         if (authData.user) {
            const { data, error } = await supabase
               .from('profiles')
               .select('role')
               .eq('id', authData.user.id)
               .single();

            if (data?.role !== 'superadmin') {
               toast.error('Access Denied: Not a superadmin account');
               await supabase.auth.signOut();
               setIsAuthenticated(false);
            } else {
               toast.success('Welcome, Admin');
               setIsAuthenticated(true);
               // Clear form
               setEmail('');
               setPassword('');
            }
         }
      } catch (err: any) {
         toast.error(err.message || 'Login failed');
      } finally {
         setLoginLoading(false);
      }
   };

   const handleLogout = async () => {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      navigate('/'); // Redirect to home on logout
   };

   // Show nothing but a loader while checking auth to avoid flicker
   if (loading) {
      return (
         <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
            <div className="animate-spin h-10 w-10 border-2 border-white/40 border-t-white rounded-full"></div>
         </div>
      );
   }

   // Render Login Screen if not authenticated
   if (!isAuthenticated) {
      return (
         <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
               {/* Shield Logo */}
               <div className="flex justify-center mb-10 relative">
                  <div className="w-24 h-24 bg-gradient-to-tr from-[#6366f1] to-[#a855f7] rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.3)] relative z-10 rotate-3 transition-transform hover:rotate-6 duration-500 group">
                     <Shield className="w-12 h-12 text-white fill-white/20 drop-shadow-xl group-hover:scale-110 transition-transform duration-300" />
                     <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-sm -z-10"></div>
                  </div>
                  <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10 rounded-full scale-150"></div>
               </div>

               <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                  <div className="text-center mb-10">
                     <h1 className="text-3xl font-bold mb-3 tracking-tight">Super Admin</h1>
                     <p className="text-zinc-500 font-medium text-sm">
                        Restricted access area. Authorized personnel only.
                     </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                     <div className="group">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-indigo-500 transition-colors">
                           Admin Email
                        </label>
                        <div className="relative">
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-[#0f0f0f] focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-zinc-700"
                              placeholder="admin@lynkr.com"
                              required
                           />
                        </div>
                     </div>

                     <div className="group">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-purple-500 transition-colors">
                           Password
                        </label>
                        <div className="relative">
                           <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-purple-500/50 focus:bg-[#0f0f0f] focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-zinc-700"
                              placeholder="••••••••"
                              required
                           />
                        </div>
                     </div>

                     <Button
                        type="submit"
                        className="w-full py-6 text-base font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl shadow-lg shadow-white/5 hover:shadow-white/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                        disabled={loginLoading}
                     >
                        {loginLoading ? 'Authenticating...' : 'Authenticate Access'}
                     </Button>
                  </form>

                  <div className="mt-10 text-center">
                     <Link to="/" className="inline-flex items-center text-zinc-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider gap-2 group">
                        <span className="text-base group-hover:-translate-x-1 transition-transform">←</span> Return to Site
                     </Link>
                  </div>
               </div>

               <div className="text-center mt-8 text-zinc-800 text-[10px] font-mono tracking-widest uppercase">
                  Secure Environment • v2.4.0
               </div>
            </div>
         </div>
      );
   }

   const setTab = (tab: TabType) => {
      setActiveTab(tab);
      sessionStorage.setItem('admin-active-tab', tab);
      setIsMobileMenuOpen(false);
   };

   const handleOverviewExport = async () => {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('LYNKR Overview', 10, 15);
      doc.setFontSize(12);
      doc.text(`Total Users: ${adminMetrics.totalUsers}`, 10, 30);
      doc.text(`Active Subs: ${adminMetrics.activeSubs}`, 10, 38);
      doc.text(`Page Views: ${adminMetrics.pageViews}`, 10, 46);
      doc.text(`Revenue: ${adminMetrics.revenue}`, 10, 54);
      doc.text('Tickets (first 10):', 10, 70);
      adminTickets.slice(0, 10).forEach((t, i) => {
         doc.text(`- ${t.title} [${t.status}]`, 12, 78 + i * 6);
      });
      doc.save('overview-report.pdf');
   };

   // Dashboard Render
   const renderContent = () => {
      switch (activeTab) {
         case 'analytics': return <AnalyticsDashboard metrics={adminMetrics} activity={activityFeed} loading={adminLoading} onExport={handleOverviewExport} />;
         case 'users': return (
            <UserManagement
               users={adminUsers}
               loading={adminLoading}
               onToggleStatus={handleToggleStatus}
               onDeleteUser={handleDeleteUser}
               onChangePlan={handleChangePlan}
               onViewUser={handleViewUser}
            />
         );
         case 'pricing': return <PricingManagement />;
         case 'settings': return <AdminSettings />;
         case 'reports': return <ReportsCenter users={adminUsers} links={adminLinks} tickets={adminTickets} />;
         case 'bugs': return <BugTracker />;
         default: return <AnalyticsDashboard metrics={adminMetrics} activity={activityFeed} loading={adminLoading} />;
      }
   };

   return (
      <>
      <div className="min-h-screen bg-background text-primary flex selection:bg-indigo-500/30">
         {/* Sidebar */}
         <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-border h-screen sticky top-0 overflow-hidden">
            <div className="p-8 pb-4 flex items-center">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <Shield className="w-5 h-5 fill-white/20" />
               </div>
               <div className="ml-3">
                  <span className="font-bold text-xl tracking-tight block leading-none">LYNKR</span>
                  <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">Admin</span>
               </div>
            </div>

            <nav className="flex-1 py-8 space-y-2 px-4">
               {[
                  { id: 'analytics', icon: LayoutGrid, label: 'Overview' },
                  { id: 'users', icon: Users, label: 'User Management' },
                  { id: 'pricing', icon: Banknote, label: 'Pricing Plans' },
                  { id: 'bugs', icon: Bug, label: 'Requests & Bugs' },
                  { id: 'reports', icon: FileDown, label: 'Reports & Data' },
                  { id: 'settings', icon: Sliders, label: 'Settings' },
               ].map((item) => (
                  <button
                     key={item.id}
                     onClick={() => setTab(item.id as TabType)}
                     className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                           ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 font-bold'
                           : 'text-secondary hover:bg-surfaceHighlight hover:text-primary'
                        }`}
                  >
                     <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-secondary group-hover:text-indigo-500'} transition-colors duration-300`} />
                     <span className="relative z-10">{item.label}</span>
                     {activeTab === item.id && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>}
                  </button>
               ))}
            </nav>

            <div className="p-4 border-t border-border">
               <Link to="/" className="flex items-center gap-3 px-5 py-3 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-xl transition-all mb-2">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
               </Link>

               <div className="flex items-center gap-3 px-5 py-3 text-secondary hover:text-primary hover:bg-surfaceHighlight rounded-xl transition-all cursor-pointer" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
               </div>

               <div onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all mt-4 font-bold group cursor-pointer">
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform " />
                  <span>Logout</span>
               </div>
            </div>
         </aside>

         {/* Mobile Header */}
         <div className="lg:hidden fixed top-0 w-full bg-surface/80 backdrop-blur-md border-b border-border z-50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Shield className="w-4 h-4 fill-white/20" />
               </div>
               <span className="font-bold text-lg">LYNKR <span className="text-[10px] bg-indigo-500 text-white px-1 py-0.5 rounded ml-1">ADMIN</span></span>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={toggleTheme} className="p-2 bg-surfaceHighlight rounded-lg text-secondary"><Sun className="w-5 h-5" /></button>
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-surfaceHighlight rounded-lg text-secondary"><Menu className="w-5 h-5" /></button>
            </div>
         </div>

         {/* Mobile Sidebar (Slide Over) */}
         {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
               <div className="absolute right-0 top-0 h-full w-72 bg-surface border-l border-border p-6 flex flex-col animate-fade-in transition-transform duration-300">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                           <Shield className="w-4 h-4 fill-white/20" />
                        </div>
                        <div>
                           <span className="font-bold text-lg tracking-tight block leading-none">LYNKR</span>
                           <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded mt-1 inline-block">Admin</span>
                        </div>
                     </div>
                     <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-secondary" /></button>
                  </div>
                  <nav className="space-y-2 flex-1">
                     {[
                        { id: 'analytics', icon: LayoutGrid, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'User Management' },
                        { id: 'pricing', icon: Banknote, label: 'Pricing Plans' },
                        { id: 'bugs', icon: Bug, label: 'Requests & Bugs' },
                        { id: 'reports', icon: FileDown, label: 'Reports & Data' },
                        { id: 'settings', icon: Sliders, label: 'Settings' },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => setTab(item.id as TabType)}
                           className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeTab === item.id
                              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 font-bold'
                              : 'text-secondary hover:bg-surfaceHighlight hover:text-primary'
                           }`}
                        >
                           <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-secondary group-hover:text-indigo-500'} transition-colors duration-300`} />
                           <span className="relative z-10">{item.label}</span>
                           {activeTab === item.id && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>}
                        </button>
                     ))}
                  </nav>
                  <div className="mt-auto border-t border-border pt-4 space-y-3">
                     <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-medium text-secondary">Theme</span>
                        <button
                           onClick={toggleTheme}
                           className="p-2 rounded-lg bg-surfaceHighlight text-primary"
                        >
                           {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                     </div>
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold">
                        <LogOut className="w-4 h-4" />
                        Logout
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Main Content */}
         <main className="flex-1 bg-background overflow-y-auto h-screen relative scroll-smooth lg:pt-0 pt-20">
            <div className="p-6 md:p-12 pb-32 max-w-7xl mx-auto">
               {renderContent()}
            </div>
         </main>
      </div>

      {selectedUserId && (
         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface border border-border rounded-3xl w-full max-w-lg p-6 relative">
               <button className="absolute top-4 right-4 text-secondary hover:text-primary" onClick={() => { setSelectedUserId(null); setSelectedUserDetails(null); }}>
                  <X className="w-5 h-5" />
               </button>
               <h3 className="text-xl font-bold mb-4">User Details</h3>
               {userDetailLoading || !selectedUserDetails ? (
                  <div className="text-secondary text-sm">Loading user...</div>
               ) : (
                  <div className="space-y-3">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                           <img src={selectedUserDetails.profile.avatar_url || '/assets/originalavatar.jpg'} className="w-full h-full rounded-full object-cover border-2 border-surface" />
                        </div>
                        <div>
                           <p className="font-bold">{selectedUserDetails.profile.username || selectedUserDetails.profile.email}</p>
                           <p className="text-xs text-secondary">{selectedUserDetails.profile.email}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-xl bg-surfaceHighlight border border-border">
                           <p className="text-secondary text-xs uppercase font-bold">Plan</p>
                           <p className="font-semibold">{(selectedUserDetails.profile.plan || 'free').toUpperCase()}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-surfaceHighlight border border-border">
                           <p className="text-secondary text-xs uppercase font-bold">Status</p>
                           <p className="font-semibold">{selectedUserDetails.profile.is_active === false ? 'Inactive' : 'Active'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-surfaceHighlight border border-border">
                           <p className="text-secondary text-xs uppercase font-bold">Joined</p>
                           <p className="font-semibold">{selectedUserDetails.profile.created_at ? new Date(selectedUserDetails.profile.created_at).toLocaleDateString() : '-'}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-surfaceHighlight border border-border">
                           <p className="text-secondary text-xs uppercase font-bold">Links</p>
                           <p className="font-semibold">{selectedUserDetails.linksCount}</p>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      )}
      </>
   );
};

export default SuperAdmin;

