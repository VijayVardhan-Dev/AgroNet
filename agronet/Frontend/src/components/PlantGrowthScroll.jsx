import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useScroll, useSpring } from 'framer-motion';

export const PlantGrowthScroll = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Glob import all images in the sequence folder
    const imagePaths = useMemo(() => {
        const modules = import.meta.glob('../assets/sequence/*.jpeg', { eager: true });
        return Object.keys(modules).sort().map(key => modules[key].default);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadImages = async () => {
            const promises = imagePaths.map((src) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null); // safely handle missing/broken frames
                    img.src = src;
                });
            });

            const loadedImgs = await Promise.all(promises);
            if (isMounted) {
                // Filter out any failed loads
                setImages(loadedImgs.filter(Boolean));
                setLoading(false);
            }
        };

        if (imagePaths.length > 0) {
            loadImages();
        } else {
            setLoading(false);
        }

        return () => { isMounted = false; };
    }, [imagePaths]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [frameIndex, setFrameIndex] = useState(0);

    // Apply smooth damping to the raw scroll value for a buttery sequence playback
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Map the smoothed scroll to frames, but complete the full sequence by 60% scroll.
    // This ensures the plant is fully grown by mid-scroll, and the final text block
    // displays over the completed growth image.
    useEffect(() => {
        if (!loading && images.length > 0) {
            return smoothProgress.on('change', (latest) => {
                const maxIndex = images.length - 1;
                // Remap: sequence completes at 60% scroll, stays at last frame after
                const sequenceEnd = 0.6;
                const normalized = Math.min(1, latest / sequenceEnd);
                const index = Math.min(maxIndex, Math.max(0, Math.floor(normalized * maxIndex)));
                setFrameIndex(index);
            });
        }
    }, [smoothProgress, loading, images]);

    // Canvas rendering loop tailored for performance and visual fidelity
    useEffect(() => {
        if (loading || images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let requestRef;

        const render = () => {
            const img = images[frameIndex];
            if (!img) return;

            const renderWidth = canvas.clientWidth;
            const renderHeight = canvas.clientHeight;

            // Set internal canvas resolution to match pixel ratio for sharp rendering (Retina support)
            const dpr = window.devicePixelRatio || 1;
            if (canvas.width !== Math.floor(renderWidth * dpr) || canvas.height !== Math.floor(renderHeight * dpr)) {
                canvas.width = Math.floor(renderWidth * dpr);
                canvas.height = Math.floor(renderHeight * dpr);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height); // maintain transparency just in case

            // Calculate 'cover' logic with bottom anchor (soil at bottom)
            const imgRatio = img.width / img.height;
            const canvasRatio = renderWidth / renderHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
                // Screen is wider than image aspect -> Fill by width
                drawWidth = renderWidth;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                // Anchor to bottom so the plant soil stays at the screen bottom
                offsetY = renderHeight - drawHeight;
            } else {
                // Screen is taller than image aspect -> Fill by height
                drawHeight = renderHeight;
                drawWidth = drawHeight * imgRatio;
                // Center horizontally
                offsetX = (renderWidth - drawWidth) / 2;
                // Fill vertically exactly, starting from top
                offsetY = 0;
            }

            // Draw to canvas with dpr scaling applied directly to the coordinates
            ctx.drawImage(
                img,
                0, 0, img.width, img.height,
                Math.floor(offsetX * dpr),
                Math.floor(offsetY * dpr),
                Math.floor(drawWidth * dpr),
                Math.floor(drawHeight * dpr)
            );
        };

        // Draw immediately when index changes using requestAnimationFrame to avoid jank
        requestRef = requestAnimationFrame(render);

        // Also listen to resize to redraw
        window.addEventListener('resize', render);

        return () => {
            cancelAnimationFrame(requestRef);
            window.removeEventListener('resize', render);
        };
    }, [frameIndex, loading, images]);


    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 border-t border-gray-200">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-6 drop-shadow-sm"></div>
                <p className="text-black/60 font-semibold tracking-wide text-sm uppercase">Loading AgroNet growth sequence...</p>
            </div>
        );
    }

    if (images.length === 0) {
        return <div className="h-screen w-full flex items-center justify-center text-black bg-gray-50">Sequence images not found. Add them to src/assets/sequence/</div>;
    }

    // A fully natural flowing layout. 
    // On mobile: container is 300vh, canvas is 100vh sticky, text blocks are each 100vh scrolling down.
    // On md+: 2-column side-by-side layout.
    return (
        <div ref={containerRef} className="relative w-full md:flex md:flex-row bg-green-50 z-20 h-[300vh] md:h-auto">

            {/* Image Canvas Sticky Wrapper — absolute on mobile so it doesn't push text down */}
            <div className="absolute inset-0 md:relative md:w-1/2 md:border-r border-green-200 md:h-auto">
                <div className="sticky top-0 h-[100vh] w-full overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover origin-center"
                    />
                    {/* Dark gradient overlay for text readability on mobile only */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 md:hidden pointer-events-none"></div>
                </div>
            </div>

            {/* Scrolling Text Blocks — these drive the 300vh height on mobile */}
            <div className="relative w-full md:w-1/2 flex flex-col items-stretch pointer-events-auto z-10">
                {/* Block 1 */}
                <div className="h-[100vh] w-full flex flex-col justify-end md:justify-center p-8 pb-32 md:p-12 lg:p-24 bg-transparent md:bg-white text-white md:text-black">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg md:drop-shadow-none">
                            From Seed.
                        </h2>
                        <p className="text-xl md:text-2xl opacity-90 md:text-black/70 font-medium leading-relaxed drop-shadow-md md:drop-shadow-none">
                            Every harvest begins with a single sprout.
                        </p>
                    </div>
                </div>

                {/* Block 2 */}
                <div className="h-[100vh] w-full flex flex-col justify-end md:justify-center p-8 pb-32 md:p-12 lg:p-24 bg-transparent md:bg-transparent text-white md:text-black">
                    <div className="max-w-xl text-right md:text-left ml-auto md:ml-0">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg md:drop-shadow-none">
                            Growth Begins.
                        </h2>
                        <p className="text-xl md:text-2xl opacity-90 md:text-black/70 font-medium leading-relaxed drop-shadow-md md:drop-shadow-none">
                            Life pushing through the soil.
                        </p>
                    </div>
                </div>

                {/* Block 3 */}
                <div className="h-[100vh] w-full flex flex-col justify-end md:justify-center p-8 pb-32 md:p-12 lg:p-24 bg-transparent md:bg-white text-white md:text-black">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg md:drop-shadow-none">
                            Nature Expands.
                        </h2>
                        <p className="text-xl md:text-2xl opacity-90 md:text-black/70 font-medium leading-relaxed drop-shadow-md md:drop-shadow-none">
                            Leaves unfold. Energy flows and AgroNet connects you to the root of it all.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
