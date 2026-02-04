'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Film, Package, MapPin, Users, Palette, Globe, DollarSign, Sparkles, Send, CheckCircle, ArrowRight, Link as LinkIcon, Plus, X } from 'lucide-react';
import BackgroundWater from '@/components/BackgroundWater';

type ServiceType = 'photography' | 'video' | 'full-package' | null;

interface FormData {
  // Basics
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  timeline: string;

  // Scope
  serviceType: ServiceType;
  projectGoal: string;
  estimatedAssets: string;

  // Production
  location: string[];
  talent: string[];
  projectDescription: string;
  inspirationLinks: string[];

  // Video-specific (conditional)
  musicLicensing: boolean;
  voiceover: boolean;

  // Licensing
  usageTypes: string[];
  usageDuration: string;

  // Investment
  budget: string;
  additionalNotes: string;
}

export default function CommercialInquiryPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    timeline: '',
    serviceType: null,
    projectGoal: '',
    estimatedAssets: '',
    location: [],
    talent: [],
    projectDescription: '',
    inspirationLinks: [''],
    musicLicensing: false,
    voiceover: false,
    usageTypes: [],
    usageDuration: '',
    budget: '',
    additionalNotes: '',
  });

  const sections = [
    { title: 'The Basics', icon: Sparkles },
    { title: 'Project Scope', icon: Package },
    { title: 'Production Details', icon: Film },
    { title: 'Licensing & Usage', icon: Globe },
    { title: 'Investment', icon: DollarSign },
  ];

  const handleCheckbox = (field: keyof FormData, value: string) => {
    const currentValues = formData[field] as string[];
    if (currentValues.includes(value)) {
      setFormData({ ...formData, [field]: currentValues.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...currentValues, value] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/commercial-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentSection) {
      case 0:
        return formData.companyName && formData.contactPerson && formData.email;
      case 1:
        return formData.serviceType && formData.projectGoal;
      case 2:
        return formData.location.length > 0 && formData.projectDescription;
      case 3:
        return formData.usageTypes.length > 0 && formData.usageDuration;
      case 4:
        return formData.budget;
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
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Thank You!
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              We've received your commercial production inquiry and are excited to learn more about your project.
              Our team will review your details and get back to you within <span className="text-accent font-semibold">24–48 hours</span>.
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
              Commercial Services
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Commercial Production Inquiry
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Thank you for reaching out! To help us provide an accurate estimate for your project,
              please fill out the details below. We'll get back to you within <span className="text-accent">24–48 hours</span>.
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = index === currentSection;
              const isCompleted = index < currentSection;

              return (
                <button
                  key={index}
                  onClick={() => index <= currentSection && setCurrentSection(index)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-accent text-white'
                      : isCompleted
                        ? 'bg-accent/20 text-accent cursor-pointer hover:bg-accent/30'
                        : 'bg-white/5 text-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">{section.title}</span>
                  <span className="text-xs font-medium sm:hidden">{index + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">

                {/* Section 1: The Basics */}
                {currentSection === 0 && (
                  <motion.div
                    key="basics"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <Sparkles className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">The Basics</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Company Name *</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder="Your Company"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-2">Contact Person *</label>
                        <input
                          type="text"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder="Your Name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder="email@company.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-2">Website / Social Media</label>
                        <input
                          type="text"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder="www.yourcompany.com or @handle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-2">Project Date / Timeline</label>
                        <input
                          type="text"
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                          placeholder='Specific date or "Q3 2025"'
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section 2: Project Scope */}
                {currentSection === 1 && (
                  <motion.div
                    key="scope"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <Package className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Project Scope</h2>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">What services are you looking for? *</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { value: 'photography', label: 'Photography Only', icon: Camera },
                          { value: 'video', label: 'Video Only', icon: Film },
                          { value: 'full-package', label: 'Full Photo & Video', icon: Package },
                        ].map((option) => {
                          const Icon = option.icon;
                          const isSelected = formData.serviceType === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, serviceType: option.value as ServiceType })}
                              className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 ${
                                isSelected
                                  ? 'bg-accent/20 border-accent text-white'
                                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                              }`}
                            >
                              <Icon className={`w-8 h-8 ${isSelected ? 'text-accent' : ''}`} />
                              <span className="text-sm font-medium">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        What is the primary goal of this project? *
                      </label>
                      <textarea
                        value={formData.projectGoal}
                        onChange={(e) => setFormData({ ...formData, projectGoal: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder="e.g., Brand awareness, product launch, website hero video, social media ads..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        Estimated number of final assets needed
                      </label>
                      <textarea
                        value={formData.estimatedAssets}
                        onChange={(e) => setFormData({ ...formData, estimatedAssets: e.target.value })}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder="e.g., 20 retouched photos, 1x 60-second brand film, 3x 15-second social reels"
                      />
                    </div>

                    {/* Conditional Video Options */}
                    <AnimatePresence>
                      {(formData.serviceType === 'video' || formData.serviceType === 'full-package') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-white/10">
                            <label className="block text-sm text-white/60 mb-4">Video-specific requirements</label>
                            <div className="flex flex-wrap gap-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.musicLicensing}
                                  onChange={(e) => setFormData({ ...formData, musicLicensing: e.target.checked })}
                                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                                />
                                <span className="text-white/80">Music Licensing Needed</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.voiceover}
                                  onChange={(e) => setFormData({ ...formData, voiceover: e.target.checked })}
                                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                                />
                                <span className="text-white/80">Professional Voiceover</span>
                              </label>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Section 3: Production Details */}
                {currentSection === 2 && (
                  <motion.div
                    key="production"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <Film className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Production Details</h2>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Location *
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'studio', label: 'At our studio' },
                          { value: 'onsite', label: 'On-site (at your office/facility)' },
                          { value: 'external', label: 'External location (Outdoor, rented lifestyle space, etc.)' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.location.includes(option.value)}
                              onChange={() => handleCheckbox('location', option.value)}
                              className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                            />
                            <span className="text-white/80 group-hover:text-white transition-colors">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">
                        <Users className="w-4 h-4 inline mr-2" />
                        Talent & Styling
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'provide-staff', label: 'We will provide staff/models' },
                          { value: 'source-talent', label: 'We need you to source professional talent' },
                          { value: 'styling', label: 'We need hair/makeup/prop styling services' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.talent.includes(option.value)}
                              onChange={() => handleCheckbox('talent', option.value)}
                              className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                            />
                            <span className="text-white/80 group-hover:text-white transition-colors">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        <Palette className="w-4 h-4 inline mr-2" />
                        Project Description *
                      </label>
                      <textarea
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder='Briefly describe the "vibe" or what will be happening in the frame...'
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        <LinkIcon className="w-4 h-4 inline mr-2" />
                        Inspiration / Moodboard Links
                      </label>
                      <div className="space-y-3">
                        {formData.inspirationLinks.map((link, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-1 relative">
                              <input
                                type="url"
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...formData.inspirationLinks];
                                  newLinks[index] = e.target.value;
                                  setFormData({ ...formData, inspirationLinks: newLinks });
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                                placeholder={index === 0 ? "Pinterest board, YouTube video, or any reference link" : "Add another inspiration link"}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                                {index + 1}
                              </span>
                            </div>
                            {formData.inspirationLinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = formData.inspirationLinks.filter((_, i) => i !== index);
                                  setFormData({ ...formData, inspirationLinks: newLinks });
                                }}
                                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/50 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </motion.div>
                        ))}

                        {/* Add Link Button */}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, inspirationLinks: [...formData.inspirationLinks, ''] })}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-white/20 text-white/50 hover:border-accent hover:text-accent transition-colors w-full justify-center"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add another link</span>
                        </button>
                      </div>
                      <p className="text-xs text-white/40 mt-3">
                        Pro tip: Sharing visual references helps us understand your vision better than words alone! Add as many links as you'd like.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Section 4: Licensing & Usage */}
                {currentSection === 3 && (
                  <motion.div
                    key="licensing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Licensing & Usage</h2>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                      <p className="text-sm text-white/80">
                        <strong className="text-accent">Note:</strong> This is crucial for commercial pricing as it determines the value of the work.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">Where will these assets be used? *</label>
                      <div className="space-y-3">
                        {[
                          { value: 'organic-social', label: 'Organic Social Media / Website' },
                          { value: 'paid-ads', label: 'Paid Digital Advertising (Ads)' },
                          { value: 'print', label: 'Print / Billboards / Physical Signage' },
                          { value: 'broadcast', label: 'Broadcast TV / Cinema' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={formData.usageTypes.includes(option.value)}
                              onChange={() => handleCheckbox('usageTypes', option.value)}
                              className="w-5 h-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
                            />
                            <span className="text-white/80 group-hover:text-white transition-colors">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">Duration of Use *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['1 Year', '2 Years', '5 Years', 'Perpetual'].map((duration) => (
                          <button
                            key={duration}
                            type="button"
                            onClick={() => setFormData({ ...formData, usageDuration: duration })}
                            className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
                              formData.usageDuration === duration
                                ? 'bg-accent/20 border-accent text-white'
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                            }`}
                          >
                            {duration}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section 5: Investment */}
                {currentSection === 4 && (
                  <motion.div
                    key="investment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <DollarSign className="w-6 h-6 text-accent" />
                      <h2 className="text-2xl font-serif text-white">Investment</h2>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-4">
                        Do you have a specific budget range allocated for this project? *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          '$2,000 – $5,000',
                          '$5,000 – $10,000',
                          '$10,000 – $25,000',
                          '$25,000+',
                          "I'm not sure, I need a custom quote",
                        ].map((budget) => (
                          <button
                            key={budget}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget })}
                            className={`px-4 py-4 rounded-lg border text-left transition-all duration-300 ${
                              formData.budget === budget
                                ? 'bg-accent/20 border-accent text-white'
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                            }`}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Additional Notes</label>
                      <textarea
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                        placeholder="Anything else you'd like us to know about your project?"
                      />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  className={`px-6 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 ${
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
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 ${
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
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 ${
                      canProceed() && !isSubmitting
                        ? 'bg-accent hover:bg-accent/90 text-white'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12 text-white/40 text-sm"
          >
            <p>We typically respond within 24-48 hours</p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
