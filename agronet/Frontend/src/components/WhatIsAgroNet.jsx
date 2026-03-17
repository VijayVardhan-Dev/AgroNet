import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const WhatIsAgroNet = () => {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // ── Desktop: shared group rises to center ──────────────────────────────
    const groupY = useTransform(scrollYProgress, [0, 0.4], ["150vh", "0vh"]);

    // ── Mobile: each card enters one-by-one (Y keyframes: enter→stack→scatter) ─
    // X scatter: ~60vw so card is ~half visible at screen edge
    const m0Y = useTransform(scrollYProgress, [0.00, 0.18, 0.42, 0.80], ["120vh", "0vh", "0vh", "-28vh"]);
    const m0X = useTransform(scrollYProgress, [0.42, 0.80], ["0vw", "-40vw"]);

    const m1Y = useTransform(scrollYProgress, [0.06, 0.24, 0.45, 0.84], ["120vh", "0vh", "0vh", "-22vh"]);
    const m1X = useTransform(scrollYProgress, [0.45, 0.84], ["0vw",  "40vw"]);

    const m2Y = useTransform(scrollYProgress, [0.12, 0.30, 0.48, 0.90], ["120vh", "0vh", "0vh",  "28vh"]);
    const m2X = useTransform(scrollYProgress, [0.48, 0.90], ["0vw", "-40vw"]);

    const m3Y = useTransform(scrollYProgress, [0.18, 0.36, 0.44, 0.82], ["120vh", "0vh", "0vh",  "35vh"]);
    const m3X = useTransform(scrollYProgress, [0.44, 0.82], ["0vw",  "30vw"]);

    // Phase 2: Staggered scattering speeds and scaling
    // Card 0 (Top Left) - Fastest
    const card0X = useTransform(scrollYProgress, [0.45, 0.85], ["0vw", "-26vw"]);
    const card0Y = useTransform(scrollYProgress, [0.4, 0.85], ["0vh", "-20vh"]);
    const card0Rot = useTransform(scrollYProgress, [0.4, 0.85], [-12, 0]);
    const card0Scale = useTransform(scrollYProgress, [0.4, 0.85], [1, 1.2]);
    const card0Aspect = useTransform(scrollYProgress, [0.4, 0.85], ["3/4", "16/9"]);

    // Card 1 (Top Right)
    const card1X = useTransform(scrollYProgress, [0.45, 0.85], ["0vw", "28vw"]);
    const card1Y = useTransform(scrollYProgress, [0.45, 0.85], ["0vh", "-22vh"]);
    const card1Rot = useTransform(scrollYProgress, [0.45, 0.85], [14, 0]);
    const card1Scale = useTransform(scrollYProgress, [0.4, 0.85], [1, 1.2]);
    const card1Aspect = useTransform(scrollYProgress, [0.45, 0.85], ["3/4", "16/9"]);

    // Card 2 (Bottom Left) - Slowest
    const card2X = useTransform(scrollYProgress, [0.5, 1.0], ["0vw", "-30vw"]);
    const card2Y = useTransform(scrollYProgress, [0.5, 1.0], ["0vh", "26vh"]);
    const card2Rot = useTransform(scrollYProgress, [0.5, 1.0], [15, 0]);
    const card2Scale = useTransform(scrollYProgress, [0.5, 1.0], [1, 1.2]);
    const card2Aspect = useTransform(scrollYProgress, [0.5, 1.0], ["3/4", "16/9"]);

    // Card 3 (Bottom Right)
    const card3X = useTransform(scrollYProgress, [0.42, 0.8], ["0vw", "23vw"]);
    const card3Y = useTransform(scrollYProgress, [0.42, 0.8], ["0vh", "28vh"]);
    const card3Rot = useTransform(scrollYProgress, [0.42, 0.8], [16, 0]);
    const card3Scale = useTransform(scrollYProgress, [0.42, 0.8], [1, 1.2]);
    const card3Aspect = useTransform(scrollYProgress, [0.42, 0.8], ["3/4", "16/9"]);

    const cards = [
        {
            x: isMobile ? m0X : card0X,
            y: isMobile ? m0Y : card0Y,
            rotate: card0Rot, scale: card0Scale, aspectRatio: card0Aspect
        },
        {
            x: isMobile ? m1X : card1X,
            y: isMobile ? m1Y : card1Y,
            rotate: card1Rot, scale: card1Scale, aspectRatio: card1Aspect
        },
        {
            x: isMobile ? m2X : card2X,
            y: isMobile ? m2Y : card2Y,
            rotate: card2Rot, scale: card2Scale, aspectRatio: card2Aspect
        },
        {
            x: isMobile ? m3X : card3X,
            y: isMobile ? m3Y : card3Y,
            rotate: card3Rot, scale: card3Scale, aspectRatio: card3Aspect
        }
    ];

    return (
        <div ref={containerRef} className="h-[400vh] relative bg-[#F4F7F2] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Background Grid & Text */}
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
                        <h2 className="text-6xl md:text-8xl font-black text-green-900 tracking-tighter mb-6 drop-shadow-sm">
                            What is <br />
                            <span className="text-green-700">AgroNet?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl bg-[#F4F7F2]/80 backdrop-blur-sm p-4 rounded-2xl">
                            A comprehensive digital ecosystem designed to connect, empower, and scale the future of global agriculture.
                        </p>
                    </div>
                </div>

                {/* Animated Dynamic Cards Container */}
                <motion.div
                    className="absolute z-10 flex items-center justify-center inset-0 pointer-events-none"
                    style={{ y: isMobile ? 0 : groupY }}
                >
                    {cards.map((card, idx) => {
                        const zIndexes = [10, 11, 12, 13];

                        return (
                            <motion.div
                                key={idx}
                                style={{
                                    x: card.x,
                                    y: card.y,
                                    rotate: card.rotate,
                                    scale: card.scale,
                                    aspectRatio: card.aspectRatio
                                }}
                                className={`absolute bg-gray-300 rounded-md shadow-2xl border border-gray-400/30 origin-center z-[${zIndexes[idx]}] pointer-events-auto w-[180px] md:w-[20vw] aspect-square`}
                            >
                                {/* Images will be inserted here later */}
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </div>
    );
};
