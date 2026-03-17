import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import introImg from '../assets/images/intro1.webp';
import tabletImg from '../assets/images/tablet.webp';
import mobileImg from '../assets/images/mobile.webp';

gsap.registerPlugin(ScrollTrigger);

export const HeroZoom = ({ children }) => {
    const containerRef = useRef(null);
    const zoomGroupRef = useRef(null);
    const contentRef = useRef(null);
    const maskImageRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2500", // Slightly shorter to make mobile scrolling feel faster
                    scrub: 0.5, // Reduced scrub delay for better mobile responsiveness
                    pin: true,
                    anticipatePin: 1,
                    fastScrollEnd: true,
                }
            });

            // Zoom perfectly into the center hole over the background
            // Use 'power3.in' to start slow and accelerate past the camera realistically
            // Scale limited to 80 to prevent total GPU memory evaporation on iOS Safari (150 was crashing it)
            tl.to(zoomGroupRef.current, {
                scale: 80,
                ease: "power3.in",
                duration: 1
            });

            // Use autoAlpha instead of opacity to fully remove the massive element from the render tree
            // This prevents the "not loading" bug when scrolling back up because the browser can safely collect it
            tl.to(maskImageRef.current, {
                autoAlpha: 0,
                duration: 0.1
            }, 0.9); // fade out just before the animation ends

            // Subtle parallax on the content behind it without hiding it
            tl.fromTo(contentRef.current,
                { scale: 0.85, opacity: 0.8 },
                { scale: 1, opacity: 1, ease: "power2.out", duration: 1 },
                0
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="h-[100svh] w-full relative overflow-hidden bg-white">
            {/* The revealed content stays behind the zooming image */}
            <div className="absolute inset-0 z-0 w-full h-full flex flex-col overflow-y-auto hidden-scrollbar pointer-events-auto">
                {/* Wrapper that animates in */}
                <div ref={contentRef} className="w-full h-full flex flex-col justify-center">
                    {children}
                </div>
            </div>

            {/* The Zooming Image layer */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
                <div
                    ref={zoomGroupRef}
                    className="w-full h-full flex items-center justify-center will-change-transform"
                    style={{ transformOrigin: '50% 50%' }}
                >
                    <picture className="absolute w-[105%] h-[105%] max-w-none -translate-x-[2.0%] md:-translate-x-[1.1%]">
                        <source media="(max-width: 640px)" srcSet={mobileImg} />
                        <source media="(max-width: 1024px)" srcSet={mobileImg} />
                        <img
                            ref={maskImageRef}
                            src={introImg}
                            alt="AgroNet Intro Mask"
                            className="w-full h-full object-cover object-center"
                            style={{ willChange: "transform, opacity" }} // Hints browser to hardware accelerate
                        />
                    </picture>
                </div>
            </div>
        </div>
    );
};
