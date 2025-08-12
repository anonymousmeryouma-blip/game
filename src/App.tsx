import React from 'react';
import { 
  GamepadIcon, 
  Users, 
  Brain, 
  Zap, 
  Trophy, 
  Settings as SettingsIcon,
  ArrowLeft,
  Play,
  RotateCcw,
  User,
  Bot,
  Eye,
  EyeOff,
  Crown,
  Shield,
  Sword,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Languages,
  Clock,
  Check,
  X,
  Plus
} from 'lucide-react';

// Types
interface Player {
  id: string;
  name: string;
}

interface WerewolfRole {
  id: string;
  name: string;
  description: string;
  team: 'werewolf' | 'villager' | 'neutral';
}

interface HomePageProps {
  onGameSelect: (game: string) => void;
  savedPlayers: Player[];
  onSettingsOpen: () => void;
}

interface CharadesGameProps {
  onBack: () => void;
  savedPlayers: Player[];
  defaultIntruderCount: number;
}

interface WerewolfGameProps {
  onBack: () => void;
  savedPlayers: Player[];
  defaultWerewolfCount: number;
  defaultSpecialRoles: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  [key: string]: any; // Add index signature
}

interface GameSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  language: 'ar' | 'en';
  animationSpeed: 'slow' | 'normal' | 'fast';
  defaultIntruderCount: number;
  defaultWerewolfCount: number;
  defaultSpecialRoles: number;
}

const defaultSettings: GameSettings = {
  darkMode: true,
  soundEnabled: true,
  language: 'ar',
  animationSpeed: 'normal',
  defaultIntruderCount: 1,
  defaultWerewolfCount: 1,
  defaultSpecialRoles: 1
};

// Game Components
const HomePage = ({ onGameSelect, savedPlayers, onSettingsOpen }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <button 
            onClick={onSettingsOpen}
            className="absolute left-4 top-0 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="الإعدادات"
          >
            <SettingsIcon className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center justify-center mb-4">
            <GamepadIcon className="w-16 h-16 text-yellow-400 mr-4" />
            <h1 className="text-5xl font-bold text-white">خمم فيها</h1>
          </div>
          <p className="text-xl text-purple-200">منصة الألعاب الذكية للأصدقاء والعائلة</p>
        </div>

        {/* Saved Players */}
        {savedPlayers.length > 0 && (
          <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 ml-2" />
              اللاعبون المحفوظون
            </h3>
            <div className="flex flex-wrap gap-2">
              {savedPlayers.map(player => (
                <span key={player.id} className="bg-purple-500/30 text-white px-3 py-1 rounded-full text-sm">
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GameCard
            title="X/O الذكية"
            description="العب ضد الذكاء الاصطناعي أو مع صديق"
            icon={<Brain className="w-8 h-8" />}
            color="from-blue-500 to-cyan-500"
            onClick={() => onGameSelect('tictactoe')}
          />
          
          <GameCard
            title="ماكش من الحوكة"
            description="لعبة التخمين الجماعية المثيرة"
            icon={<Eye className="w-8 h-8" />}
            color="from-green-500 to-emerald-500"
            onClick={() => onGameSelect('charades')}
          />
          
          <GameCard
            title="الذئب والقرية"
            description="لعبة الأدوار الاستراتيجية"
            icon={<Crown className="w-8 h-8" />}
            color="from-red-500 to-orange-500"
            onClick={() => onGameSelect('werewolf')}
          />
          
          <GameCard
            title="سؤال وجواب"
            description="اختبر معلوماتك في مختلف المجالات"
            icon={<Zap className="w-8 h-8" />}
            color="from-purple-500 to-pink-500"
            onClick={() => onGameSelect('quiz')}
          />
          
          <GameCard
            title="لعبة الذاكرة"
            description="تحدى ذاكرتك مع البطاقات"
            icon={<Trophy className="w-8 h-8" />}
            color="from-yellow-500 to-amber-500"
            onClick={() => onGameSelect('memory')}
          />
          
          <GameCard
            title="الإعدادات"
            description="تخصيص التطبيق وإدارة البيانات"
            icon={<SettingsIcon className="w-8 h-8" />}
            color="from-gray-500 to-slate-500"
            onClick={() => onGameSelect('settings')}
          />
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ title, description, icon, color, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}
    >
      <div className="text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
};

const TicTacToe = ({ onBack }: { onBack: () => void }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameMode, setGameMode] = useState<'ai' | 'friend' | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, opponent: 0, draws: 0 });

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(square => square) ? 'draw' : null;
  };

  const makeAIMove = (currentBoard: (string | null)[]) => {
    const availableMoves = currentBoard.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];
    
    // Simple AI strategy
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') return move;
    }
    
    for (const move of availableMoves) {
      const testBoard = [...currentBoard];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') return move;
    }
    
    const corners = [0, 2, 6, 8].filter(i => availableMoves.includes(i));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    if (availableMoves.includes(4)) return 4;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    
    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult === 'X') setScores(prev => ({ ...prev, player: prev.player + 1 }));
      else if (gameResult === 'O') setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      else setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }
    
    if (gameMode === 'ai' && isPlayerTurn) {
      setIsPlayerTurn(false);
      setTimeout(() => {
        const aiMove = makeAIMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
        
        const aiResult = checkWinner(aiBoard);
        if (aiResult) {
          setWinner(aiResult);
          if (aiResult === 'O') setScores(prev => ({ ...prev, opponent: prev.opponent + 1 }));
          else if (aiResult === 'draw') setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
    } else {
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
        <div className="container mx-auto max-w-md">
          <button onClick={onBack} className="mb-6 flex items-center text-white hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </button>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">اختر نمط اللعب</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setGameMode('ai')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                <Bot className="w-6 h-6 ml-3" />
                العب ضد الذكاء الاصطناعي
              </button>
              
              <button
                onClick={() => setGameMode('friend')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                <User className="w-6 h-6 ml-3" />
                العب مع صديق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center text-white hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة
          </button>
          <button onClick={resetGame} className="flex items-center text-white hover:text-blue-300 transition-colors">
            <RotateCcw className="w-5 h-5 ml-2" />
            إعادة تشغيل
          </button>
        </div>

        {/* Scores */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex justify-between text-white text-sm">
            <span>اللاعب: {scores.player}</span>
            <span>التعادل: {scores.draws}</span>
            <span>{gameMode === 'ai' ? 'الذكاء الاصطناعي' : 'الصديق'}: {scores.opponent}</span>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-bold text-white">
              {winner === 'draw' ? 'تعادل!' : 
               winner === 'X' ? 'فاز اللاعب الأول!' : 
               gameMode === 'ai' ? 'فاز الذكاء الاصطناعي!' : 'فاز اللاعب الثاني!'}
            </div>
          ) : (
            <div className="text-xl text-white">
              دور: {isPlayerTurn ? 'اللاعب الأول (X)' : gameMode === 'ai' ? 'الذكاء الاصطناعي (O)' : 'اللاعب الثاني (O)'}
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="aspect-square bg-white/20 rounded-xl flex items-center justify-center text-4xl font-bold text-white hover:bg-white/30 transition-all"
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CharadesGame = ({ onBack, savedPlayers, defaultIntruderCount }: CharadesGameProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showWord, setShowWord] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [intruders, setIntruders] = useState<string[]>([]);
  const [intruderCount, setIntruderCount] = useState(1);
  const [showingRole, setShowingRole] = useState(false);
  const [currentViewingPlayer, setCurrentViewingPlayer] = useState(0);

  const categories = {
    'أفلام': ['تايتانيك', 'الأسد الملك', 'فروزن', 'أفاتار', 'إنسبشن'],
    'حيوانات': ['فيل', 'زرافة', 'بطريق', 'دولفين', 'نمر'],
    'مهن': ['طبيب', 'مهندس', 'معلم', 'طباخ', 'رسام'],
    'رياضة': ['كرة القدم', 'سباحة', 'تنس', 'كرة السلة', 'جولف'],
    'طعام': ['بيتزا', 'برجر', 'سوشي', 'مكرونة', 'آيس كريم']
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim()
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length >= 2 && selectedCategory) {
      // Select random intruders
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const selectedIntruders = shuffledPlayers.slice(0, intruderCount).map(p => p.id);
      setIntruders(selectedIntruders);
      setGameStarted(true);
      generateNewWord();
    }
  };

  const getMaxIntruders = () => {
    if (players.length <= 4) return 1;
    if (players.length <= 7) return 2;
    return 3;
  };

  const generateNewWord = () => {
    const words = categories[selectedCategory as keyof typeof categories];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setShowWord(false);
  };

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    generateNewWord();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4">
        <div className="container mx-auto max-w-md">
          <button onClick={onBack} className="mb-6 flex items-center text-white hover:text-green-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </button>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">ماكش من الحوكة</h2>

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">اختر الفئة:</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(categories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Intruder Count Selection */}
            {players.length >= 2 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">عدد الدخلاء:</h3>
                <div className="flex gap-2">
                  {Array.from({ length: getMaxIntruders() }, (_, i) => i + 1).map((count) => (
                    <button
                      key={count}
                      onClick={() => setIntruderCount(count)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        intruderCount === count
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
                <p className="text-white/70 text-sm mt-2">
                  الحد الأقصى للدخلاء: {getMaxIntruders()}
                </p>
              </div>
            )}

            {/* Add Players */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">إضافة اللاعبين:</h3>
              
              {/* Saved Players */}
              {savedPlayers.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-2">اللاعبون المحفوظون:</p>
                  <div className="flex flex-wrap gap-2">
                    {savedPlayers.map(player => (
                      <button
                        key={player.id}
                        onClick={() => {
                          if (!players.find(p => p.id === player.id)) {
                            setPlayers([...players, player]);
                          }
                        }}
                        className="bg-green-500/30 text-white px-3 py-1 rounded-full text-sm hover:bg-green-500/50 transition-colors"
                      >
                        + {player.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="اسم اللاعب"
                  className="flex-1 bg-white/20 text-white placeholder-white/50 px-4 py-2 rounded-xl border-none outline-none focus:bg-white/30 transition-all"
                />
                <button
                  onClick={addPlayer}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                >
                  إضافة
                </button>
              </div>

              {/* Players List */}
              {players.length > 0 && (
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                      <span className="text-white">{player.name}</span>
                      <button
                        onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Start Game */}
            <button
              onClick={startGame}
              disabled={players.length < 2 || !selectedCategory}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              ابدأ اللعبة ({players.length} لاعبين، {intruderCount} دخيل)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showingRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setGameStarted(false)} className="flex items-center text-white hover:text-green-300 transition-colors">
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة
            </button>
            <div className="text-white text-sm">
              الفئة: {selectedCategory}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-6">توزيع الأدوار</h2>
            <p className="text-white/80 mb-6">كل لاعب يجب أن يرى دوره بشكل منفصل</p>
            
            <div className="space-y-3">
              {players.map((player, index) => (
                <button
                  key={player.id}
                  onClick={() => {
                    setCurrentViewingPlayer(index);
                    setShowingRole(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  {player.name} - اضغط لرؤية دورك
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = players[currentViewingPlayer];
  const isIntruder = intruders.includes(currentPlayer.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowingRole(false)} className="flex items-center text-white hover:text-green-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للقائمة
          </button>
          <div className="text-white text-sm">
            الفئة: {selectedCategory}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {currentPlayer.name}
          </h3>

          <div className="mb-8">
            <div className={`rounded-xl p-6 mb-4 ${
              isIntruder ? 'bg-red-500/30 border border-red-500/50' : 'bg-white/20'
            }`}>
              {isIntruder ? (
                <div>
                  <div className="text-2xl font-bold text-red-300 mb-2">🕵️ أنت الدخيل!</div>
                  <div className="text-white/80">لا تعرف الكلمة - حاول التخمين!</div>
                </div>
              ) : (
                <div>
                  <div className="text-white/70 mb-2">كلمتك هي:</div>
                  <div className="text-3xl font-bold text-white">{currentWord}</div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const nextIndex = (currentViewingPlayer + 1) % players.length;
                if (nextIndex === 0) {
                  // All players have seen their roles, start the game
                  setShowingRole(false);
                  setCurrentPlayerIndex(0);
                } else {
                  setCurrentViewingPlayer(nextIndex);
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              {currentViewingPlayer === players.length - 1 ? 'ابدأ اللعبة' : 'اللاعب التالي'}
            </button>
            
            <button
              onClick={generateNewWord}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              كلمة جديدة
            </button>
          </div>

          {/* Players List */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-white font-semibold mb-3">اللاعبون:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {players.map((player, index) => (
                <span
                  key={player.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === currentViewingPlayer
                      ? 'bg-green-500 text-white'
                      : intruders.includes(player.id)
                      ? 'bg-red-500/50 text-white'
                      : 'bg-white/20 text-white/70'
                  }`}
                >
                  {player.name} {intruders.includes(player.id) ? '🕵️' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WerewolfGame = ({ onBack, savedPlayers, defaultWerewolfCount, defaultSpecialRoles }: WerewolfGameProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [roles, setRoles] = useState<{ [playerId: string]: WerewolfRole }>({});
  const [showRoles, setShowRoles] = useState(false);
  const [werewolfCount, setWerewolfCount] = useState(1);
  const [villagerCount, setVillagerCount] = useState(2);
  const [specialCount, setSpecialCount] = useState(1);
  const [showingRole, setShowingRole] = useState(false);
  const [currentViewingPlayer, setCurrentViewingPlayer] = useState(0);

  const werewolfRoles: WerewolfRole[] = [
    { id: 'werewolf', name: 'ذئب', description: 'يحاول القضاء على القرويين', team: 'werewolf' },
    { id: 'villager', name: 'قروي', description: 'يحاول العثور على الذئاب', team: 'villager' },
    { id: 'seer', name: 'العراف', description: 'يمكنه معرفة هوية لاعب واحد كل ليلة', team: 'villager' },
    { id: 'doctor', name: 'الطبيب', description: 'يمكنه حماية لاعب واحد كل ليلة', team: 'villager' },
    { id: 'hunter', name: 'الصياد', description: 'عند موته يمكنه قتل لاعب آخر', team: 'villager' },
    { id: 'mayor', name: 'العمدة', description: 'صوته يحسب مضاعف في التصويت', team: 'villager' }
  ];

  const distributeRoles = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const newRoles: { [playerId: string]: WerewolfRole } = {};

    let assignedCount = 0;

    // Assign werewolves
    for (let i = 0; i < werewolfCount && assignedCount < players.length; i++) {
      newRoles[shuffledPlayers[assignedCount].id] = werewolfRoles[0]; // werewolf
      assignedCount++;
    }

    // Assign special villager roles
    let roleIndex = 2; // Start from seer
    for (let i = 0; i < specialCount && assignedCount < players.length && roleIndex < werewolfRoles.length; i++) {
      newRoles[shuffledPlayers[assignedCount].id] = werewolfRoles[roleIndex];
      roleIndex++;
      assignedCount++;
    }

    // Assign regular villagers to remaining players
    for (let i = assignedCount; i < players.length; i++) {
      newRoles[shuffledPlayers[i].id] = werewolfRoles[1]; // villager
    }

    setRoles(newRoles);
    setGameStarted(true);
    setShowingRole(true);
    setCurrentViewingPlayer(0);
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim()
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
        <div className="container mx-auto max-w-md">
          <button onClick={onBack} className="mb-6 flex items-center text-white hover:text-red-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </button>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">الذئب والقرية</h2>

            {/* Add Players */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">إضافة اللاعبين:</h3>
              
              {/* Saved Players */}
              {savedPlayers.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-2">اللاعبون المحفوظون:</p>
                  <div className="flex flex-wrap gap-2">
                    {savedPlayers.map(player => (
                      <button
                        key={player.id}
                        onClick={() => {
                          if (!players.find(p => p.id === player.id)) {
                            setPlayers([...players, player]);
                          }
                        }}
                        className="bg-red-500/30 text-white px-3 py-1 rounded-full text-sm hover:bg-red-500/50 transition-colors"
                      >
                        + {player.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                  placeholder="اسم اللاعب"
                  className="flex-1 bg-white/20 text-white placeholder-white/50 px-4 py-2 rounded-xl border-none outline-none focus:bg-white/30 transition-all"
                />
                <button
                  onClick={addPlayer}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
                >
                  إضافة
                </button>
              </div>

              {/* Players List */}
              {players.length > 0 && (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between bg-white/10 p-3 rounded-xl">
                      <span className="text-white">{player.name}</span>
                      <button
                        onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Configuration */}
            {players.length >= 4 && (
              <div className="mb-6 bg-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-4">إعداد الأدوار:</h4>
                
                {/* Werewolf Count */}
                <div className="mb-4">
                  <label className="text-white/80 text-sm mb-2 block">عدد الذئاب:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => setWerewolfCount(count)}
                        disabled={count >= players.length}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          werewolfCount === count
                            ? 'bg-red-500 text-white'
                            : count >= players.length
                            ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Roles Count */}
                <div className="mb-4">
                  <label className="text-white/80 text-sm mb-2 block">الأدوار الخاصة:</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSpecialCount(count)}
                        disabled={werewolfCount + count >= players.length}
                        className={`px-3 py-1 rounded-lg text-sm transition-all ${
                          specialCount === count
                            ? 'bg-blue-500 text-white'
                            : werewolfCount + count >= players.length
                            ? 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="text-white/80 text-sm space-y-1">
                  <p>الذئاب: {werewolfCount}</p>
                  <p>الأدوار الخاصة: {specialCount}</p>
                  <p>القرويين العاديين: {players.length - werewolfCount - specialCount}</p>
                </div>
              </div>
            )}

            {/* Start Game */}
            <button
              onClick={distributeRoles}
              disabled={players.length < 4}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-orange-600 transition-all"
            >
              {players.length < 4 ? 'يحتاج 4 لاعبين على الأقل' : `ابدأ اللعبة (${players.length} لاعبين)`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
      <div className="container mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setGameStarted(false)} className="flex items-center text-white hover:text-red-300 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة
          </button>
          <h2 className="text-2xl font-bold text-white text-center">الذئب والقرية</h2>
          <div className="w-20"></div> {/* For alignment */}
        </div>

        {showingRole ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              دور {players[currentViewingPlayer]?.name}
            </h3>
            
            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <div className="text-6xl mb-4">
                {roles[players[currentViewingPlayer]?.id]?.team === 'werewolf' ? '🐺' : 
                 roles[players[currentViewingPlayer]?.id]?.id === 'seer' ? '🔮' :
                 roles[players[currentViewingPlayer]?.id]?.id === 'doctor' ? '⚕️' :
                 roles[players[currentViewingPlayer]?.id]?.id === 'mayor' ? '👑' :
                 roles[players[currentViewingPlayer]?.id]?.id === 'hunter' ? '🏹' : '👤'}
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                {roles[players[currentViewingPlayer]?.id]?.name}
              </h4>
              <p className="text-white/80">
                {roles[players[currentViewingPlayer]?.id]?.description}
              </p>
            </div>

            <button
              onClick={() => {
                if (currentViewingPlayer < players.length - 1) {
                  setCurrentViewingPlayer(currentViewingPlayer + 1);
                } else {
                  setShowingRole(false);
                }
              }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all"
            >
              {currentViewingPlayer < players.length - 1 ? 'اللاعب التالي' : 'ابدأ اللعبة'}
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">اللعبة جاهزة!</h3>
            
            <div className="space-y-3 mb-6">
              {players.map((player) => (
                <div key={player.id} className="p-4 rounded-xl bg-white/10">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-white ml-3" />
                    <div className="text-white font-semibold">{player.name}</div>
                  </div>
                </div>
              ))}
            </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-white font-semibold mb-3">قواعد اللعبة:</h4>
            <div className="text-white/80 text-sm space-y-2">
              <p>• الذئاب يحاولون القضاء على جميع القرويين</p>
              <p>• القرويون يحاولون العثور على جميع الذئاب</p>
              <p>• العراف يمكنه معرفة هوية لاعب واحد كل ليلة</p>
              <p>• الطبيب يمكنه حماية لاعب واحد كل ليلة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizGame = ({ onBack }: { onBack: () => void }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');

  // Sample questions by category
  const questionBank: Record<string, QuizQuestion[]> = {
    general: [
      {
        id: 1,
        question: 'ما هي عاصمة المملكة العربية السعودية؟',
        options: ['جدة', 'الرياض', 'الدمام', 'مكة المكرمة'],
        correctAnswer: 1,
        category: 'general'
      },
      {
        id: 2,
        question: 'ما هو أطول نهر في العالم؟',
        options: ['نهر النيل', 'نهر الأمازون', 'نهر اليانجتسي', 'نهر المسيسيبي'],
        correctAnswer: 0,
        category: 'general'
      }
    ],
    sports: [
      {
        id: 3,
        question: 'في أي عام فازت إسبانيا بكأس العالم لكرة القدم؟',
        options: ['2006', '2010', '2014', '2018'],
        correctAnswer: 1,
        category: 'sports'
      }
    ]
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      const selectedQuestions = questionBank[selectedCategory as keyof typeof questionBank] || [];
      
      if (selectedQuestions.length === 0) {
        throw new Error('لا توجد أسئلة متاحة لهذا التصنيف');
      }
      
      // Shuffle questions and select first 10
      const shuffled = [...selectedQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);
      
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الأسئلة');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showScore || !questions[currentQuestionIndex]) return;
    
    setSelectedAnswer(answerIndex);
    const correct = questions[currentQuestionIndex].correctAnswer === answerIndex;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    // Reload questions when resetting
    setSelectedCategory(prev => prev);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <div className="text-lg text-indigo-700">جاري تحميل الأسئلة...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-md w-full text-center">
          {error}
        </div>
        <button
          onClick={() => {
            setSelectedCategory('general');
            setError(null);
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          المحاولة مرة أخرى
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center text-indigo-600">
            <ArrowLeft className="w-5 h-5 ml-1" />
            العودة
          </button>
          <h1 className="text-3xl font-bold">سؤال وجواب</h1>
          <div className="w-20"></div>
        </div>

        {!showScore && questions.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  سؤال {currentQuestionIndex + 1} من {questions.length}
                </span>
                <span className="font-semibold">النقاط: {score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {currentQuestion?.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 text-right rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'bg-green-100 text-green-800 border-2 border-green-400'
                        : 'bg-red-100 text-red-800 border-2 border-red-400'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  } ${selectedAnswer !== null && currentQuestion.correctAnswer === index ? 'border-2 border-green-500' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">انتهى الاختبار!</h2>
            <p className="text-gray-600 mb-2">
              أجبت على {score} من أصل {questions.length} سؤالاً بشكل صحيح
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-8 mt-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(score / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1 sm:flex-none"
              >
                <RotateCcw className="inline ml-2 w-5 h-5" />
                إعادة الاختبار
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-none"
              >
                <Home className="inline ml-2 w-5 h-5" />
                العودة للرئيسية
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentGame, setCurrentGame] = useState<string>('home');
  const [savedPlayers, setSavedPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  const [showSettings, setShowSettings] = useState(false);

  // Load saved players from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gamePlayers');
    if (saved) {
      setSavedPlayers(JSON.parse(saved));
    }
  }, []);

  // Save players and settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('gamePlayers', JSON.stringify(savedPlayers));
  }, [savedPlayers]);

  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  const handleGameSelect = (game: string) => {
    setCurrentGame(game);
  };

  const handleBack = () => {
    setCurrentGame('home');
  };

  // Add new players to saved list
  const addToSavedPlayers = (newPlayers: Player[]) => {
    const uniquePlayers = newPlayers.filter(
      newPlayer => !savedPlayers.find(saved => saved.name === newPlayer.name)
    );
    if (uniquePlayers.length > 0) {
      setSavedPlayers([...savedPlayers, ...uniquePlayers]);
    }
  };

  // Settings component with modern toggles
  const Settings = () => {
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h2>
          <button 
            onClick={() => setShowSettings(false)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-yellow-400 mr-2" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400 mr-2" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {settings.darkMode ? 'الوضع الليلي' : 'النهاري'}
              </span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              aria-label={settings.darkMode ? 'تعطيل الوضع الليلي' : 'تفعيل الوضع الليلي'}
            >
              <span
                className={`${
                  settings.darkMode ? 'translate-x-8' : 'translate-x-1'
                } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-500 mr-2" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500 mr-2" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {settings.soundEnabled ? 'الصوت مفعل' : 'الصوت معطل'}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                settings.soundEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
              aria-label={settings.soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              <span
                className={`${
                  settings.soundEnabled ? 'translate-x-8' : 'translate-x-1'
                } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Languages className="w-5 h-5 text-purple-500 mr-2" />
              <span>اللغة</span>
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  settings.language === 'ar' 
                    ? 'bg-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  settings.language === 'en' 
                    ? 'bg-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Default Game Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
              <SettingsIcon className="w-5 h-5 text-blue-500 mr-2" />
              الإعدادات الافتراضية للألعاب
            </h3>
            
            {/* Default Intruder Count */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">عدد المتسللين الافتراضي (ماكش من الحومة)</label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => updateIntruderCount(num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      settings.defaultIntruderCount === num
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Werewolf Count */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 dark:text-gray-400">عدد الذئاب الافتراضي (الذئب والقرية)</label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => updateWerewolfCount(num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      settings.defaultWerewolfCount === num
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset to Defaults */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
                  setSettings({
                    ...defaultSettings,
                    // Keep the current language setting
                    language: settings.language
                  });
                }
              }}
              className="w-full px-4 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all hover:shadow-md active:scale-95"
            >
              إعادة تعيين الإعدادات
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'tictactoe':
        return <TicTacToe onBack={handleBack} />;
      case 'charades':
        return <CharadesGame 
          onBack={handleBack} 
          savedPlayers={savedPlayers} 
          defaultIntruderCount={settings.defaultIntruderCount}
        />;
      case 'werewolf':
        return <WerewolfGame 
          onBack={handleBack} 
          savedPlayers={savedPlayers}
          defaultWerewolfCount={settings.defaultWerewolfCount}
          defaultSpecialRoles={settings.defaultSpecialRoles}
        />;
      case 'quiz':
        return <QuizGame onBack={handleBack} />;
      case 'home':
      default:
        return (
          <>
            <HomePage 
              onGameSelect={handleGameSelect} 
              savedPlayers={savedPlayers} 
              onSettingsOpen={() => setShowSettings(true)}
            />
            {showSettings && <Settings />}
          </>
        );
    }
  };

  // Apply dark mode class to html element and save settings
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  // Toggle dark mode handler
  const toggleDarkMode = () => {
    setSettings(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  // Toggle sound handler
  const toggleSound = () => {
    setSettings(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  // Change language handler
  const changeLanguage = (lang: 'ar' | 'en') => {
    setSettings(prev => ({
      ...prev,
      language: lang
    }));
  };

  // Update default intruder count
  const updateIntruderCount = (count: number) => {
    setSettings(prev => ({
      ...prev,
      defaultIntruderCount: count
    }));
  };

  // Update default werewolf count
  const updateWerewolfCount = (count: number) => {
    setSettings(prev => ({
      ...prev,
      defaultWerewolfCount: count
    }));
  };

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      {renderCurrentGame()}
    </div>
  )
};

export default App;
