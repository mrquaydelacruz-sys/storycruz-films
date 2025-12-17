import Hero from "@/components/Hero";
import { client, urlFor } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import FeaturedFilms from "@/components/FeaturedFilms";
import Testimonials from "@/components/Testimonials";
import IntroSlideshow from "@/components/IntroSlideshow";
import BackgroundWater from "@/components/BackgroundWater"; // 1. Import the background

async function getData() {
  const home = await client.fetch(`*[_type == "homepage"][0]{
    heroTitle,
    heroSubtitle,
    "heroVideoUrl": heroVideo.asset->url, 
    introHeading,
    introText,
    introLeftImage,
    introSlideshow[] { asset->{ url, metadata { dimensions } } },
    introRightImage,
    dividerImage,
    testimonials
  }`);

  // FIX: Ensure this is "const" and not "onst"
  const featuredFilms = await client.fetch(`
  *[_type == "film" && featured == true] | order(publishedAt desc)[0...2] {
    title,
    slug,
    youtubeUrl,
    customThumbnail // Ensure this is just the field name, not re-mapped
  }
`);

  return { home, featuredFilms };
}

export default async function Home() {
  const { home, featuredFilms } = await getData();

  return (
    // 2. Change bg-black to bg-transparent
    <main className="relative w-full min-h-screen text-offwhite bg-transparent">
      
      {/* 3. Add the background component */}
      <BackgroundWater />
      
      {/* 4. Wrap everything else in a relative z-10 container */}
      <div className="relative z-10">
        {/* 1. HERO */}
        <Hero videoUrl={home?.heroVideoUrl} />
        
        {/* 2. RETRO MAGAZINE SPREAD */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-4">
              {home?.introHeading || "Welcome, you're in good company."}
            </h2>
            <p className="text-xs md:text-sm font-sans text-neutral-400 uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
              {home?.introText || "We believe in the beauty of the moment."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* LEFT IMAGE */}
            <div className="md:col-span-3">
              {home?.introLeftImage && (
                <div className="bg-[#fdfdfd] p-[3px] shadow-lg rotate-[-1.5deg] hover:rotate-0 transition-transform duration-700 aspect-[3/4] relative">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image 
                      src={urlFor(home.introLeftImage).width(600).url()} 
                      alt="Intro Left"
                      fill
                      className="object-cover" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CENTER SLIDESHOW */}
            <div className="md:col-span-3">
              {home?.introSlideshow && home.introSlideshow.length > 0 && (
                <div className="bg-[#fdfdfd] p-[3px] shadow-lg rotate-[0.5deg] aspect-[3/4] relative z-10">
                  <div className="relative w-full h-full overflow-hidden">
                     <IntroSlideshow images={home.introSlideshow} />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT IMAGE */}
            <div className="md:col-span-6">
              {home?.introRightImage && (
                <div className="bg-[#fdfdfd] p-[4px] shadow-lg rotate-[1deg] hover:rotate-0 transition-transform duration-700 aspect-video relative">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image 
                      src={urlFor(home.introRightImage).width(1200).url()} 
                      alt="Feature Landscape"
                      fill
                      className="object-cover" 
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Link href="/about" className="text-[10px] uppercase tracking-[0.2em] text-white/60 border-b border-white/20 pb-1 hover:text-accent hover:border-accent transition-all">
                  More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CINEMATIC DIVIDER */}
        {home?.dividerImage && (
          <section className="relative w-full h-[40vh] md:h-[80vh] overflow-hidden my-20">
             <Image 
               src={urlFor(home.dividerImage).url()} 
               alt="Cinematic Moment" 
               fill 
               className="object-cover opacity-60" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </section>
        )}

        {/* 4. FEATURED FILMS SECTION */}
        <FeaturedFilms films={featuredFilms} />

        {/* 5. LOVE NOTES */}
        {home?.testimonials && <Testimonials reviews={home.testimonials} />}

        {/* 6. FOOTER */}
        <section className="h-[20vh] flex items-center justify-center text-neutral-600 text-sm">
          © 2025 StoryCruz Films
        </section>
      </div>
    </main>
  );
}