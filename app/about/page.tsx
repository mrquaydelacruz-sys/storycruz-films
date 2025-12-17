import { client, urlFor } from "@/sanity/client";
import Image from "next/image";
import AboutSlideshow from "@/components/AboutSlideshow";
import SignatureAnimation from "@/components/SignatureAnimation";

async function getData() {
  return await client.fetch(`*[_type == "siteContent"][0]{
    aboutTitle,
    aboutText,
    aboutImage,
    aboutSignature,
    aboutSlideshow,
    signatureGif // <--- Fetch the GIF
  }`);
}

export default async function AboutPage() {
  const data = await getData();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-black">
      
      {/* 1. TOP SECTION: Bio */}
      <div className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
        
        {/* Left Column: Bio Image */}
        <div className="relative aspect-[3/4] w-full bg-neutral-900 rounded-sm overflow-hidden">
          {data?.aboutImage && (
            <Image 
              src={urlFor(data.aboutImage).url()} 
              alt="About Us" 
              fill 
              className="object-cover"
            />
          )}
        </div>

        {/* Right Column: Bio Text */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
            {data?.aboutTitle || "Our Story"}
          </h1>
          <div className="text-offwhite/80 font-sans leading-relaxed text-lg whitespace-pre-wrap">
            {data?.aboutText}
          </div>

          {/* --- SIGNATURE SECTION (GIF or Animation) --- */}
          <div className="mt-12 mb-10 min-h-[100px]">
            
            {/* OPTION A: If a GIF is uploaded in Sanity, show it */}
            {data?.signatureGif ? (
              <div className="relative w-64 h-32">
                <Image 
                  src={urlFor(data.signatureGif).url()}
                  alt="Signature"
                  fill
                  className="object-contain object-left"
                  unoptimized // Required for GIFs to play
                />
              </div>
            ) : (
              /* OPTION B: If no GIF, use the code animation */
              data?.aboutSignature && <SignatureAnimation text={data.aboutSignature} />
            )}

          </div>
          {/* ------------------------------------------- */}

        </div>
      </div>

      {/* 2. SLIDESHOW DIVIDER */}
      {data?.aboutSlideshow && (
        <div className="w-full mb-24">
          <AboutSlideshow images={data.aboutSlideshow} />
        </div>
      )}

      {/* 3. CTA SECTION */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
          Ready to tell your story?
        </h2>
        <a 
          href="https://storycruzfilms.pixieset.com/contact-form/cf_eniioOifaksZ9zgpyOAUktqPicDw" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-white text-black px-12 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-accent hover:text-white transition-all duration-500"
        >
          Connect With Us
        </a>
      </section>

    </main>
  );
}