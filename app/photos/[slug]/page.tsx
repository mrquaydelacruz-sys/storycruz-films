import { client, urlFor } from "@/sanity/client";
import { notFound } from "next/navigation";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getAlbumData(slug: string) {
  // PARAMETERIZED QUERY: This is where $slug belongs
  const query = `*[_type == "photoGallery" && slug.current == $slug][0] {
    title,
    date,
    images[] {
      asset-> {
        url,
        metadata { dimensions }
      }
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbumData(slug);

  if (!album) notFound();

  return (
    <main className="min-h-screen pt-32 px-6 md:px-12 bg-black pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">{album.title}</h1>
        </header>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {album.images?.map((photo: any, index: number) => (
            <div key={index} className="break-inside-avoid bg-[#fdfdfd] p-[3px] shadow-lg inline-block w-full">
              <Image
                src={urlFor(photo).width(1200).url()}
                alt="gallery"
                width={photo.asset.metadata.dimensions.width}
                height={photo.asset.metadata.dimensions.height}
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}