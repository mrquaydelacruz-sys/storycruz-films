import { client } from "@/sanity/client";
import { notFound } from "next/navigation";

// 1. Fetch the specific film data based on the URL slug
async function getData(slug: string) {
  const query = `
    *[_type == "film" && slug.current == '${slug}'][0] {
      title,
      youtubeUrl,
      publishedAt,
      description
    }
  `;
  
  const film = await client.fetch(query);
  return film;
}

export default async function FilmProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params; // Await params (Next.js 15 requirement)
  const film = await getData(slug);

  // If the film doesn't exist in Sanity, show a 404
  if (!film) {
    notFound();
  }

  // Helper to extract Video ID from YouTube URL
  // Handles: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(film.youtubeUrl);

  return (
    <main className="min-h-screen pt-32 px-6 md:px-12 bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-serif text-accent mb-2 text-center">
          {film.title}
        </h1>
        <p className="text-center text-offwhite/60 mb-8 font-sans text-sm tracking-widest uppercase">
          {new Date(film.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>

        {/* Video Player */}
        <div className="relative aspect-video w-full border border-white/5 bg-neutral-900 mb-12 shadow-2xl">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={film.title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-red-400">
              Invalid YouTube URL
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a href="/films" className="inline-block border border-accent/30 text-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors uppercase tracking-widest text-xs">
            Back to Films
          </a>
        </div>

      </div>
    </main>
  );
}