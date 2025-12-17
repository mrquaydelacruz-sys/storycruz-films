import Link from 'next/link';
import { client } from "@/sanity/client";

async function getData() {
  // We use a GROQ projection { ... } to specifically grab the URL from the uploaded file asset
  return await client.fetch(`
    *[_type == "siteContent"][0] {
      ...,
      "videoUrl": inquireVideo.asset->url
    }
  `);
}

export default async function InquirePage() {
  const data = await getData();
  const pixiesetUrl = "https://storycruzfilms.pixieset.com/contact-form/cf_eniioOifaksZ9zgpyOAUktqPicDw";

  // Use the uploaded video if it exists, otherwise fallback to the local file
  const backgroundVideo = data?.videoUrl || "/inquire-bg.mp4";

  return (
    <main className="min-h-screen bg-background pb-20">
      
      {/* 1. HERO VIDEO SECTION */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden mb-16">
        {/* Key prop ensures React re-renders if the video source changes */}
        <video
          key={backgroundVideo} 
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        {/* Title */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="font-serif text-3xl md:text-5xl tracking-widest text-white opacity-35">
            We'd Love to Connect
          </h1>
        </div>
      </section>

      {/* 2. EXISTING CONTENT GRID */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Dynamic Contact Info */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-serif text-accent mb-6">
            {data?.inquireTitle || "Let's Create"}
          </h2>
          <p className="text-offwhite/80 font-sans leading-relaxed mb-8 text-lg whitespace-pre-wrap">
            {data?.inquireText || "Contact us for pricing and availability."}
          </p>
          
          <div className="space-y-4 text-sm tracking-widest uppercase text-white/60 flex flex-col items-center lg:items-start">
            {data?.location && (
              <p className="border-l border-accent pl-4">{data.location}</p>
            )}
            {data?.email && (
              <p className="border-l border-accent pl-4">{data.email}</p>
            )}
            <p className="border-l border-accent pl-4">@storycruzfilms</p>
          </div>
        </div>

        {/* Right Side: Animated "Calling" Link */}
        <div className="flex items-center justify-center w-full min-h-[400px]">
          <Link 
            href={pixiesetUrl}
            target="_blank"
            className="group relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80"
          >
            {/* The 'Calling' Pulse Animation */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
            
            {/* The Main Circle Button */}
            <div className="relative flex flex-col items-center justify-center w-full h-full rounded-full border border-white/30 bg-black/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-accent group-hover:bg-white/5">
              
              <h3 className="font-serif text-4xl italic text-white transition-colors duration-300 group-hover:text-accent">
                Inquire
              </h3>
              
              <div className="flex items-center gap-2 mt-2 overflow-hidden">
                 <span className="text-xs uppercase tracking-[0.3em] text-white/60 group-hover:translate-x-[-150%] transition-transform duration-500">
                    Click Here
                 </span>
                 <span className="absolute text-2xl text-accent translate-x-[150%] group-hover:translate-x-0 transition-transform duration-500">
                    &rarr;
                 </span>
              </div>

            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}