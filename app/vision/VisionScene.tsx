"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useVideoTexture, ScrollControls, useScroll, useTexture, Float, Sparkles, Image as DreiImage, Html } from "@react-three/drei";
import { createRoot } from "react-dom/client";
import { Suspense, useRef, useState, useEffect, createContext, useContext } from "react";
import * as THREE from 'three';
import { ChevronDown } from "lucide-react";
import { urlFor } from "@/sanity/client";
import FeaturedFilms from "@/components/FeaturedFilms";
import ContactSection from "@/components/ContactSection";
import Image from "next/image";

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
            stateRef.current.pages = 8;
        }
    });
    return <>{children}</>;
}

// --- TYPES ---
export type VisionData = {
    heroVideoUrl: string;
    introLeftUrl: string;
    introCenterUrl: string;
    introSlideshowUrls?: string[];
    introRightUrl: string;
    dividerImageUrl?: string | null;
    testimonials?: {
        quote: string;
        couple: string;
        location?: string;
    }[];
    featuredVideos: {
        title: string;
        slug?: { current: string };
        thumbnailUrl: string;
        videoUrl: string;
    }[];
}

// --- COMPONENTS ---

function BackgroundVideo({ url, opacity }: { url: string, opacity: number }) {
    const texture = useVideoTexture(url);
    const { width, height } = useThree((state) => state.viewport.getCurrentViewport(state.camera, [0, 0, -2]));

    // Calculate "cover" scale (like CSS background-size: cover)
    const videoAspect = 16 / 9;
    const viewportAspect = width / height;

    let scale: [number, number, number];
    if (viewportAspect > videoAspect) {
        // Viewport is wider than video: constrain by width
        scale = [width, width / videoAspect, 1];
    } else {
        // Viewport is taller than video: constrain by height
        scale = [height * videoAspect, height, 1];
    }

    return (
        <mesh position={[0, 0, -2]} scale={scale}>
            <planeGeometry />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={opacity}
                toneMapped={false}
            />
        </mesh>
    );
}

function Divider3D({ url, opacity, scrollOffset }: { url: string, opacity: number, scrollOffset: number }) {
    const meshRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (meshRef.current) {
            // Parallax: Moves up 
            // Active around offset 0.15 - 0.25 (See MainSequence)
            // We want it to slide through the view.
            // Center of view is Y=0.
            // When Offset = 0.2 (center of divider phase), Y should be 0.
            const relativeY = (scrollOffset - 0.2) * 10;
            meshRef.current.position.y = relativeY;
        }
    });

    if (!url) return null;

    return (
        <group ref={meshRef} visible={opacity > 0} position={[0, -5, -1]}>
            <DreiImage
                url={url}
                scale={[12, 6]}
                transparent
                opacity={opacity}
                color="#888"
            />
        </group>
    );
}

function LogoHero({ opacity, scrollOffset }: { opacity: number, scrollOffset: number }) {
    const texture = useTexture("/logo.png");
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const targetRotation = scrollOffset * Math.PI * 4;
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation, 0.1);
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
        }
    });

    return (
        <group visible={opacity > 0}>
            <mesh ref={meshRef}>
                <planeGeometry args={[1.5, 1.5]} />
                <meshStandardMaterial
                    map={texture}
                    transparent
                    opacity={opacity}
                    roughness={0.1}
                    metalness={1}
                    envMapIntensity={2}
                />
            </mesh>
        </group>
    );
}

interface BorderedImageProps {
    url: string;
    position: [number, number, number];
    scale: [number, number];
    opacity: number;
    radius?: number;
}

function BorderedImage({ url, position, scale, opacity, radius = 0 }: BorderedImageProps) {
    const borderSize = 0.04;
    return (
        <group position={position}>
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[scale[0] + borderSize, scale[1] + borderSize]} />
                <meshBasicMaterial color="white" transparent opacity={opacity} />
            </mesh>
            <DreiImage
                url={url}
                scale={scale}
                transparent
                opacity={opacity}
                radius={radius}
            />
        </group>
    );
}

function PhotoCarousel({ urls, opacity, scrollOffset }: { urls: string[], opacity: number, scrollOffset: number }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            // Active around 0.1 - 0.15
            const targetX = (scrollOffset - 0.1) * -20;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
        }
    });

    if (!urls || urls.length === 0) return null;

    return (
        <group ref={groupRef} position={[3, 0, 0]}>
            {urls.map((url, i) => (
                <BorderedImage
                    key={i}
                    url={url}
                    scale={[0.85, 1.2]}
                    position={[i * 1.5, 0, 0]}
                    opacity={opacity}
                />
            ))}
        </group>
    );
}

function PhotoGrid({ opacity, data, scrollOffset }: { opacity: number, data: VisionData, scrollOffset: number }) {
    const slideshow = (data.introSlideshowUrls && data.introSlideshowUrls.length > 0)
        ? data.introSlideshowUrls
        : [data.introCenterUrl];

    return (
        <group visible={opacity > 0} position={[0, -0.2, 0]}>
            {/* Left Image */}
            {data.introLeftUrl && (
                <group position={[-3 + (scrollOffset * 4), 0, 0]}>
                    <BorderedImage
                        url={data.introLeftUrl}
                        scale={[0.85, 1.2]}
                        position={[-1.5, 0, 0]}
                        opacity={opacity}
                    />
                </group>
            )}

            {/* Slideshow */}
            <PhotoCarousel urls={slideshow} opacity={opacity} scrollOffset={scrollOffset} />

            {/* Right Image */}
            {data.introRightUrl && (
                <group position={[3 - (scrollOffset * 4), 0, 0]}>
                    <BorderedImage
                        url={data.introRightUrl}
                        scale={[1.5, 1.0]}
                        position={[1.5 + (slideshow.length * 0.1), 0, 0]}
                        opacity={opacity}
                    />
                </group>
            )}
        </group>
    );
}

// --- 3D SCENE COMPOSITOR ---
function MainSequence({ data }: { data: VisionData }) {
    const scroll = useScroll();
    const [scrollState, setScrollState] = useState({ offset: 0 });
    const [opacities, setOpacities] = useState({
        logo: 1,
        photos: 0,
        bg: 0.6,
        divider: 0
    });

    useFrame(() => {
        const off = scroll.offset;
        setScrollState({ offset: off });

        // Total Pages: 5 (0.2 per page unit approximately)

        // 1. Logo (0 - 0.05)
        const logoOp = 1 - scroll.range(0, 0.05);

        // 2. Photos (0.05 - 0.15)
        const photoOp = scroll.curve(0.05, 0.15);

        // 3. Divider (0.15 - 0.25)
        let divOp = 0;
        if (off > 0.15 && off < 0.25) {
            // simple bell curve
            divOp = Math.sin(((off - 0.15) / 0.1) * Math.PI);
        }

        // 4. Background Video Global
        // Start clear (0.6), dim down to 0.15 when leaving top area to let content pop
        let bgOp = 0.6;
        if (off > 0.05) {
            // Lerp down to 0.15 quickly as we leave the hero
            const fade = Math.min((off - 0.05) * 8, 1);
            bgOp = THREE.MathUtils.lerp(0.6, 0.15, fade);
        }

        setOpacities({
            logo: logoOp,
            photos: photoOp,
            bg: bgOp,
            divider: divOp
        });
    });

    return (
        <>
            <BackgroundVideo url={data.heroVideoUrl || "/hero-video.mp4"} opacity={opacities.bg} />
            <LogoHero opacity={opacities.logo} scrollOffset={scrollState.offset} />
            <PhotoGrid opacity={opacities.photos} data={data} scrollOffset={scrollState.offset} />
            {data.dividerImageUrl && (
                <Divider3D url={data.dividerImageUrl} opacity={opacities.divider} scrollOffset={scrollState.offset} />
            )}
            <Sparkles count={80} scale={15} size={4} opacity={0.6} speed={0.4} color="#ffe4a1" />
        </>
    );
}

// Lerp progress in [start, end] to 0–1
function progressIn(offset: number, start: number, end: number): number {
    if (offset <= start) return 0;
    if (offset >= end) return 1;
    return (offset - start) / (end - start);
}

// --- HTML SCROLL CONTENT (rendered into ScrollControls’ fixed div via a single root to avoid createRoot twice) ---
function VisionOverlayContent({ data, scrollStateRef }: { data: VisionData; scrollStateRef: ScrollStateRef }) {
    const [offset, setOffset] = useState(0);
    const [height, setHeight] = useState(600);
    const lastSet = useRef(0);
    const THROTTLE_MS = 40;

    useEffect(() => {
        let rafId: number;
        const tick = () => {
            rafId = requestAnimationFrame(tick);
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            if (now - lastSet.current >= THROTTLE_MS) {
                lastSet.current = now;
                setOffset(scrollStateRef.current.offset);
                setHeight(scrollStateRef.current.height);
            }
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [scrollStateRef]);

    const pages = 8;
    // Slower, wider transitions so each section stays visible and has time to load
    const featuredEnter = progressIn(offset, 0.22, 0.36);
    const featuredExit = progressIn(offset, 0.44, 0.58);
    const loveNotesEnter = progressIn(offset, 0.50, 0.68);

    // Scroll hint fades out shortly after the user starts scrolling
    const scrollHintOpacity = 1 - progressIn(offset, 0.02, 0.12);

    const featuredScale = 0.85 + 0.15 * (1 - featuredExit) * featuredEnter;
    const featuredY = (1 - featuredEnter) * 32 + featuredExit * -120;
    const featuredOpacity = Math.min(featuredEnter * (1 - featuredExit * 1.2), 1);
    const loveNotesY = (1 - loveNotesEnter) * 48;
    const loveNotesOpacity = loveNotesEnter;

    const translateY = height * (pages - 1) * -offset;

    return (
        <div
            className="w-full text-white font-serif relative"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                willChange: 'transform',
                transform: `translate3d(0, ${translateY}px, 0)`,
            }}
        >
            <style>{`
                ::-webkit-scrollbar { width: 7px; background: #000; }
                ::-webkit-scrollbar-track { background: #050505; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>

            {/* 0. Intro Text */}
                <div className="absolute top-0 w-full h-[100vh] flex flex-col justify-end items-center pb-24 md:pb-32 px-6 md:px-0 pointer-events-none">
                    <h2 className="text-4xl md:text-5xl font-normal mb-2 text-center drop-shadow-2xl">
                        Capturing the Unscripted
                    </h2>
                    <p className="text-sm tracking-widest uppercase opacity-70">
                        Cinematic Details That Make Your Story Truly Yours
                    </p>

                    {/* Animated scroll hint */}
                    <div
                        className="mt-10 flex flex-col items-center gap-4"
                        style={{ opacity: scrollHintOpacity }}
                    >
                        <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-neutral-200/80 animate-pulse">
                            Scroll to explore
                        </span>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/70 to-transparent animate-pulse" />
                            <ChevronDown className="w-6 h-6 text-white/90 animate-bounce" />
                        </div>
                    </div>
                </div>

                {/* 1. Featured Films — scroll-driven enter (pop) and exit (move away from center) */}
                <div
                    className="absolute top-[200vh] w-full min-h-[120vh] md:min-h-[100vh] flex flex-col justify-center items-center will-change-transform py-16 md:py-0"
                    style={{
                        transform: `translateY(${featuredY}px) scale(${featuredScale})`,
                        opacity: featuredOpacity,
                        transformOrigin: 'center center',
                        pointerEvents: featuredOpacity < 0.02 ? 'none' : 'auto',
                    }}
                >
                    <div className="w-full max-w-7xl px-6 md:px-4">
                        <FeaturedFilms
                            films={data.featuredVideos.map(v => ({ ...v, youtubeUrl: v.videoUrl }))}
                            scrollDrivenProgress={featuredEnter}
                        />
                    </div>
                </div>

                {/* 2. Kind Words / Love Letters — appear as Featured Films moves away */}
                <div
                    className="absolute top-[400vh] w-full min-h-[120vh] md:min-h-[100vh] flex flex-col justify-center items-center px-6 md:px-4 py-16 md:py-0 pointer-events-none will-change-transform"
                    style={{
                        transform: `translateY(${loveNotesY}px)`,
                        opacity: loveNotesOpacity,
                    }}
                >
                    <div className="max-w-4xl text-center">
                        <div className="text-white/90 text-2xl tracking-[0.4em] mb-3" aria-hidden>
                            ☆ ☆ ☆ ☆ ☆
                        </div>
                        <h3 className="text-3xl md:text-5xl font-serif text-white mb-2">
                            Kind Words From Our Couples
                        </h3>
                        <p className="text-sm tracking-widest uppercase text-neutral-400 mb-10 md:mb-12">
                            Love Letters That Inspire Us
                        </p>
                        <div className="flex flex-col gap-10 md:gap-12">
                            {data.testimonials?.slice(0, 3).map((t, i) => (
                                <div key={i} className="bg-black/40 backdrop-blur-md p-6 md:p-8 border border-white/10 rounded-lg shadow-xl">
                                    <p className="text-xl italic mb-6">"{t.quote}"</p>
                                    <p className="text-sm uppercase font-bold text-neutral-400">— {t.couple}</p>
                                    {t.location && <p className="text-xs text-neutral-600 mt-2">{t.location}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Contact — extra bottom padding so Inquire button stays above footer on mobile */}
                <div className="absolute top-[600vh] w-full min-h-[120vh] md:min-h-[100vh] flex flex-col justify-center items-center pb-40 md:pb-32">
                    <div className="w-full px-4 md:px-0">
                        <ContactSection />
                    </div>
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
        <ScrollControls pages={8} damping={0.25}>
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

export default function VisionScene({ data }: { data: VisionData }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollStateRef = useRef({ offset: 0, height: 600, pages: 8 });
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
                <VisionOverlayContent data={data} scrollStateRef={scrollStateRef} />
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
    }, [data]);

    // Prevent body/document scroll so only ScrollControls’ inner div scrolls (no double scrollbar).
    // On smaller mobile screens (like iPhone), locking the body to 100vh can cause
    // sections to be visually covered or clipped by the browser chrome. To avoid that,
    // we only apply the body lock on larger viewports (desktop / large tablets).
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isDesktopLike = window.innerWidth >= 1024;
        if (!isDesktopLike) {
            // Let the document scroll normally on mobile so content isn't clipped.
            return;
        }

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
                <Canvas className="h-full w-full" camera={{ position: [0, 0, 6], fov: 35 }}>
                    <Scene data={data} />
                </Canvas>
            </div>
        </ScrollStateContext.Provider>
    );
}
