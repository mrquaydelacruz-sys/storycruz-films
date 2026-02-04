'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, FileText, Send, CheckCircle, ArrowRight } from 'lucide-react';
import BackgroundWater from '@/components/BackgroundWater';

type ServiceType = 'photography' | 'videography' | 'both' | null;
type ProjectType =
  | 'wedding'
  | 'debut'
  | 'events'
  | 'commercial-branding'
  | 'real-estate'
  | 'lifestyle'
  | null;

interface FormData {
  fullName: string;
  partnerName: string;
  email: string;
  phone: string;
  serviceType: ServiceType;
  projectType: ProjectType;
  referralSource: string[];
  eventDate: string;
  location: string;
  estimatedBudget: string;
  projectDetails: string;
}

const SERVICE_OPTIONS = [
  { value: 'photography' as const, label: 'Photography' },
  { value: 'videography' as const, label: 'Videography' },
  { value: 'both' as const, label: 'Both' },
];

const PROJECT_OPTIONS = [
  { value: 'wedding' as const, label: 'Wedding' },
  { value: 'debut' as const, label: 'Debut' },
  { value: 'events' as const, label: 'Events (Birthdays, Baby Shower, Gender Reveal, Christmas Party)' },
  { value: 'commercial-branding' as const, label: 'Commercial Branding' },
  { value: 'real-estate' as const, label: 'Real Estate' },
  { value: 'lifestyle' as const, label: 'Lifestyle (Maternity, Newborn, Family, Couple, Graduation, Cake Smash, Milestone)' },
];

const REFERRAL_OPTIONS = [
  'Google',
  'Facebook',
  'Instagram',
  'Client Referral',
  'Vendor Referral',
  'Other',
];

export default function WeddingInquiryPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    partnerName: '',
    email: '',
    phone: '',
    serviceType: null,
    projectType: null,
    referralSource: [],
    eventDate: '',
    location: '',
    estimatedBudget: '',
    projectDetails: '',
  });

  const sections = [
    { title: 'Your Info', icon: User },
    { title: 'Project', icon: Package },
    { title: 'Details', icon: FileText },
  ];

  const handleCheckbox = (field: 'referralSource', value: string) => {
    const current = formData[field];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter((v) => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...current, value] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/wedding-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentSection) {
      case 0:
        return !!formData.fullName && !!formData.email;
      case 1:
        return formData.serviceType !== null && formData.projectType !== null && !!formData.eventDate;
      case 2:
        return !!formData.projectDetails;
      default:
        return true;
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <BackgroundWater />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-accent" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Thank You!</h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              We've received your inquiry and are excited to learn more about your project. Our team
              will review your details and get back to you within{' '}
              <span className="text-accent font-semibold">24–48 hours</span>.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-all duration-300"
            >
              Return Home
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundWater />

      <div className="relative z-10 pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
              Contact Us
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Inquiry</h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Please fill out the form below. We'll get back to you within{' '}
              <span className="text-accent">24–48 hours</span>.
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
            {sections.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === currentSection;
              const isCompleted = i < currentSection;
              return (
                <button
                  key={i}
                  onClick={() => i <= currentSection && setCurrentSection(i)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-accent text-white'
                      : isCompleted
                        ? 'bg-accent/20 text-accent cursor-pointer hover:bg-accent/30'
                        : 'bg-white/5 text-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">{s.title}</span>
                  <span className="text-xs font-medium sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Section 1: Your Info */}
                {currentSection === 0 && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <User className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Your Info</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Partner's Name (if applicable)
                        </label>
                        <input
                          type="text"
                          value={formData.partnerName}
                          onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="Partner's full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="name@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="604-123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">How did you hear about us?</label>
                      <div className="flex flex-wrap gap-3">
                        {REFERRAL_OPTIONS.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.referralSource.includes(opt)}
                              onChange={() => handleCheckbox('referralSource', opt)}
                              className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                            />
                            <span className="text-white/80 group-hover:text-white text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section 2: Project */}
                {currentSection === 1 && (
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <Package className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Project</h2>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">
                        What type of service do you need? *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SERVICE_OPTIONS.map((opt) => {
                          const isSelected = formData.serviceType === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, serviceType: opt.value })}
                              className={`px-4 py-4 rounded-xl border text-center transition-all duration-300 ${
                                isSelected
                                  ? 'bg-accent/20 border-accent text-white'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">
                        What type of project you are looking for? *
                      </label>
                      <div className="space-y-3">
                        {PROJECT_OPTIONS.map((opt) => {
                          const isSelected = formData.projectType === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, projectType: opt.value })}
                              className={`w-full px-4 py-3 rounded-xl border text-left transition-all duration-300 ${
                                isSelected
                                  ? 'bg-accent/20 border-accent text-white'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Date of project or event *
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Location of the project
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="City, venue, or address"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-white/60 mb-2">Estimated Budget</label>
                        <input
                          type="text"
                          value={formData.estimatedBudget}
                          onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                          placeholder="e.g. $5,000 – $10,000 or range"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section 3: Details */}
                {currentSection === 2 && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <FileText className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Details</h2>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        Kindly provide specific details about this project *
                      </label>
                      <textarea
                        value={formData.projectDetails}
                        onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent resize-none"
                        placeholder="Tell us about your vision, timeline, must-haves, and any questions..."
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  className={`px-6 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all ${
                    currentSection === 0 ? 'opacity-0 pointer-events-none' : ''
                  }`}
                >
                  Previous
                </button>

                {currentSection < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => canProceed() && setCurrentSection(currentSection + 1)}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all ${
                      canProceed()
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed() || isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all ${
                      canProceed() && !isSubmitting
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12 text-white/40 text-sm"
          >
            <p>We typically respond within 24–48 hours</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
