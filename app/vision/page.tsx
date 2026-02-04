import { client, urlFor } from "@/sanity/client";
import VisionScene, { VisionData } from "./VisionScene";

export const revalidate = 60; // Revalidate every 60 seconds

// Helper to extract YouTube ID
function getYouTubeId(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default async function VisionPage() {
    const data = await getVisionData();
    return <VisionScene data={data} />;
}

export async function getVisionData(): Promise<VisionData> {
    const homepageQuery = `*[_type == "homepage"][0]{
    heroVideo { asset->{url} },
    introLeftImage,
    introSlideshow,
    introRightImage,
    testimonials,
    dividerImage
  }`;

    // Relaxed query: get more films to ensure we have enough to show
    const filmsQuery = `*[_type == "film"] | order(publishedAt desc)[0...10]{
    title,
    slug,
    youtubeUrl,
    "thumbnailUrl": customThumbnail.asset->url,
    featured
  }`;

    const [homepage, films] = await Promise.all([
        client.fetch(homepageQuery),
        client.fetch(filmsQuery)
    ]);

    // Priority: Featured -> Newest
    const featuredDocs = films.filter((f: any) => f.featured);
    const nonFeatured = films.filter((f: any) => !f.featured);

    // Combine: Featured first, then fill remainder from non-featured to get 4 videos max
    const displayFilms = [...featuredDocs, ...nonFeatured].slice(0, 4);

    // Provide safe defaults
    const safeFilms = displayFilms.length > 0 ? displayFilms : [
        { thumbnailUrl: "/images/photo2.jpg", youtubeUrl: "https://youtube.com", title: "Fallback 1", slug: { current: "fallback-1" } },
        { thumbnailUrl: "/images/photo3.jpg", youtubeUrl: "https://youtube.com", title: "Fallback 2", slug: { current: "fallback-2" } }
    ];

    // Transform Sanity data to our VisionData shape
    return {
        heroVideoUrl: homepage?.heroVideo?.asset?.url || "/hero-video.mp4",
        introLeftUrl: homepage?.introLeftImage ? urlFor(homepage.introLeftImage).url() : "/images/photo2.jpg",
        introCenterUrl: homepage?.introSlideshow?.[0] ? urlFor(homepage.introSlideshow[0]).url() : "/images/QA-Home.jpg",
        introSlideshowUrls: homepage?.introSlideshow ? homepage.introSlideshow.map((img: any) => urlFor(img).url()) : [],
        introRightUrl: homepage?.introRightImage ? urlFor(homepage.introRightImage).url() : "/images/photo3.jpg",
        dividerImageUrl: homepage?.dividerImage ? urlFor(homepage.dividerImage).url() : null,
        testimonials: homepage?.testimonials ? homepage.testimonials.map((t: any) => ({
            quote: t.quote,
            couple: t.couple,
            location: t.location
        })) : [],
        featuredVideos: safeFilms.map((f: any) => {
            const ytId = getYouTubeId(f.youtubeUrl);
            const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/images/photo2.jpg";

            return {
                title: f.title,
                slug: f.slug,
                thumbnailUrl: f.thumbnailUrl || ytThumb,
                videoUrl: f.youtubeUrl || ""
            };
        })
    };
}
