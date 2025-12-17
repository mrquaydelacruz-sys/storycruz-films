import { client, urlFor } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";

async function getPhotos() {
  // SIMPLE QUERY: No $slug needed here
  return await client.fetch(`*[_type == "photoGallery" && defined(slug.current)] | order(date desc) {
    title,
    slug,
    coverImage
  }`);
}

export default async function PhotosPage() {
  const albums = await getPhotos();

  return (
    <main className="min-h-screen pt-32 px-6 md:px-12 bg-black pb-20">
      <h1 className="text-4xl md:text-6xl font-serif text-white mb-16 text-center">Photography</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {albums.map((album: any, index: number) => (
          <Link href={`/photos/${album.slug.current}`} key={album.slug.current} className="group block">
            <div className={`bg-[#fdfdfd] p-[3px] shadow-xl transition-all duration-700 group-hover:rotate-0 ${index % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                {album.coverImage && (
                  <Image src={urlFor(album.coverImage).width(800).url()} alt={album.title} fill className="object-cover" />
                )}
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-lg font-serif text-white">{album.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}