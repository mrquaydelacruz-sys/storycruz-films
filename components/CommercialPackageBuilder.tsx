'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Clapperboard,
  Send,
  CheckCircle,
  ArrowRight,
  Plus,
  Check,
  Building2,
  Calendar,
  MapPin,
  SquarePen,
  Layers,
  Clock,
  Minus,
  Camera,
  Mic,
  Lamp,
  SlidersHorizontal,
} from 'lucide-react'
import BackgroundWater from '@/components/BackgroundWater'
import {
  COMMERCIAL_FILMING,
  COMMERCIAL_GEAR_OPTIONS,
  COMMERCIAL_INCLUDED_CAMERAS,
  COMMERCIAL_MAX_CAMERAS,
  COMMERCIAL_PRESETS,
  COMMERCIAL_PROJECT_TYPES,
  clampExtraCameras,
  commercialExtraCameraUnitLabel,
  commercialExtraCameraUnitPrice,
  commercialGearCredit,
  commercialGearCreditLabel,
  estimateCommercialTotal,
  formatCad,
  getCommercialEditOptions,
  type CommercialEditId,
  type CommercialFilmingId,
  type CommercialGearId,
  type CommercialProjectType,
  type CommercialCatalogOption,
} from '@/lib/commercial-package-catalog'

function OptionCard({
  item,
  selected,
  onSelect,
  priceFlashKey,
}: {
  item: CommercialCatalogOption
  selected: boolean
  onSelect: () => void
  /** Remounts the price line when filming duration changes so $400 ↔ $650 is obvious. */
  priceFlashKey?: string
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`w-full text-left rounded-xl border transition-all duration-300 px-4 py-4 flex gap-4 ${
          selected
            ? 'bg-accent/15 border-accent/80 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'
            : 'bg-white/[0.03] border-white/10 hover:border-white/25'
        }`}
      >
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
            selected
              ? 'border-accent bg-accent text-white'
              : 'border-white/20 bg-white/5 text-white/50'
          }`}
        >
          {selected ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="font-medium text-white">
              {item.title}
              {item.subtitle ? (
                <span className="text-white/45 font-normal text-sm"> · {item.subtitle}</span>
              ) : null}
            </span>
            <span
              key={priceFlashKey ?? item.priceLabel}
              className={`text-xs shrink-0 tabular-nums ${
                selected ? 'text-accent font-medium' : 'text-white/40'
              }`}
            >
              {item.priceLabel}
            </span>
          </span>
          {item.priceNote ? (
            <span
              key={`note-${priceFlashKey ?? item.priceNote}`}
              className="block text-[11px] text-white/40 mt-1.5 leading-snug"
            >
              {item.priceNote}
            </span>
          ) : null}
          <span className="block text-sm text-white/55 mt-1 leading-snug">{item.description}</span>
          <ul className="mt-3 space-y-1.5">
            {item.included.map((line) => (
              <li key={line} className="flex gap-2 text-[13px] text-white/65 leading-snug">
                <Check className="w-3.5 h-3.5 text-accent/80 shrink-0 mt-0.5" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </span>
      </button>
    </li>
  )
}

export default function CommercialPackageBuilder() {
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [projectType, setProjectType] = useState<CommercialProjectType | null>('meeting')
  const [shootDate, setShootDate] = useState('')
  const [location, setLocation] = useState('')
  const [durationHint, setDurationHint] = useState('')
  const [notes, setNotes] = useState('')

  const [filmingId, setFilmingId] = useState<CommercialFilmingId | null>(null)
  const [editId, setEditId] = useState<CommercialEditId | null>(null)
  const [extraCameras, setExtraCameras] = useState(0)
  const [includeCameras, setIncludeCameras] = useState(true)
  const [includeAudio, setIncludeAudio] = useState(true)
  const [includeLighting, setIncludeLighting] = useState(true)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const extras = clampExtraCameras(extraCameras)
  const totalCameras = COMMERCIAL_INCLUDED_CAMERAS + extras
  const maxExtra = COMMERCIAL_MAX_CAMERAS - COMMERCIAL_INCLUDED_CAMERAS

  const editOptions = useMemo(() => getCommercialEditOptions(filmingId), [filmingId])
  const estimate = estimateCommercialTotal({
    filmingId,
    editId,
    extraCameras: extras,
    includeCameras,
    includeAudio,
    includeLighting,
  })

  const selectedFilming = COMMERCIAL_FILMING.find((f) => f.id === filmingId) ?? null
  const selectedEdit = editOptions.find((e) => e.id === editId) ?? null
  const extraCamerasSubtotal =
    filmingId && extras > 0 ? extras * commercialExtraCameraUnitPrice(filmingId) : 0
  const gearCredits =
    (includeCameras ? 0 : commercialGearCredit('cameras', filmingId)) +
    (includeAudio ? 0 : commercialGearCredit('audio', filmingId)) +
    (includeLighting ? 0 : commercialGearCredit('lighting', filmingId))

  const gearIncluded: Record<CommercialGearId, boolean> = {
    cameras: includeCameras,
    audio: includeAudio,
    lighting: includeLighting,
  }

  const activePresetId =
    extras === 0 && includeCameras && includeAudio && includeLighting
      ? COMMERCIAL_PRESETS.find((p) => p.filmingId === filmingId && p.editId === editId)?.id
      : undefined

  const canSubmit =
    companyName.trim() &&
    contactPerson.trim() &&
    email.trim() &&
    projectType != null &&
    filmingId != null &&
    editId != null

  const applyPreset = (presetId: string) => {
    const preset = COMMERCIAL_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setFilmingId(preset.filmingId)
    setEditId(preset.editId)
    setExtraCameras(0)
    setIncludeCameras(true)
    setIncludeAudio(true)
    setIncludeLighting(true)
  }

  const toggleGear = (id: CommercialGearId, next: boolean) => {
    if (id === 'cameras') setIncludeCameras(next)
    else if (id === 'audio') setIncludeAudio(next)
    else setIncludeLighting(next)
  }

  const selectFilming = (id: CommercialFilmingId) => {
    setFilmingId(id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/commercial-package-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName.trim(),
          contactPerson: contactPerson.trim(),
          email: email.trim(),
          phone: phone.trim(),
          projectType,
          shootDate: shootDate || undefined,
          location: location.trim() || undefined,
          durationHint: durationHint.trim() || undefined,
          notes: notes.trim() || undefined,
          filmingId,
          filmingTitle: selectedFilming?.title,
          filmingPrice: selectedFilming?.priceLabel,
          editId,
          editTitle: selectedEdit?.title,
          editPrice: selectedEdit?.priceLabel,
          extraCameras: extras,
          totalCameras,
          extraCamerasUnitPrice: filmingId
            ? commercialExtraCameraUnitPrice(filmingId)
            : undefined,
          includeCameras,
          includeAudio,
          includeLighting,
          gearCredits,
          estimatedTotalCad: estimate,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit')
      }
      setIsSubmitted(true)
    } catch {
      setSubmitError('Something went wrong sending your quote request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-black text-white relative overflow-hidden">
        <BackgroundWater />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-accent" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Quote received</h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Thanks{contactPerson.trim() ? `, ${contactPerson.trim().split(' ')[0]}` : ''}. We&apos;ll
              review your commercial package and follow up within{' '}
              <span className="text-accent font-medium">24–48 hours</span> with a confirmed quote.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-all duration-300"
            >
              Return home
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-white/20">
      <BackgroundWater />

      <div className="relative z-10 pt-32 pb-0 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-accent mb-4">
              Commercial services
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
              Corporate package builder
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Build a clear quote for meeting captures, panels, and small corporate shoots — filming
              hours first, then the edit level you need.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 px-6 md:px-12 pb-28 pt-4">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Project info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl mb-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-6 h-6 text-accent shrink-0" />
                <h2 className="text-2xl font-serif text-white">Project info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Company *</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="Company or organization"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Contact person *</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Work email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="(403) 555-0100"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm text-white/60 mb-4">Project type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {COMMERCIAL_PROJECT_TYPES.map((opt) => {
                    const isSelected = projectType === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProjectType(opt.value)}
                        className={`px-4 py-3 rounded-xl border text-center text-sm transition-all duration-300 ${
                          isSelected
                            ? 'bg-accent/20 border-accent text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Shoot date
                  </label>
                  <input
                    type="date"
                    value={shootDate}
                    onChange={(e) => setShootDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="City or venue"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Approx. duration
                  </label>
                  <input
                    type="text"
                    value={durationHint}
                    onChange={(e) => setDurationHint(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent"
                    placeholder="e.g. 2 hours, half day"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick packages */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-10"
            >
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-serif text-white">Quick packages</h2>
              </div>
              <p className="text-sm text-white/50 mb-6 max-w-2xl">
                One tap fills filming + edit (2 cameras). Add more cameras below if needed.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMERCIAL_PRESETS.map((preset) => {
                  const total = estimateCommercialTotal({
                    filmingId: preset.filmingId,
                    editId: preset.editId,
                    extraCameras: 0,
                  })
                  const active = activePresetId === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={`text-left rounded-xl border px-5 py-5 transition-all duration-300 ${
                        active
                          ? 'bg-accent/15 border-accent/80'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="font-medium text-white">{preset.title}</span>
                        {total != null ? (
                          <span className="text-sm text-accent tabular-nums font-medium">
                            ~{formatCad(total)} + GST
                          </span>
                        ) : null}
                      </div>
                      {preset.badge ? (
                        <span className="inline-block text-[10px] uppercase tracking-wider text-accent/90 mb-2">
                          {preset.badge}
                        </span>
                      ) : null}
                      <p className="text-sm text-white/55 leading-snug">{preset.blurb}</p>
                    </button>
                  )
                })}
              </div>
            </motion.section>

            {/* Filming | Editing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-10">
              <motion.section
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Video className="w-7 h-7 text-accent" />
                  <div>
                    <h2 className="text-xl font-serif text-white">Filming & gear</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider mt-1">
                      Choose half-day or full-day
                    </p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {COMMERCIAL_FILMING.map((item) => (
                    <OptionCard
                      key={item.id}
                      item={item}
                      selected={filmingId === item.id}
                      onSelect={() => selectFilming(item.id as CommercialFilmingId)}
                    />
                  ))}
                </ul>

                {/* Customize cameras / audio / lighting */}
                <div
                  className={`mt-6 rounded-xl border px-4 py-4 transition-colors ${
                    filmingId
                      ? 'border-white/10 bg-white/[0.03]'
                      : 'border-white/5 bg-white/[0.02] opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <SlidersHorizontal className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm">Customize cameras, audio & lighting</p>
                      <p className="text-[13px] text-white/50 mt-1 leading-snug">
                        All three are included by default. Turn any off if you&apos;re bringing your
                        own — we&apos;ll credit that gear off the filming rate. Operator labor stays
                        included when you supply cameras.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {COMMERCIAL_GEAR_OPTIONS.map((gear) => {
                      const included = gearIncluded[gear.id]
                      const Icon =
                        gear.id === 'cameras' ? Camera : gear.id === 'audio' ? Mic : Lamp
                      const creditLabel = commercialGearCreditLabel(gear.id, filmingId)
                      return (
                        <li key={gear.id}>
                          <button
                            type="button"
                            disabled={!filmingId}
                            onClick={() => toggleGear(gear.id, !included)}
                            aria-pressed={included}
                            className={`w-full text-left rounded-lg border px-3 py-3 flex gap-3 transition-all disabled:cursor-not-allowed ${
                              included
                                ? 'border-accent/50 bg-accent/10'
                                : 'border-white/10 bg-black/20'
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                                included
                                  ? 'border-accent bg-accent text-white'
                                  : 'border-white/20 bg-white/5 text-white/45'
                              }`}
                            >
                              {included ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <span className="font-medium text-white text-sm">{gear.title}</span>
                                <span
                                  className={`text-[11px] shrink-0 tabular-nums ${
                                    included ? 'text-white/40' : 'text-accent'
                                  }`}
                                >
                                  {included ? 'Included' : creditLabel}
                                </span>
                              </span>
                              <span className="block text-[13px] text-white/50 mt-1 leading-snug">
                                {included ? gear.includedLabel : gear.removedLabel}
                              </span>
                              <span className="block text-[11px] text-white/35 mt-1 leading-snug">
                                {gear.description}
                              </span>
                              {!included ? (
                                <span
                                  role="note"
                                  className="mt-2 block rounded-md border border-white/10 bg-black/30 px-2.5 py-2 text-[11px] leading-snug text-white/65"
                                >
                                  {gear.removedDisclaimer}
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Extra cameras / operators */}
                <div
                  className={`mt-4 rounded-xl border px-4 py-4 transition-colors ${
                    filmingId
                      ? 'border-white/10 bg-white/[0.03]'
                      : 'border-white/5 bg-white/[0.02] opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Camera className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white text-sm">
                        {includeCameras
                          ? 'Need more cameras?'
                          : 'Need more operators / angles?'}
                      </p>
                      <p className="text-[13px] text-white/50 mt-1 leading-snug">
                        {includeCameras ? (
                          <>
                            Packages include {COMMERCIAL_INCLUDED_CAMERAS} cameras with operators.
                            Add up to {maxExtra} more (max {COMMERCIAL_MAX_CAMERAS} total) for wider
                            coverage or audience / cutaway angles.
                          </>
                        ) : (
                          <>
                            Crew labor for {COMMERCIAL_INCLUDED_CAMERAS} operators stays included.
                            Add up to {maxExtra} more operators / angles — you supply those camera
                            bodies as well (or note mixed gear below).
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!filmingId || extras <= 0}
                        onClick={() => setExtraCameras((n) => clampExtraCameras(n - 1))}
                        className="h-9 w-9 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
                        aria-label={includeCameras ? 'Remove extra camera' : 'Remove extra operator'}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[7.5rem] text-center text-sm tabular-nums text-white">
                        <span className="font-medium">{totalCameras}</span>
                        <span className="text-white/45">
                          {includeCameras ? ' cameras' : ' operators'}
                        </span>
                        {extras > 0 ? (
                          <span className="block text-[10px] uppercase tracking-wider text-accent/90 mt-0.5">
                            +{extras} extra
                          </span>
                        ) : null}
                      </span>
                      <button
                        type="button"
                        disabled={!filmingId || extras >= maxExtra}
                        onClick={() => setExtraCameras((n) => clampExtraCameras(n + 1))}
                        className="h-9 w-9 rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center justify-center"
                        aria-label={includeCameras ? 'Add extra camera' : 'Add extra operator'}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-white/45 tabular-nums text-right">
                      {filmingId ? (
                        extras > 0 ? (
                          <>
                            +{formatCad(extraCamerasSubtotal)}{' '}
                            <span className="text-white/35">
                              ({commercialExtraCameraUnitLabel(filmingId)})
                            </span>
                          </>
                        ) : (
                          <span>{commercialExtraCameraUnitLabel(filmingId)}</span>
                        )
                      ) : (
                        <span>Select filming first</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Clapperboard className="w-7 h-7 text-accent" />
                  <div>
                    <h2 className="text-xl font-serif text-white">Editing & post</h2>
                    <p className="text-xs text-white/45 uppercase tracking-wider mt-1">
                      Raw delivery or basic multi-cam edit
                    </p>
                  </div>
                </div>
                {!filmingId ? (
                  <p className="text-sm text-white/40 italic mb-4">
                    Select a filming duration first — basic edit pricing switches between{' '}
                    <span className="text-white/55 not-italic">$400</span> (half-day) and{' '}
                    <span className="text-white/55 not-italic">$650</span> (full-day).
                  </p>
                ) : (
                  <p className="text-sm text-white/45 mb-4">
                    Basic Multi-Cam Edit is currently{' '}
                    <span className="text-accent font-medium tabular-nums">
                      {filmingId === 'full-day' ? '$650 + GST' : '$400 + GST'}
                    </span>{' '}
                    for your {filmingId === 'full-day' ? 'full-day' : 'half-day'} shoot.
                  </p>
                )}
                <ul className="space-y-4">
                  {editOptions.map((item) => (
                    <OptionCard
                      key={item.id}
                      item={item}
                      selected={editId === item.id}
                      onSelect={() => setEditId(item.id as CommercialEditId)}
                      priceFlashKey={
                        item.id === 'basic-edit' ? `basic-${filmingId ?? 'none'}` : undefined
                      }
                    />
                  ))}
                </ul>
              </motion.section>
            </div>

            {/* Live estimate */}
            <AnimatePresence>
              {(filmingId || editId) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl mb-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                        Filming & gear
                      </p>
                      <p className="text-lg font-medium text-accent tabular-nums">
                        {selectedFilming
                          ? formatCad(
                              (selectedFilming.priceCad ?? 0) +
                                extraCamerasSubtotal -
                                gearCredits
                            )
                          : '—'}
                      </p>
                      {gearCredits > 0 ? (
                        <p className="text-[10px] text-white/40 mt-1 tabular-nums">
                          Includes −{formatCad(gearCredits)} gear credit
                          {extras > 0
                            ? ` · +${formatCad(extraCamerasSubtotal)} ${includeCameras ? 'cameras' : 'operators'}`
                            : ''}
                        </p>
                      ) : extras > 0 ? (
                        <p className="text-[10px] text-white/40 mt-1 tabular-nums">
                          Includes +{formatCad(extraCamerasSubtotal)} extra{' '}
                          {includeCameras ? 'cameras' : 'operators'}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                        Editing & post
                      </p>
                      <p
                        key={`edit-est-${filmingId}-${editId}`}
                        className="text-lg font-medium text-accent tabular-nums"
                      >
                        {selectedEdit
                          ? selectedEdit.priceCad === 0
                            ? 'Included'
                            : selectedEdit.priceCad != null
                              ? formatCad(selectedEdit.priceCad)
                              : selectedEdit.priceLabel
                          : '—'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1">
                        Combined estimate (pre-tax)
                      </p>
                      <p className="text-lg font-medium text-white tabular-nums">
                        {estimate != null ? `${formatCad(estimate)}` : '—'}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">GST added on final invoice</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 mt-4 leading-relaxed">
                    Pre-tax estimate for planning. Final quote confirms crew size, venue access, and
                    deliverable specs. GST is not included in these totals.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Review */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <SquarePen className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-serif text-white">Review & notes</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45 mb-3">
                    Filming selection
                  </p>
                  {selectedFilming ? (
                    <div className="space-y-2">
                      <p className="text-sm text-white/85 flex gap-2">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>
                          <span className="font-medium text-white">{selectedFilming.title}</span>
                          <span className="text-white/50"> · {selectedFilming.priceLabel}</span>
                        </span>
                      </p>
                      <p className="text-sm text-white/85 flex gap-2 pl-0">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>
                          <span className="font-medium text-white">
                            {totalCameras} operator
                            {totalCameras === 1 ? '' : 's'} / angle
                            {totalCameras === 1 ? '' : 's'}
                          </span>
                          <span className="text-white/50">
                            {includeCameras
                              ? extras > 0
                                ? ` · ${COMMERCIAL_INCLUDED_CAMERAS} cameras included + ${extras} extra (${formatCad(extraCamerasSubtotal)})`
                                : ` · ${COMMERCIAL_INCLUDED_CAMERAS} production cameras included`
                              : extras > 0
                                ? ` · client cameras · +${extras} extra operators (${formatCad(extraCamerasSubtotal)})`
                                : ' · client-supplied cameras · crew labor included'}
                          </span>
                        </span>
                      </p>
                      {COMMERCIAL_GEAR_OPTIONS.map((gear) => {
                        const included = gearIncluded[gear.id]
                        return (
                          <p key={gear.id} className="text-sm text-white/85 flex gap-2">
                            <Check
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                included ? 'text-accent' : 'text-white/30'
                              }`}
                            />
                            <span>
                              <span
                                className={`font-medium ${included ? 'text-white' : 'text-white/55'}`}
                              >
                                {included ? gear.includedLabel : gear.removedLabel}
                              </span>
                              {!included && filmingId ? (
                                <span className="text-accent/90">
                                  {' '}
                                  · −{formatCad(commercialGearCredit(gear.id, filmingId))}
                                </span>
                              ) : null}
                            </span>
                          </p>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-white/35 italic">Nothing selected yet.</p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45 mb-3">
                    Edit selection
                  </p>
                  {selectedEdit ? (
                    <p className="text-sm text-white/85 flex gap-2">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>
                        <span className="font-medium text-white">{selectedEdit.title}</span>
                        <span className="text-white/50"> · {selectedEdit.priceLabel}</span>
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-white/35 italic">Nothing selected yet.</p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-white/60 mb-2">
                  Anything else we should know?
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-accent resize-y min-h-[120px]"
                  placeholder="Agenda length, speaker count, room layout, branding needs, delivery deadline…"
                />
              </div>

              {submitError ? (
                <p className="text-sm text-red-300/90 mb-4" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Combined estimate (pre-tax)
                  </p>
                  <p className="text-2xl font-serif text-white tabular-nums mt-1">
                    {estimate != null ? formatCad(estimate) : '—'}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1">
                    GST will be added on the final invoice
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold uppercase tracking-wider text-sm rounded-full transition-all duration-300"
                >
                  {isSubmitting ? 'Sending…' : 'Request this quote'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-white/35 mt-4">
                Prefer a larger branded production?{' '}
                <a href="/commercial" className="text-white/55 underline underline-offset-2 hover:text-accent">
                  Use the full commercial inquiry
                </a>
                .
              </p>
            </motion.div>
          </form>
        </div>
      </div>
    </main>
  )
}
