'use client'

export default function VideoPlayer({ url }: { url: string }) {
  if (!url) return null;

  // Extract the Video ID from a standard YouTube link
  // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(url);

  return (
    <section className="w-full py-20 bg-background flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h3 className="text-accent font-serif text-3xl italic">The Film</h3>
        <div className="h-[1px] w-20 bg-white/20 mx-auto mt-4"></div>
      </div>

      <div className="w-full max-w-6xl px-4 md:px-10">
        <div className="relative w-full aspect-video border-[1px] border-white/10 rounded-sm overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}