import { client, urlFor } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import HeaderCarousel from "@/components/HeaderCarousel";

async function getData() {
  // We use Promise.all to fetch both data sources at the same time (faster)
  const [albums, siteData] = await Promise.all([
    // 1. Get the Albums with 'photoGallery' tag
    client.fetch(`
      *[_type == "photoGallery" && defined(slug.current)] | order(date desc) {
        title,
        slug,
        coverImage
      }
    `, {}, { next: { tags: ['photoGallery'] } }), // Added tag
    
    // 2. Get the Slideshow Images with 'siteContent' tag
    client.fetch(`
      *[_type == "siteContent"][0] {
        "slideshow": photoHeaderImages[].asset->url,
        photosTitle 
      }
    `, {}, { next: { tags: ['siteContent'] } }) // Added tag
  ]);

  return { albums, siteData };
}

export default async function PhotosPage() {
  const { albums, siteData } = await getData();

  return (
    <main className="min-h-screen bg-black pb-20">
      
      {/* 1. HERO SLIDESHOW */}
      {/* This sits at the very top. We removed 'pt-32' from main so this touches the top edge. */}
      <HeaderCarousel images={siteData?.slideshow || []} />

      {/* 2. ALBUM GRID */}
      <div className="px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-16 text-center">
          {siteData?.photosTitle || "Photography"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {albums.map((album: any, index: number) => (
            <Link href={`/photos/${album.slug.current}`} key={album.slug.current} className="group block">
              {/* Polaroid Style Card */}
              <div className={`bg-[#fdfdfd] p-[3px] shadow-xl transition-all duration-700 group-hover:rotate-0 ${index % 2 === 0 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  {album.coverImage && (
                    <Image 
                      src={urlFor(album.coverImage).width(800).url()} 
                      alt={album.title} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-lg font-serif text-white group-hover:text-gray-300 transition-colors">
                  {album.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}