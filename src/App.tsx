import React, { useState } from 'react';
import { 
  GamepadIcon, 
  Users, 
  User, 
  Home, 
  Trophy, 
  Settings,
  Moon,
  Sun,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Shuffle,
  Eye,
  EyeOff
} from 'lucide-react';

type GameType = 'individual' | 'group';
type Page = 'home' | 'individual' | 'group' | 'leaderboard' | 'settings';

interface Player {
  id: number;
  name: string;
  role?: string;
  isAlive?: boolean;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const App: React.Component = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Individual games state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Group games state
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [currentGame, setCurrentGame] = useState<string>('');

  const questions: Question[] = [
    {
      id: 1,
      text: "ما هي عاصمة تونس؟",
      options: ["صفاقس", "تونس", "سوسة", "قابس"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "كم عدد أيام السنة؟",
      options: ["364", "365", "366", "367"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "ما هو أكبر كوكب في المجموعة الشمسية؟",
      options: ["الأرض", "المريخ", "المشتري", "زحل"],
      correctAnswer: 2
    }
  ];

  const loupGarouRoles = [
    "ذئب", "قروي", "عراف", "طبيب", "صياد", "ساحرة", "حارس", "عمدة"
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameStarted(false);
        setCurrentQuestion(0);
      }
    }, 2000);
  };

  const startIndividualGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: Date.now(), name: newPlayerName.trim() }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startLoupGarou = () => {
    if (players.length < 4) {
      alert('يجب أن يكون هناك على الأقل 4 لاعبين');
      return;
    }
    
    const shuffledRoles = [...loupGarouRoles].sort(() => Math.random() - 0.5);
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      role: shuffledRoles[index % shuffledRoles.length],
      isAlive: true
    }));
    
    setPlayers(updatedPlayers);
    setGamePhase('playing');
    setCurrentGame('loup-garou');
  };

  const startMakeshGame = () => {
    if (players.length < 3) {
      alert('يجب أن يكون هناك على الأقل 3 لاعبين');
      return;
    }
    
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const outsider = shuffledPlayers[0];
    const updatedPlayers = shuffledPlayers.map(player => ({
      ...player,
      role: player.id === outsider.id ? 'الغريب' : 'من الحومة'
    }));
    
    setPlayers(updatedPlayers);
    setGamePhase('playing');
    setCurrentGame('makesh');
  };

  const resetGame = () => {
    setPlayers([]);
    setGamePhase('setup');
    setCurrentGame('');
  };

  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    className = ''
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
  }) => {
    const baseClasses = "font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white",
      secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white",
      success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white",
      danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white",
      outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl ${className}`}>
      {children}
    </div>
  );

  const renderNavigation = () => (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <GamepadIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">خمم فيها</h1>
          </div>
          
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('individual')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'individual' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span>ألعاب فردية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('group')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'group' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>ألعاب جماعية</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('leaderboard')}
              className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'leaderboard' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>المتصدرين</span>
            </button>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          مرحباً بك في منصة الألعاب الذكية
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          استمتع بمجموعة متنوعة من الألعاب الفردية والجماعية
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">ألعاب فردية</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            اختبر معلوماتك وذكاءك مع مجموعة من الأسئلة المتنوعة
          </p>
          <Button onClick={() => setCurrentPage('individual')} size="lg">
            ابدأ اللعب
          </Button>
        </Card>
        
        <Card className="text-center hover:scale-105 transition-transform duration-300">
          <Users className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">ألعاب جماعية</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            العب مع الأصدقاء في ألعاب مثيرة مثل لعبة الذئب والقرية
          </p>
          <Button onClick={() => setCurrentPage('group')} variant="success" size="lg">
            العب مع الأصدقاء
          </Button>
        </Card>
      </div>
    </div>
  );

  const renderIndividualGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">الألعاب الفردية</h2>
        <p className="text-gray-600 dark:text-gray-300">اختبر معلوماتك وحقق أعلى النقاط</p>
      </div>
      
      {!gameStarted ? (
        <Card className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">لعبة الأسئلة</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            أجب على الأسئلة واحصل على أعلى نقاط ممكنة
          </p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Button onClick={startIndividualGame} size="lg">
              <Play className="w-5 h-5 ml-2" />
              ابدأ اللعبة
            </Button>
          </div>
          {score > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
              <p className="text-blue-600 dark:text-blue-300 font-semibold">
                آخر نتيجة: {score} من {questions.length}
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                السؤال {currentQuestion + 1} من {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                النقاط: {score}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {questions[currentQuestion].text}
          </h3>
          
          <div className="grid gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 rounded-xl text-right transition-all duration-300 transform hover:scale-102 ${
                  showResult
                    ? index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500 text-green-700 dark:text-green-300'
                      : selectedAnswer === index
                      ? 'bg-red-100 dark:bg-red-900 border-2 border-red-500 text-red-700 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 border-transparent hover:border-blue-300 text-gray-800 dark:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && (
                    <span className="ml-2">
                      {index === questions[currentQuestion].correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const renderGroupGames = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">الألعاب الجماعية</h2>
        <p className="text-gray-600 dark:text-gray-300">العب مع الأصدقاء واستمتع بوقتك</p>
      </div>
      
      {gamePhase === 'setup' && (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">إضافة اللاعبين</h3>
            <div className="space-y-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="اسم اللاعب"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <Button onClick={addPlayer} size="sm">إضافة</Button>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-white">{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                عدد اللاعبين: {players.length}
              </p>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">اختر اللعبة</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">لعبة الذئب والقرية</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  لعبة استراتيجية مثيرة حيث يحاول الذئاب القضاء على القرويين
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  الحد الأدنى: 4 لاعبين
                </p>
                <Button 
                  onClick={startLoupGarou} 
                  disabled={players.length < 4}
                  className="w-full"
                >
                  ابدأ اللعبة
                </Button>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">ماكش من الحومة</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  لعبة ممتعة حيث يحاول اللاعبون اكتشاف من هو الغريب بينهم
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  الحد الأدنى: 3 لاعبين
                </p>
                <Button 
                  onClick={startMakeshGame} 
                  disabled={players.length < 3}
                  variant="success"
                  className="w-full"
                >
                  ابدأ اللعبة
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {gamePhase === 'playing' && currentGame === 'loup-garou' && (
        <Card className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">لعبة الذئب والقرية</h3>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة تشغيل
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 dark:text-white">{player.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.role === 'ذئب' 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  }`}>
                    {player.role}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${
                    player.isAlive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {player.isAlive ? 'حي' : 'ميت'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">قواعد اللعبة:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• الذئاب يحاولون القضاء على القرويين</li>
              <li>• العراف يمكنه معرفة هوية لاعب واحد كل ليلة</li>
              <li>• الطبيب يمكنه حماية لاعب واحد كل ليلة</li>
              <li>• الهدف: القضاء على جميع الذئاب أو جميع القرويين</li>
            </ul>
          </div>
        </Card>
      )}
      
      {gamePhase === 'playing' && currentGame === 'makesh' && (
        <Card className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">ماكش من الحومة</h3>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة تشغيل
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <div key={player.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800 dark:text-white">{player.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.role === 'الغريب' 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  }`}>
                    {player.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-xl">
            <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">قواعد اللعبة:</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• هناك لاعب واحد "غريب" والباقي "من الحومة"</li>
              <li>• الهدف: اكتشاف من هو الغريب</li>
              <li>• الغريب يحاول أن يندمج مع المجموعة</li>
              <li>• اللاعبون يصوتون لاختيار الغريب</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">المتصدرين</h2>
        <p className="text-gray-600 dark:text-gray-300">أفضل اللاعبين في المنصة</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">قريباً</h3>
          <p className="text-gray-600 dark:text-gray-300">
            سيتم إضافة نظام المتصدرين قريباً لتتبع أفضل النتائج
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'individual' && renderIndividualGames()}
        {currentPage === 'group' && renderGroupGames()}
        {currentPage === 'leaderboard' && renderLeaderboard()}
      </main>
    </div>
  );
};

export default App;
