import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Topbar from '../../components/common/Topbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import {
  Sparkles,
  Link as LinkIcon,
  Check,
  Copy,
  ExternalLink,
  Edit3,
  Clock,
  IndianRupee,
  Shield,
  Calendar,
  Users,
  CheckCircle2,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Profile Edit Form State
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    consultationFee: user?.consultationFee || 1500,
    sessionDuration: user?.sessionDuration || 50,
    specializations: user?.specializations?.join(', ') || 'Anxiety, Relationships, Burnout',
    languages: user?.languages?.join(', ') || 'English, Hindi',
  });

  const publicUrl = `${window.location.origin}/${user?.slug || 'dr-ananya-sharma'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setToastMessage('Public profile link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile({
        bio: formData.bio,
        consultationFee: Number(formData.consultationFee),
        sessionDuration: Number(formData.sessionDuration),
        specializations: formData.specializations.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
      });
      setIsEditingProfile(false);
      setToastMessage('Practice profile updated successfully!');
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Calculate profile completion
  const completionChecks = [
    { label: 'Basic profile details', done: Boolean(user?.name && user?.email) },
    { label: 'Custom URL slug generated', done: Boolean(user?.slug) },
    { label: 'Clinical bio & approach', done: Boolean(user?.bio && user.bio.length > 20) },
    { label: 'Consultation fee & duration', done: Boolean(user?.consultationFee && user?.sessionDuration) },
  ];
  const completionPercentage = Math.round(
    (completionChecks.filter((c) => c.done).length / completionChecks.length) * 100
  );

  return (
    <div className="min-h-screen bg-bg-main flex">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[252px] flex flex-col min-w-0">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} title="Practice Overview" />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Welcome Banner */}
          <div className="bg-bg-dark-sidebar rounded-card p-6 sm:p-8 border border-border/20 shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-bg-main/10 blur-[80px] translate-y-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-sage" />
                  <span>Practice Profile Live</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white tracking-tight">
                  Good afternoon, {user?.name || 'Dr. Ananya'}.
                </h2>
                <p className="text-sm text-bg-main mt-1 max-w-2xl leading-relaxed">
                  Your practice is running smoothly. Here’s what needs your attention today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditingProfile(true)}
                  icon={Edit3}
                  className="text-xs sm:text-sm"
                >
                  Edit profile
                </Button>
                <a
                  href={`/${user?.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex"
                >
                  <Button variant="primary" icon={ExternalLink} className="text-xs sm:text-sm">
                    View public profile
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-bg-card-elevated rounded-card p-5 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/50 rounded-lg text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-sage flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> On track</span>
              </div>
              <h3 className="text-3xl font-bold text-ink tracking-tight mb-1">4</h3>
              <p className="text-sm text-slate font-medium">Today's sessions</p>
            </div>
            
            <div className="bg-bg-card-elevated rounded-card p-5 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/50 rounded-lg text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-sage flex items-center gap-1">↑ 2 this month</span>
              </div>
              <h3 className="text-3xl font-bold text-ink tracking-tight mb-1">18</h3>
              <p className="text-sm text-slate font-medium">Active clients</p>
            </div>

            <div className="bg-bg-card-elevated rounded-card p-5 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/50 rounded-lg text-primary">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-sage flex items-center gap-1">↑ 12%</span>
              </div>
              <h3 className="text-3xl font-bold text-ink tracking-tight mb-1">₹45,000</h3>
              <p className="text-sm text-slate font-medium">Monthly revenue</p>
            </div>

            <div className="bg-bg-card-elevated rounded-card p-5 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/50 rounded-lg text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-peach flex items-center gap-1">Action needed</span>
              </div>
              <h3 className="text-3xl font-bold text-ink tracking-tight mb-1">2</h3>
              <p className="text-sm text-slate font-medium">Pending actions</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Today's Schedule */}
              <div className="bg-bg-card rounded-card border border-border shadow-sm">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                  <h3 className="text-base font-bold text-ink">Today's Schedule</h3>
                  <button className="text-primary text-xs font-semibold hover:underline">View Calendar</button>
                </div>
                <div className="divide-y divide-border/60">
                  {[
                    { name: 'Arjun M.', time: '10:00 AM', type: 'Intake Session', mode: 'Online', action: 'Join Call' },
                    { name: 'Priya K.', time: '11:30 AM', type: 'CBT', mode: 'In-person', action: 'View Details' },
                    { name: 'Rohan & Neha', time: '3:00 PM', type: 'Couples Counseling', mode: 'Online', action: 'Join Call' }
                  ].map((session, idx) => (
                    <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-bg-card-elevated transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                          {session.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-ink">{session.name}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.time}</span>
                            <span>•</span>
                            <span>{session.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md ${session.mode === 'Online' ? 'bg-sage-soft text-sage border border-sage/20' : 'bg-white/50 text-slate border border-border'}`}>
                          {session.mode}
                        </span>
                        <Button variant="secondary" className="text-xs px-3 py-1.5 h-auto">
                          {session.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Overview */}
              <div className="bg-bg-card rounded-card p-6 border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <h3 className="text-base font-bold text-ink">Revenue Overview</h3>
                  <div className="flex items-center bg-bg-card-elevated p-1 rounded-lg border border-border">
                    {['Week', 'Month', 'Year'].map(tab => (
                      <button key={tab} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${tab === 'Month' ? 'bg-white shadow-sm text-ink' : 'text-slate hover:text-ink'}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Simple CSS Chart */}
                <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <div key={i} className="w-full relative group">
                      <div 
                        className="w-full bg-primary/40 group-hover:bg-primary transition-colors rounded-t-md" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 px-2 text-xs text-slate font-medium">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>

            {/* Right Column: Practice Pulse */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-dark-card rounded-card p-6 shadow-card border border-border/10">
                <h3 className="text-base font-bold text-white mb-6">Practice Pulse</h3>
                
                <div className="space-y-6">
                  {/* Profile Completion */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">Profile Setup</span>
                      <span className="text-xs font-bold text-bg-main">{completionPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Operational Metrics */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                        <div className="p-2 bg-white/5 rounded-lg"><Users className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Unread messages</span>
                      </div>
                      <span className="text-sm font-bold text-white bg-primary/40 px-2.5 py-0.5 rounded-full">3</span>
                    </div>

                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                        <div className="p-2 bg-white/5 rounded-lg"><IndianRupee className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Pending payments</span>
                      </div>
                      <span className="text-sm font-bold text-peach bg-peach/10 px-2.5 py-0.5 rounded-full border border-peach/20">₹4,500</span>
                    </div>

                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
                        <div className="p-2 bg-white/5 rounded-lg"><FileText className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Incomplete notes</span>
                      </div>
                      <span className="text-sm font-bold text-warning bg-warning/10 px-2.5 py-0.5 rounded-full border border-warning/20">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs">
          <div className="bg-bg-card-elevated rounded-card shadow-card border border-border w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Update Practice Details</h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate hover:text-ink text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  Bio / Clinical Approach
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your approach to therapy..."
                  className="w-full p-3 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full h-[44px] px-3.5 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.sessionDuration}
                    onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                    className="w-full h-[44px] px-3.5 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.specializations}
                  onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                  placeholder="Anxiety, Depression, Relationships"
                  className="w-full h-[44px] px-3.5 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
                  Languages Spoken (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="English, Hindi, Kannada"
                  className="w-full h-[44px] px-3.5 bg-bg-card text-ink text-sm rounded-[10px] border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={updating}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
