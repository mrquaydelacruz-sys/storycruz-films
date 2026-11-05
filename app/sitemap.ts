import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";

const siteUrl = "https://www.storycruzfilms.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/about", "/experience", "/photos", "/films", "/inquire", "/commercial", "/connect"];

  let albums: { slug: string }[] = [];
  try {
    albums = await client.fetch(
      `*[_type == "photoGallery" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      { next: { tags: ["photoGallery"] } }
    );
  } catch {
    // Sitemap still lists static pages if Sanity is unreachable.
  }

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...albums.map(({ slug }) => ({
      url: `${siteUrl}/photos/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
