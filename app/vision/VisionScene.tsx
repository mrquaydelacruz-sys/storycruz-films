"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useVideoTexture, ScrollControls, useScroll, Scroll, useTexture, Float, Sparkles, Image, Html } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from 'three';
import { urlFor } from "@/sanity/client";
import { motion } from "framer-motion";

// --- TYPES ---
export type VisionData = {
    heroVideoUrl: string;
    introLeftUrl: string;
    introCenterUrl: string;
    introSlideshowUrls?: string[];
    introRightUrl: string;
    testimonials?: {
        quote: string;
        couple: string;
        location?: string;
    }[];
    featuredVideos: {
        thumbnailUrl: string;
        videoUrl: string;
    }[];
}

// --- COMPONENTS ---

function BackgroundVideo({ url, opacity }: { url: string, opacity: number }) {
    const texture = useVideoTexture(url);
    return (
        <mesh position={[0, 0, -1]} scale={[10, 5.625, 1]}>
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

function LogoHero({ opacity, scrollOffset }: { opacity: number, scrollOffset: number }) {
    const texture = useTexture("/logo.png");
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
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
    onClick?: () => void;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

function BorderedImage({ url, position, scale, opacity, radius = 0, onClick, onPointerOver, onPointerOut }: BorderedImageProps) {
    const borderSize = 0.04;
    return (
        <group position={position}>
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[scale[0] + borderSize, scale[1] + borderSize]} />
                <meshBasicMaterial color="white" transparent opacity={opacity} />
            </mesh>
            <Image
                url={url}
                scale={scale}
                transparent
                opacity={opacity}
                radius={radius}
                onClick={onClick}
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
            />
        </group>
    );
}

function PhotoCarousel({ urls, opacity, scrollOffset }: { urls: string[], opacity: number, scrollOffset: number }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // Move left as we scroll down
            // scrollOffset moves from ~0.25 to 0.55 during this phase
            // Map 0.25 -> 0, 0.55 -> -3 (approx)
            const targetX = (scrollOffset - 0.25) * -8;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
        }
    });

    if (!urls || urls.length === 0) return null;

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {urls.map((url, i) => (
                <BorderedImage
                    key={i}
                    url={url}
                    scale={[0.85, 1.2]}
                    position={[-0.3 + (i * 1.2), 0, 0]} // Space them out horizontally
                    opacity={opacity}
                />
            ))}
        </group>
    );
}

function ParallaxGroup({ children, speed = -5, scrollOffset, basePosition }: { children: React.ReactNode, speed?: number, scrollOffset: number, basePosition: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            // Only move if we are in the "active" phase (scrollOffset > 0.25)
            if (scrollOffset > 0.25) {
                const moveX = (scrollOffset - 0.25) * speed;
                groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, basePosition[0] + moveX, 0.1);
            } else {
                // Reset to base
                groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, basePosition[0], 0.1);
            }
        }
    });
    return <group ref={groupRef} position={basePosition}>{children}</group>;
}

function PhotoGrid({ opacity, data, scrollOffset }: { opacity: number, data: VisionData, scrollOffset: number }) {
    // If we have a slideshow array, use it. Otherwise fallback to the single center image.
    const slideshow = (data.introSlideshowUrls && data.introSlideshowUrls.length > 0)
        ? data.introSlideshowUrls
        : [data.introCenterUrl];

    return (
        <group visible={opacity > 0}>
            {opacity > 0 && (
                <group position={[0, -0.2, 0]}>
                    {/* Left Image (Moves left to exit) */}
                    {data.introLeftUrl && (
                        <ParallaxGroup
                            basePosition={[-1.3, 0, 0]}
                            scrollOffset={scrollOffset}
                            speed={-12} // Move left faster than carousel (-8) to avoid overlap
                        >
                            <BorderedImage
                                url={data.introLeftUrl}
                                scale={[0.85, 1.2]}
                                position={[0, 0, 0]} // Relative to group
                                opacity={opacity}
                            />
                        </ParallaxGroup>
                    )}

                    {/* Center Carousel */}
                    <PhotoCarousel urls={slideshow} opacity={opacity} scrollOffset={scrollOffset} />

                    {/* Right Image (Static/Parallax - pushed further right maybe?) */}
                    {data.introRightUrl && (
                        <BorderedImage
                            url={data.introRightUrl}
                            scale={[1.5, 1.0]}
                            position={[1.5 + (slideshow.length * 0.5), 0, 0]} // Push right based on carousel? Actually let's keep it fixed or maybe hide it?
                            // User asked for "center slideshow". Let's assume the carousel REPLACES the center slot.
                            // But usually a carousel takes up horizontal space.
                            // Let's just render the right image at a fixed position for now, 
                            // though it might overlap with the carousel if the carousel is long.
                            // Better yet: Let's remove the "static" right image if we are doing a full carousel flow, 
                            // OR let the carousel pass BEHIND the left/right "frame" images?
                            // User said: "lets have the photos do a auto carousel ... lets use the photos upload through sanity for center slideshow"
                            // So likely the Center Slot becomes a window.

                            // Implementation choice: Just render the carousel. 
                            // To keep it simple and clean: I will just render the Left and Right images as "anchors" 
                            // and the carousel moving in the middle? 
                            // Or maybe the carousel IS the main feature.

                            // Let's stick to the request: "Center slideshow". 
                            // I'll render the carousel starting at the center position.
                            opacity={opacity}
                        />
                    )}
                </group>
            )}
        </group>
    );
}

// Merged HTML Content Component
// Navbar Controller Component
function NavbarController() {
    const scroll = useScroll();
    const lastScroll = useRef(0);
    const lastDirection = useRef(0); // 1 = down, -1 = up

    useFrame(() => {
        // Use scroll.offset (0 to 1)
        const offset = scroll.offset;

        // Manual delta calculation is often more reliable than scroll.delta in frame loops
        const delta = offset - lastScroll.current;
        const threshold = 0.0001; // Lower sensitivity to catch slow scrolls

        // Only trigger if we moved enough
        if (Math.abs(delta) > threshold) {
            const direction = delta > 0 ? 1 : -1;

            // If direction changed
            if (direction !== lastDirection.current) {
                // Logic: 
                // - Visible if at top (< 0.01)
                // - Visible if scrolling UP (direction -1)
                // - Hidden if scrolling DOWN (direction 1)

                const isAtTop = offset < 0.01;
                const shouldBeVisible = isAtTop || direction === -1;

                console.log(`[VisionScene] Scroll Toggle: ${shouldBeVisible ? 'SHOW' : 'HIDE'} (Offset: ${offset.toFixed(4)}, Dir: ${direction})`);

                window.dispatchEvent(new CustomEvent('storycruz-toggle-nav', {
                    detail: { visible: shouldBeVisible }
                }));

                lastDirection.current = direction;
            }
        }

        // Force show if at very top (safer check)
        if (offset < 0.01 && lastDirection.current !== -1) {
            window.dispatchEvent(new CustomEvent('storycruz-toggle-nav', {
                detail: { visible: true }
            }));
            lastDirection.current = -1;
        }

        lastScroll.current = offset;
    });

    return null;
}

function VisionPages({ data }: { data: VisionData }) {
    const scroll = useScroll();

    // Refs for text containers
    const page1Ref = useRef<HTMLDivElement>(null);
    const page2Ref = useRef<HTMLDivElement>(null);
    const page3Ref = useRef<HTMLDivElement>(null);
    const testimonialsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const ctaRef = useRef<HTMLDivElement>(null);

    useFrame(() => {
        const off = scroll.offset;

        // --- Calculation Helper ---
        // peak: where opacity is 1
        // width: how wide the "1" range is
        // fade: how wide the fade in/out ramps are
        const getOpacity = (peak: number, width: number, fade: number) => {
            // Range logic:
            // 0 -> start of fade in (peak - width/2 - fade)
            // 1 -> peak start (peak - width/2)
            // 1 -> peak end (peak + width/2)
            // 0 -> end of fade out (peak + width/2 + fade)

            const startFadeIn = peak - width / 2 - fade;
            const endFadeIn = peak - width / 2;
            const startFadeOut = peak + width / 2;
            const endFadeOut = peak + width / 2 + fade;

            if (off < startFadeIn) return 0;
            if (off >= startFadeIn && off < endFadeIn) return (off - startFadeIn) / fade;
            if (off >= endFadeIn && off <= startFadeOut) return 1;
            if (off > startFadeOut && off < endFadeOut) return 1 - (off - startFadeOut) / fade;
            return 0;
        };

        const getYiTranslate = (peak: number, width: number, fade: number) => {
            // Simple parallax/slide effect: Slide UP as we scroll down
            // At startFadeIn: +50px
            // At endFadeIn: 0px
            // At startFadeOut: 0px
            // At endFadeOut: -50px
            const startFadeIn = peak - width / 2 - fade;
            const endFadeIn = peak - width / 2;
            const startFadeOut = peak + width / 2;
            const endFadeOut = peak + width / 2 + fade;

            if (off < startFadeIn) return 50;
            if (off >= startFadeIn && off < endFadeIn) {
                // Lerp 50 -> 0
                return THREE.MathUtils.lerp(50, 0, (off - startFadeIn) / fade);
            }
            if (off >= endFadeIn && off <= startFadeOut) return 0;
            if (off > startFadeOut && off < endFadeOut) {
                // Lerp 0 -> -50
                return THREE.MathUtils.lerp(0, -50, (off - startFadeOut) / fade);
            }
            return -50;
        }

        // --- Apply to Refs ---

        // Page 1: 0 - 0.2
        const p1Op = off < 0.1 ? 1 : THREE.MathUtils.lerp(1, 0, (off - 0.1) / 0.1);

        if (page1Ref.current) {
            page1Ref.current.style.opacity = Math.max(0, p1Op).toString();
            page1Ref.current.style.transform = `translateY(${off * 100}px)`; // Parallax down a bit
        }

        // Page 2 (Capturing): 0.25 - 0.55 range from MainSequence for photos
        // Let's Center text at 0.35. Width 0.1 (0.3-0.4). Fade 0.1 (0.2-0.3, 0.4-0.5).
        if (page2Ref.current) {
            const op = getOpacity(0.35, 0.1, 0.1);
            const y = getYiTranslate(0.35, 0.1, 0.1);
            page2Ref.current.style.opacity = op.toString();
            page2Ref.current.style.transform = `translateY(${y}px)`;
        }

        // Page 3 (Ready): 0.55 - 0.8 range from MainSequence
        // Center at 0.65. Width 0.1 (0.6-0.7). Fade 0.1 (0.5-0.6, 0.7-0.8).
        const p3Op = getOpacity(0.65, 0.1, 0.1);
        const p3Y = getYiTranslate(0.65, 0.1, 0.1);

        if (page3Ref.current) {
            page3Ref.current.style.opacity = p3Op.toString();
            page3Ref.current.style.transform = `translateY(${p3Y}px)`;

            // Typewriter Effect
            const fullText = "Ready to tell your story?";
            const startType = 0.5;
            const endType = 0.7;

            let typeProgress = 0;
            if (off > startType && off < endType) {
                typeProgress = (off - startType) / (endType - startType);
            } else if (off >= endType) {
                typeProgress = 1;
            }

            const charCount = Math.floor(fullText.length * typeProgress);
            const currentText = fullText.substring(0, charCount);

            const h2 = page3Ref.current.querySelector('h2');
            if (h2 && h2.innerText !== currentText) {
                h2.innerText = currentText;
            }
        }

        // Testimonials Sequential Fade: 0.55 - 0.95 (Extended for longer reading time)
        if (data.testimonials && data.testimonials.length > 0) {
            // Define the total scroll range for the sequence
            const tStart = 0.55;
            const tEnd = 0.95;
            const tTotal = tEnd - tStart;

            const count = data.testimonials.length;
            const itemDuration = tTotal / count;

            data.testimonials.forEach((_, i) => {
                const itemRef = testimonialsRefs.current[i];
                if (itemRef) {
                    // Calculate start and end points for this specific item's "slot"
                    const start = tStart + (i * itemDuration);
                    const end = start + itemDuration;

                    // Fade duration (Reduced to 15% for faster fade in, longer hold)
                    const fade = itemDuration * 0.15;
                    let op = 0;

                    if (off >= start && off < end) {
                        if (off < start + fade) {
                            // Fading In
                            op = (off - start) / fade;
                        } else if (off > end - fade) {
                            // Fading Out
                            op = 1 - (off - (end - fade)) / fade;
                        } else {
                            // Fully Visible (Hold)
                            op = 1;
                        }
                    }

                    itemRef.style.opacity = op.toString();

                    // Subtle Slide Up Effect
                    // Slide from 20px down to -20px up as it progresses through its slot
                    const y = THREE.MathUtils.lerp(20, -20, (off - start) / itemDuration);
                    itemRef.style.transform = `translateY(${y}px)`;
                }
            });
        }

        // CTA: > 0.8
        if (ctaRef.current) {
            let op = 0;
            if (off > 0.75 && off < 0.9) op = (off - 0.75) / 0.15;
            if (off >= 0.9) op = 1;

            const y = THREE.MathUtils.lerp(50, 0, Math.min(1, Math.max(0, (off - 0.75) / 0.15)));

            ctaRef.current.style.opacity = op.toString();
            ctaRef.current.style.transform = `translateY(${y}px)`;
            ctaRef.current.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
        }
    });

    return (
        <Scroll html style={{ width: '100%' }}>
            {/* Global Styles */}
            <style>{`
                ::-webkit-scrollbar {
                    width: 7px;
                    background: #000; 
                }
                ::-webkit-scrollbar-track {
                    background: #050505; 
                }
                ::-webkit-scrollbar-thumb {
                    background: #333; 
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #555; 
                }
            `}</style>

            <div className="w-full text-white font-serif pointer-events-none">
                {/* Page 1 - Simple Bounce */}
                <div className="h-screen w-full flex flex-col justify-end items-center pb-32">
                    <div
                        ref={page1Ref}
                        className="animate-bounce text-white/50 text-sm tracking-widest uppercase"
                    >
                        Scroll to Explore
                    </div>
                </div>

                {/* Page 2 - Capturing the Unscripted */}
                <div className="h-screen w-full flex flex-col items-center justify-start pt-20">
                    <div
                        ref={page2Ref}
                        className="flex flex-col items-center opacity-0" // Start invisible
                    >
                        <h2 className="text-5xl md:text-6xl font-normal mb-2 text-center">
                            Capturing the Unscripted
                        </h2>
                        <p className="text-sm md:text-base tracking-widest uppercase opacity-70 mb-20">
                            Cinematic Details That Make Your Story Truly Yours
                        </p>
                    </div>
                </div>

                {/* Page 3 - Ready to tell your story */}
                <div className="h-screen w-full flex flex-col items-center justify-center relative">
                    {/* Text Container */}
                    <div
                        ref={page3Ref}
                        className="flex flex-col items-center opacity-0 z-10"
                    >
                        <h2 className="text-5xl md:text-7xl font-normal text-center drop-shadow-2xl h-[1.2em] mb-12">
                            {/* Inner text updated by useFrame */}
                        </h2>
                    </div>

                    {/* Testimonials Container - Stacked Centered */}
                    <div
                        className="absolute bottom-[20%] w-full flex justify-center items-center pointer-events-none px-4"
                    >
                        <div className="relative w-full max-w-3xl flex justify-center items-center h-[200px]">
                            {/* We give the container some height (h-[200px]) to reserve space, 
                                but the items themselves are centered absolutely within it. 
                                Actually, 'absolute inset-0' was the issue. 
                                Let's center them using transforms so they can grow. 
                            */}
                            {data.testimonials?.map((t, i) => (
                                <div
                                    key={i}
                                    ref={(el) => { testimonialsRefs.current[i] = el; }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center text-center bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-lg border border-white/10 shadow-2xl"
                                    style={{ opacity: 0, width: '90%', maxWidth: '600px' }} // Start invisible
                                >
                                    <p className="text-xl md:text-2xl italic mb-6 font-light leading-relaxed drop-shadow-md">
                                        "{t.quote}"
                                    </p>
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-sm uppercase tracking-[0.2em] font-bold opacity-90">— {t.couple}</p>
                                        {t.location && <p className="text-xs tracking-widest opacity-60 font-light">{t.location}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Page 4 - CTA */}
                <div className="h-screen w-full flex flex-col items-center justify-center relative z-50">
                    <div
                        ref={ctaRef}
                        className="opacity-0"
                    >
                        <button
                            className="pointer-events-auto px-12 py-4 border border-white/30 bg-black/50 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-widest text-sm"
                        >
                            Inquire Now
                        </button>
                    </div>
                </div>
            </div>
        </Scroll>
    );
}

function MainSequence({ data }: { data: VisionData }) {
    const scroll = useScroll();
    const [scrollState, setScrollState] = useState({ offset: 0 });
    const [opacities, setOpacities] = useState({ logo: 1, photos: 0, bg: 0, cta: 0 });

    useFrame(() => {
        const off = scroll.offset;
        setScrollState({ offset: off });

        // 1. Logo Intro (0 - 0.2)
        const logoOp = 1 - scroll.range(0, 0.2);

        // 2. Photo Grid (0.25 - 0.5)
        // BG Opacity should be dim here (~0.2)
        let photoOp = 0;
        if (off > 0.2 && off < 0.3) photoOp = (off - 0.2) / 0.1;
        if (off >= 0.3 && off <= 0.45) photoOp = 1;
        if (off > 0.45 && off < 0.55) photoOp = 1 - (off - 0.45) / 0.1;

        // 3. Full Hero Video "Ready to tell your story" (0.55 - 0.8)
        let globalBgOp = 0;
        // Phase A: Dim for Grid
        if (off > 0.1 && off <= 0.5) globalBgOp = THREE.MathUtils.lerp(0, 0.2, (off - 0.1) / 0.1);
        if (off > 0.25 && off <= 0.5) globalBgOp = 0.2;
        // Phase B: Full for Text
        if (off > 0.5 && off <= 0.6) globalBgOp = THREE.MathUtils.lerp(0.2, 1.0, (off - 0.5) / 0.1);
        if (off > 0.6 && off <= 0.75) globalBgOp = 1.0;
        // Phase C: Fade out for CTA
        if (off > 0.8) globalBgOp = THREE.MathUtils.lerp(1.0, 0.1, (off - 0.8) / 0.15);

        // 4. CTA (0.8 - 1.0)
        let ctaOp = 0;
        if (off > 0.8) ctaOp = (off - 0.8) / 0.1;

        setOpacities({
            logo: logoOp,
            photos: photoOp,
            bg: globalBgOp,
            cta: ctaOp
        });
    });

    return (
        <>
            <BackgroundVideo url={data.heroVideoUrl || "/hero-video.mp4"} opacity={opacities.bg} />
            <LogoHero opacity={Math.max(opacities.logo, opacities.cta)} scrollOffset={scrollState.offset} />
            <PhotoGrid opacity={opacities.photos} data={data} scrollOffset={scrollState.offset} />
            <Sparkles count={60} scale={12} size={3} opacity={0.6} speed={0.2} color="#ffe4a1" />
        </>
    );
}

function Scene({ data }: { data: VisionData }) {
    return (
        <ScrollControls pages={4} damping={0.3}>
            <MainSequence data={data} />
            <NavbarController />
            <VisionPages data={data} />
        </ScrollControls>
    )
}

export default function VisionScene({ data }: { data: VisionData }) {
    return (
        <div className="h-screen w-full bg-[#050505] relative overflow-hidden text-white selection:bg-white selection:text-black">

            {/* Navigation moved inside Canvas/ScrollControls */}

            <Canvas className="h-full w-full" camera={{ position: [0, 0, 6], fov: 35 }}>
                <Suspense fallback={null}>
                    <Scene data={data} />
                    <Environment preset="studio" />
                </Suspense>
            </Canvas>
        </div>
    );
}
