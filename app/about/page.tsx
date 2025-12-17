import { client, urlFor } from "@/sanity/client";
import Image from "next/image";

async function getData() {
  return await client.fetch(`*[_type == "siteContent"][0]{
    aboutTitle,
    aboutText,
    aboutImage,
    aboutSignature 
  }`);
}

export default async function AboutPage() {
  const data = await getData();

  return (
    <main className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
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

        {/* Right Column: Bio Text & Signature */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
            {data?.aboutTitle || "Our Story"}
          </h1>
          
          <div className="text-offwhite/80 font-sans leading-relaxed text-lg whitespace-pre-wrap">
            {data?.aboutText}
          </div>

          {/* THE SIGNATURE */}
          {data?.aboutSignature && (
            <div className="mt-12 mb-10">
              <p 
                className="text-4xl md:text-6xl text-accent opacity-90 leading-[1.1]"
                style={{ fontFamily: 'var(--font-cursive), cursive' }}
              >
                {data.aboutSignature.includes(',') ? (
                  <>
                    <span>{data.aboutSignature.split(',')[0]},</span>
                    <br />
                    <span className="inline-block mt-4 pl-4 md:pl-8">
                      {data.aboutSignature.split(',')[1]}
                    </span>
                  </>
                ) : (
                  data.aboutSignature
                )}
              </p>
            </div>
          )}
        </div> {/* 👈 This closing div was missing! */}
      </div>

      {/* CALL TO ACTION SECTION */}
      <section className="mt-24 py-16 border-t border-white/10 text-center">
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