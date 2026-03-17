import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FEATURES = [
    {
        label: "01",
        title: "Smart Farming",
        desc: "Leverage AI-driven analytics to optimize yields and reduce resource waste across your land.",
        accent: "bg-green-400",
    },
    {
        label: "02",
        title: "Direct Marketplace",
        desc: "Connect directly with bulk buyers and sellers globally, eliminating middlemen completely.",
        accent: "bg-blue-400",
    },
    {
        label: "03",
        title: "Supply Chain",
        desc: "Track market demand and manage your inventory with live, real-time updates.",
        accent: "bg-yellow-400",
    },
];

// rotateY configs per card — each panel fans to a different final angle
// giving that premium "open book" tilt instead of all landing flat
const CARD_FINAL_ROT = [200, 180, 160]; // deg: left tilts past flip, center perfect, right tilts before full flip

const FlipPanel = ({ feature, scrollYProgress, flipStart, flipEnd, finalRot }) => {
    const rotateY = useTransform(scrollYProgress, [flipStart, flipEnd], [0, finalRot]);

    return (
        // perspectiveOrigin must sit on the wrapper, not the motion div, for correct 3D
        <div style={{ perspective: 1400, flex: 1, height: '100%' }}>
            <motion.div
                style={{ rotateY, width: '100%', height: '100%', transformStyle: 'preserve-3d', position: 'relative' }}
            >
                {/* ── Front face: the dark rectangle panel ─────────────── */}
                <div
                    className="absolute inset-0 bg-green-800 flex items-end p-8"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <span className="text-white/10 text-[7rem] font-black select-none absolute top-4 right-6 leading-none">
                        {feature.label}
                    </span>
                    <p className="text-white/40 text-sm font-semibold tracking-[0.2em] uppercase relative z-10">
                        {feature.title}
                    </p>
                </div>

                {/* ── Back face: revealed content ───────────────────────── */}
                <div
                    className="absolute inset-0 bg-[#F8F8F6] border border-gray-200 flex flex-col justify-between p-8 md:p-10"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className={`w-10 h-10 rounded-lg ${feature.accent}`} />
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">
                            {feature.label}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                            {feature.title}
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const FeatureReveal = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Phase 1 (0 → 0.3): Big rectangle is fully visible — no animation
    // Phase 2 (0.3 → 0.5): Crack opens — panels separate with a small gap
    // Phase 3 (0.5 → 1.0): Panels flip staggered to reveal content

    const gap = useTransform(scrollYProgress, [0.3, 0.5], [0, 12]);

    // Staggered flip windows — each panel flips in its own scroll range
    const flip0 = { start: 0.48, end: 0.70 }; // Left  — first
    const flip1 = { start: 0.55, end: 0.77 }; // Center — second
    const flip2 = { start: 0.62, end: 0.84 }; // Right  — last

    // Label fade
    const labelOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
    const labelY = useTransform(scrollYProgress, [0.05, 0.2], [16, 0]);

    return (
        <div ref={containerRef} className="h-[350vh] relative bg-white w-full">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* "What we offer" label */}
                <motion.p
                    style={{ opacity: labelOpacity, y: labelY }}
                    className="text-sm md:text-base font-black tracking-[0.3em] uppercase text-green-700 mb-8 drop-shadow-sm"
                >
                    ✦ What we offer ✦
                </motion.p>

                {/* THE big rectangle — always 80% wide, fixed height desktop, variable mobile */}
                <motion.div
                    className="flex flex-col md:flex-row items-stretch mx-auto"
                    style={{ 
                        gap, 
                        width: 'min(90vw, 1100px)',
                        height: 'min(70vh, 460px)' // increased height for mobile vertical layout
                    }}
                >
                    <FlipPanel
                        feature={FEATURES[0]}
                        scrollYProgress={scrollYProgress}
                        flipStart={flip0.start}
                        flipEnd={flip0.end}
                        finalRot={CARD_FINAL_ROT[0]}
                    />
                    <FlipPanel
                        feature={FEATURES[1]}
                        scrollYProgress={scrollYProgress}
                        flipStart={flip1.start}
                        flipEnd={flip1.end}
                        finalRot={CARD_FINAL_ROT[1]}
                    />
                    <FlipPanel
                        feature={FEATURES[2]}
                        scrollYProgress={scrollYProgress}
                        flipStart={flip2.start}
                        flipEnd={flip2.end}
                        finalRot={CARD_FINAL_ROT[2]}
                    />
                </motion.div>

            </div>
        </div>
    );
};
