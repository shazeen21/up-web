"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#ebe5da]">
            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative h-16 w-32 sm:h-24 sm:w-48"
                    >
                        <Image
                            src="/logos/uphaar.png"
                            alt="Uphaar Loading"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>

                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1, // Offset the animation
                        }}
                        className="relative h-16 w-32 sm:h-24 sm:w-48"
                    >
                        <Image
                            src="/logos/kyddoz.png"
                            alt="Kyddoz Loading"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </div>

                {/* Animated dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="h-3 w-3 rounded-full bg-[#670E10]"
                            animate={{
                                y: ["0%", "-50%", "0%"],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
