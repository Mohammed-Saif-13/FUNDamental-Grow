"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFlip, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-flip";
import Link from "next/link";

export default function Home() {
  const slides = [
    {
      id: 1,
      subheading: "We help communities",
      heading: "Together, we can make the world better",
      buttonText: "DONATE NOW",
      buttonHref: "/donate",
    },
    {
      id: 2,
      subheading: "We create solutions",
      heading: "Building a sustainable future for everyone",
      buttonText: "LEARN MORE",
      buttonHref: "/about",
    },
    {
      id: 3,
      subheading: "Join our mission",
      heading: "Empowering communities",
      buttonText: "GET INVOLVED",
      buttonHref: "/volunteer",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-[600px] lg:h-[650px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      >
        <Swiper
          modules={[Navigation, EffectFlip, Autoplay]}
          effect="flip"
          flipEffect={{
            slideShadows: true,
            limitRotation: true,
          }}
          navigation={{
            nextEl: ".swiper-next",
            prevEl: ".swiper-prev",
          }}
          loop={true}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="wrapper h-full flex flex-col justify-center items-start">
                <p className="text-[#343434] text-2xl md:text-3xl font-serif mb-5">
                  {slide.subheading}
                </p>
                <h1
                  className="text-white text-5xl md:text-6xl lg:text-7xl font-serif 
                 leading-tight max-w-[710px] mb-10"
                >
                  {slide.heading}
                </h1>
                <div>
                  <Link
                    href={slide.buttonHref}
                    className="group inline-flex items-center gap-3 bg-white text-[#343434] px-6 py-4 
        rounded-full border border-[#FF5528] font-bold text-sm tracking-wider
        hover:bg-[#343434] hover:text-white hover:border-[#343434] transition-all duration-200"
                  >
                    {slide.buttonText}
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-full 
        bg-[#FF5528] text-white group-hover:bg-white group-hover:text-[#FF5528] 
        transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
          <button
            className="swiper-prev w-12 h-12 bg-white rounded-full flex items-center justify-center 
                           shadow-lg hover:bg-[#FF5528] transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 fill-[#343434] group-hover:fill-white transition-all"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            className="swiper-next w-12 h-12 bg-white rounded-full flex items-center justify-center 
                           shadow-lg hover:bg-[#FF5528] transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 fill-[#343434] group-hover:fill-white transition-all"
              viewBox="0 0 24 24"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Other sections will go here */}
    </>
  );
}
