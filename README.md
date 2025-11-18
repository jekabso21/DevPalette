# DevPalette 🎨

**DevPalette** is a comprehensive color palette generator built for developers and designers. Generate professional, harmonious color schemes from a single primary color and export them in multiple formats ready for your projects.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://dev-palette-5ffi.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

## ✨ Features

### 🎨 **Color Generation**
- **Smart Shade System** - Automatically generates 10 shades (50-900) from any primary color
- **Multiple Harmony Types** - Monochromatic, Analogous, Complementary, Triadic, Split-Complementary, and Tetradic schemes
- **Harmony Scoring** - AI-powered scoring system rates color combinations (0-100)
- **Gradient Generator** - Create beautiful linear, radial, and conic gradients with presets

### ♿ **Accessibility Tools**
- **WCAG Contrast Matrix** - Real-time contrast ratio checking (AAA/AA/Fail indicators)
- **Color Blindness Simulator** - Preview palettes with 8 types of color vision deficiencies
  - Protanopia, Deuteranopia, Tritanopia
  - Protanomaly, Deuteranomaly, Tritanomaly
  - Achromatopsia, Achromatomaly
- **Accessibility Recommendations** - Get suggestions for improving color accessibility

### 📦 **Export Formats**
Export your palettes in developer-ready formats:
- **Tailwind CSS** - `tailwind.config.js` with theme extension
- **CSS Variables** - `:root` with custom properties
- **SCSS/SASS** - Variable definitions
- **JavaScript/TypeScript** - ES6 module exports
- **Figma** - JSON format for Figma plugins

### 🎯 **Smart Features**
- **Semantic Naming** - Auto-suggests color names based on hue (brand, primary, accent, etc.)
- **Component Previews** - See colors in real UI components (buttons, alerts, cards)
- **Click-to-Copy** - One-click copying of any color value
- **Real-time Preview** - See changes instantly as you adjust colors

## 🚀 Live Demo

Try it now: **[dev-palette-5ffi.vercel.app](https://dev-palette-5ffi.vercel.app)**

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Chakra UI** - Accessible component library
- **Zustand** - Lightweight state management
- **chroma.js** - Professional color manipulation
- **Tailwind CSS** - Utility-first styling

## 📥 Installation

```bash
# Clone the repository
git clone https://github.com/jekabso21/DevPalette.git

# Navigate to project directory
cd DevPalette

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📜 Available Scripts

```bash
npm run dev       # Start development server (Vite)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎯 Usage

1. **Choose a primary color** - Use the color picker or enter a hex value
2. **Explore generated palettes** - View shades and different harmony types
3. **Check accessibility** - Use the contrast matrix and color blindness simulator
4. **Customize naming** - Choose semantic names for your colors
5. **Export** - Download in your preferred format

## 🏗️ Project Structure

```
DevPalette/
├── src/
│   ├── components/
│   │   ├── Accessibility/       # Contrast & color blindness tools
│   │   ├── ColorSchemes/        # Palette display components
│   │   ├── Export/              # Export functionality
│   │   ├── Gradients/           # Gradient generator
│   │   ├── Preview/             # Component previews
│   │   └── UI/                  # Reusable UI components
│   ├── utils/
│   │   ├── colorGenerator.js    # Color scheme algorithms
│   │   ├── shadeGenerator.js    # Shade generation logic
│   │   ├── exportFormatters.js  # Export format handlers
│   │   ├── accessibilityHelpers.ts
│   │   ├── colorBlindnessSimulator.ts
│   │   └── gradientGenerator.ts
│   ├── store/
│   │   └── colorStore.js        # Zustand state management
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets
└── dist/                        # Production build
```

## 🎨 Color Generation Algorithm

**Shade Generation (50-900):**
- Uses HSL color space for perceptually uniform results
- 500 = primary color (unchanged)
- 50-400: Progressive lightening by mixing with white
- 600-900: Progressive darkening by reducing lightness

**Harmony Scoring:**
```
Score = (colorWheelHarmony × 0.4) +
        (saturationBalance × 0.3) +
        (brightnessDistribution × 0.2) +
        (overallContrast × 0.1)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details. You are free to use, modify, and distribute this software for any purpose, including commercial use.

## 👤 Author

**jekabso21**
- GitHub: [@jekabso21](https://github.com/jekabso21)

## 🙏 Acknowledgments

- Color theory algorithms based on industry-standard practices
- Color blindness simulation matrices from Brettel, Viénot & Mollon research
- WCAG accessibility guidelines from W3C

## 📊 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

**Made with ❤️ for developers who care about color**

[View Demo](https://dev-palette-5ffi.vercel.app) • [Report Bug](https://github.com/jekabso21/DevPalette/issues) • [Request Feature](https://github.com/jekabso21/DevPalette/issues)
