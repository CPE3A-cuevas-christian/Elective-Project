import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-cream mt-auto relative">
      {/* Decorative Grass Border */}
      <div
        className="absolute top-0 left-0 w-full h-4 -mt-4 bg-repeat-x"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 100%, #2d5016 4px, transparent 5px)",
          backgroundSize: "16px 16px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Brand */}
          <div className="max-w-3xl">
            <h2 className="font-pixel text-sm mb-4 text-gold text-shadow-pixel">
              🌿 GanapPH
            </h2>

            <p className="text-sm text-parchment mb-4 leading-relaxed text-justify">
              Discover exciting events, local festivals, community gatherings,
              and unforgettable experiences happening around you. GanapPH helps
              you explore what’s happening nearby and never miss the moments
              that matter.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-brown pt-6 text-center">
          <p className="font-pixel text-[8px] md:text-[10px] text-light-brown leading-loose">
            Developed by BS Computer Engineering Students{" "}
            <br className="md:hidden" />
            <span className="hidden md:inline"> | </span>
            Bulacan State University 2026
          </p>
        </div>
      </div>
    </footer>
  );
}