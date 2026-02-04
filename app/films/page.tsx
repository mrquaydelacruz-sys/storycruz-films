import { client } from "@/sanity/client";
import BackgroundWater from "@/components/BackgroundWater";
import ContactSection from "@/components/ContactSection";

// Helper to extract Video ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

async function getData() {
  // Fetch films with the 'film' tag
  const projects = await client.fetch(
    `*[_type == "film" && defined(youtubeUrl)] | order(publishedAt desc) {
      title,
      youtubeUrl,
      description
    }`,
    {},
    { next: { tags: ['film'] } }
  );

  // Fetch settings with the 'siteContent' tag
  const settings = await client.fetch(
    `*[_type == "siteContent"][0]{ filmsTitle }`,
    {},
    { next: { tags: ['siteContent'] } }
  );

  return { projects, title: settings?.filmsTitle };
}

export default async function FilmsPage() {
  const { projects, title } = await getData();

  return (
    <main className="relative min-h-screen pt-32 bg-transparent pb-20 overflow-x-hidden">
      <BackgroundWater />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-serif text-accent mb-16 text-center">
          {title || "Cinematic Films"}
        </h1>

        {/* Single Column Layout with Embedded Videos */}
        <div className="space-y-20">
          {projects.map((project: any, index: number) => {
            const videoId = getYouTubeId(project.youtubeUrl);

            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
              >
                {/* Video Title */}
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-4 text-center">
                  {project.title}
                </h2>

                {/* Video Embed */}
                {videoId ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-xl mb-4">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=1&color=white`}
                      title={project.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-lg bg-neutral-900/40 flex items-center justify-center text-white/20">
                    Video unavailable
                  </div>
                )}

                {/* Optional Description */}
                {project.description && (
                  <p className="text-neutral-400 text-center text-sm md:text-base leading-relaxed mt-4">
                    {project.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}