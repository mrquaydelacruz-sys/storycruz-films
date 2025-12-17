import Link from 'next/link'
import { client } from "@/sanity/client";

async function getData() {
  return await client.fetch(`*[_type == "siteContent"][0]`);
}

export default async function InquirePage() {
  const data = await getData();
  const pixiesetUrl = "https://storycruzfilms.pixieset.com/contact-form/cf_eniioOifaksZ9zgpyOAUktqPicDw";

  return (
    <main className="min-h-screen pt-32 px-6 md:px-12 bg-background pb-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Dynamic Contact Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-accent mb-8">
            {data?.inquireTitle || "Let's Create"}
          </h1>
          <p className="text-offwhite/80 font-sans leading-relaxed mb-8 text-lg whitespace-pre-wrap">
            {data?.inquireText || "Contact us for pricing and availability."}
          </p>
          
          <div className="space-y-4 text-sm tracking-widest uppercase text-white/60">
            {data?.location && (
              <p className="border-l border-accent pl-4">{data.location}</p>
            )}
            {data?.email && (
              <p className="border-l border-accent pl-4">{data.email}</p>
            )}
            <p className="border-l border-accent pl-4">@storycruzfilms</p>
          </div>
        </div>

        {/* Right Side: Call to Action */}
        <div className="w-full h-[500px] bg-white/5 rounded-sm border border-white/10 flex flex-col items-center justify-center p-10 text-center hover:bg-white/10 transition-colors duration-500">
          <h3 className="text-2xl font-serif text-offwhite mb-4">Ready to start?</h3>
          <p className="text-white/60 mb-10 max-w-sm">
            Inquire now
          </p>
          <Link 
            href={pixiesetUrl}
            target="_blank"
            className="px-8 py-4 bg-white text-black font-serif text-lg rounded-sm hover:scale-105 transition-transform duration-300"
          >
            Open Inquiry Form &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}