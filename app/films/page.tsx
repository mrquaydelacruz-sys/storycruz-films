import { client, urlFor } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import BackgroundWater from "@/components/BackgroundWater"; // 1. Import the background

// Helper to extract Video ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to get YouTube Thumbnail URL
const getYouTubeThumbnail = (url: string) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

async function getData() {
  const projects = await client.fetch(`
    *[_type == "film" && defined(youtubeUrl) && defined(slug.current)] | order(publishedAt desc) {
      title,
      slug,
      customThumbnail,
      youtubeUrl
    }
  `);

  const settings = await client.fetch(`*[_type == "siteContent"][0]{ filmsTitle }`);

  return { projects, title: settings?.filmsTitle };
}

export default async function FilmsPage() {
  const { projects, title } = await getData();

  return (
    // 2. Change bg-background to bg-transparent
    <main className="relative min-h-screen pt-32 px-6 md:px-12 bg-transparent pb-20 overflow-x-hidden">
      
      {/* 3. Add the background component */}
      <BackgroundWater />

      {/* 4. Wrap everything in a relative z-10 container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif text-accent mb-12 text-center">
          {title || "Cinematic Films"}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project: any) => {
            const youtubeImage = getYouTubeThumbnail(project.youtubeUrl);
            const customImage = project.customThumbnail ? urlFor(project.customThumbnail).width(800).url() : null;
            const displayImage = customImage || youtubeImage;

            return (
              <Link 
                href={`/films/${project.slug.current}`} 
                key={project.slug.current}
                className="group block relative"
              >
                <div className="relative aspect-video bg-neutral-900/40 overflow-hidden mb-4 border border-white/5 backdrop-blur-sm">
                  
                  {displayImage ? (
                    <Image 
                      src={displayImage} 
                      alt={project.title} 
                      fill 
                      className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                      unoptimized={!customImage}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                      No Preview Available
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-offwhite/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-black/20 backdrop-blur-sm">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-offwhite border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                  </div>

                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-serif text-offwhite group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}