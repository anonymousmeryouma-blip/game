import React, { useState, useEffect } from 'react';
import { Users, Trophy, Clock, Play, RotateCcw, Plus, Eye, EyeOff, Shuffle, Brain, Target, Zap, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
  isImpostor?: boolean;
  hasRevealed?: boolean;
  answers?: { [key: string]: string };
}

interface FirstLetterCategory {
  name: string;
  icon: string;
  key: string;
}

interface ImpostorWord {
  word: string;
  category: string;
}

const playerColors = [
  "from-blue-500 to-blue-600",
  "from-red-500 to-red-600", 
  "from-green-500 to-green-600",
  "from-purple-500 to-purple-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600"
];

const firstLetterCategories: FirstLetterCategory[] = [
  { name: "حيوان", icon: "🐾", key: "animal" },
  { name: "إنسان", icon: "👤", key: "person" },
  { name: "نبات", icon: "🌱", key: "plant" },
  { name: "جماد", icon: "🏠", key: "object" },
  { name: "بلد", icon: "🌍", key: "country" },
  { name: "طعام", icon: "🍎", key: "food" }
];

// قاموس الكلمات للتحقق
const wordDictionary: { [key: string]: { [key: string]: string[] } } = {
  'أ': {
    animal: ['أسد', 'أرنب', 'أفعى', 'أخطبوط'],
    person: ['أحمد', 'أمير', 'أستاذ', 'أطباء'],
    plant: ['أرز', 'أناناس', 'أوراق'],
    object: ['أثاث', 'أقلام', 'أبواب'],
    country: ['أمريكا', 'ألمانيا', 'أستراليا'],
    food: ['أرز', 'أناناس', 'أجبان']
  },
  'ب': {
    animal: ['بقرة', 'بطة', 'ببغاء', 'بعوضة'],
    person: ['بائع', 'باسم', 'بطل'],
    plant: ['بطاطس', 'برتقال', 'بصل'],
    object: ['باب', 'بيت', 'برج'],
    country: ['بريطانيا', 'البرازيل', 'بلجيكا'],
    food: ['برتقال', 'بطاطس', 'بيض']
  },
  'ت': {
    animal: ['تمساح', 'تيس', 'ثعبان'],
    person: ['تاجر', 'طبيب', 'تلميذ'],
    plant: ['تفاح', 'توت', 'تين'],
    object: ['تلفاز', 'تلفون', 'طاولة'],
    country: ['تونس', 'تركيا', 'تايلاند'],
    food: ['تفاح', 'توت', 'تين']
  },
  'ج': {
    animal: ['جمل', 'جاموس', 'جرذ'],
    person: ['جندي', 'جار', 'جد'],
    plant: ['جزر', 'جوز', 'جوافة'],
    object: ['جهاز', 'جسر', 'جدار'],
    country: ['الجزائر', 'الأردن', 'جورجيا'],
    food: ['جزر', 'جبن', 'جوز']
  },
  'ح': {
    animal: ['حصان', 'حمار', 'حوت'],
    person: ['حارس', 'حكيم', 'حداد'],
    plant: ['حمص', 'حنطة', 'حبوب'],
    object: ['حاسوب', 'حقيبة', 'حذاء'],
    country: ['العراق', 'الهند', 'هولندا'],
    food: ['حمص', 'حليب', 'حلوى']
  }
};

const impostorWords: ImpostorWord[] = [
  { word: "القطة", category: "حيوانات" },
  { word: "الشمس", category: "طبيعة" },
  { word: "المدرسة", category: "أماكن" },
  { word: "الكتاب", category: "أشياء" },
  { word: "السيارة", category: "مواصلات" },
  { word: "الطبيب", category: "مهن" },
  { word: "البحر", category: "طبيعة" },
  { word: "الطائرة", category: "مواصلات" },
  { word: "المطبخ", category: "أماكن" },
  { word: "الهاتف", category: "تكنولوجيا" }
];

const brainTeasers = [
  {
    question: "ما الشيء الذي يمشي بلا أرجل ويبكي بلا عيون؟",
    answer: "السحاب",
    category: "ألغاز"
  },
  {
    question: "أنا في البداية والنهاية، في الأرض والسماء، فمن أنا؟",
    answer: "حرف الألف",
    category: "ألغاز"
  },
  {
    question: "شيء له رأس ولا يفكر، وله عين ولا يرى؟",
    answer: "الإبرة",
    category: "ألغاز"
  },
  {
    question: "كلما زاد نقص، فما هو؟",
    answer: "العمر",
    category: "ألغاز"
  },
  {
    question: "ما الشيء الذي يأكل ولا يشبع؟",
    answer: "النار",
    category: "ألغاز"
  }
];

type GameType = 'menu' | 'firstLetter' | 'impostor' | 'brainTeaser' | 'quickMath';
type GameState = 'setup' | 'playing' | 'finished' | 'reveal';

function App() {
  const [gameType, setGameType] = useState<GameType>('menu');
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentLetter, setCurrentLetter] = useState('');
  const [currentWord, setCurrentWord] = useState<ImpostorWord | null>(null);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [currentBrainTeaser, setCurrentBrainTeaser] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mathProblem, setMathProblem] = useState({ question: '', answer: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && gameStarted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, gameStarted]);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: Player = {
        id: players.length + 1,
        name: newPlayerName.trim(),
        score: 0,
        color: playerColors[players.length],
        answers: {}
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentPlayer(0);
    setTimeLeft(60);
    setRevealedCards([]);
    setCurrentRevealIndex(0);
    setShowAnswer(false);
    setGameStarted(false);
    setPlayers(players.map(player => ({ 
      ...player, 
      score: 0, 
      isImpostor: false, 
      hasRevealed: false,
      answers: {}
    })));
  };

  const startFirstLetterGame = () => {
    if (players.length >= 2) {
      setGameState('playing');
      generateRandomLetter();
      setTimeLeft(120);
      setGameStarted(true);
      // Initialize answers for all players
      const updatedPlayers = players.map(player => ({
        ...player,
        answers: firstLetterCategories.reduce((acc, cat) => ({
          ...acc,
          [cat.key]: ''
        }), {})
      }));
      setPlayers(updatedPlayers);
    }
  };

  const generateRandomLetter = () => {
    const availableLetters = Object.keys(wordDictionary);
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    setCurrentLetter(availableLetters[randomIndex]);
  };

  const updatePlayerAnswer = (playerId: number, category: string, answer: string) => {
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { 
            ...player, 
            answers: { 
              ...player.answers, 
              [category]: answer 
            } 
          }
        : player
    ));
  };

  const checkAnswers = () => {
    const updatedPlayers = players.map(player => {
      let score = 0;
      const playerAnswers = player.answers || {};
      
      firstLetterCategories.forEach(category => {
        const answer = playerAnswers[category.key]?.trim().toLowerCase();
        const validWords = wordDictionary[currentLetter]?.[category.key] || [];
        
        if (answer && validWords.some(word => word.toLowerCase() === answer)) {
          score += 10;
        }
      });
      
      return { ...player, score: player.score + score };
    });
    
    setPlayers(updatedPlayers);
    setGameState('finished');
  };

  const startImpostorGame = () => {
    if (players.length >= 3) {
      const shuffledPlayers = [...players];
      const impostorIndex = Math.floor(Math.random() * shuffledPlayers.length);
      
      const updatedPlayers = shuffledPlayers.map((player, index) => ({
        ...player,
        isImpostor: index === impostorIndex,
        hasRevealed: false
      }));
      
      setPlayers(updatedPlayers);
      setCurrentWord(impostorWords[Math.floor(Math.random() * impostorWords.length)]);
      setGameState('playing');
      setRevealedCards([]);
      setCurrentRevealIndex(0);
    }
  };

  const revealNextCard = () => {
    if (currentRevealIndex < players.length) {
      setCurrentRevealIndex(currentRevealIndex + 1);
    }
  };

  const revealPreviousCard = () => {
    if (currentRevealIndex > 0) {
      setCurrentRevealIndex(currentRevealIndex - 1);
    }
  };

  const startBrainTeaserGame = () => {
    if (players.length >= 1) {
      setGameState('playing');
      setCurrentBrainTeaser(0);
      setShowAnswer(false);
      setTimeLeft(30);
    }
  };

  const generateMathProblem = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    
    let answer = 0;
    let question = '';
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        break;
      case '×':
        const smallNum1 = Math.floor(Math.random() * 12) + 1;
        const smallNum2 = Math.floor(Math.random() * 12) + 1;
        answer = smallNum1 * smallNum2;
        question = `${smallNum1} × ${smallNum2}`;
        break;
    }
    
    setMathProblem({ question, answer });
  };

  const startQuickMathGame = () => {
    if (players.length >= 1) {
      setGameState('playing');
      generateMathProblem();
      setTimeLeft(15);
    }
  };

  if (gameType === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-full mb-6">
              <div className="text-6xl animate-bounce">🎮</div>
            </div>
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 animate-pulse">
              مجموعة الألعاب الجماعية
            </h1>
            <p className="text-2xl text-gray-300 font-light">اختر لعبتك المفضلة واستمتع مع الأصدقاء!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              onClick={() => setGameType('firstLetter')}
              className="group bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-lg border border-blue-400/30 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔤</div>
                <h3 className="text-3xl font-bold mb-3 text-blue-300">لعبة أول حرف</h3>
                <p className="text-blue-100 mb-4 text-lg">حيوان، إنسان، نبات، جماد بحرف محدد</p>
                <div className="flex items-center text-blue-200">
                  <Users size={18} className="mr-2" />
                  <span>2+ لاعبين</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setGameType('impostor')}
              className="group bg-gradient-to-br from-red-500/20 to-red-700/20 backdrop-blur-lg border border-red-400/30 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🕵️</div>
                <h3 className="text-3xl font-bold mb-3 text-red-300">لعبة الدخيل</h3>
                <p className="text-red-100 mb-4 text-lg">اكتشف الدخيل من خلال الكلمات والأوصاف</p>
                <div className="flex items-center text-red-200">
                  <Users size={18} className="mr-2" />
                  <span>3+ لاعبين</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setGameType('brainTeaser')}
              className="group bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-lg border border-green-400/30 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🧠</div>
                <h3 className="text-3xl font-bold mb-3 text-green-300">ألغاز الذكاء</h3>
                <p className="text-green-100 mb-4 text-lg">تحدى عقلك مع ألغاز ذكية ومثيرة</p>
                <div className="flex items-center text-green-200">
                  <Brain size={18} className="mr-2" />
                  <span>1+ لاعبين</span>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setGameType('quickMath')}
              className="group bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-lg border border-purple-400/30 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔢</div>
                <h3 className="text-3xl font-bold mb-3 text-purple-300">الحساب السريع</h3>
                <p className="text-purple-100 mb-4 text-lg">حل المسائل الحسابية بأسرع وقت</p>
                <div className="flex items-center text-purple-200">
                  <Zap size={18} className="mr-2" />
                  <span>1+ لاعبين</span>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-orange-500/20 to-orange-700/20 backdrop-blur-lg border border-orange-400/30 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/25 relative overflow-hidden opacity-75">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h3 className="text-3xl font-bold mb-3 text-orange-300">قريباً...</h3>
                <p className="text-orange-100 mb-4 text-lg">المزيد من الألعاب المثيرة</p>
                <div className="flex items-center text-orange-200">
                  <Target size={18} className="mr-2" />
                  <span>قيد التطوير</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup Phase for all games
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <button
              onClick={() => setGameType('menu')}
              className="mb-4 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              ← العودة للقائمة الرئيسية
            </button>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
              {gameType === 'firstLetter' && '🔤 لعبة أول حرف'}
              {gameType === 'impostor' && '🕵️ لعبة الدخيل'}
              {gameType === 'brainTeaser' && '🧠 ألغاز الذكاء'}
              {gameType === 'quickMath' && '🔢 الحساب السريع'}
            </h1>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="text-yellow-400" />
              إضافة اللاعبين
            </h2>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="اسم اللاعب..."
                className="flex-1 px-6 py-4 rounded-xl border-none bg-white/10 backdrop-blur-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 8}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Plus size={20} />
                إضافة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {players.map((player) => (
                <div key={player.id} className={`bg-gradient-to-r ${player.color} rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-300 shadow-lg`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-sm opacity-80 mt-1">النقاط: {player.score}</div>
                </div>
              ))}
            </div>

            {players.length >= (gameType === 'impostor' ? 3 : gameType === 'firstLetter' ? 2 : 1) ? (
              <button
                onClick={() => {
                  if (gameType === 'firstLetter') startFirstLetterGame();
                  else if (gameType === 'impostor') startImpostorGame();
                  else if (gameType === 'brainTeaser') startBrainTeaserGame();
                  else if (gameType === 'quickMath') startQuickMathGame();
                }}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <Play size={24} />
                بدء اللعبة!
              </button>
            ) : (
              <div className="text-center text-gray-300 text-lg">
                {gameType === 'impostor' && 'يجب إضافة 3 لاعبين على الأقل'}
                {gameType === 'firstLetter' && 'يجب إضافة لاعبين على الأقل'}
                {(gameType === 'brainTeaser' || gameType === 'quickMath') && 'يجب إضافة لاعب واحد على الأقل'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // First Letter Game
  if (gameType === 'firstLetter' && gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">🔤 لعبة أول حرف</h1>
            <div className="flex justify-center items-center gap-4 text-lg text-gray-300">
              <Clock size={20} />
              <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 text-center">
            <h2 className="text-8xl font-bold text-yellow-400 mb-4 animate-pulse">{currentLetter}</h2>
            <p className="text-2xl text-white mb-8">ابحث عن كلمات تبدأ بهذا الحرف</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {players.map((player) => (
              <div key={player.id} className={`bg-gradient-to-r ${player.color}/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6`}>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">{player.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {firstLetterCategories.map((category) => (
                    <div key={category.key} className="bg-white/10 rounded-xl p-4">
                      <div className="text-center mb-2">
                        <span className="text-2xl">{category.icon}</span>
                        <div className="text-white font-semibold">{category.name}</div>
                      </div>
                      <input
                        type="text"
                        value={player.answers?.[category.key] || ''}
                        onChange={(e) => updatePlayerAnswer(player.id, category.key, e.target.value)}
                        className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center"
                        placeholder="..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={checkAnswers}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <Check size={24} />
              تحقق من الإجابات
            </button>
            <button
              onClick={generateRandomLetter}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <Shuffle size={20} />
              حرف جديد
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <RotateCcw size={20} />
              إعادة تشغيل
            </button>
          </div>
        </div>
      </div>
    );
  }

  // First Letter Game Results
  if (gameType === 'firstLetter' && gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">🏆 النتائج</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {players.map((player) => (
              <div key={player.id} className={`bg-gradient-to-r ${player.color}/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6`}>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                  <div className="text-3xl font-bold text-yellow-400">النقاط: {player.score}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {firstLetterCategories.map((category) => {
                    const answer = player.answers?.[category.key]?.trim().toLowerCase() || '';
                    const validWords = wordDictionary[currentLetter]?.[category.key] || [];
                    const isCorrect = answer && validWords.some(word => word.toLowerCase() === answer);
                    
                    return (
                      <div key={category.key} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                        <div className="text-center">
                          <span className="text-lg">{category.icon}</span>
                          <div className="text-white text-sm">{category.name}</div>
                          <div className="text-white font-semibold">{answer || 'لا يوجد'}</div>
                          {isCorrect ? <Check size={16} className="text-green-400 mx-auto mt-1" /> : <X size={16} className="text-red-400 mx-auto mt-1" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <RotateCcw size={24} />
              لعبة جديدة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Impostor Game
  if (gameType === 'impostor' && gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 mb-4">🕵️ لعبة الدخيل</h1>
            <p className="text-xl text-gray-300">اضغط على الأزرار للتنقل بين البطاقات</p>
          </div>

          {currentWord && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">الفئة: {currentWord.category}</h2>
              <p className="text-gray-300">الدخيل لا يعرف الكلمة السرية!</p>
            </div>
          )}

          {/* عرض البطاقة الحالية */}
          <div className="flex justify-center mb-8">
            {currentRevealIndex < players.length ? (
              <div className="relative">
                <div className={`bg-gradient-to-r ${players[currentRevealIndex].color} rounded-3xl p-12 text-white transform hover:scale-105 transition-all duration-300 min-h-[300px] min-w-[250px] flex flex-col justify-center items-center shadow-2xl`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {players[currentRevealIndex].isImpostor ? '🕵️' : '👤'}
                    </div>
                    <div className="font-bold text-2xl mb-4">{players[currentRevealIndex].name}</div>
                    {players[currentRevealIndex].isImpostor ? (
                      <div className="text-red-200 font-semibold text-xl">أنت الدخيل!</div>
                    ) : (
                      <div className="text-green-200 font-semibold text-xl">
                        الكلمة: {currentWord?.word}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white text-2xl">
                تم عرض جميع البطاقات!
              </div>
            )}
          </div>

          {/* أزرار التنقل */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={revealPreviousCard}
              disabled={currentRevealIndex === 0}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <ArrowRight size={20} />
              السابق
            </button>
            <button
              onClick={revealNextCard}
              disabled={currentRevealIndex >= players.length}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              التالي
              <ArrowLeft size={20} />
            </button>
          </div>

          {/* مؤشر التقدم */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {players.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentRevealIndex ? 'bg-green-400' : 
                    index === currentRevealIndex ? 'bg-yellow-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              <RotateCcw size={24} />
              لعبة جديدة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Brain Teaser Game
  if (gameType === 'brainTeaser' && gameState === 'playing') {
    const currentPuzzle = brainTeasers[currentBrainTeaser];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">🧠 ألغاز الذكاء</h1>
            <div className="flex justify-center items-center gap-4 text-lg text-gray-300">
              <span>اللغز {currentBrainTeaser + 1} من {brainTeasers.length}</span>
              <span>•</span>
              <Clock size={20} />
              <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8">
            <div className="text-center mb-6">
              <span className="bg-green-400 text-black px-6 py-3 rounded-full font-semibold text-lg">
                {currentPuzzle.category}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-8 text-center leading-relaxed">
              {currentPuzzle.question}
            </h2>

            {showAnswer ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-4">
                  الإجابة: {currentPuzzle.answer}
                </div>
                <button
                  onClick={() => {
                    if (currentBrainTeaser < brainTeasers.length - 1) {
                      setCurrentBrainTeaser(currentBrainTeaser + 1);
                      setShowAnswer(false);
                      setTimeLeft(30);
                    } else {
                      setGameState('finished');
                    }
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  {currentBrainTeaser < brainTeasers.length - 1 ? 'اللغز التالي' : 'إنهاء اللعبة'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xl font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300"
                >
                  إظهار الإجابة
                </button>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 mx-auto transform hover:scale-105"
            >
              <RotateCcw size={20} />
              إعادة تشغيل
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quick Math Game
  if (gameType === 'quickMath' && gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">🔢 الحساب السريع</h1>
            <div className="flex justify-center items-center gap-4 text-lg text-gray-300">
              <Clock size={20} />
              <span className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 mb-8 text-center">
            <h2 className="text-8xl font-bold text-yellow-400 mb-8 animate-pulse">{mathProblem.question}</h2>
            <p className="text-2xl text-white mb-8">ما هو الناتج؟</p>
            
            <button
              onClick={() => {
                alert(`الإجابة الصحيحة: ${mathProblem.answer}`);
                generateMathProblem();
                setTimeLeft(15);
              }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300"
            >
              إظهار الإجابة
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                generateMathProblem();
                setTimeLeft(15);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <Shuffle size={20} />
              مسألة جديدة
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <RotateCcw size={20} />
              إعادة تشغيل
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default App;