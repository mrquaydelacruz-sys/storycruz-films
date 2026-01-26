import { client } from "@/sanity/client";
import { Check, Star, Clock, Users, Camera, Video } from "lucide-react";
import FAQSection from "@/components/FAQSection";

export const revalidate = 0;

export const metadata = {
  title: 'Investment Guide | Story Cruz Films',
  robots: {
    index: false,
    follow: false,
  },
};

async function getData(slug: string) {
  return await client.fetch(`
    *[_type == "pricing" && slug.current == $slug][0]{
      ...,
      "videoUrl": heroVideo.asset->url
    }
  `, { slug });
}

export default async function InvestmentPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const data = await getData(slug);

  const videoSource = data?.videoUrl || "/inquire-bg.mp4";

  if (!data) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4 px-6 text-center">
      <h1 className="text-3xl font-serif text-white">Page Not Found</h1>
      <p className="text-white/50 tracking-wide uppercase text-xs">This investment link is invalid or has expired.</p>
      <a href="/" className="border-b border-white/30 pb-1 text-sm hover:text-accent transition-colors">Return Home</a>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      
      {/* HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-50">
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-10 animate-in fade-in zoom-in duration-1000">
          <div className="flex justify-center mb-6 gap-2 text-yellow-500/80">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
          </div>
          <p className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-white/60 mb-8">Official Investment Guide</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">{data.title || "Your Legacy."}</h1>
          <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
            We don't just capture events; we craft heirlooms. Below you will find the collections we have curated for your story.
          </p>
        </div>
      </section>

      {/* PACKAGES & FAQ SECTION */}
      <section className="relative z-20 px-6 pb-32 -mt-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24">
          
          {/* VIDEO PACKAGES */}
          {data.videoPackages && data.videoPackages.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-center mb-8 flex items-center justify-center gap-4">
                <span className="h-[1px] w-12 bg-white/20"></span>Cinematography<span className="h-[1px] w-12 bg-white/20"></span>
              </h2>
              {data.videoPackages.map((pkg: any, i: number) => (
                <div key={i} className="group relative bg-white/5 backdrop-blur-md p-10 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6 gap-2">
                    <h3 className="text-2xl font-serif text-white">{pkg.name}</h3>
                    <span className="text-xl font-light text-white/90">{pkg.price}</span>
                  </div>
                  <p className="text-white/60 text-sm mb-8 border-l-2 border-white/10 pl-4">{pkg.description}</p>
                  <ul className="space-y-4">
                    {pkg.features?.map((feat: string, j: number) => (
                      <li key={j} className="flex gap-4 text-sm text-white/70 group-hover:text-white transition-colors">
                        <Check size={16} className="text-white/40 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* PHOTO PACKAGES */}
          {data.photoPackages && data.photoPackages.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-serif text-center mb-8 flex items-center justify-center gap-4">
                <span className="h-[1px] w-12 bg-white/20"></span>Photography<span className="h-[1px] w-12 bg-white/20"></span>
              </h2>
              {data.photoPackages.map((pkg: any, i: number) => (
                <div key={i} className="group relative bg-white/5 backdrop-blur-md p-10 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6 gap-2">
                    <h3 className="text-2xl font-serif text-white">{pkg.name}</h3>
                    <span className="text-xl font-light text-white/90">{pkg.price}</span>
                  </div>
                  <p className="text-white/60 text-sm mb-8 border-l-2 border-white/10 pl-4">{pkg.description}</p>
                  <ul className="space-y-4">
                    {pkg.features?.map((feat: string, j: number) => (
                      <li key={j} className="flex gap-4 text-sm text-white/70 group-hover:text-white transition-colors">
                        <Check size={16} className="text-white/40 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEASONAL & INTIMATE COLLECTIONS */}
        {data.seasonalCollections?.enabled && data.seasonalCollections.tiers?.length > 0 && (
          <div className="max-w-7xl mx-auto mb-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 flex items-center justify-center gap-4">
                <span className="h-[1px] w-16 bg-white/20"></span>
                {data.seasonalCollections.sectionTitle || "Seasonal Collections"}
                <span className="h-[1px] w-16 bg-white/20"></span>
              </h2>
              {data.seasonalCollections.availability && (
                <p className="text-white/50 text-sm tracking-wide max-w-2xl mx-auto">
                  {data.seasonalCollections.availability}
                </p>
              )}
            </div>

            <div className="space-y-16">
              {data.seasonalCollections.tiers.map((tier: any, tierIndex: number) => (
                <div key={tierIndex} className="space-y-8">
                  {/* Tier Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <Clock size={16} className="text-white/40" />
                      <span className="text-xs tracking-[0.3em] uppercase text-white/40">{tier.duration}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
                      {tier.tierName || `Tier ${tier.tierNumber}`}
                    </h3>
                    {tier.tagline && (
                      <p className="text-white/50 text-sm max-w-xl mx-auto">{tier.tagline}</p>
                    )}
                  </div>

                  {/* Options Grid */}
                  {tier.hasMultipleOptions && tier.options?.length > 0 ? (
                    /* Multiple Options (A/B) */
                    <div className={`grid grid-cols-1 ${tier.options.length === 2 ? 'lg:grid-cols-2' : tier.options.length >= 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
                      {tier.options.map((option: any, optIndex: number) => (
                        <div key={optIndex} className="group relative bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-500">
                          {/* Option Label Badge */}
                          <div className="absolute -top-3 left-8">
                            <span className="bg-white/10 backdrop-blur-sm px-4 py-1 text-xs tracking-[0.2em] uppercase text-white/70 border border-white/10">
                              {option.optionLabel}
                            </span>
                          </div>

                          <div className="pt-4">
                            <h4 className="text-xl font-serif text-white mb-2">{option.optionName}</h4>
                            <p className="text-2xl font-light text-white/90 mb-6">{option.price}</p>

                            {/* Coverage & Team */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                              {option.coverage && (
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                  <Clock size={14} className="text-white/40" />
                                  <span>{option.coverage}</span>
                                </div>
                              )}
                              {option.team && (
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                  <Users size={14} className="text-white/40" />
                                  <span>{option.team}</span>
                                </div>
                              )}
                              {option.guestCap && (
                                <div className="flex items-center gap-3 text-sm text-white/60">
                                  <Users size={14} className="text-white/40" />
                                  <span>{option.guestCap}</span>
                                </div>
                              )}
                            </div>

                            {/* Media Choice */}
                            {option.mediaChoice && (
                              <div className="mb-6 p-4 bg-white/5 rounded-sm border-l-2 border-white/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Camera size={14} className="text-white/50" />
                                  <span className="text-xs tracking-wide uppercase text-white/50">Choose Your Medium</span>
                                  <Video size={14} className="text-white/50" />
                                </div>
                                <p className="text-sm text-white/70">{option.mediaChoice}</p>
                              </div>
                            )}

                            {/* Deliverables */}
                            {option.deliverables?.length > 0 && (
                              <ul className="space-y-3 mb-6">
                                {option.deliverables.map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3 text-sm text-white/70 group-hover:text-white transition-colors">
                                    <Check size={14} className="text-white/40 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Why It Works */}
                            {option.whyItWorks && (
                              <p className="text-xs text-white/40 italic border-t border-white/10 pt-4">
                                {option.whyItWorks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Single Option Tier */
                    <div className="max-w-2xl mx-auto">
                      <div className="group relative bg-white/5 backdrop-blur-md p-10 rounded-sm border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-500">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-6 gap-2">
                          <h4 className="text-xl font-serif text-white">{tier.tierName}</h4>
                          <span className="text-2xl font-light text-white/90">{tier.singlePrice}</span>
                        </div>

                        {/* Coverage & Team */}
                        <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                          {tier.singleCoverage && (
                            <div className="flex items-center gap-3 text-sm text-white/60">
                              <Clock size={14} className="text-white/40" />
                              <span>{tier.singleCoverage}</span>
                            </div>
                          )}
                          {tier.singleTeam && (
                            <div className="flex items-center gap-3 text-sm text-white/60">
                              <Users size={14} className="text-white/40" />
                              <span>{tier.singleTeam}</span>
                            </div>
                          )}
                          {tier.singleGuestCap && (
                            <div className="flex items-center gap-3 text-sm text-white/60">
                              <Users size={14} className="text-white/40" />
                              <span>{tier.singleGuestCap}</span>
                            </div>
                          )}
                        </div>

                        {/* Deliverables */}
                        {tier.singleDeliverables?.length > 0 && (
                          <ul className="space-y-4 mb-6">
                            {tier.singleDeliverables.map((item: string, i: number) => (
                              <li key={i} className="flex gap-4 text-sm text-white/70 group-hover:text-white transition-colors">
                                <Check size={16} className="text-white/40 mt-0.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Best For */}
                        {tier.singleBestFor && (
                          <p className="text-sm text-white/50 italic border-l-2 border-white/10 pl-4">
                            {tier.singleBestFor}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- FAQ SECTION PLACED HERE --- */}
        <FAQSection faqs={data.faqs} />

        <div className="text-center mt-20 max-w-2xl mx-auto">
            <p className="text-white/30 text-xs tracking-widest uppercase">
                Story Cruz Films • Investment Guide 2025
            </p>
        </div>
      </section>
    </main>
  );
}