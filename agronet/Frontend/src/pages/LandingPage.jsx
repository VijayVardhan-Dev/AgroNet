import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../routing/routes';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { HeroZoom } from '../components/HeroZoom';
import { WhatIsAgroNet } from '../components/WhatIsAgroNet';
import { PlantGrowthScroll } from '../components/PlantGrowthScroll';
import { FeatureReveal } from '../components/FeatureReveal';
import { Footer } from '../components/Footer';
import vardhan from '../assets/images/vardhan.jpeg';
import ProfileCard from '../components/ProfileCardComponent';
import logo from '../assets/images/logo.png';
import overlayicon from '../assets/images/overlayicon.png';

// Create a spaced-out pattern by embedding the icon inside a larger padded SVG
const paddedIconString = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cimage href='${overlayicon}' width='40' height='40' x='30' y='30'/%3E%3C/svg%3E`;

const LandingPage = () => {
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            // Scrolling down
            setIsNavVisible(false);
        } else {
            // Scrolling up
            setIsNavVisible(true);
        }
    });

    return (
        <div className="relative font-sans text-gray-800 bg-white min-h-screen">
            {/* Loading Screen */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-6"></div>
                    <p className="text-green-800 font-semibold tracking-wide text-sm uppercase">Loading AgroNet...</p>
                </div>
            )}
            {/* Overlay Navigation */}
            <div className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center pointer-events-none transition-colors duration-300">
                <motion.div
                    className="flex items-center gap-3 pointer-events-auto"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                        y: isNavVisible ? 0 : -100,
                        opacity: isNavVisible ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full p-1">
                        <img src={logo} alt="AgroNet" className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <span className="font-bold text-2xl text-white tracking-tight drop-shadow-lg">AGRONET</span>
                </motion.div>

                <motion.div
                    className="flex items-center"
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                        y: isNavVisible ? 0 : -100,
                        opacity: isNavVisible ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <Link
                        to={ROUTES.LOGIN}
                        className="px-6 py-2.5 bg-white/90 backdrop-blur-md text-green-800 text-sm font-semibold rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg"
                    >
                        Log In
                    </Link>
                </motion.div>
            </div>

            {/* Scrollytelling Component */}
            <HeroZoom>
                {/* Main Landing Section */}
                <div className="relative z-10 bg-white w-full py-32 px-8 flex flex-col items-center justify-center min-h-[80vh]">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-green-900 mb-6 md:mb-8 text-center max-w-4xl tracking-tight leading-tight px-4 md:px-0">
                        The Future of Agriculture is Here
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-medium text-center max-w-3xl mb-8 md:mb-12 px-4 md:px-0">
                        Connect with thousands of farmers, access smart analytics, and optimize your harvest yield with AgroNet.
                    </p>

                    <div className="flex gap-6 flex-wrap justify-center">
                        <button className="px-8 py-4 bg-green-700 text-white rounded-full font-bold text-lg hover:bg-green-800 hover:scale-105 transition-all shadow-xl">
                            Get Started
                        </button>
                        <button className="px-8 py-4 bg-green-100 text-green-800 rounded-full font-bold text-lg hover:bg-green-200 hover:scale-105 transition-all shadow-sm">
                            Learn More
                        </button>
                    </div>
                </div>
            </HeroZoom>

            {/* Plant Growth Scrollytelling Section */}
            <PlantGrowthScroll onLoaded={() => setIsLoading(false)} />

            <WhatIsAgroNet />

            {/* Feature Split & Flip Reveal Section */}
            <FeatureReveal />

            {/* Meet the Core Team Section */}
            <section className="w-full py-24 bg-green-50 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-green-50 z-0"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#86efac_1px,transparent_1px),linear-gradient(to_bottom,#86efac_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_110%)] opacity-40 z-0"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4 drop-shadow-sm">
                        Meet the Core Team
                    </h2>
                    <p className="text-green-800 text-lg md:text-xl mb-16 max-w-2xl font-medium tracking-wide">
                        Dedicated to building the future of agriculture with innovative, modern web technologies.
                    </p>

                    <div className="w-full overflow-x-auto pb-8 -mx-4 px-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 no-scrollbar">
                        <div className="flex justify-start md:justify-center gap-6 md:gap-8 w-max md:w-full max-w-6xl mx-auto perspective-1000">
                            <div className="w-64 shrink-0 mt-4 md:mt-0">
                                <ProfileCard
                                    name="Hemant Kumar"
                                    title="Lead Developer"
                                    handle="hemant"
                                    status="Online"
                                    contactText="Contact Me"
                                    avatarUrl="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=256&auto=format&fit=crop"
                                    miniAvatarUrl="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=64&auto=format&fit=crop"
                                    showUserInfo={false}
                                    enableTilt={true}
                                    enableMobileTilt={false}
                                    detailsPosition="bottom"
                                    onContactClick={() => console.log('Contact clicked')}
                                    behindGlowColor="rgba(22, 163, 74, 0.4)"
                                    behindGlowEnabled
                                    innerGradient="linear-gradient(145deg, rgba(22, 163, 74, 0.15) 0%, rgba(134, 239, 172, 0.05) 100%)"
                                    iconUrl={overlayicon}
                                />
                            </div>
                            <div className="w-64 shrink-0 mt-4 md:mt-0">
                                <ProfileCard
                                    name="Vijay Vardhan"
                                    title="UI/UX Engineer"
                                    handle="vijay"
                                    status="Active"
                                    contactText="Contact Me"
                                    avatarUrl={vardhan}
                                    miniAvatarUrl="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=64&auto=format&fit=crop"
                                    showUserInfo={false}
                                    enableTilt={true}
                                    enableMobileTilt={false}
                                    imageFill={true}
                                    detailsPosition="bottom"
                                    onContactClick={() => console.log('Contact clicked')}
                                    behindGlowColor="rgba(22, 163, 74, 0.4)"
                                    behindGlowEnabled
                                    innerGradient="linear-gradient(145deg, rgba(22, 163, 74, 0.15) 0%, rgba(134, 239, 172, 0.05) 100%)"
                                    iconUrl={overlayicon}
                                />
                            </div>
                            <div className="w-64 shrink-0 mt-4 md:mt-0">
                                <ProfileCard
                                    name="Ananya Rao"
                                    title="Product Manager"
                                    handle="ananya"
                                    status="Active"
                                    contactText="Contact Me"
                                    avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
                                    miniAvatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop"
                                    showUserInfo={false}
                                    enableTilt={true}
                                    detailsPosition="bottom"
                                    enableMobileTilt={false}
                                    onContactClick={() => console.log('Contact clicked')}
                                    behindGlowColor="rgba(22, 163, 74, 0.4)"
                                    behindGlowEnabled
                                    innerGradient="linear-gradient(145deg, rgba(22, 163, 74, 0.15) 0%, rgba(134, 239, 172, 0.05) 100%)"
                                    iconUrl={overlayicon}
                                />
                            </div>
                            <div className="w-64 shrink-0 mt-4 md:mt-0 pr-4 md:pr-0">
                                <ProfileCard
                                    name="Karan Singh"
                                    title="Agronomy Expert"
                                    handle="karan"
                                    status="Offline"
                                    contactText="Contact Me"
                                    avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
                                    miniAvatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop"
                                    showUserInfo={false}
                                    enableTilt={true}
                                    enableMobileTilt={false}
                                    detailsPosition="bottom"
                                    onContactClick={() => console.log('Contact clicked')}
                                    behindGlowColor="rgba(22, 163, 74, 0.4)"
                                    behindGlowEnabled
                                    innerGradient="linear-gradient(145deg, rgba(22, 163, 74, 0.15) 0%, rgba(134, 239, 172, 0.05) 100%)"
                                    iconUrl={overlayicon}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;


