'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Settings,
  Film,
  Globe,
  DollarSign,
  ArrowRight,
  Send,
  CheckCircle
} from 'lucide-react'

const STEPS = [
  { id: 'basics', label: 'The Basics', icon: Sparkles },
  { id: 'event', label: 'Your Event', icon: Settings },
  { id: 'services', label: 'Services', icon: Film },
  { id: 'details', label: 'Details', icon: Globe },
  { id: 'investment', label: 'Investment', icon: DollarSign },
] as const

type StepId = typeof STEPS[number]['id']

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState<StepId>('basics')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    fullName: '',
    partnerName: '',
    email: '',
    phone: '',
    projectType: '',
    eventDate: '',
    location: '',
    services: [] as string[],
    budget: '',
    howFound: '',
    message: '',
  })

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'basics':
        return formData.fullName.trim() && formData.email.trim()
      case 'event':
        return formData.projectType
      case 'services':
        return formData.services.length > 0
      case 'details':
        return true
      case 'investment':
        return formData.budget
      default:
        return true
    }
  }

  const nextStep = () => {
    const idx = currentStepIndex
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1].id)
    }
  }

  const prevStep = () => {
    const idx = currentStepIndex
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1].id)
    }
  }

  const goToStep = (stepId: StepId) => {
    const targetIndex = STEPS.findIndex(s => s.id === stepId)
    if (targetIndex <= currentStepIndex) {
      setCurrentStep(stepId)
    }
  }

  const handleSubmit = async () => {
    setStatus('idle')
    setLoading(true)

    const name = formData.partnerName
      ? `${formData.fullName} & ${formData.partnerName}`
      : formData.fullName

    let messageText = formData.message
    const additionalInfo: string[] = []
    if (formData.services.length > 0) additionalInfo.push(`Services interested in: ${formData.services.join(', ')}`)
    if (formData.budget) additionalInfo.push(`Budget range: ${formData.budget}`)
    if (formData.howFound) additionalInfo.push(`How they found us: ${formData.howFound}`)
    if (additionalInfo.length > 0) {
      messageText = messageText + '\n\n---\n' + additionalInfo.join('\n')
    }

    try {
      const res = await fetch('https://cruzcontrol.tech/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: formData.email,
          phone: formData.phone || undefined,
          projectType: formData.projectType,
          eventDate: formData.eventDate || undefined,
          location: formData.location || undefined,
          message: messageText,
          workspaceName: 'StoryCruz Films',
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[500px] flex items-center justify-center px-6"
      >
        <div className="text-center max-w-2xl">
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
            We&apos;ve received your inquiry and are excited to learn more about your story.
            Our team will review your details and get back to you within <span className="text-accent font-semibold">24–48 hours</span>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-all duration-300"
          >
            Return Home
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = idx < currentStepIndex
          const isClickable = idx <= currentStepIndex

          return (
            <button
              key={step.id}
              onClick={() => isClickable && goToStep(step.id)}
              disabled={!isClickable}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-accent text-white'
                  : isCompleted
                    ? 'bg-accent/20 text-accent cursor-pointer hover:bg-accent/30'
                    : 'bg-white/5 text-white/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs md:text-sm font-medium hidden sm:inline">{step.label}</span>
              <span className="text-xs font-medium sm:hidden">{idx + 1}</span>
            </button>
          )
        })}
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12 shadow-2xl"
      >
        <AnimatePresence mode="wait">

          {/* Step: The Basics */}
          {currentStep === 'basics' && (
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
                  <label className="block text-sm text-white/60 mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Partner&apos;s Name</label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => updateField('partnerName', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Partner's name (if applicable)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Your Event */}
          {currentStep === 'event' && (
            <motion.div
              key="event"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <Settings className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-serif text-white">Your Event</h2>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-4">What type of service do you need? *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Wedding', 'Engagement', 'Elopement', 'Portrait', 'Event', 'Commercial', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('projectType', type)}
                      className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
                        formData.projectType === type
                          ? 'bg-accent/20 border-accent text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateField('eventDate', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                    placeholder="City, Province or Venue"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Services */}
          {currentStep === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <Film className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-serif text-white">Services Needed</h2>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-4">What services are you interested in? *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'photography', label: 'Photography' },
                    { value: 'videography', label: 'Videography' },
                    { value: 'photo-video', label: 'Photo + Video' },
                  ].map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => toggleService(service.value)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-300 ${
                        formData.services.includes(service.value)
                          ? 'bg-accent/20 border-accent text-white'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <Film className={`w-8 h-8 ${formData.services.includes(service.value) ? 'text-accent' : ''}`} />
                      <span className="text-sm font-medium">{service.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step: Details */}
          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <Globe className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-serif text-white">Tell Us More</h2>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">How did you hear about us?</label>
                <input
                  type="text"
                  value={formData.howFound}
                  onChange={(e) => updateField('howFound', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
                  placeholder="Instagram, Google, Referral, etc."
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Share your story with us</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us about your love story, your vision for the day, or any questions you have..."
                />
              </div>
            </motion.div>
          )}

          {/* Step: Investment */}
          {currentStep === 'investment' && (
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
                  Do you have a specific budget range? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    '$2,000 – $4,000',
                    '$4,000 – $6,000',
                    '$6,000 – $10,000',
                    '$10,000+',
                    "I'm not sure yet",
                  ].map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => updateField('budget', budget)}
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

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-300">
                    There was an error submitting your inquiry. Please try again or contact us directly at hi@storycruzfilms.com
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
          <button
            type="button"
            onClick={prevStep}
            className={`px-6 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 ${
              currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            Previous
          </button>

          {currentStep === 'investment' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold uppercase tracking-wider text-sm transition-all duration-300 ${
                canProceed() && !loading
                  ? 'bg-accent hover:bg-accent/90 text-white'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {loading ? (
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
          ) : (
            <button
              type="button"
              onClick={nextStep}
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
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-white/40 text-sm mt-8">
        We typically respond within 24-48 hours
      </p>
    </div>
  )
}
