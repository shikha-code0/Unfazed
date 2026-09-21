import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import {
  ShieldCheck,
  Star,
  Clock,
  IndianRupee,
  Video,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Sparkles,
  HeartHandshake,
  Lock,
  ArrowRight
} from 'lucide-react';

const PublicProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/therapists/public/${slug}`);
        if (res.data.success) {
          setTherapist(res.data.therapist);
          // Set dynamic meta title
          document.title = `${res.data.therapist.name} | Unfazed Verified Therapist`;
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Therapist profile not found.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  const handleBookingClick = (serviceName = 'Individual Therapy') => {
    navigate(`/book/${slug}`);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
        <Loader size="lg" color="primary" />
        <p className="mt-4 text-xs font-semibold text-slate uppercase tracking-wider">
          Loading therapist profile...
        </p>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-error-bg text-error flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-ink">Therapist Profile Not Found</h2>
        <p className="mt-2 text-sm text-slate max-w-md">
          {error || 'We could not find a verified therapist profile at this web address.'}
        </p>
        <Link to="/login" className="mt-6">
          <Button variant="primary">Return to Unfazed</Button>
        </Link>
      </div>
    );
  }

  const services = [
    {
      title: 'Individual Therapy',
      duration: `${therapist.sessionDuration || 50} min`,
      price: `₹${therapist.consultationFee || 1500}`,
      desc: 'One-on-one confidential counseling addressing anxiety, life transitions, burnout, or emotional regulation.',
    },
    {
      title: 'Couples Therapy',
      duration: '60 min',
      price: `₹${Math.round((therapist.consultationFee || 1500) * 1.35)}`,
      desc: 'Collaborative relationship dialogue focused on conflict resolution, communication, and mutual empathy.',
    },
    {
      title: 'Initial Consultation',
      duration: '20 min',
      price: `₹${Math.round((therapist.consultationFee || 1500) * 0.4)}`,
      desc: 'A brief introductory call to discuss your goals, therapy approach, and see if we are a good fit.',
    },
  ];

  const faqs = [
    {
      q: 'How do I book my first session?',
      a: 'Select a service that fits your requirements and choose a convenient time slot. You will receive a private Google Meet or secure video link with pre-session intake questions.',
    },
    {
      q: 'Is therapy strictly confidential?',
      a: 'Yes. All consultations and session materials adhere strictly to ethical clinical guidelines and Indian data protection standards. Your conversations are private and protected.',
    },
    {
      q: 'Do you offer online video sessions?',
      a: 'Yes, sessions are conducted via secure, high-definition tele-health video accessible directly from your browser or mobile phone.',
    },
    {
      q: 'What is your cancellation or rescheduling policy?',
      a: 'You can reschedule or cancel your session with at least 24 hours prior notice at no extra charge directly through your client portal.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-main text-ink selection:bg-primary/20 selection:text-primary">
      <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />

      {/* Public Header */}
      <header className="sticky top-0 z-40 bg-bg-main border-b border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
            <span className="text-xl font-bold tracking-tight text-ink">unfazed</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                Therapist Login
              </Button>
              <Button variant="secondary" size="sm" className="sm:hidden px-3">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 bg-bg-dark-card border-b border-border/20 text-white overflow-hidden">
        {/* Layered powder blue and mauve glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-primary/10 blur-[120px]"></div>
          <div className="absolute -bottom-[20%] right-[5%] w-[40%] h-[50%] rounded-full bg-sage/10 blur-[100px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center justify-between">
            {/* Left Hero Details */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
                </span>
                <span>Available online</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                Dr. {therapist.name.replace('Dr. ', '')}
              </h1>
              
              <div className="text-lg text-bg-main leading-relaxed font-medium">
                Licensed Clinical Psychologist • {therapist.languages?.join(', ') || 'English, Hindi, Kannada'}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">4.9 / 5.0</span>
                  <span>(120+ sessions)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-primary-light" />
                  <span>{therapist.sessionDuration || 50} Min Sessions</span>
                </div>
              </div>

              {/* Specialization tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {therapist.specializations?.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-white"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4 hidden md:flex">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleBookingClick('Individual Therapy')}
                >
                  Book a session
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => setToastMessage("Messaging will be available in Module 2")}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Message {therapist.name.split(' ')[0]}
                </Button>
              </div>
            </div>

            {/* Right Profile Image (Overlapping style) */}
            <div className="w-full md:w-72 lg:w-80 flex-shrink-0 relative">
               <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-full md:h-auto md:aspect-square rounded-2xl overflow-hidden border-4 border-bg-main shadow-2xl mx-auto md:translate-y-12 transition-transform">
                 <img
                    src={therapist.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'}
                    alt={therapist.name}
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"></div>
                 <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                   <div className="p-1.5 rounded-full bg-sage text-white shadow-sm">
                     <ShieldCheck className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-white tracking-wider uppercase">Verified</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-8 bg-bg-card border-y border-border relative z-0 md:pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ink">9+ Years Experience</h4>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-sage-soft flex items-center justify-center text-sage">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ink">Confidential & Secure</h4>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ink">Online Sessions</h4>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-sage-soft flex items-center justify-center text-sage">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ink">English, Hindi, Kannada</h4>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-primary">About me</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-2">
                Therapy that meets you where you are
              </h2>
            </div>
            <div className="text-base text-slate leading-relaxed space-y-4">
              <p>
                {therapist.bio || 'My approach is warm, collaborative, and grounded in evidence-based care. Together, we will make space for the concerns that matter most to you.'}
              </p>
              <p>
                I believe that healing is not linear, and there is profound courage in simply showing up. Whether you are navigating burnout, life transitions, or seeking deeper self-awareness, I am here to facilitate that journey safely.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 gap-4">
            <div className="p-6 rounded-card bg-bg-card-elevated border border-border shadow-sm flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-bg-card text-primary shrink-0"><HeartHandshake className="w-5 h-5" /></div>
              <div>
                <h3 className="text-base font-bold text-ink mb-1">Collaborative</h3>
                <p className="text-sm text-slate leading-relaxed">
                  We define therapeutic goals together at a pace that honors your emotional readiness and life context.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-card bg-bg-card-elevated border border-border shadow-sm flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-bg-card text-sage shrink-0"><Sparkles className="w-5 h-5" /></div>
              <div>
                <h3 className="text-base font-bold text-ink mb-1">Evidence-informed</h3>
                <p className="text-sm text-slate leading-relaxed">
                  Utilizing CBT, Acceptance and Commitment Therapy (ACT), and mindfulness-informed practices.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-card bg-bg-card-elevated border border-border shadow-sm flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-bg-card text-primary shrink-0"><ShieldCheck className="w-5 h-5" /></div>
              <div>
                <h3 className="text-base font-bold text-ink mb-1">Trauma-aware</h3>
                <p className="text-sm text-slate leading-relaxed">
                  A private, unconditional container where all feelings, doubts, and lived experiences are received with safety and dignity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-bg-card-elevated border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold tracking-wider uppercase text-primary">Practices & Modalities</span>
            <h2 className="font-serif text-3xl text-ink">Consultation Services</h2>
            <p className="text-sm text-slate">Clear pricing with no hidden charges or commitments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((srv, idx) => {
              const isDark = idx === 1; // Make Couples Therapy the featured dark card
              return (
                <div
                  key={idx}
                  className={`${isDark ? 'bg-bg-dark-card text-white border-primary/30 shadow-lg scale-100 md:scale-[1.02] md:-translate-y-2' : 'bg-bg-card text-ink border-border hover:border-primary/40 hover:shadow-card'} rounded-card p-6 sm:p-8 border flex flex-col justify-between transition-all group relative overflow-hidden`}
                >
                  {isDark && <div className="absolute top-0 right-0 p-12 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-primary/20 text-primary-light border border-primary/30' : 'bg-bg-card-elevated text-primary border border-border'}`}>
                        {srv.duration}
                      </span>
                      <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-ink'}`}>{srv.price}</span>
                    </div>
                    <h3 className={`text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-ink'} mt-4`}>{srv.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-bg-main' : 'text-slate'} mt-3 leading-relaxed`}>{srv.desc}</p>
                  </div>

                  <div className={`relative z-10 mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-border'}`}>
                    <Button
                      variant={isDark ? 'primary' : 'outline'}
                      className="w-full font-semibold"
                      onClick={() => handleBookingClick(srv.title)}
                    >
                      Book this session
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-16 sm:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold tracking-wider uppercase text-primary">Questions & Clarifications</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-bg-card-elevated rounded-2xl border border-border overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-white/40 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-ink pr-4">{faq.q}</span>
                  <div className={`p-1.5 rounded-full bg-bg-card border border-border transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-primary" />
                  </div>
                </button>
                <div 
                  className={`px-6 text-sm text-slate leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pt-2 border-t border-border/50">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark-sidebar border-t border-border/20 py-12 text-white pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-sm font-bold text-white">{therapist.name}</p>
            <p className="text-[11px] text-white/60">Practicing Clinical Psychologist · Bengaluru, India</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-white/70">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#cancellation" className="hover:text-white transition-colors">Cancellation Policy</a>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <span>Powered by</span>
            <span className="font-bold text-white inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sage"></span> unfazed
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Booking CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-card-elevated/90 backdrop-blur-md border-t border-border md:hidden z-50 flex items-center justify-between gap-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex-1">
          <p className="text-xs font-bold text-ink">Individual Therapy</p>
          <p className="text-[11px] text-slate">₹{therapist.consultationFee || 1500} / {therapist.sessionDuration || 50} min</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleBookingClick('Individual Therapy')}
          className="flex-shrink-0"
        >
          Book a session
        </Button>
      </div>
    </div>
  );
};

export default PublicProfile;
