"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useVideoTexture, ScrollControls, useScroll, useTexture, Sparkles, Image as DreiImage } from "@react-three/drei";
import { createRoot } from "react-dom/client";
import { Suspense, useRef, useEffect, createContext, useContext } from "react";
import * as THREE from 'three';
import dynamic from "next/dynamic";
import type { VisionData } from "@/app/vision/types";
import type { SiteChromeData } from "@/lib/site-chrome";
import Footer from "@/components/Footer";

const FeaturedFilms = dynamic(() => import("@/components/FeaturedFilms"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));

const PAGES = 6;
/** How many viewport-heights the overlay travels from offset 0 → 1. */
const SCROLL_TRAVEL = PAGES - 1;

type Visuals = {
    offset: number;
    logo: number;
    photos: number;
    bg: number;
    divider: number;
};

type VisualsRef = React.MutableRefObject<Visuals>;

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}

function smoothstep(t: number) {
    const x = clamp01(t);
    return x * x * (3 - 2 * x);
}

/**
 * Opacity for a section parked at `topVh`, based on where that top sits in the
 * viewport after scroll. Keeps enter/hold/exit aligned with real scroll position
 * so we never blank the page between sections.
 */
function sectionOpacity(offset: number, topVh: number) {
    const y = topVh - offset * SCROLL_TRAVEL * 100;
    if (y >= 85) return 0;
    if (y > 15) return smoothstep((85 - y) / 70);
    if (y > -55) return 1;
    if (y > -110) return 1 - smoothstep((-55 - y) / 55);
    return 0;
}

/** Fade in, hold at 1, fade out — so sections can actually arrive before they leave. */
function plateau(offset: number, inStart: number, holdStart: number, holdEnd: number, outEnd: number) {
    if (offset <= inStart || offset >= outEnd) return 0;
    if (offset < holdStart) return smoothstep((offset - inStart) / (holdStart - inStart));
    if (offset > holdEnd) return 1 - smoothstep((offset - holdEnd) / (outEnd - holdEnd));
    return 1;
}

function setMaterialOpacity(material: THREE.Material | THREE.Material[] | undefined, opacity: number) {
    if (!material) return;
    if (Array.isArray(material)) {
        material.forEach((entry) => {
            entry.opacity = opacity;
            entry.transparent = true;
        });
        return;
    }
    material.opacity = opacity;
    material.transparent = true;
    const uniform = (material as THREE.ShaderMaterial).uniforms?.opacity;
    if (uniform) uniform.value = opacity;
}

// Scroll state for the overlay (avoids using Scroll html, which can call createRoot twice).
export type ScrollStateRef = React.MutableRefObject<{ offset: number; height: number; pages: number }>;
const ScrollStateContext = createContext<ScrollStateRef | null>(null);

function ScrollStateWriter({ children }: { children: React.ReactNode }) {
    const scroll = useScroll();
    const stateRef = useContext(ScrollStateContext);
    const { size } = useThree((s) => ({ size: s.size }));
    useFrame(() => {
        if (stateRef?.current) {
            stateRef.current.offset = scroll.offset;
            stateRef.current.height = size.height;
            stateRef.current.pages = PAGES;
        }
    });
    return <>{children}</>;
}

export type { VisionData } from "@/app/vision/types";

// --- COMPONENTS ---

function BackgroundVideo({ url, visuals }: { url: string; visuals: VisualsRef }) {
    const texture = useVideoTexture(url);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const { width, height } = useThree((state) => state.viewport.getCurrentViewport(state.camera, [0, 0, -2]));

    const videoAspect = 16 / 9;
    const viewportAspect = width / height;

    let scale: [number, number, number];
    if (viewportAspect > videoAspect) {
        scale = [width, width / videoAspect, 1];
    } else {
        scale = [height * videoAspect, height, 1];
    }

    useFrame(() => {
        if (materialRef.current) materialRef.current.opacity = visuals.current.bg;
    });

    return (
        <mesh position={[0, 0, -2]} scale={scale}>
            <planeGeometry />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                transparent
                opacity={0.6}
                toneMapped={false}
            />
        </mesh>
    );
}

function Divider3D({ url, visuals }: { url: string; visuals: VisualsRef }) {
    const groupRef = useRef<THREE.Group>(null);
    const imageRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        const opacity = visuals.current.divider;
        if (groupRef.current) {
            groupRef.current.visible = opacity > 0.01;
            groupRef.current.position.y = (visuals.current.offset - 0.27) * 8;
        }
        if (imageRef.current) setMaterialOpacity(imageRef.current.material, opacity);
    });

    if (!url) return null;

    return (
        <group ref={groupRef} visible={false} position={[0, -5, -1]}>
            <DreiImage
                ref={imageRef}
                url={url}
                scale={[12, 6]}
                transparent
                opacity={0}
                color="#888"
            />
        </group>
    );
}

function LogoHero({ visuals }: { visuals: VisualsRef }) {
    const texture = useTexture("/logo.png");
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const opacity = visuals.current.logo;
        if (groupRef.current) groupRef.current.visible = opacity > 0.01;
        if (meshRef.current) {
            const targetRotation = visuals.current.offset * Math.PI * 4;
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation, 0.1);
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
            setMaterialOpacity(meshRef.current.material, opacity);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={meshRef}>
                <planeGeometry args={[1.5, 1.5]} />
                <meshStandardMaterial
                    map={texture}
                    transparent
                    opacity={1}
                    roughness={0.1}
                    metalness={1}
                    envMapIntensity={2}
                />
            </mesh>
        </group>
    );
}

function BorderedImage({
    url,
    position,
    scale,
    getOpacity,
    dampFade = false,
    radius = 0,
}: {
    url: string;
    position: [number, number, number];
    scale: [number, number];
    getOpacity: () => number;
    dampFade?: boolean;
    radius?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const borderMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const imageRef = useRef<THREE.Mesh>(null);
    const fadeRef = useRef(0);
    const borderSize = 0.04;

    useFrame((_, delta) => {
        const target = getOpacity();
        fadeRef.current = dampFade
            ? THREE.MathUtils.damp(fadeRef.current, target, 4, delta)
            : target;
        const opacity = fadeRef.current;
        if (groupRef.current) groupRef.current.visible = opacity > 0.01;
        if (borderMatRef.current) borderMatRef.current.opacity = opacity;
        if (imageRef.current) setMaterialOpacity(imageRef.current.material, opacity);
    });

    return (
        <group ref={groupRef} position={position} visible={false}>
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[scale[0] + borderSize, scale[1] + borderSize]} />
                <meshBasicMaterial ref={borderMatRef} color="white" transparent opacity={0} />
            </mesh>
            <DreiImage
                ref={imageRef}
                url={url}
                scale={scale}
                transparent
                opacity={0}
                radius={radius}
            />
        </group>
    );
}

function PhotoCarousel({ urls, visuals }: { urls: string[]; visuals: VisualsRef }) {
    const activeIndex = useRef(0);

    useEffect(() => {
        if (urls.length <= 1) return;
        const timer = setInterval(() => {
            activeIndex.current = (activeIndex.current + 1) % urls.length;
        }, 4000);
        return () => clearInterval(timer);
    }, [urls.length]);

    if (!urls || urls.length === 0) return null;

    return (
        <group position={[0, 0, 0]}>
            {urls.map((url, i) => (
                <BorderedImage
                    key={url}
                    url={url}
                    scale={[0.85, 1.2]}
                    position={[0, 0, 0]}
                    dampFade
                    getOpacity={() => visuals.current.photos * (i === activeIndex.current ? 1 : 0)}
                />
            ))}
        </group>
    );
}

/** Rest positions keep the trio centered in the fov≈35 / z=6 framing. */
const PHOTO_LEFT_X = -2.15;
const PHOTO_RIGHT_X = 2.15;

function PhotoGrid({ data, visuals }: { data: VisionData; visuals: VisualsRef }) {
    const leftRef = useRef<THREE.Group>(null);
    const rightRef = useRef<THREE.Group>(null);
    const rootRef = useRef<THREE.Group>(null);
    const slideshow = (data.introSlideshowUrls && data.introSlideshowUrls.length > 0)
        ? data.introSlideshowUrls
        : [data.introCenterUrl];

    useFrame(() => {
        const photos = visuals.current.photos;
        if (rootRef.current) rootRef.current.visible = photos > 0.01;
        // Slide in from just outside rest — never park off the right edge.
        if (leftRef.current) leftRef.current.position.x = PHOTO_LEFT_X - (1 - photos) * 0.9;
        if (rightRef.current) rightRef.current.position.x = PHOTO_RIGHT_X + (1 - photos) * 0.9;
    });

    return (
        <group ref={rootRef} visible={false} position={[0, -0.15, 0]}>
            {data.introLeftUrl && (
                <group ref={leftRef} position={[PHOTO_LEFT_X, 0, 0]}>
                    <BorderedImage
                        url={data.introLeftUrl}
                        scale={[0.85, 1.2]}
                        position={[0, 0, 0]}
                        getOpacity={() => visuals.current.photos}
                    />
                </group>
            )}

            <PhotoCarousel urls={slideshow} visuals={visuals} />

            {data.introRightUrl && (
                <group ref={rightRef} position={[PHOTO_RIGHT_X, 0, 0]}>
                    <BorderedImage
                        url={data.introRightUrl}
                        scale={[1.35, 0.9]}
                        position={[0, 0, 0]}
                        getOpacity={() => visuals.current.photos}
                    />
                </group>
            )}
        </group>
    );
}

function MainSequence({ data }: { data: VisionData }) {
    const scroll = useScroll();
    const visuals = useRef<Visuals>({
        offset: 0,
        logo: 1,
        photos: 0,
        bg: 0.6,
        divider: 0,
    });

    useFrame(() => {
        const off = scroll.offset;
        visuals.current.offset = off;
        visuals.current.logo = 1 - smoothstep(off / 0.09);
        visuals.current.photos = plateau(off, 0.05, 0.11, 0.20, 0.28);
        visuals.current.divider = plateau(off, 0.20, 0.24, 0.30, 0.36);
        // Keep a soft video presence under mid sections; only clear once contact covers the view.
        if (off <= 0.05) {
            visuals.current.bg = 0.6;
        } else if (off < 0.58) {
            visuals.current.bg = THREE.MathUtils.lerp(0.6, 0.18, Math.min((off - 0.05) * 5, 1));
        } else {
            visuals.current.bg = 0.18 * (1 - smoothstep((off - 0.58) / 0.1));
        }
    });

    return (
        <>
            <BackgroundVideo url={data.heroVideoUrl || "/hero-video.mp4"} visuals={visuals} />
            <LogoHero visuals={visuals} />
            <PhotoGrid data={data} visuals={visuals} />
            {data.dividerImageUrl && (
                <Divider3D url={data.dividerImageUrl} visuals={visuals} />
            )}
            <Sparkles count={40} scale={12} size={3} opacity={0.5} speed={0.35} color="#ffe4a1" />
        </>
    );
}

function applySectionMotion(
    el: HTMLElement | null,
    opacity: number,
    translateY: number,
    interactive: boolean,
) {
    if (!el) return;
    const visible = opacity > 0.02;
    el.style.opacity = String(clamp01(opacity));
    el.style.transform = `translate3d(0, ${translateY}px, 0)`;
    el.style.pointerEvents = interactive && visible ? 'auto' : 'none';
}

function VisionOverlayContent({
    data,
    chrome,
    scrollStateRef,
}: {
    data: VisionData;
    chrome: SiteChromeData;
    scrollStateRef: ScrollStateRef;
}) {
    const rootRef = useRef<HTMLDivElement>(null);
    const introRef = useRef<HTMLDivElement>(null);
    const featuredRef = useRef<HTMLDivElement>(null);
    const loveNotesRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId = 0;
        const tick = () => {
            rafId = requestAnimationFrame(tick);
            const offset = scrollStateRef.current.offset;
            const height = scrollStateRef.current.height || 600;
            const root = rootRef.current;
            if (root) {
                root.style.transform = `translate3d(0, ${height * SCROLL_TRAVEL * -offset}px, 0)`;
            }

            const intro = sectionOpacity(offset, 0);
            const featured = sectionOpacity(offset, 150);
            const loveNotes = sectionOpacity(offset, 250);

            const featuredY = featured < 1 && offset * SCROLL_TRAVEL * 100 < 150
                ? (1 - featured) * 28
                : (1 - featured) * -36;
            const loveNotesY = loveNotes < 1 && offset * SCROLL_TRAVEL * 100 < 250
                ? (1 - loveNotes) * 28
                : (1 - loveNotes) * -36;

            applySectionMotion(introRef.current, intro, (1 - intro) * -16, false);
            applySectionMotion(featuredRef.current, featured, featuredY, true);
            applySectionMotion(loveNotesRef.current, loveNotes, loveNotesY, false);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [scrollStateRef]);

    return (
        <div
            ref={rootRef}
            className="w-full text-white font-serif relative"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                willChange: 'transform',
            }}
        >
            <style>{`
                ::-webkit-scrollbar { width: 7px; background: #000; }
                ::-webkit-scrollbar-track { background: #050505; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>

            <div
                ref={introRef}
                className="absolute top-0 w-full h-[100vh] flex flex-col justify-end items-center pb-32 pointer-events-none will-change-transform"
            >
                <h2 className="text-4xl md:text-5xl font-normal mb-2 text-center drop-shadow-2xl">
                    Capturing the Unscripted
                </h2>
                <p className="text-sm tracking-widest uppercase opacity-70">
                    Cinematic Details That Make Your Story Truly Yours
                </p>
            </div>

            <div
                ref={featuredRef}
                className="absolute top-[150vh] w-full min-h-[100vh] flex flex-col justify-center items-center will-change-transform"
                style={{ opacity: 0, pointerEvents: 'none' }}
            >
                <div className="w-full max-w-7xl px-4">
                    <FeaturedFilms
                        films={data.featuredVideos.map(v => ({ ...v, youtubeUrl: v.videoUrl }))}
                        forceVisible
                    />
                </div>
            </div>

            <div
                ref={loveNotesRef}
                className="absolute top-[250vh] w-full min-h-[100vh] flex flex-col justify-center items-center px-4 pointer-events-none will-change-transform"
                style={{ opacity: 0 }}
            >
                <div className="max-w-4xl text-center">
                    <div className="text-white/90 text-2xl tracking-[0.4em] mb-3" aria-hidden>
                        ☆ ☆ ☆ ☆ ☆
                    </div>
                    <h3 className="text-3xl md:text-5xl font-serif text-white mb-2">
                        Kind Words From Our Couples
                    </h3>
                    <p className="text-sm tracking-widest uppercase text-neutral-400 mb-12">
                        Love Letters That Inspire Us
                    </p>
                    <div className="flex flex-col gap-12">
                        {data.testimonials?.slice(0, 3).map((t, i) => (
                            <div key={i} className="rounded-lg border border-white/10 bg-black/75 p-8 shadow-xl backdrop-blur-md">
                                <p className="text-xl italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                                <p className="text-sm uppercase font-bold text-neutral-400">— {t.couple}</p>
                                {t.location && <p className="text-xs text-neutral-600 mt-2">{t.location}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*
              Travel = 500vh. Contact from 320vh with min-height 180vh fills through
              the end so the footer is the last thing on screen — no black void after.
            */}
            <div
                ref={contactRef}
                className="absolute top-[320vh] flex w-full min-h-[180vh] flex-col bg-[#050505]"
            >
                <div className="flex min-h-[100vh] flex-1 flex-col justify-center">
                    <ContactSection />
                </div>
                <Footer data={chrome} className="mt-auto shrink-0" />
            </div>
        </div>
    );
}

function NavbarLogic() {
    const scroll = useScroll();
    const lastDirection = useRef(0);
    const lastOff = useRef(0);

    useFrame(() => {
        const off = scroll.offset;
        const delta = off - lastOff.current;
        const direction = delta > 0 ? 1 : -1;

        if (Math.abs(delta) > 0.0001 && direction !== lastDirection.current) {
            const shouldShow = off < 0.02 || direction === -1;
            window.dispatchEvent(new CustomEvent('storycruz-toggle-nav', { detail: { visible: shouldShow } }));
            lastDirection.current = direction;
        }
        lastOff.current = off;
    });
    return null;
}

// --- SCENE COMPONENT ---
function Scene({ data }: { data: VisionData }) {
    return (
        <ScrollControls pages={PAGES} damping={0.18}>
            <ScrollStateWriter>
                <Suspense fallback={null}>
                    <MainSequence data={data} />
                    <Environment preset="studio" />
                </Suspense>
                <NavbarLogic />
            </ScrollStateWriter>
        </ScrollControls>
    );
}

export default function VisionScene({ data, chrome }: { data: VisionData; chrome: SiteChromeData }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollStateRef = useRef({ offset: 0, height: 600, pages: PAGES });
    const overlayRootRef = useRef<ReturnType<typeof createRoot> | null>(null);

    useEffect(() => {
        let cancelled = false;
        let attempts = 0;
        const maxAttempts = 30;

        const tryInject = () => {
            if (cancelled || attempts >= maxAttempts) return;
            attempts += 1;

            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            // ScrollControls appends the scroll div to gl.domElement.parentNode.
            // Path A: wrapper > container > [canvas, scrollEl] > fixed. Path B: wrapper > [canvas, scrollEl] > fixed.
            const first = wrapper.firstElementChild as HTMLElement | null;
            const scrollEl =
                (first?.tagName === 'CANVAS' ? wrapper.children[1] : first?.children?.[1]) as HTMLElement | undefined;
            let fixedDiv = scrollEl?.children?.[0] as HTMLElement | undefined;
            if (!fixedDiv && first) {
                fixedDiv = wrapper.querySelector('[style*="sticky"]') as HTMLElement | undefined;
            }

            if (!fixedDiv) {
                requestAnimationFrame(tryInject);
                return;
            }

            const root = overlayRootRef.current ?? createRoot(fixedDiv);
            if (!overlayRootRef.current) overlayRootRef.current = root;
            root.render(
                <VisionOverlayContent data={data} chrome={chrome} scrollStateRef={scrollStateRef} />
            );
        };

        const id = requestAnimationFrame(tryInject);

        return () => {
            cancelled = true;
            cancelAnimationFrame(id);
            const root = overlayRootRef.current;
            overlayRootRef.current = null;
            // Defer unmount so we don’t unmount while React is still rendering
            if (root && 'unmount' in root) {
                queueMicrotask(() => { root.unmount(); });
            }
        };
    }, [data, chrome]);

    // Prevent body/document scroll so only ScrollControls’ inner div scrolls (no double scrollbar).
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevHeight = document.body.style.height;
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.height = prevHeight;
        };
    }, []);

    return (
        <ScrollStateContext.Provider value={scrollStateRef}>
            <div ref={wrapperRef} className="h-screen w-full min-h-0 bg-[#050505] relative overflow-hidden z-0">
                <Canvas
                    className="h-full w-full"
                    camera={{ position: [0, 0, 6], fov: 35 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: false, powerPreference: 'high-performance' }}
                >
                    <Scene data={data} />
                </Canvas>
            </div>
        </ScrollStateContext.Provider>
    );
}
