import React, { useState } from 'react';
import { Shuffle, Loader, Sparkles, RefreshCw, Zap, Lightbulb } from 'lucide-react';

const WordFusionApp = () => {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ideas, setIdeas] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const wordBank = [
    // Technology
    'robot', 'digital', 'cyber', 'quantum', 'virtual', 'neural', 'smart', 'nano', 'bio', 'eco',
    // Nature
    'ocean', 'forest', 'mountain', 'solar', 'lunar', 'crystal', 'thunder', 'wind', 'fire', 'ice',
    // Actions
    'flying', 'dancing', 'spinning', 'glowing', 'flowing', 'racing', 'climbing', 'diving', 'jumping', 'singing',
    // Objects
    'mirror', 'door', 'bridge', 'tower', 'garden', 'library', 'kitchen', 'studio', 'workshop', 'laboratory',
    // Qualities
    'invisible', 'magical', 'ancient', 'modern', 'tiny', 'giant', 'silent', 'colorful', 'transparent', 'flexible',
    // Animals
    'dragon', 'phoenix', 'wolf', 'eagle', 'dolphin', 'butterfly', 'tiger', 'lion', 'bear', 'fox',
    // Time
    'midnight', 'dawn', 'sunset', 'eternal', 'instant', 'future', 'vintage', 'timeless', 'rapid', 'slow',
    // Materials
    'glass', 'metal', 'wood', 'stone', 'fabric', 'paper', 'plastic', 'ceramic', 'diamond', 'gold'
  ];

  const getRandomWord = () => {
    return wordBank[Math.floor(Math.random() * wordBank.length)];
  };

  const shuffleWord1 = () => {
    setWord1(getRandomWord());
  };

  const shuffleWord2 = () => {
    setWord2(getRandomWord());
  };

  const categories = [
    { id: 'business', name: 'Business', icon: '💼', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'writing', name: 'Creative Writing', icon: '✍️', gradient: 'from-purple-500 to-pink-500' },
    { id: 'products', name: 'Product Ideas', icon: '📦', gradient: 'from-orange-500 to-red-500' },
    { id: 'solutions', name: 'Problem Solving', icon: '🔧', gradient: 'from-green-500 to-emerald-500' },
    { id: 'art', name: 'Art & Design', icon: '🎨', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'stories', name: 'Story Concepts', icon: '✨', gradient: 'from-pink-500 to-rose-500' },
  ];

  const generateIdeas = async () => {
    if (!word1.trim() || !word2.trim() || !selectedCategory) {
      return;
    }

    setIsLoading(true);
    setIdeas('');

    try {
      const categoryContext = {
        business: 'business opportunities, startups, or entrepreneurial ventures',
        writing: 'creative writing prompts, story ideas, or narrative concepts',
        products: 'new product concepts, improvements, or market opportunities',
        art: 'artistic projects, design concepts, or creative visual ideas',
        solutions: 'practical solutions to everyday problems or challenges',
        stories: 'engaging story concepts, plot ideas, or narrative themes',
      };

      // Using Hugging Face's free API (Mixtral model)
      const prompt = `Generate 5-7 creative and practical ideas that combine the words "${word1}" and "${word2}" for ${categoryContext[selectedCategory]}. 

Make the ideas:
- Innovative and unique
- Practical and achievable
- Each idea should have a clear title followed by a detailed explanation
- Varied in scope and approach

Format your response as a numbered list where each entry follows this exact format:
"1. [Idea Title] - [Detailed explanation of the idea in 1-2 sentences]"

Example format:
"1. Smart Garden Monitor - A device that combines sensors and AI to automatically track soil moisture, light levels, and plant health, sending notifications to your phone when your plants need attention."

Make sure every idea has both a title AND a description separated by " - "`;

      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Note: Users will need to get their own free API key from Hugging Face
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const generatedText = data[0]?.generated_text || data.generated_text || '';
      
      if (generatedText) {
        setIdeas(generatedText);
      } else {
        // Fallback to local generation if API fails
        generateLocalIdeas();
      }
    } catch (error) {
      console.log('API failed, using local generation:', error);
      generateLocalIdeas();
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalIdeas = () => {
    const ideaTemplates = {
      business: [
        `${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Solutions - A consulting firm that specializes in combining ${word1} expertise with ${word2} innovation to help businesses solve complex challenges.`,
        `${word2.charAt(0).toUpperCase() + word2.slice(1)}-Powered ${word1.charAt(0).toUpperCase() + word1.slice(1)} Platform - An online marketplace that connects ${word1} enthusiasts with ${word2}-enhanced services and products.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} & ${word2.charAt(0).toUpperCase() + word2.slice(1)} Academy - An educational institution offering courses that blend traditional ${word1} knowledge with modern ${word2} techniques.`,
        `Smart${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} App - A mobile application that uses ${word2} technology to optimize ${word1}-related activities for maximum efficiency.`,
        `${word1.charAt(0).toUpperCase() + word1.slice(1)}Fusion ${word2.charAt(0).toUpperCase() + word2.slice(1)} Service - A subscription service that delivers personalized ${word1} experiences enhanced by cutting-edge ${word2} innovations.`
      ],
      writing: [
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Chronicles - A fantasy series where ancient ${word1} magic collides with futuristic ${word2} technology in an epic battle for the fate of two worlds.`,
        `${word2.charAt(0).toUpperCase() + word2.slice(1)} in the ${word1.charAt(0).toUpperCase() + word1.slice(1)} - A mystery novel about a detective who uses ${word2} to solve crimes in a world where ${word1} holds the key to every mystery.`,
        `The Last ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} - A post-apocalyptic story where the protagonist must master both ${word1} and ${word2} to survive in a changed world.`,
        `${word1.charAt(0).toUpperCase() + word1.slice(1)} Meets ${word2.charAt(0).toUpperCase() + word2.slice(1)} - A romantic comedy about two unlikely characters who discover their shared passion for combining ${word1} with ${word2}.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Diaries - A coming-of-age story following a young person's journey to master the art of blending ${word1} traditions with ${word2} innovation.`
      ],
      products: [
        `${word1.charAt(0).toUpperCase() + word1.slice(1)}${word2.charAt(0).toUpperCase() + word2.slice(1)} Pro - An innovative device that combines the functionality of ${word1} with the convenience of ${word2} for everyday use.`,
        `Smart ${word1.charAt(0).toUpperCase() + word1.slice(1)} with ${word2.charAt(0).toUpperCase() + word2.slice(1)} Integration - A next-generation product that revolutionizes how people interact with ${word1} through ${word2} technology.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Kit - A comprehensive starter package that teaches users how to effectively combine ${word1} and ${word2} in their daily routine.`,
        `Eco-${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} System - A sustainable solution that uses ${word2} principles to enhance traditional ${word1} applications while reducing environmental impact.`,
        `Portable ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Station - A compact, user-friendly device that brings the benefits of ${word1} and ${word2} integration directly to consumers.`
      ],
      art: [
        `${word1.charAt(0).toUpperCase() + word1.slice(1)} Meets ${word2.charAt(0).toUpperCase() + word2.slice(1)} Installation - An interactive art piece that invites viewers to explore the relationship between ${word1} and ${word2} through immersive experience.`,
        `Digital ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Gallery - A virtual exhibition space showcasing how contemporary artists interpret the fusion of ${word1} and ${word2} in modern society.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Project - A collaborative art initiative where multiple artists create works inspired by the intersection of ${word1} and ${word2}.`,
        `${word2.charAt(0).toUpperCase() + word2.slice(1)}-Inspired ${word1.charAt(0).toUpperCase() + word1.slice(1)} Sculptures - A series of physical artworks that use ${word2} aesthetics to reimagine traditional ${word1} forms.`,
        `Interactive ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Workshop - A hands-on art experience where participants create their own pieces combining elements of ${word1} and ${word2}.`
      ],
      solutions: [
        `${word1.charAt(0).toUpperCase() + word1.slice(1)}-Enhanced ${word2.charAt(0).toUpperCase() + word2.slice(1)} System - A practical solution that uses ${word1} principles to improve the efficiency and effectiveness of ${word2} applications.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Method - A step-by-step approach that helps people solve common problems by combining the strengths of ${word1} and ${word2}.`,
        `Smart ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Assistant - An AI-powered tool that provides personalized recommendations for optimizing ${word1} activities using ${word2} insights.`,
        `${word1.charAt(0).toUpperCase() + word1.slice(1)} Recovery through ${word2.charAt(0).toUpperCase() + word2.slice(1)} - A therapeutic approach that addresses ${word1}-related challenges by incorporating ${word2} techniques and strategies.`,
        `Community ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Network - A platform that connects people facing similar challenges to share ${word1} experiences and ${word2} solutions.`
      ],
      stories: [
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Academy - A story about students learning to master the ancient art of combining ${word1} with ${word2} in a magical school setting.`,
        `When ${word1.charAt(0).toUpperCase() + word1.slice(1)} Meets ${word2.charAt(0).toUpperCase() + word2.slice(1)} - An adventure tale following characters who discover that ${word1} and ${word2} are two halves of a powerful ancient secret.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Guardian - A heroic story about a protector who uses both ${word1} wisdom and ${word2} power to defend their world.`,
        `Lost in ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} - A journey story where the protagonist must navigate a realm where ${word1} and ${word2} create unexpected challenges and opportunities.`,
        `The ${word1.charAt(0).toUpperCase() + word1.slice(1)} ${word2.charAt(0).toUpperCase() + word2.slice(1)} Legacy - A multi-generational saga exploring how the combination of ${word1} and ${word2} shapes families and communities over time.`
      ]
    };

    const templates = ideaTemplates[selectedCategory] || ideaTemplates.business;
    const shuffledTemplates = templates.sort(() => Math.random() - 0.5);
    const selectedIdeas = shuffledTemplates.slice(0, 5);
    
    const formattedIdeas = selectedIdeas
      .map((idea, index) => `${index + 1}. ${idea}`)
      .join('\n');
    
    setIdeas(formattedIdeas);
  };

  const resetApp = () => {
    setWord1('');
    setWord2('');
    setSelectedCategory('');
    setIdeas('');
  };

  const shuffleBothWords = () => {
    setWord1(getRandomWord());
    setWord2(getRandomWord());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f8fafc" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">IdeaSpark</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Free AI Powered</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Transform Two Words into Endless Possibilities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Where Creativity Meets
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Innovation</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Combine any two concepts and watch AI generate brilliant ideas across business, writing, products, and more.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/20 p-6 sm:p-8 lg:p-10">
            
            {/* Word Input Section */}
            <div className="mb-8 sm:mb-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* Word 1 */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    First Concept
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition-colors duration-200">
                      <input
                        type="text"
                        value={word1}
                        onChange={(e) => setWord1(e.target.value)}
                        placeholder="ocean"
                        className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 pr-12"
                      />
                      <button
                        onClick={shuffleWord1}
                        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 transition-all duration-200 hover:scale-110 hover:bg-blue-50 rounded-lg"
                        title="Generate random word"
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Word 2 */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Second Concept
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 hover:border-purple-300 transition-colors duration-200">
                      <input
                        type="text"
                        value={word2}
                        onChange={(e) => setWord2(e.target.value)}
                        placeholder="robot"
                        className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 pr-12"
                      />
                      <button
                        onClick={shuffleWord2}
                        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 text-slate-400 hover:text-purple-500 transition-all duration-200 hover:scale-110 hover:bg-purple-50 rounded-lg"
                        title="Generate random word"
                      >
                        <Shuffle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <button
                  onClick={shuffleBothWords}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Shuffle Both</span>
                </button>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Or enter your own words
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 text-center">
                Choose Your Creative Direction
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r ' + category.gradient + ' text-white shadow-lg shadow-black/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{category.icon}</div>
                      <div className="font-bold text-sm sm:text-base leading-tight">{category.name}</div>
                    </div>
                    {selectedCategory === category.id && (
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-white/30"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mb-8">
              <button
                onClick={generateIdeas}
                disabled={isLoading || !word1.trim() || !word2.trim() || !selectedCategory}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-4 sm:py-6 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span>Generating Ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Generate Ideas</span>
                  </>
                )}
              </button>
            </div>

            {/* Ideas Display */}
            {ideas && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Your Creative Ideas
                  </h3>
                  <button
                    onClick={resetApp}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium w-fit"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Start Over</span>
                  </button>
                </div>
                
                <div className="grid gap-4 sm:gap-6">
                  {ideas.split('\n').filter(line => line.trim() && /^\d+\./.test(line.trim())).map((idea, index) => {
                    // Clean the idea text by removing the number prefix
                    const cleanIdea = idea.replace(/^\d+\.\s*/, '').trim();
                    
                    // Try to split on " - " first, then try other common separators
                    let title, description;
                    
                    if (cleanIdea.includes(' - ')) {
                      [title, ...description] = cleanIdea.split(' - ');
                      description = description.join(' - ');
                    } else if (cleanIdea.includes(': ')) {
                      [title, ...description] = cleanIdea.split(': ');
                      description = description.join(': ');
                    } else {
                      // If no clear separator, use the whole thing as title
                      // but try to split on first sentence if it's very long
                      if (cleanIdea.length > 100) {
                        const sentences = cleanIdea.split(/\.\s+(?=[A-Z])/);
                        title = sentences[0];
                        description = sentences.slice(1).join('. ');
                        if (description) description += '.';
                      } else {
                        title = cleanIdea;
                        description = '';
                      }
                    }
                    
                    return (
                      <div key={index} className="group relative bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.01]">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-base">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 leading-tight">
                              {title.replace(/^["']|["']$/g, '')}
                            </h4>
                            {description && (
                              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Hover Effect Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordFusionApp;