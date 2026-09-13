import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    setToastMessage(`Booking for "${serviceName}" will be available in Module 2 (Scheduling System)!`);
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
      <header className="sticky top-0 z-40 bg-bg-card/90 backdrop-blur-md border-b border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
            <span className="text-xl font-bold tracking-tight text-ink">unfazed</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate">
            <a href="#about" className="hover:text-ink transition-colors">About</a>
            <a href="#services" className="hover:text-ink transition-colors">Services</a>
            <a href="#faqs" className="hover:text-ink transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleBookingClick('Individual Therapy')}
            >
              Book a Session
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-bg-dark-sidebar border-b border-border/20 text-white overflow-hidden">
        {/* Layered powder blue and mauve glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] rounded-full bg-bg-main/10 blur-[100px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-primary/20 blur-[100px]"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                <span>Verified Clinical Psychologist · Online & Bengaluru</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {therapist.name}
              </h1>

              <p className="text-base sm:text-lg text-bg-main leading-relaxed">
                {therapist.bio ||
                  'A safe space to understand yourself, heal at your own pace, and move forward with warmth, collaboration, and evidence-based care.'}
              </p>

              {/* Specialization tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {therapist.specializations?.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white shadow-xs"
                  >
                  {spec}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleBookingClick('Individual Therapy')}
                icon={CalendarCheck}
              >
                Book a session
              </Button>
              <a href="#about">
                <Button variant="secondary" size="lg">
                  Learn about my approach
                </Button>
              </a>
            </div>

            {/* Verified Trust Strip under CTAs */}
            <div className="pt-4 flex items-center gap-6 text-xs text-white/80 border-t border-white/20">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-ink">4.9 / 5.0</span>
                <span>(120+ sessions)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-primary" />
                <span>Confidential video sessions</span>
              </div>
            </div>
          </div>

          {/* Right Therapist Card */}
          <div className="lg:col-span-5 relative z-10">
            <div className="bg-bg-card rounded-card p-6 sm:p-8 border border-border shadow-card relative overflow-hidden text-ink">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <img
                    src={
                      therapist.profileImage ||
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={therapist.name}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-sage-soft shadow-md"
                  />
                  <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-sage text-white shadow-xs" title="Verified Practitioner">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-ink">{therapist.name}</h3>
                <p className="text-xs text-slate mt-0.5">Licensed Clinical Psychologist</p>

                {/* Consultation Details Card */}
                <div className="w-full mt-6 grid grid-cols-2 gap-3 p-3.5 bg-bg-card-elevated rounded-xl border border-border">
                  <div className="text-center">
                    <span className="block text-[11px] uppercase tracking-wider text-slate font-semibold">Duration</span>
                    <span className="text-sm font-bold text-ink flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {therapist.sessionDuration || 50} mins
                    </span>
                  </div>
                  <div className="text-center border-l border-border">
                    <span className="block text-[11px] uppercase tracking-wider text-slate font-semibold">Standard Fee</span>
                    <span className="text-sm font-bold text-ink flex items-center justify-center gap-0.5 mt-0.5">
                      <IndianRupee className="w-3.5 h-3.5 text-sage" /> {therapist.consultationFee || 1500}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 text-xs text-slate space-y-1.5 text-left bg-bg-card p-3 rounded-lg border border-border/50">
                  <p><strong>Languages:</strong> {therapist.languages?.join(', ') || 'English, Hindi'}</p>
                  <p><strong>Mode:</strong> Tele-health (Secure Video Call)</p>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-5"
                  onClick={() => handleBookingClick('Standard Consultation')}
                >
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Trust Strip */}
      <section className="py-8 bg-bg-card-elevated border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <Lock className="w-5 h-5 text-primary mx-auto" />
              <h4 className="text-xs font-bold text-ink">Confidential & Secure</h4>
              <p className="text-[11px] text-slate">Encrypted notes & private audio/video</p>
            </div>
            <div className="space-y-1">
              <Video className="w-5 h-5 text-sage mx-auto" />
              <h4 className="text-xs font-bold text-ink">Flexible Online Care</h4>
              <p className="text-[11px] text-slate">Join seamlessly from any device</p>
            </div>
            <div className="space-y-1">
              <CalendarCheck className="w-5 h-5 text-warning mx-auto" />
              <h4 className="text-xs font-bold text-ink">Easy Rescheduling</h4>
              <p className="text-[11px] text-slate">Change dates with 24hr notice</p>
            </div>
            <div className="space-y-1">
              <CheckCircle className="w-5 h-5 text-success mx-auto" />
              <h4 className="text-xs font-bold text-ink">Transparent Payments</h4>
              <p className="text-[11px] text-slate">Direct UPI, cards & digital invoices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs font-bold tracking-wider uppercase text-primary">Clinical Philosophy</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">
            Therapy that meets you where you are
          </h2>
          <p className="text-base text-slate leading-relaxed max-w-2xl mx-auto">
            {therapist.bio ||
              'My approach is warm, collaborative, and grounded in evidence-based care. Together, we will make space for the concerns that matter most to you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-card bg-bg-card border border-border shadow-card">
            <HeartHandshake className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-sm font-bold text-ink mb-1.5">Collaborative Space</h3>
            <p className="text-xs text-slate leading-relaxed">
              We define therapeutic goals together at a pace that honors your emotional readiness and life context.
            </p>
          </div>
          <div className="p-6 rounded-card bg-bg-card border border-border shadow-card">
            <Sparkles className="w-6 h-6 text-sage mb-3" />
            <h3 className="text-sm font-bold text-ink mb-1.5">Evidence-Based Care</h3>
            <p className="text-xs text-slate leading-relaxed">
              Utilizing CBT, Acceptance and Commitment Therapy (ACT), and mindfulness-informed practices.
            </p>
          </div>
          <div className="p-6 rounded-card bg-bg-card border border-border shadow-card">
            <ShieldCheck className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-sm font-bold text-ink mb-1.5">Non-Judgmental Warmth</h3>
            <p className="text-xs text-slate leading-relaxed">
              A private, unconditional container where all feelings, doubts, and lived experiences are received with dignity.
            </p>
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
              const isDark = idx === 1; // Make Couples Counselling the featured dark card
              return (
                <div
                  key={idx}
                  className={`${isDark ? 'bg-bg-dark-card text-white border-primary/30 shadow-lg scale-100 md:scale-[1.02]' : 'bg-bg-card text-ink border-border hover:border-primary/40 hover:shadow-card'} rounded-card p-6 border flex flex-col justify-between transition-all group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isDark ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'}`}>
                        {srv.duration}
                      </span>
                      <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-ink'}`}>{srv.price}</span>
                    </div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-ink'} mt-3`}>{srv.title}</h3>
                    <p className={`text-xs ${isDark ? 'text-bg-main' : 'text-slate'} mt-2 leading-relaxed`}>{srv.desc}</p>
                  </div>

                  <div className={`mt-8 pt-4 border-t ${isDark ? 'border-white/20' : 'border-border/70'}`}>
                    <Button
                      variant={isDark ? 'primary' : 'secondary'}
                      className={`w-full text-xs font-semibold transition-all`}
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
      <section id="faqs" className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold tracking-wider uppercase text-primary">Questions & Clarifications</span>
          <h2 className="font-serif text-3xl text-ink">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-bg-card rounded-xl border border-border overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-bg-card-elevated"
                >
                  <span className="text-sm font-semibold text-ink">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-card-elevated border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs font-semibold text-ink">{therapist.name}</p>
            <p className="text-[11px] text-slate">Practicing Clinical Psychologist · Bengaluru, India</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate">
            <a href="#privacy" className="hover:text-ink">Privacy Policy</a>
            <span>•</span>
            <a href="#cancellation" className="hover:text-ink">Cancellation Policy</a>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate">
            <span>Powered by</span>
            <span className="font-bold text-ink inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sage"></span> unfazed
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicProfile;
