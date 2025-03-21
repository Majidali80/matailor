import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full mx-auto relative overflow-hidden h-screen md:h-[80vh] min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero.png" // Background image with the girl on the right
          alt="MA Tailor Hero - Pakistani Women's Fashion"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="brightness-55"
          priority // Prioritize loading for above-the-fold content
          sizes="100vw"
        />
      </div>

      {/* Overlay for Text Readability */}
      <div className="absolute inset-0 bg-navyBlue/40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16 lg:px-24 lg:py-20 gap-6 sm:gap-8 md:gap-12 h-full">
        {/* Left Section: Text and Call-to-Action */}
        <div className="flex-1 space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-Montserrat font-extrabold leading-tight tracking-tight text-darkYellow drop-shadow-lg">
            MA TAILOR
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-Montserrat font-light text-softWhite max-w-[90%] sm:max-w-[80%] md:max-w-[450px] drop-shadow-md mx-auto md:mx-0">
            Discover MA Tailor’s exquisite collection of ready-to-wear, unstitched, and custom-stitched suits for women and girls – crafted with love and tradition.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-darkOrange hover:bg-orange-600 text-softWhite font-Montserrat font-semibold text-sm sm:text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Explore Now
          </Link>
        </div>

        {/* Right Section: Empty (Girl is in the Background Image) */}
        <div className="flex-1" />
      </div>
    </section>
  );
}