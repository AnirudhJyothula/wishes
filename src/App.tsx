import React, { useState, useEffect, useRef, memo } from 'react';
import { Heart, ChevronRight, Music, Camera, Mail, Gift, Clock, Sparkles, Calendar, PartyPopper } from 'lucide-react';
import { supabase } from './lib/supabase';
import { SurpriseScreen } from './components/SurpriseScreen';
import { SongsScreen } from './components/SongsScreen';

type Section = 'welcome' | 'home' | 'journey' | 'photos' | 'songs' | 'letter' | 'surprise' | 'birthday';

interface TimelinePoint {
  title: string;
  text: string;
  date: string;
}

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('welcome');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWelcomeContent, setShowWelcomeContent] = useState(false);
  const [letterText, setLetterText] = useState('');
  const [hoveredTimelineIndex, setHoveredTimelineIndex] = useState<number | null>(0);
  const [timeUntilBirthday, setTimeUntilBirthday] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'surprise'>('home');
  const [showFeelingsBox, setShowFeelingsBox] = useState(false);
  const [userFeelings, setUserFeelings] = useState('');
  const [isSubmittingFeelings, setIsSubmittingFeelings] = useState(false);
  const [feelingsSubmitted, setFeelingsSubmitted] = useState(false);
  const [currentFeelingId, setCurrentFeelingId] = useState<string | null>(null);

  const timelinePoints: TimelinePoint[] = [
    {
      title: "First Time I Saw You When my heart recognized you before I did.",
      text: "I didn't know your name. But my heart did. You smiled… and something changed in me forever. It wasn't love at first sight — it was truth at first glance. That was the moment my heart whispered,\"There she is.\".",
      date: "The Beginning"
    },
    {
      title: "School Memories - A silent story that only my heart remembers.",
      text: "You were the reason I never skipped a day. I'd wait for a glimpse… for a smile… for a moment. I lived whole stories inside my head with you —All while sitting in silence. Every laugh of yours lit up places inside me that no one else ever reached. And though we never spoke much, you were always the loudest part of my heart.",
      date: "Those Days"
    },
    {
      title: "Couldn't Say It - I tried… more times than you'll ever know.",
      text: "I stayed back after class, hoping you'd walk by alone. I waited near the notice board — not for a notice, but for a glance. I rehearsed it in my head every lunch break… \"Hey… I like you.\" But the words always froze in my throat. You'd walk past, smiling — and I'd smile back… pretending that was enough. I didn't lack feelings. I lacked courage. And so, I let the moment slip. Again. And again.",
      date: "Silent Moments"
    },
    {
      title: "You Got Married - Smiling with a heart breaking in silence.",
      text: "I smiled. I wished you happiness. But inside… something shattered. I mourned a future that never got written. Still, even through the pain… I never stopped loving you. Because my love was never about having you — it was about seeing you happy, even if it wasn't with me.",
      date: "The Hardest Day"
    },
    {
      title: "What I Wish I Said - In another lifetime, I won't wait.  ",
      text: "I should've told you. I should've screamed it when my heart first whispered it. \"It's always been you.\" But I didn't… and maybe that was my greatest mistake. If there\'s another life — I\'ll find you sooner. I\'ll hold your hand tighter. I\'ll love you out loud. And I\'ll build that world I dreamed of — with you beside me.",
      date: "Forever"
    }
  ];

  const fullLetterText = `💌 To the girl I always loved, but never had the courage to tell,

I don't know if you'll ever read this. I don't know if these words will ever reach you — but if they do, I hope they carry every beat of my heart, every unsaid feeling, every tear I never showed, and every smile that was silently for you.

You were my first crush.
My first love.
And still, the one I could never forget.

It all began back in 10th. I remember the exact moment — how you smiled, how you walked, how you existed with such grace, and how my heart just knew... she's the one. From that day on, you were the reason for my quiet smiles, the secret behind the sudden rush in my heartbeat whenever you passed by.

But I never told you.
Not because I didn't want to — but because I was scared.
Scared of losing even the little distance I had from you, scared you'd never look at me the same way again.

So I kept it all inside. Year after year.
Hoping for a perfect moment.
Waiting for that one chance where I could say — "It's always been you."

But life… had its own plans.

You got married. And I stood there, silently, with a breaking heart, still smiling, still wishing you all the happiness in the world. Because even in pain, my love for you was pure — it never wanted to take anything from you. It only ever wanted to see you happy.

I tried to move on. I really did.
But some people… they're not meant to be forgotten.
You were not just a girl I liked — you were the vision that gave me strength, the dream that made me want to become something more.
I believed — that with you beside me, I could've achieved every single thing I dreamt of. With your encouragement, your smile, your warmth… I would've built a world for us.

But maybe, I was late.
Maybe I waited too long.
And maybe in this life, my story with you was only meant to be one-sided.

Still, I want you to know — I loved you. Truly. Fully. Deeply.
And I always will.

If there's a next life…
I'll find you sooner.
I won't wait. I won't hesitate. I'll tell you everything the moment I see you.
I'll hold your hand and never let go.

And if God's listening, I only ask this:
Send her to me in my next life.
Let me love her loudly. Let me live a life with her — the life I could only imagine in this one.

Wherever you are, whoever you're with, I hope you're happy.
And if, just once, you ever wonder if someone loved you silently from afar — know that it was me.

Forever yours in a heart that never stopped loving,
– Anirudh`;

  const photos = [
    { id: 1, caption: "I smiled every time I saw this." },
    { id: 2, caption: "My favorite moment — even if you never knew." },
    { id: 3, caption: "You were always art to me." },
    { id: 4, caption: "This memory kept me warm on cold nights." }
  ];

  useEffect(() => {
    if (currentSection === 'welcome') {
      setTimeout(() => setShowWelcomeContent(true), 500);
    } else if (currentSection === 'journey') {
      setHoveredTimelineIndex(0);
    }
  }, [currentSection]);

  // Birthday countdown effect
  useEffect(() => {
    const calculateTimeUntilBirthday = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let birthday = new Date(currentYear, 6, 26); // July 26th (month is 0-indexed)
      
      // If birthday has passed this year, set it for next year
      if (now > birthday) {
        birthday = new Date(currentYear + 1, 6, 26);
      }
      
      const timeDiff = birthday.getTime() - now.getTime();
      
      // Check if it's birthday today
      const today = new Date();
      const isToday = today.getMonth() === 6 && today.getDate() === 26;
      setIsBirthdayToday(isToday);
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeUntilBirthday({ days, hours, minutes, seconds });
      } else {
        setTimeUntilBirthday({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeUntilBirthday();
    const interval = setInterval(calculateTimeUntilBirthday, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSection === 'letter') {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullLetterText.length) {
          setLetterText(fullLetterText.substring(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [currentSection]);

  const navigateToSection = (section: Section) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSection(section);
      setIsAnimating(false);
    }, 300);
  };

  const handleKeepForever = () => {
    setShowFeelingsBox(true);
  };

  const handleSubmitFeelings = async () => {
    if (userFeelings.trim()) {
      setIsSubmittingFeelings(true);
      
      try {
        if (currentFeelingId) {
          // Update existing feeling
          const { error } = await supabase
            .from('feelings')
            .update({ 
              user_feelings: userFeelings.trim(),
              updated_at: new Date().toISOString()
            })
            .eq('id', currentFeelingId);
          
          if (error) throw error;
        } else {
          // Create new feeling
          const { data, error } = await supabase
            .from('feelings')
            .insert([{ user_feelings: userFeelings.trim() }])
            .select()
            .single();
          
          if (error) throw error;
          if (data) setCurrentFeelingId(data.id);
        }
        
        setIsSubmittingFeelings(false);
        setFeelingsSubmitted(true);
      } catch (error) {
        console.error('Error saving feelings:', error);
        setIsSubmittingFeelings(false);
        // You could add error handling UI here
      }
    }
  };

  // Real-time save as user types
  
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse"></div>
      
      {/* Subtle geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white/20 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>
      
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${16 + Math.random() * 12}px`
            }}
          >
            ✨
          </div>
        ))}
      </div>
      
      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute text-white/20 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              fontSize: `${8 + Math.random() * 4}px`
            }}
          >
            💫
          </div>
        ))}
      </div>
      
      <div className={`text-center transition-all duration-1500 transform ${showWelcomeContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>
        {/* Main content container */}
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Heart icon with glow effect */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
            </div>
            <div className="relative">
              <Heart className="w-20 h-20 text-white mx-auto mb-6 drop-shadow-2xl animate-pulse" fill="currentColor" />
            </div>
          </div>
          
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-thin text-white mb-6 leading-tight tracking-wide">
              <span className="bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
                For You,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 bg-clip-text text-transparent">
                Always
              </span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-white/80 font-light italic leading-relaxed max-w-2xl mx-auto">
              "Some stories are never told…<br />
              but they live forever in silence."
            </p>
            <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
            <p className="text-lg text-white/60 mt-6 font-light">
              This is mine — for you.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <button
              onClick={() => navigateToSection('home')}
              className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              <span>Enter My Heart</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                fontSize: `${20 + Math.random() * 16}px`
              }}
            >
              💕
            </div>
          ))}
        </div>
        
        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-white/20 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${8 + Math.random() * 8}px`
              }}
            >
              ✨
            </div>
          ))}
        </div>
        
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col p-4 sm:p-6">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Header section */}
          <div className="text-center pt-8 pb-12">
            {/* Main romantic message */}
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-2xl blur-xl"></div>
                <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide mb-6" style={{ 
                  fontFamily: 'Kalam, cursive',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  <span className="block bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
                    My Heart's
                  </span>
                  <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 bg-clip-text text-transparent">
                    Silent Story
                  </span>
                </h1>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light italic leading-relaxed">
                  "Some love stories are written in silence..."
                </p>
                <p className="text-base sm:text-lg text-white/70 font-light">
                  This is mine — carried in my heart for years, finally finding its voice.
                </p>
              </div>
            </div>
          </div>
          
          {/* Cards section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <RomanticCard
                  image="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400"
                  icon="💕"
                  title="Our Journey"
                  subtitle="The story I lived in silence"
                  description="Every moment I treasured"
                  onClick={() => navigateToSection('journey')}
                  gradient="from-rose-500/20 to-pink-500/20"
                />
                
                <RomanticCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuDiSdGeobQVEjbqmWZx2ZjMUHZnak1ZKY0rSkV2yyw155rQghK0_s-Cd2FrJ1yfWYgB1-fsxgRfNK_IiQ3w--ayaJQu_TnZSMlPwRwHc8JhDHF5tmg7rKJMBq2CUQwa6ljEBR88lEwAbiM7lHCqOXDNErBWQL_I35JjEe_s9Pui3KJPDV0TxFkg1I4ifY5vA832RUSJbHqLsgt8sBKuHUxxRvcEG6TTRXtfAqq0x7r1LBUPdBTFFAhh7KEVrZeZ5ez83FSx35KTAyQ"
                  icon="📸"
                  title="Photo Memories"
                  subtitle="Moments that never faded"
                  description="Pictures worth a thousand dreams"
                  onClick={() => navigateToSection('photos')}
                  gradient="from-purple-500/20 to-indigo-500/20"
                />
                
                <RomanticCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuBwCtw-ghf8WEBY4m86k0WiPehV1areB-w5sNrYqJMPu5OhtDDgFpsOWRcFG5LL5kwZamIbLgP7lptT2ivQe8rgUt2jyHIL0PwzIHpBc3hhZcPSkLtVTUN7jXqa-9TrAAXn9yP7q_5dDXAdoUq9ro0nTn6J86KwwhG3xZdy5XWCRH9MtanBGZyBsVDyRZ3iNiJU22I3Mb4Km_cVuo1sWKw4qf0C7CUSMS5SMypLs27cCukiF0klKJY1NSgbZRyJ7HP1H-fNrfUAOEU"
                  icon="🎵"
                  title="Songs for You"
                  subtitle="Melodies of my heart"
                  description="The soundtrack to my feelings"
                  onClick={() => navigateToSection('songs')}
                  gradient="from-pink-500/20 to-rose-500/20"
                />
                
                <RomanticCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuALakmgiJDV8jtjnY3I6BGYrjg9o0d0xsOpXXMgSHvUS4pYallM4j92YAYmADKNey4qJ9lhaBq6nuyuyAyThoOpGPRhZQlqqKs44vFHIHdPj277f3tWO4wb3LbXEIlh50W_FBkRAhRZaWY2a2rS07rS7lQH4hojfBJaFulbgOYInc_lD7qq91COBksMucOkSt_uYTv32qpsbj0ezhRxYW6sHAUn_nDrVYY9gUcoanT3zLDrPNfNpOuHUKKqKKMajyZTOaaOGyU0Xp0"
                  icon="💌"
                  title="A Letter"
                  subtitle="Everything I never dared to say"
                  description="Words from the depths of my soul"
                  onClick={() => navigateToSection('letter')}
                  gradient="from-indigo-500/20 to-purple-500/20"
                />
                
                <RomanticCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuDPDQ1ZghZhXL215llQ5hhS4bOgzDbtToeC2qBwRne-btmlfyIsabkkO4jCjT58uArPkSMMmb0qcqDk1CgMdtWXSjl-KwXTXrAADvqatabJ2QhyB5QkFYXlN3jnfwCJ42wkkrewDaWvjWRH6lk22fkjSLEiRBFoTM72P4cG2JfQucCXFhemqweuHaxdPOoDTFbf6eN4IP5OeqWbhNiSAxK6F3kRWbzXyu4IdGd7chrbiUgeoWWAecufrfzQhJi41be3td0IJisRH5g"
                  icon="🎂"
                  title="Birthday Countdown"
                  subtitle="Her Day, Always"
                  description="Celebrating the day you graced this world"
                  onClick={() => navigateToSection('birthday')}
                  gradient="from-yellow-500/20 to-orange-500/20"
                />
                
                <RomanticCard
                  image="https://lh3.googleusercontent.com/aida-public/AB6AXuAxC2YT6I0e6hHVVhGBNw5xyy8-cnYy_Q4Q0h8Nb48wHHaQQFE_LIUmIPGQqwxlgzT_7Vxg1qS-HtsopVrRQ001QP20VAgGY0CDgQi9qBaRhROolEgi1-tz_v5oCBCp4CbI6TBksjUGDOayf7mIMPQV1POABck7GBOkRFaeG-5k7umOihYjtRqq2zJVXlv2MyQyjUUn4rLLuRPIMkZjWXW1ffOVfx7rVikcCquw_i5SoGPJIVB0cHNNL3oEZaF6GqO5xHARkp0edTw"
                  icon="🎁"
                  title="The Surprise"
                  subtitle="For the next life, maybe..."
                  description="A gift from my heart to yours"
                  onClick={() => navigateToSection('surprise')}
                  gradient="from-teal-500/20 to-cyan-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RomanticCard = ({ image, icon, title, subtitle, description, onClick, gradient }: {
    image: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    onClick: () => void;
    gradient: string;
  }) => (
    <div
      onClick={onClick}
      className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-500 active:scale-[0.98] relative"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-110`}></div>
      
      {/* Card content */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
        {/* Image section */}
        <div className="h-48 sm:h-56 relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Icon overlay */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-6">
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-pink-200 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-white/80 text-sm font-medium">
              {subtitle}
            </p>
            <p className="text-white/60 text-sm italic leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Hover indicator */}
          <div className="mt-4 flex items-center text-white/50 text-xs group-hover:text-pink-200 transition-colors duration-300">
            <span>Tap to explore</span>
            <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const JourneyScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <button
          onClick={() => navigateToSection('home')}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Home
        </button>
        
        <div className="space-y-8 sm:space-y-12">
          {timelinePoints.map((point, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 sm:gap-8 transition-all duration-500 cursor-pointer ${
                hoveredTimelineIndex === index 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-20 scale-95'
              }`}
              onMouseEnter={() => setHoveredTimelineIndex(index)}
              onMouseLeave={() => setHoveredTimelineIndex(0)}
            >
              <div className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4 bg-pink-400 rounded-full mt-2 shadow-lg" />
              <div className="flex-1">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-xs sm:text-sm text-gray-500 mb-2">{point.date}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{point.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed">{point.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PhotosScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <button
          onClick={() => navigateToSection('home')}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Home
        </button>
        
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-700 mb-4">Photo Memories</h2>
          <p className="text-base sm:text-lg text-gray-600 italic">I saved these not just in my phone, but in my heart.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {/* Photo 1 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="/wishes/image.png" 
              alt="Memory" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm sm:text-base text-gray-600 italic text-center">
              I smiled every time I saw this.
            </p>
          </div>

          {/* Photo 2 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="/wishes/myfavourite.png" 
              alt="Memory" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm sm:text-base text-gray-600 italic text-center">
              My favorite moment — even if you never knew.
            </p>
          </div>

          {/* Photo 3 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="/wishes/art.png" 
              alt="Memory" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm sm:text-base text-gray-600 italic text-center">
              You were always art to me.
            </p>
          </div>

          {/* Photo 4 */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
            <img 
              src="/wishes/coldnights.png" 
              alt="Memory" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-sm sm:text-base text-gray-600 italic text-center">
              This memory kept me warm on cold nights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );


  const LetterScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-0">
        <button
          onClick={() => navigateToSection('home')}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base cursor-pointer z-50 relative"
        >
          ← Back to Home
        </button>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-light text-gray-700">A Letter</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 font-serif leading-relaxed">
                {letterText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BirthdayScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-4 sm:p-6 relative overflow-hidden">
      {/* Floating birthday elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {i % 3 === 0 ? '🧁' : i % 3 === 1 ? '🎂' : '🕯️'}
          </div>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10 px-2 sm:px-0">
        <button
          onClick={() => navigateToSection('home')}
          className="mb-6 sm:mb-8 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base"
        >
          ← Back to Home
        </button>
        
        <div className="text-center mb-8 sm:mb-12 px-4">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4 sm:mb-6 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-700 mb-4">
            Her Day, Always
          </h2>
          <p className="text-base sm:text-xl text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            The world was brighter on this day — because you were born.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {!isBirthdayToday ? (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg text-center">
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 italic">
                Just {timeUntilBirthday.days} days left to your birthday… and to the words I've waited years to say.
              </p>
              
              {/* Countdown Timer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-800 animate-pulse">
                    {timeUntilBirthday.days}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Days</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {timeUntilBirthday.hours}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Hours</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {timeUntilBirthday.minutes}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Minutes</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">
                    {timeUntilBirthday.seconds}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Seconds</div>
                </div>
              </div>
              
              <div className="text-sm sm:text-base text-gray-500 italic">
                The birthday wish will unlock on July 26th...
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden border border-yellow-200">
              {/* Birthday confetti effect */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce opacity-30"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                      fontSize: `${8 + Math.random() * 6}px`
                    }}
                  >
                    {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🎂</div>
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
                    Happy Birthday Amma! 🎉
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 italic">
                    Today, the universe celebrates you.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 mb-6 border border-yellow-200">
                  <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                    "On this day, years ago, the world became a more beautiful place. 
                    I may not be there to celebrate with you, but know that somewhere, 
                    someone is thinking of you with the purest love and wishing you 
                    all the happiness your heart can hold."
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">
                    My Birthday Wish for You:
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                    May every candle on your cake represent a dream come true. 
                    May your smile never fade, your heart never break, and may you 
                    always know how deeply you are loved — even from afar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'home':
        return <HomeScreen />;
      case 'journey':
        return <JourneyScreen />;
      case 'photos':
        return <PhotosScreen />;
      case 'songs':
        return <SongsScreen onNavigateHome={() => navigateToSection('home')} />;
      case 'letter':
        return <LetterScreen />;
      case 'birthday':
        return <BirthdayScreen />;
      case 'surprise':
        return (
          <SurpriseScreen
            showFeelingsBox={showFeelingsBox}
            feelingsSubmitted={feelingsSubmitted}
            userFeelings={userFeelings}
            setUserFeelings={setUserFeelings}
            isSubmittingFeelings={isSubmittingFeelings}
            onSubmitFeelings={handleSubmitFeelings}
            onKeepForever={handleKeepForever}
            onCancelFeelings={() => setShowFeelingsBox(false)}
            onNavigateHome={() => navigateToSection('home')}
          />
        );
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div >
      {renderCurrentSection()}
    </div>
  );
}

export default App;