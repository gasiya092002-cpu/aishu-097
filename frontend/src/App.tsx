import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { ImageToImagePage } from './pages/ImageToImagePage';
import { PosterStudioPage } from './pages/PosterStudioPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';
import { GeneratedImage } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');
  const [prefilledStyle, setPrefilledStyle] = useState<string>('Photorealistic');
  const [referenceImageForImg2Img, setReferenceImageForImg2Img] = useState<GeneratedImage | null>(null);

  const handleQuickGenerateFromHome = (prompt: string, style: string) => {
    setPrefilledPrompt(prompt);
    setPrefilledStyle(style);
    setActiveTab('generator');
  };

  const handleUseAsReference = (image: GeneratedImage) => {
    setReferenceImageForImg2Img(image);
    setActiveTab('img2img');
  };

  const handleRegenerateFromGallery = (prompt: string, style: string) => {
    setPrefilledPrompt(prompt);
    setPrefilledStyle(style);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 flex flex-col font-sans selection:bg-electric selection:text-white">
      
      {/* Primary Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onQuickGenerate={handleQuickGenerateFromHome}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorPage
            initialPrompt={prefilledPrompt}
            initialStyle={prefilledStyle}
            onNavigateTab={setActiveTab}
            onSelectReferenceImage={handleUseAsReference}
          />
        )}

        {activeTab === 'img2img' && (
          <ImageToImagePage
            initialReferenceImage={referenceImageForImg2Img}
          />
        )}

        {activeTab === 'poster' && (
          <PosterStudioPage />
        )}

        {activeTab === 'gallery' && (
          <GalleryPage
            onRegeneratePrompt={handleRegenerateFromGallery}
            onUseAsReference={handleUseAsReference}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </main>

      {/* Studio Footer */}
      <Footer />

    </div>
  );
};

export default App;
