declare module 'react-slick' {
    import * as React from 'react';
  
    export interface Settings {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      autoplay?: boolean;
      autoplaySpeed?: number;
      pauseOnHover?: boolean;
      fade?: boolean;
      arrows?: boolean;
      [key: string]: any; // Para permitir propiedades adicionales
    }
  
    const Slider: React.ComponentType<Settings>;
    export default Slider;
  }
  