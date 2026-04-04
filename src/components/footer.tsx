import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-cream mt-auto relative">
      {/* Decorative Grass Border */}
      <div
        className="absolute top-0 left-0 w-full h-4 -mt-4 bg-repeat-x"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 100%, #2d5016 4px, transparent 5px)',
          backgroundSize: '16px 16px',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="font-pixel text-sm mb-4 text-gold text-shadow-pixel">
              🌿 GanapPH
            </h2>
            <p className="text-sm text-parchment mb-4 leading-relaxed">
              Discover magical experiences in your local community. Find
              festivals, markets, and gatherings near you.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-pixel text-xs mb-4 text-gold">
              Town Notice Board
            </h3>
            <p className="text-sm text-parchment mb-2">
              Want to post an event on the town notice board?
            </p>
            <button className="bg-green hover:bg-dark-green text-cream px-4 py-2 font-pixel text-[10px] pixel-border-sm transition-colors mt-2">
              Submit Event
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-brown pt-6 text-center">
          <p className="font-pixel text-[8px] md:text-[10px] text-light-brown leading-loose">
            Developed by BS Computer Engineering Students{' '}
            <br className="md:hidden" />
            <span className="hidden md:inline"> | </span>
            Bulacan State University 2026
          </p>
        </div>
      </div>
    </footer>
  );
}