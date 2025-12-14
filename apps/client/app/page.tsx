import Image from "next/image";
import Link from "next/link";
import TitleCarousel from "@/app/components/FocusCarousel";
import AnimateOnScroll from "@/app/components/AnimateOnScroll";

export default function Home() {
    return (
        <main>
            {/* Hero Intro */}
            <div
              className="relative h-[90vh] flex items-center justify-center
              bg-cover bg-center"
              style={{ backgroundImage: "url(/rails2.jpg)" }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white">
                    <AnimateOnScroll direction="up" threshold={0.2}>
                        <h1 className="text-3xl md:text-6xl py-7 font-medium px-20 text-center">
                          Hello, I am Yuhao
                        </h1>
                    </AnimateOnScroll>
                    <AnimateOnScroll direction="up" threshold={0.2} delay={100}>
                        <p className="text-l md:text-xl mb-2">
                            Based in Singapore 🇸🇬
                        </p>
                    </AnimateOnScroll>
                    <AnimateOnScroll direction="up" threshold={0.2} delay={200}>
                        <p className="text-l md:text-2xl opacity-90 max-w-2/3 mx-auto">
                          I am a software developer looking to build and test Web Applications, AI/ML pipelines
                        </p>
                    </AnimateOnScroll>
                    <div className="flex flex-col md:flex-row justify-around items-center m-8">
                        <a href="/jss.png" download className="btn btn-lg m-2 md:m-5">
                            Resume
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                />
                            </svg>
                        </a>
                        <a href="https://www.github.com/ringoftheking">
                            <button className="btn bg-base-200 btn-lg m-2 md:m-5 text-s md:text-xl">
                            Github
                            </button>
                        </a>
                        <Link href="/contact">
                            <button className="btn bg-base-200 btn-lg m-2 md:m-5 text-s text-xl">
                            Contact
                            </button>
                        </Link>
                    </div>
                    <AnimateOnScroll direction="up" threshold={0.2} delay={400}>
                        <p className="text-l md:text-2xl mb-2"> Available for work from: June 2026</p>
                    </AnimateOnScroll>

                </div>
            </div>

            {/* Self Intro Segment */}
            <div className="relative m-10 flex flex-col md:flex-row gap-10">
              <AnimateOnScroll direction="left" className="w-full md:basis-1/2 flex justify-center md:justify-start">
                  <div className="relative h-48 w-48 md:h-full md:w-full">
                      <Image
                          src="/Selfie.jpg"
                          alt="Selfie"
                          fill
                          className="rounded-xl shadow-lg object-cover"
                      />
                  </div>
              </AnimateOnScroll>

              <AnimateOnScroll direction="right" className="w-full md:basis-1/2 text-center md:text-left">
                  <h1 className="text-3xl md:text-2xl py-7 px-10 opacity-90">
                      About Me:
                  </h1>
                  <p className="px-10 text-2xl opacity-90 md:text-xl">
                      Hi, I'm a current undergraduate student at the National University of Singapore,
                      pursuing a degree in <b>Computer Science</b>.
                      <br/><br/>
                      My Specialisations include
                      <b> Artificial Intelligence</b> and <b>Software Engineering</b>.
                      <br/><br/>
                      I have experience in
                      <b> App Development</b> and <b>Machine Learning</b> projects.
                  </p>
              </AnimateOnScroll>
            </div>

            <div className="flex justify-center my-3 md:my-8">
                <hr className="w-[90vw] border-t border-base-content/40" />
            </div>

        {/* Title Carousel Segment */}
            <AnimateOnScroll direction="down">
                <h1 className="text-6xl text-center">Projects</h1>
            </AnimateOnScroll>
            <div className="w-full flex justify-center">
              <TitleCarousel/>
            </div>
        </main>
    );
}
