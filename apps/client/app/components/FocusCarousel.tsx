"use client"; // server cannot useEffect to center the focused card
import React from "react";
import { useEffect, useRef, useState } from "react";
import badgeList from "@/app/components/badgeList";
import BadgeList from "@/app/components/badgeList";

interface ProjectItem {
    id: number,
    title: string,
    desc: string,
    img: string, // url
    skills?: string[], // list of skills to be turned into badges
}

// dummy data
const projects = [
    {
        id: 1,
        title: "SportsVision",
        desc: "A computer vision pipeline for sports analytics",
        img: "jump.png",
        skills: ["Python", "OpenCV", "YOLOv8", "keypoint detection"]
    },
    {
        id: 2,
        title: "LLamaIndex RAG assisted LLM",
        desc: "Improving local vLLM with PG vector DB",
        img: "libre.png",
        skills: ["PGVector", "vLLM", "LangChain", "RAG"]
    },
    {
        id: 3,
        title: "PowerTower",
        desc: "A tower defense game built with Unity",
        img: "game.png",
        skills: ["C#", "Unity", "Game Development"]
    },
    {
        id: 4,
        title: "club website",
        desc: "A website developed for my Japanese club, with full CI/CD on GitLab and AWS",
        img: "jss.png",
        skills: ["React", "JavaScript", "AWS", "CI/CD", "Postgres", "fullstack"]
    },
    {
        id: 5,
        title: "PeerPrep",
        desc: "A RabbitMQ event driven app for showcasing Matchmaking systems",
        img: "peerprep.png",
        skills: ["MERN", "RabbitMQ", "Docker", "Microservices"]
    }
];

// TODO: fetch projects from server instead of using dummy data
export default function FocusCarousel({projectsList}: {projectsList?: ProjectItem[]}) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    // Detect which card is closest to center on scroll
    const handleScroll = () => {
        const viewportCenter = window.innerWidth / 2;

        const distances = itemRefs.current.map((elem) => {
            if (!elem) return Infinity;
            const rect = elem.getBoundingClientRect();
            const elemCenter = rect.left + rect.width / 2;
            return Math.abs(elemCenter - viewportCenter);
        });

        const closest = distances.indexOf(Math.min(...distances));
        setFocusedIndex(closest);
    }

    const handleClick = (index: number) => {
        const cardElement = itemRefs.current[index];
        const container = scrollContainerRef.current;
        
        if (cardElement && container) {
            // Calculate the position to center the card
            const containerRect = container.getBoundingClientRect();
            const cardRect = cardElement.getBoundingClientRect();
            const containerCenter = containerRect.left + containerRect.width / 2;
            const cardCenter = cardRect.left + cardRect.width / 2;
            const scrollOffset = cardCenter - containerCenter// overshoot compensation is around 8vw
            
            // Smooth scroll to center the card
            container.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            });
            
            // Update focused index immediately for better UX
            setFocusedIndex(index);
        }
    }

    // use on scroll on this container
    useEffect(() => {
        // this container
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Initial call to set focused index
        handleScroll();

        return () => {
            container.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div ref={scrollContainerRef} className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
            <div className="flex gap-10 px-10 py-16 w-max items-center relative">
            {/*Invisible Spacer for front of carousel*/}
            <div className="flex-shrink-0 w-[5vw] md:w-[10vw]"/>

            {projects.map((item, index) => {
                const isFocused = index === focusedIndex;

                return (
                    <div
                        key={item.id}
                        data-index={index}
                        ref={(el) => {
                            itemRefs.current[index] = el
                        }}
                        onClick={() => handleClick(index)}
                        className={`
                            snap-center flex-shrink-0 w-[66vw]
                            transition-transform transition-opacity duration-500 ease-out
                            cursor-pointer relative
                            ${isFocused ? "scale-100 opacity-100 z-20" : "scale-90 opacity-40 z-10"}
                        `}
                    >

                        <div className="rounded-xl shadow-xl overflow-hidden bg-base-200 flex justify-center items-center">
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-auto h-[75vh] object-cover"
                            />
                        </div>

                        <div className="mt-4 text-center">
                            <h2 className="text-2xl font-bold">{item.title}</h2>
                            <p className="opacity-70">{item.desc}</p>

                            {/* Section for Badges*/}
                            <div className="my-5 md:my-7"/>
                            <BadgeList badgeList={{items: item.skills}} />
                        </div>
                    </div>
                );
            })}

            {/*Invisible Spacer for end of carousel*/}
                <div className="flex-shrink-0 w-[5vw] md:w-[10vw]"/>
            </div>


        </div>
    );
}
