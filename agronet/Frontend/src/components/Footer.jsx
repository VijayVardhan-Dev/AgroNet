import React from 'react';
import { motion } from 'framer-motion';
import TextPressure from './TextPressure';

export const Footer = () => {
    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <footer className="w-full bg-green-950 text-white relative overflow-hidden pt-24 pb-8 flex flex-col items-center">
            {/* Background design elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_bottom,_var(--tw-gradient-stops))] from-green-900/40 via-transparent to-transparent opacity-60 z-0"></div>
            
            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                {/* Left side: Tagline and CTA */}
                <div className="max-w-md">
                    <motion.h3 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-green-100 mb-4"
                    >
                        Grow Beyond Boundaries
                    </motion.h3>
                    <motion.p 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-green-300 text-lg mb-8"
                    >
                        Join the agricultural revolution today. Connect deeply, optimize smartly, and harvest successfully.
                    </motion.p>
                    <motion.button 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="px-8 py-4 bg-green-500 hover:bg-green-400 text-green-950 font-black rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors"
                    >
                        Join AgroNet Now ⭢
                    </motion.button>
                </div>

                {/* Right side: Animated Links */}
                <div className="flex gap-16">
                    <motion.div 
                        variants={listVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h4 className="text-green-400 font-bold mb-6 tracking-widest uppercase text-sm">Platform</h4>
                        <ul className="space-y-4">
                            {['Features', 'Marketplace', 'Analytics', 'Pricing'].map((item) => (
                                <motion.li key={item} variants={itemVariants}>
                                    <a href="#" className="text-green-100/80 hover:text-white transition-colors relative group">
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div 
                        variants={listVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h4 className="text-green-400 font-bold mb-6 tracking-widest uppercase text-sm">Company</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Contact', 'Privacy'].map((item) => (
                                <motion.li key={item} variants={itemVariants}>
                                    <a href="#" className="text-green-100/80 hover:text-white transition-colors relative group">
                                        {item}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full"></span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Huge TextPressure Header at bottom */}
            <div className="w-full h-[30vh] md:h-[40vh] relative z-10 px-4 mb-8">
                <TextPressure
                    text="AGRONET"
                    flex
                    alpha={false}
                    stroke={false}
                    width
                    weight
                    italic
                    textColor="rgba(134, 239, 172, 0.9)" /* text-green-300 with opacity */
                    strokeColor="transparent"
                    minFontSize={50}
                />
            </div>

            {/* Copyright bar */}
            <div className="w-full border-t border-green-800/50 pt-8 flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 text-sm text-green-500 relative z-10">
                <p>&copy; {new Date().getFullYear()} AgroNet Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-green-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-green-300 transition-colors">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};
