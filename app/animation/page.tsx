"use client";

import "./page.css";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Animation() {
    const [screen, setScreen] = useState<Element | null>(null);
    // Target the screen element
    useEffect(() => {
        const screenElement = document.querySelector(".screen");
        if (screenElement) {
            setScreen(screenElement);
            //
            //     .to(screen, { backgroundColor: "#111" });
            // tvAnimation
            //     .to(screen, {
            //         duration: 0.1,
            //         opacity: 0.2,
            //         repeat: 4,
            //         yoyo: true,
            //         ease: "power1.inOut",
            //     })
            //     .to(screen, {
            //         duration: 0.3,
            //         opacity: 1,
            //     });
        }
    }, []);

    // Timeline for the TV animation
    const tvAnimation = gsap.timeline({ repeat: 0, repeatDelay: 2 });

    const turnOn = () => {
        if (screen) {
            tvAnimation
                .to(screen, {
                    duration: 0.3,
                    scaleY: 0.05,
                    scaleX: 0.05,
                    opacity: 1,
                    ease: "power4.in",
                })
                .to(screen, {
                    duration: 0.4,
                    scaleY: 0.005,
                    scaleX: 1,
                    ease: "elastic.out(1, 0.5)",
                    backgroundColor: "#FFFFFF",
                })
                .to(screen, {
                    duration: 0.3,
                    scaleY: 1,
                    scaleX: 1,
                    ease: "power4.out",
                })
                .to(screen, {
                    opacity: 0.8,
                    duration: 0.02,
                    repeat: 11,
                    yoyo: true,
                })
                .to(screen, {
                    delay: 0.5,
                    opacity: 0.8,
                    duration: 0.02,
                    repeat: 5,
                    yoyo: true,
                })
                .to(screen, {
                    delay: 1,
                    opacity: 0.8,
                    duration: 0.02,
                    repeat: 7,
                    yoyo: true,
                });
        }
    };

    const turnOff = () => {
        if (screen) {
            tvAnimation
                .to(screen, {
                    duration: 0.4,
                    scaleY: 0.005,
                    scaleX: 1,
                    ease: "elastic.out(1, 0.3)",
                    backgroundColor: "#FFFFFF",
                })
                .to(screen, {
                    duration: 0.3,
                    scaleY: 0.05,
                    scaleX: 0.05,
                    opacity: 1,
                    ease: "power4.in",
                })
                .to(screen, {
                    duration: 0.4,
                    scaleY: 0,
                    scaleX: 0,
                    ease: "elastic.out(1, 0.3)",
                    backgroundColor: "#FFFFFF",
                });
        }
    };

    // const flickerEffect = () => {
    //     if (screen) {
    //     }
    // };
    return (
        <div className="mt-[25%] ml-[25%]">
            <div className="tv">
                <div className="screen"></div>
            </div>
            <Button onClick={() => turnOn()}>Turn on</Button>
            <Button onClick={() => turnOff()}>Turn off</Button>
        </div>
    );
}
