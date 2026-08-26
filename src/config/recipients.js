/**
 * Isolated Configuration & Theme Registry for Rakhi 2026 Recipients.
 * Each world has completely isolated styling, particle rules, mascot behaviors,
 * sound profiles, custom games, and locked gift reveal data.
 */

export const RECIPIENTS = {
  chiti: {
    id: 'chiti',
    name: 'Siri Chaithra',
    nickname: 'Chiti',
    relation: 'My Wonderful Sister ❤️',
    roleTag: 'The Heart & Soul Sister',
    emoji: '❤️',
    mascotEmoji: '🌸',
    password: 'brother',
    hint: 'Who is the one wishing his favorite sister a Happy Raksha Bandhan 2026? ❤️',
    welcomeQuote: '"A sister is both your mirror and your biggest cheerleader. Happy Raksha Bandhan 2026! 💖"',
    theme: {
      key: 'chiti-warmth',
      primary: '#ff3366',
      primaryRgb: '255, 51, 102',
      secondary: '#ff758c',
      secondaryRgb: '255, 117, 140',
      accent: '#ffd166',
      accentRgb: '255, 209, 102',
      bgDark: '#12050c',
      bgGradient: 'radial-gradient(ellipse at top, #3d0c24 0%, #1a0410 50%, #0d0108 100%)',
      cardBg: 'rgba(45, 12, 28, 0.65)',
      cardBorder: 'rgba(255, 117, 140, 0.35)',
      glowColor: 'rgba(255, 51, 102, 0.5)',
      textPrimary: '#fff0f5',
      textSecondary: '#fbcfe8',
      fontHeading: "'Outfit', sans-serif",
      fontAccent: "'Caveat', cursive",
      badgeGradient: 'linear-gradient(135deg, #ff3366, #ff758c)',
      highlightTag: 'Sibling Special ✨'
    },
    particles: {
      type: 'chiti',
      shapes: ['heart', 'flower', 'sparkle', 'star'],
      colors: ['#ff3366', '#ff758c', '#ffd166', '#ff9ebb', '#ffffff'],
      density: 35,
      speed: 0.8
    },
    audioProfile: {
      theme: 'chiti',
      mascotSound: 'harpSparkle',
      clickSound: 'softPop',
      soundTitle: 'Magical Sister Chimes 🌸'
    },
    hero: {
      title: 'Welcome to Chiti\'s Warm Sanctuary 💖',
      subtitle: 'A golden corner filled with hearts, sibling memories, and unlimited love.',
      mascotName: 'Sister Chiti 💖',
      mascotActionText: 'Tap Chiti to start the celebration dance! 🌸💃'
    },
    interactiveWidget: {
      type: 'sisterLove',
      title: 'Sister Love & Sparkle Jar 💌',
      prompt: 'Tap to shower the screen with sibling affection!',
      actionLabel: 'Send Love Shower 💖',
      statLabel: 'Love Sparks Sent:',
      quotes: [
        '“Forever my built-in best friend!” 👭',
        '“Rakhi promise: Always having your back!” 🛡️',
        '“Thank you for being the sweetest sister ever!” 🌟',
        '“No one makes me laugh quite like you do!” 😂',
        '“May this Rakhi bring you endless happiness!” 🎀'
      ]
    },
    letterPreview: {
      title: 'A Heartfelt Letter for Siri Chaithra (Chiti) 📜',
      tag: 'From Your Brother',
      teaserText: 'Dear Chiti, growing up together has given me the best memories and a bond that only gets stronger with every Rakhi. Even when we bicker over the silliest things or fight for the remote, you are always the heart of our home. On this Rakhi 2026, I promise to always stand by you, celebrate your victories, and cheer you up whenever you need a laugh. Happy Raksha Bandhan!',
      signature: 'With infinite love & blessings, Your Brother ✨'
    },
    giftTeaser: {
      title: 'Chiti\'s Secret Rakhi 2026 Gift Box 🎁',
      badge: 'Rakhi Special',
      description: 'A special surprise packaged with golden ribbons and sister memories. Complete the Brother\'s Challenge above to unwrap!',
      mysteryClue: 'Clue: A sparkling token of brotherly love, sweet treats, and memories made just for Chiti 🌸',
      revealMessage: 'Happy Rakhi 2026, Chiti! 🎀 You are the most wonderful sister in the universe. May all your dreams sparkle and come true this year!'
    }
  },

  duck: {
    id: 'duck',
    name: 'Grishma',
    nickname: 'Duck',
    relation: 'College Bestie 🦆',
    roleTag: 'Supreme Commander of Quacks',
    emoji: '🦆',
    mascotEmoji: '🐤',
    password: 'quack',
    hint: 'Think of the signature sound our quacky bestie makes! 🦆',
    welcomeQuote: '"Life is tough, but ducks keep swimming with pure chaos and swag. Happy Rakhi 2026! 🌊"',
    theme: {
      key: 'duck-pond',
      primary: '#06b6d4',
      primaryRgb: '6, 182, 212',
      secondary: '#facc15',
      secondaryRgb: '250, 204, 21',
      accent: '#38bdf8',
      accentRgb: '56, 189, 248',
      bgDark: '#041724',
      bgGradient: 'radial-gradient(ellipse at top, #083344 0%, #032030 50%, #010f18 100%)',
      cardBg: 'rgba(8, 51, 68, 0.65)',
      cardBorder: 'rgba(56, 189, 248, 0.35)',
      glowColor: 'rgba(6, 182, 212, 0.5)',
      textPrimary: '#ecfeff',
      textSecondary: '#bae6fd',
      fontHeading: "'Fredoka', sans-serif",
      fontAccent: "'Plus Jakarta Sans', sans-serif",
      badgeGradient: 'linear-gradient(135deg, #06b6d4, #facc15)',
      highlightTag: 'Quack Zone 🦆'
    },
    particles: {
      type: 'duck',
      shapes: ['bubble', 'feather', 'waterdrop', 'duckMini'],
      colors: ['#06b6d4', '#38bdf8', '#facc15', '#a5f3fc', '#ffffff'],
      density: 35,
      speed: 1.1
    },
    audioProfile: {
      theme: 'duck',
      mascotSound: 'quackSound',
      clickSound: 'bubbleSplash',
      soundTitle: 'Chaotic Quack FX 🌊'
    },
    hero: {
      title: 'Welcome to Duck\'s Splashtastic Pond 🦆💦',
      subtitle: 'The quackiest, most cheerful corner of the Rakhi multiverse!',
      mascotName: 'Captain Quackers 🦆',
      mascotActionText: 'Tap the duck to start the waddle dance groove! 🌊💃'
    },
    interactiveWidget: {
      type: 'duckPond',
      title: 'Duck Chaos & Pond Splash Meter 🌊',
      prompt: 'Tap to trigger a ripple wave and unleash bouncing duckies!',
      actionLabel: 'Launch Quack Attack! 🦆',
      statLabel: 'Ducks Unleashed:',
      quotes: [
        '“Quack quack! Stay buoyant, bestie!” 🦆',
        '“Feathers ruffled? Never! We just float!” 🌊',
        '“100% genuine duck energy guaranteed!” ⚡',
        '“Waddle into greatness this Rakhi 2026!” 👑',
        '“Certified Quack Master approved!” 📜'
      ]
    },
    letterPreview: {
      title: 'A Special Note for Grishma (Duck) 📜',
      tag: 'From Your Friend',
      teaserText: 'Hey Duck! College without your hilarious chaotic energy and signature quacks would be 1000% more boring. Thank you for all the laughs, random gossip sessions, and unconditional friendship. You bring so much cheer and life into every room. Wishing you an awesome and buoyant Rakhi 2026!',
      signature: 'Stay Quacky & Unstoppable! 🦆'
    },
    giftTeaser: {
      title: 'Duck\'s Mystery Rakhi Hamper 🎁',
      badge: 'Rakhi Special',
      description: 'A customized gift wrapped in pond-aqua wrapping paper with floating bubbles. Complete Duck Pond Mayhem to unlock!',
      mysteryClue: 'Clue: Cheeky, yellow, full of fun memories, and guaranteed to make Duck smile! 🦆',
      revealMessage: 'Happy Rakhi 2026, Duck! 🦆 May your year be packed with high scores, zero stress, and endless hilarious adventures!'
    }
  },

  cat: {
    id: 'cat',
    name: 'Ashwidha',
    nickname: 'Cat',
    relation: 'College Bestie 🐱',
    roleTag: 'Queen of Midnight Mischief',
    emoji: '🐱',
    mascotEmoji: '🐾',
    password: 'meow',
    hint: 'What sound does a cute kitty make when asking for love & treats? 🐱',
    welcomeQuote: '"Cats rule the world, and you rule the mischief. Happy Raksha Bandhan 2026! 🐾✨"',
    theme: {
      key: 'cat-night',
      primary: '#a855f7',
      primaryRgb: '168, 85, 247',
      secondary: '#ec4899',
      secondaryRgb: '236, 72, 153',
      accent: '#c084fc',
      accentRgb: '192, 132, 252',
      bgDark: '#13091e',
      bgGradient: 'radial-gradient(ellipse at top, #2e1065 0%, #17082c 50%, #090312 100%)',
      cardBg: 'rgba(39, 14, 75, 0.65)',
      cardBorder: 'rgba(192, 132, 252, 0.35)',
      glowColor: 'rgba(168, 85, 247, 0.5)',
      textPrimary: '#faf5ff',
      textSecondary: '#e9d5ff',
      fontHeading: "'Outfit', sans-serif",
      fontAccent: "'Caveat', cursive",
      badgeGradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
      highlightTag: 'Feline Realm 🐾'
    },
    particles: {
      type: 'cat',
      shapes: ['paw', 'yarn', 'fish', 'catEye'],
      colors: ['#a855f7', '#ec4899', '#c084fc', '#f472b6', '#ffffff'],
      density: 35,
      speed: 0.9
    },
    audioProfile: {
      theme: 'cat',
      mascotSound: 'meowPurr',
      clickSound: 'pawTap',
      soundTitle: 'Feline Meows & Purrs 🐾'
    },
    hero: {
      title: 'Welcome to Cat\'s Midnight Realm 🐱✨',
      subtitle: 'Where paws leave glowing trails and yarn balls defy gravity!',
      mascotName: 'Midnight Cat Ashwidha 🐱',
      mascotActionText: 'Tap the kitten to watch the paw dance routine! 🐾💃'
    },
    interactiveWidget: {
      type: 'catPlayground',
      title: 'Paws, Yarn & Purr Station 🧶',
      prompt: 'Tap to roll playful yarn balls and leave glowing paw prints!',
      actionLabel: 'Spawn Playful Kittens! 🐾',
      statLabel: 'Paws Stamped:',
      quotes: [
        '“Nap hard, play harder, stay fabulous!” 🐱',
        '“Certified 10/10 coolest cat in college!” 🐾',
        '“Nine lives, infinite mischief!” 🧶',
        '“May your Rakhi be purr-fectly amazing!” 💖',
        '“Paws down the best friend anyone could ask for!” 🌟'
      ]
    },
    letterPreview: {
      title: 'A Special Note for Ashwidha (Cat) 📜',
      tag: 'From Your Friend',
      teaserText: 'Dear Cat, your chill yet wildly playful vibe makes every hangout and college break unforgettable. Thank you for being such a stellar, loyal, and fun-loving friend who always brings great energy. Wishing you a purr-fect Raksha Bandhan 2026 filled with good vibes and happy moments!',
      signature: 'Stay Purr-fect & Mischievous! 🐾'
    },
    giftTeaser: {
      title: 'Cat\'s Mystery Midnight Gift 🎁',
      badge: 'Rakhi Special',
      description: 'A sleek violet surprise box sealed with a silver cat paw charm. Complete Midnight Cat Run to unwrap!',
      mysteryClue: 'Clue: Soft, stylish, full of feline charm, and midnight sparkle 🐾',
      revealMessage: 'Happy Rakhi 2026, Cat! 🐱 May your days be filled with cozy naps, sweet victories, and infinite fun!'
    }
  },

  peacock: {
    id: 'peacock',
    name: 'Thanishqa',
    nickname: 'White Peacock',
    relation: 'College Bestie 🦚',
    roleTag: 'Empress of Grace & Elegance',
    emoji: '🦚',
    mascotEmoji: '🪶',
    password: 'peaky',
    hint: 'A majestic nickname celebrating our graceful white peacock! 🦚',
    welcomeQuote: '"Grace is not standing out, but being remembered for pure radiance. Happy Rakhi 2026! ✨👑"',
    theme: {
      key: 'peacock-royal',
      primary: '#10b981',
      primaryRgb: '16, 185, 129',
      secondary: '#0284c7',
      secondaryRgb: '2, 132, 199',
      accent: '#e0e7ff',
      accentRgb: '224, 231, 255',
      bgDark: '#031718',
      bgGradient: 'radial-gradient(ellipse at top, #064e3b 0%, #032a2f 50%, #021215 100%)',
      cardBg: 'rgba(6, 78, 59, 0.65)',
      cardBorder: 'rgba(16, 185, 129, 0.35)',
      glowColor: 'rgba(16, 185, 129, 0.5)',
      textPrimary: '#f0fdf4',
      textSecondary: '#a7f3d0',
      fontHeading: "'Cinzel', serif",
      fontAccent: "'Outfit', sans-serif",
      badgeGradient: 'linear-gradient(135deg, #10b981, #0284c7, #e0e7ff)',
      highlightTag: 'Royal Sanctuary 🦚'
    },
    particles: {
      type: 'peacock',
      shapes: ['feather', 'crystal', 'starburst', 'auraRing'],
      colors: ['#ffffff', '#10b981', '#38bdf8', '#a7f3d0', '#e0e7ff'],
      density: 32,
      speed: 0.7
    },
    audioProfile: {
      theme: 'peacock',
      mascotSound: 'celestialFanfare',
      clickSound: 'crystalTink',
      soundTitle: 'Royal Crystal Harmonies 🪶'
    },
    hero: {
      title: 'Welcome to the White Peacock Sanctuary 🦚✨',
      subtitle: 'An iridescent court of elegance, crystalline stars, and royal majesty.',
      mascotName: 'The Royal White Peacock 🦚',
      mascotActionText: 'Tap the peacock to unfurl the majestic fan dance! ✨💃'
    },
    interactiveWidget: {
      type: 'peacockFeathers',
      title: 'Royal Radiance & Feather Bloom 🪶',
      prompt: 'Tap to unfurl majestic iridescent feathers and celestial starlight!',
      actionLabel: 'Unfurl Royal Plumes! 🦚',
      statLabel: 'Royal Radiance Spun:',
      quotes: [
        '“Radiating pure poise, beauty, and kindness!” 🦚',
        '“Elegance is the only beauty that never fades!” 👑',
        '“May your year shine as brightly as iridescent plumes!” ✨',
        '“True royalty in spirit and friendship!” 💎',
        '“Wishing you a spectacular and regal Rakhi 2026!” 🌟'
      ]
    },
    letterPreview: {
      title: 'A Special Note for Thanishqa (White Peacock) 📜',
      tag: 'From Your Friend',
      teaserText: 'Dear Thanishqa, your calm wisdom, genuine kindness, and radiant poise bring so much grace and positivity to our college circle. Thank you for being such an inspiring, thoughtful, and loyal friend. Wishing you a fabulous Raksha Bandhan 2026!',
      signature: 'With Royal Warmth & Best Wishes! 🦚'
    },
    giftTeaser: {
      title: 'Thanishqa\'s Regal Rakhi Gift Box 🎁',
      badge: 'Rakhi Special',
      description: 'An iridescent emerald-and-silver gift box crowned with a peacock plume. Complete the Royal Labyrinth to unwrap!',
      mysteryClue: 'Clue: Shimmering, sophisticated, crystal-adorned, and fit for royalty 🦚',
      revealMessage: 'Happy Rakhi 2026, White Peacock! 🦚 May your year unfold with brilliance, elegance, and crowning achievements!'
    }
  },

  hanvika: {
    id: 'hanvika',
    name: 'Hanvika',
    nickname: 'Rabbit',
    relation: 'Bouncy Bestie 🐰',
    roleTag: 'The Meadow Rabbit Champion',
    emoji: '🐰',
    mascotEmoji: '🥕',
    password: 'bunny',
    hint: 'Think of a cute, fluffy meadow companion with long ears! 🐰🥕',
    welcomeQuote: '"Stay fluffy, hop high, and keep munching on sweet victories. Happy Raksha Bandhan 2026! 🥕✨"',
    theme: {
      key: 'rabbit-meadow',
      primary: '#ec4899',
      primaryRgb: '236, 72, 153',
      secondary: '#f97316',
      secondaryRgb: '249, 115, 22',
      accent: '#facc15',
      accentRgb: '250, 204, 21',
      bgDark: '#1a081e',
      bgGradient: 'radial-gradient(ellipse at top, #2e0832 0%, #15031a 50%, #08010b 100%)',
      cardBg: 'rgba(38, 10, 44, 0.65)',
      cardBorder: 'rgba(236, 72, 153, 0.35)',
      glowColor: 'rgba(236, 72, 153, 0.5)',
      textPrimary: '#fff1f2',
      textSecondary: '#fbcfe8',
      fontHeading: "'Fredoka', sans-serif",
      fontAccent: "'Caveat', cursive",
      badgeGradient: 'linear-gradient(135deg, #ec4899, #f97316)',
      highlightTag: 'Bunny Hop Realm 🐰'
    },
    particles: {
      type: 'rabbit',
      shapes: ['carrot', 'heart', 'sparkle', 'star'],
      colors: ['#ec4899', '#f97316', '#facc15', '#f472b6', '#ffffff'],
      density: 35,
      speed: 0.85
    },
    audioProfile: {
      theme: 'rabbit',
      mascotSound: 'bunnyHop',
      clickSound: 'carrotCrunch',
      soundTitle: 'Playful Meadow Chimes 🐰'
    },
    hero: {
      title: 'Welcome to Hanvika\'s Bunny Meadow 🐰🥕',
      subtitle: 'A cheerful sunlit pasture of golden carrots, fluffy hops, and joyful memories.',
      mascotName: 'Fluffy Meadow Rabbit 🐰',
      mascotActionText: 'Tap the bunny to watch the energetic carrot hop dance! 🥕💃'
    },
    interactiveWidget: {
      type: 'bunnyCarrots',
      title: 'Carrot Crunch & Meadow Sparkle 🥕✨',
      prompt: 'Tap to feed crunchy carrots and bloom meadow flowers!',
      actionLabel: 'Feed Golden Carrot! 🥕',
      statLabel: 'Golden Carrots Fed:',
      quotes: [
        '“Hopping through life with endless energy and sweetness!” 🐰',
        '“Carrot crunch certified: 100% wholesome friend!” 🥕',
        '“May your Rakhi bounce with joy and bright laughs!” 🌸',
        '“No obstacle too high for our meadow bunny!” ⭐',
        '“Wishing you a fluffy, joyful, and sweetest Rakhi 2026!” 🎀'
      ]
    },
    letterPreview: {
      title: 'A Warm Letter for Hanvika (Rabbit) 📜',
      tag: 'From Your Friend',
      teaserText: 'Dear Hanvika, your cheerful energy, contagious smile, and cute bunny hops make every day brighter and full of fun. Thank you for bringing so much laughter and pure positivity into our lives. Wishing you a joyful, blessed, and wonderful Raksha Bandhan 2026!',
      signature: 'With Bunny Hops & Warmest Wishes! 🐰'
    },
    giftTeaser: {
      title: 'Hanvika\'s Secret Bunny Rakhi Gift Box 🎁',
      badge: 'Rakhi Special',
      description: 'A cheerful strawberry-pink and carrot-gold gift box tied with silk ribbons. Complete the Bunny Meadow Quest to unwrap!',
      mysteryClue: 'Clue: Fluffy, adorable, sweet, and made specially for our favorite meadow rabbit 🥕✨',
      revealMessage: 'Happy Rakhi 2026, Hanvika (Rabbit)! 🐰🥕 May your days be filled with sweet blessings, high hops, and endless happiness!'
    }
  }
};

export const RECIPIENT_LIST = Object.values(RECIPIENTS);

/**
 * Resets all level progressions, locks, and completions across all characters.
 */
export const resetAllProgression = () => {
  try {
    const ids = ['chiti', 'duck', 'cat', 'peacock', 'hanvika'];
    ids.forEach((id) => {
      sessionStorage.removeItem(`rakhi_2026_max_level_${id}`);
      sessionStorage.removeItem(`rakhi_2026_curr_level_${id}`);
      sessionStorage.removeItem(`rakhi_2026_danced_${id}`);
      sessionStorage.removeItem(`rakhi_2026_widget_${id}`);
      sessionStorage.removeItem(`rakhi_2026_game_cleared_${id}`);
      sessionStorage.removeItem(`rakhi_2026_seal_broken_${id}`);
      sessionStorage.removeItem(`rakhi_2026_gift_revealed_${id}`);
      
      localStorage.removeItem(`rakhi_2026_max_level_${id}`);
      localStorage.removeItem(`rakhi_2026_curr_level_${id}`);
      localStorage.removeItem(`rakhi_2026_danced_${id}`);
      localStorage.removeItem(`rakhi_2026_widget_${id}`);
      localStorage.removeItem(`rakhi_2026_game_cleared_${id}`);
      localStorage.removeItem(`rakhi_2026_seal_broken_${id}`);
      localStorage.removeItem(`rakhi_2026_gift_revealed_${id}`);
    });
    sessionStorage.removeItem('rakhi_2026_recipient_id');
  } catch (err) {
    console.warn('Could not reset progress:', err);
  }
};


