import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full mx-auto relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/hero2.jpg" // Background image
          alt="MA Foods Kitchen Background"
          fill
          style={{ objectFit: "cover" }}
          className="brightness-75"
          priority // Prioritize loading for above-the-fold content
        />
      </div>

      {/* Overlay for Text Readability */}
      <div className="absolute inset-0 bg-navy-900/40" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-24 xl:py-16 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        {/* Left Section: Text and Call-to-Action */}
        <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-Montserrat font-black leading-tight tracking-tight text-amber-400 drop-shadow-lg">
            Savor the Moment
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-Montserrat font-light text-white max-w-[90%] sm:max-w-[80%] md:max-w-[400px] lg:max-w-[450px] drop-shadow-md">
            Discover MA Foods’ frozen meals – quick, delicious, and ready when you are. Perfectly crafted for your busy life.
          </p>
          <Link
            href="/shop"
            className="inline-block px-5 py-2 sm:px-6 sm:py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-4 bg-myDgold hover:bg-myLgold text-navy-900 font-Montserrat font-semibold text-xs sm:text-sm md:text-base lg:text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Section: Multiple Images */}
        <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 animate-slideIn">
          {/* Image 1 */}
          <div className="relative w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[220px] xl:h-[300px]">
            <Image
              src="/hero.jpg"
              alt="MA Foods Hero Dish 1"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-2xl brightness-90"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" // Optimize image sizes for different breakpoints
            />
          </div>

          {/* Image 2 */}
          <div className="relative w-full h-[120px] sm:h-[150px] md:h-[180px] lg:h-[220px] xl:h-[300px]">
            <Image
              src="/hero3.jpg"
              alt="MA Foods Hero Dish 2"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-2xl brightness-90"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          {/* Image 3 */}
          <div className="relative w-full h-[150px] sm:h-[180px] md:h-[220px] lg:h-[260px] xl:h-[300px] col-span-2">
            <Image
              src="/hero4.jpg"
              alt="MA Foods Hero Dish 3"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-2xl brightness-90"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1024px) 50vw, 40vw"
            />
            {/* Decorative Overlay */}
            <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 w-16 sm:w-20 h-16 sm:h-20 bg-amber-400 rounded-full opacity-20 blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}