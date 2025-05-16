import React, { useEffect, useState } from "react";

// Expanded emoji collection
const emojis = ["💰", "💸", "🍯", "🫖", "💵", "🔗", "👾", "💎", "🪙", "🌟", "✨", "🚀", "🌈", "⚡"];

const FlyingEmojis = () => {
  const [emojiList, setEmojiList] = useState([]);
  
  // Add initial emojis to prevent black screen at start
  useEffect(() => {
    // Pre-populate with emojis in various positions to avoid empty start
    const initialEmojis = [];
    for (let i = 0; i < 20; i++) {
      initialEmojis.push({
        id: `initial-${i}`,
        symbol: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        size: 20 + Math.random() * 40,
        duration: 3 + Math.random() * 4,
        progress: Math.random() * 0.8, // Initial progress (0.8 = 80% through animation)
        wiggle: Math.random() > 0.5,
        wiggleAmount: 5 + Math.random() * 15,
        wiggleSpeed: 0.5 + Math.random() * 1.5,
        rotationSpeed: Math.random() > 0.7 ? (Math.random() * 2 - 1) * 360 : 0,
        glowColor: getRandomGlowColor(),
        glowIntensity: 3 + Math.random() * 7,
      });
    }
    
    setEmojiList(initialEmojis);
    
    // Remove initial emojis after their animation completes
    initialEmojis.forEach(emoji => {
      const remainingTime = emoji.duration * (1 - emoji.progress) * 1000;
      setTimeout(() => {
        setEmojiList(prev => prev.filter(e => e.id !== emoji.id));
      }, remainingTime);
    });
  }, []);

  // Function to get random glow color
  function getRandomGlowColor() {
    const colors = [
      '#ffcc00', // Gold
      '#00ffff', // Cyan
      '#ff00ff', // Magenta
      '#00ff00', // Green
      '#ff3300', // Orange-red
      '#3366ff', // Blue
      '#ffffff', // White
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useEffect(() => {
    // Create more emojis (higher emission rate)
    const interval = setInterval(() => {
      // Create 3-5 emojis at once for higher density
      const count = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < count; i++) {
        const newEmoji = {
          id: Date.now() + i,
          symbol: emojis[Math.floor(Math.random() * emojis.length)],
          left: Math.random() * 100,
          size: 20 + Math.random() * 40,
          duration: 3 + Math.random() * 4,
          progress: 0,
          wiggle: Math.random() > 0.5, // 50% chance to wiggle
          wiggleAmount: 5 + Math.random() * 15, // Random wiggle amount
          wiggleSpeed: 0.5 + Math.random() * 1.5, // Random wiggle speed
          rotationSpeed: Math.random() > 0.6 ? (Math.random() * 2 - 1) * 360 : 0, // 40% chance to rotate
          glowColor: getRandomGlowColor(),
          glowIntensity: 3 + Math.random() * 7, // Random glow intensity
        };
        
        setEmojiList((prev) => [...prev, newEmoji]);
        
        // Remove emoji after its animation duration
        setTimeout(() => {
          setEmojiList((prev) => prev.filter((e) => e.id !== newEmoji.id));
        }, newEmoji.duration * 1000);
      }
    }, 150); // Emit every 150ms for even higher density
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {emojiList.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute"
          style={{
            left: `${emoji.left}%`,
            top: emoji.progress ? `${100 - 120 * emoji.progress}%` : '100%',
            fontSize: `${emoji.size}px`,
            animation: `${emoji.wiggle ? 'flyUpWiggle' : 'flyUp'} ${emoji.duration}s linear forwards`,
            animationDelay: emoji.progress ? `-${emoji.duration * emoji.progress}s` : '0s',
            filter: `drop-shadow(0 0 ${emoji.glowIntensity}px ${emoji.glowColor})`,
            transform: emoji.rotationSpeed ? 'rotate(0deg)' : undefined,
          }}
        >
          <div
            className="inline-block"
            style={{
              animation: emoji.rotationSpeed ? `spin ${Math.abs(emoji.rotationSpeed / 100)}s linear infinite` : undefined,
            }}
          >
            {emoji.symbol}
          </div>
        </div>
      ))}

      {/* Custom animations in Tailwind */}
      <style>
        {`
          @keyframes flyUp {
            0% {
              transform: translateY(0);
              opacity: 0.3;
            }
            5% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-120vh);
              opacity: 0;
            }
          }
          
          @keyframes flyUpWiggle {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0.3;
            }
            5% {
              opacity: 1;
            }
            25% {
              transform: translateY(-30vh) translateX(20px);
            }
            50% {
              transform: translateY(-60vh) translateX(-20px);
            }
            75% {
              transform: translateY(-90vh) translateX(15px);
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-120vh) translateX(0);
              opacity: 0;
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default FlyingEmojis;