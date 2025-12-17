import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/client";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import BackgroundWater from "@/components/BackgroundWater";

async function getProject(slug: string) {
  const query = `*[_type == "wedding" && slug.current == $slug][0] {
    title,
    date,
    mainImage,
    youtubeUrl,
    gallery
  }`;
  const data = await client.fetch(query, { slug });
  return data;
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) return <div className="text-center py-40 text-white">Project not found</div>;

  return (
    // Changed bg-background to relative to ensure BackgroundWater sits behind
    <main className="relative min-h-screen text-offwhite pt-32 pb-20 overflow-x-hidden">
      
      {/* 1. THE WATER BACKGROUND */}
      <BackgroundWater />
      
      {/* 2. HEADER */}
      <section className="relative z-10 px-6 md:px-12 max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-7xl font-serif text-accent mb-6">
          {project.title}
        </h1>
        <p className="text-white/60 font-sans tracking-widest uppercase text-sm">
          {project.date}
        </p>
      </section>

      {/* 3. FEATURED VIDEO */}
      {project.youtubeUrl && (
        <div className="relative z-10 mb-20">
           <VideoPlayer url={project.youtubeUrl} />
        </div>
      )}

      {/* 4. PHOTO GALLERY GRID */}
      <section className="relative z-10 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.gallery?.map((img: any, i: number) => (
            <div key={i} className="relative aspect-[2/3] w-full bg-neutral-900/50 overflow-hidden border border-white/5">
               <Image 
                 src={urlFor(img).width(800).url()} 
                 alt="Gallery Image" 
                 fill 
                 className="object-cover hover:scale-105 transition-transform duration-700" 
               />
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
}