import { useState, useEffect, useCallback } from "react"

const banners = [
  {
    id: 1,
    image: "banner-1.webp",
    alt: "Electronics Sale",
    link: "#category-1",
  },
  {
    id: 2,
    image: "banner-2.webp",
    alt: "Fashion Sale",
    link: "#category-2",
  },
  {
    id: 3,
    image: "banner-3.webp",
    alt: "Home Appliances",
    link: "#category-3",
  },
  {
    id: 4,
    image: "banner-4.webp",
    alt: "Mega Deals",
    link: "#products",
  },
]

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prev) => (prev + 1) % banners.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }, [isTransitioning])

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 500)
    }
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    /* Standard Flipkart max-width for desktop is 1248px */
    <div className="w-full max-w-[1248px] mx-auto sm:px-2 md:mt-4">
      <div className="relative bg-white overflow-hidden shadow-sm group">
        
        {/* RESIZED HEIGHT: 
            Mobile: 150px
            Tablet: 220px 
            Desktop: 280px (Standard Flipkart Banner Height)
        */}
        <div className="relative h-[150px] sm:h-[220px] md:h-[280px]">
          {banners.map((banner, index) => (
            <a
              key={banner.id}
              href={banner.link}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'opacity-100 translate-x-0 z-10' 
                  : index < currentIndex
                  ? 'opacity-0 -translate-x-full z-0'
                  : 'opacity-0 translate-x-full z-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                /* Use object-fill on desktop to match their non-cropping banner style */
                className="w-full h-full object-cover md:object-fill"
              />
            </a>
          ))}
        </div>

        {/* Navigation Buttons - Thinner flaps to match Buykart style */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-12 sm:w-11 sm:h-20 bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all z-20 rounded-r-md group opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-12 sm:w-11 sm:h-20 bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all z-20 rounded-l-md group opacity-0 group-hover:opacity-100"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators - Slightly smaller for the shorter banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-5" : "bg-white/40 w-1.5 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerCarousel;