import Navigation from "@/components/Navigation";
import { BACKGROUND_IMAGES, getBackgroundStyle } from "@/constants/images";

interface HeaderProps {
  backgroundImage?: string;
}

const Header = ({ backgroundImage }: HeaderProps) => {
  const bgImage = backgroundImage || BACKGROUND_IMAGES.PRIMARY;
  
  return (
    <header 
      className="shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gold-400/30" 
      style={getBackgroundStyle(bgImage)}
    >
      <div className="container mx-auto px-4 relative">
        {/* Logo Section */}
        <div className="text-center py-1.5 border-b border-gold-400/20 relative">
          {/* Natalia Logo in top left */}
          <img 
            src="/img/d400ba6e-3090-41d0-afab-e8e8c2a5655b.jpg" 
            alt="Natalia" 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-10 sm:w-12 md:w-16 h-6 sm:h-8 md:h-10 opacity-95 hover:opacity-100 transition-opacity mix-blend-screen rounded-0 object-fill"
            style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
          />
          {/* Natalia Logo in top right */}
          <img 
            src={BACKGROUND_IMAGES.LOGO} 
            alt="Natalia" 
            className="absolute top-1/2 right-0 -translate-y-1/2 w-10 sm:w-12 md:w-16 h-6 sm:h-8 md:h-10 opacity-95 hover:opacity-100 transition-opacity mix-blend-screen object-fill"
            style={{filter: 'invert(1) brightness(1.5) sepia(1) saturate(4) hue-rotate(15deg) contrast(1.3)'}}
          />
          <h1 className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-gold-400">
            Гармония энергий
          </h1>
        </div>
        {/* Navigation */}
        <Navigation variant="main" />
      </div>
    </header>
  );
};

export default Header;