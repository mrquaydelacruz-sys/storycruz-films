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
    signatureGif,
    aboutSlideshow,
    
    // Fetch Christine's new data
    christineTitle,
    christineText,
    christineImage,
    christineSignature
  }`);
}

export default async function AboutPage() {
  const data = await getData();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-black">
      
      {/* --- SECTION 1: MAIN BIO (QUAY / TOGETHER) --- */}
      <div className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
        {/* Left: Image */}
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

        {/* Right: Text */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
            {data?.aboutTitle || "Our Story"}
          </h1>
          <div className="text-offwhite/80 font-sans leading-relaxed text-lg whitespace-pre-wrap">
            {data?.aboutText}
          </div>

          {/* Signature 1 (Gif or Text) */}
          <div className="mt-12 mb-10 min-h-[100px]">
            {data?.signatureGif ? (
              <div className="relative w-64 h-32">
                <Image 
                  src={urlFor(data.signatureGif).url()}
                  alt="Signature"
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            ) : (
              data?.aboutSignature && <SignatureAnimation text={data.aboutSignature} />
            )}
          </div>
        </div>
      </div>


      {/* --- SECTION 2: CHRISTINE'S BIO --- */}
      {/* Only shows if you upload Christine's photo in Sanity */}
      {data?.christineImage && (
        <div className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* Left: Christine's Image */}
          <div className="relative aspect-[3/4] w-full bg-neutral-900 rounded-sm overflow-hidden">
             <Image 
                src={urlFor(data.christineImage).url()} 
                alt="Christine" 
                fill 
                className="object-cover"
              />
          </div>

          {/* Right: Christine's Text */}
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
              {data?.christineTitle || "Christine"}
            </h2>
            <div className="text-offwhite/80 font-sans leading-relaxed text-lg whitespace-pre-wrap">
              {data?.christineText}
            </div>

            {/* Optional: Christine's Signature */}
            {data?.christineSignature && (
              <div className="mt-12 mb-10 min-h-[80px]">
                <SignatureAnimation text={data.christineSignature} />
              </div>
            )}
          </div>
        </div>
      )}


      {/* --- SLIDESHOW DIVIDER --- */}
      {data?.aboutSlideshow && (
        <div className="w-full mb-24">
          <AboutSlideshow images={data.aboutSlideshow} />
        </div>
      )}

      {/* --- CTA SECTION --- */}
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