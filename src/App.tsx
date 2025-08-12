import React, { useState, useEffect } from 'react';
import { Brain, Users, User, Trophy, Star, Play, Home, GamepadIcon, Lightbulb, Medal, Eye, EyeOff, MessageCircle, HelpCircle, CheckCircle } from 'lucide-react';

// Game Components
const GameCard = ({ title, description, icon: Icon, players, difficulty, onClick, featured = false }) => (
  <div 
    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
      featured 
        ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 col-span-2' 
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600'
    }`}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
    <div className="relative p-8 text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm ${featured ? 'animate-pulse' : ''}`}>
          <Icon size={32} />
        </div>
        {featured && (
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold animate-bounce">
            مميز ⭐
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/90 mb-6 leading-relaxed">{description}</p>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
          <Users size={16} />
          <span className="text-sm">{players}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(difficulty)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-all duration-300">
      <Play size={20} fill="currentColor" />
    </div>
  </div>
);

const BaraSalfaGame = ({ onBack }) => {
  const [gamePhase, setGamePhase] = useState('setup'); // setup, playing, voting, reveal
  const [players, setPlayers] = useState(['']);
  const [currentWord, setCurrentWord] = useState('');
  const [outsider, setOutsider] = useState('');
  const [playerCards, setPlayerCards] = useState({});
  const [revealedCards, setRevealedCards] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [votes, setVotes] = useState({});
  const [gameResult, setGameResult] = useState('');

  const words = [
    'مدرسة', 'مستشفى', 'مطعم', 'سوق', 'مسجد', 'بحر', 'جبل', 'سيارة', 'طائرة', 'قطار',
    'كتاب', 'قلم', 'هاتف', 'تلفاز', 'كمبيوتر', 'كرة', 'لعبة', 'فيلم', 'أغنية', 'رقص',
    'طبخ', 'أكل', 'شرب', 'نوم', 'عمل', 'دراسة', 'سفر', 'رياضة', 'موسيقى', 'رسم',
    'عائلة', 'أصدقاء', 'حب', 'زواج', 'أطفال', 'والدين', 'أخوة', 'جيران', 'زملاء', 'معلم'
  ];

  const startGame = () => {
    if (players.filter(p => p.trim()).length >= 3) {
      const activePlayers = players.filter(p => p.trim());
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomOutsider = activePlayers[Math.floor(Math.random() * activePlayers.length)];
      
      setCurrentWord(randomWord);
      setOutsider(randomOutsider);
      
      // توزيع البطاقات
      const cards = {};
      activePlayers.forEach(player => {
        cards[player] = player === randomOutsider ? 'دخيل' : randomWord;
      });
      
      setPlayerCards(cards);
      setRevealedCards({});
      setGamePhase('playing');
      setCurrentPlayer(activePlayers[0]);
    }
  };

  const revealCard = (player) => {
    setRevealedCards(prev => ({
      ...prev,
      [player]: true
    }));
  };

  const hideCard = (player) => {
    setRevealedCards(prev => ({
      ...prev,
      [player]: false
    }));
  };

  const startVoting = () => {
    setGamePhase('voting');
    setVotes({});
  };

  const vote = (voter, suspect) => {
    setVotes(prev => ({
      ...prev,
      [voter]: suspect
    }));
  };

  const revealResults = () => {
    setGamePhase('reveal');
    
    // حساب الأصوات
    const voteCount = {};
    Object.values(votes).forEach(suspect => {
      voteCount[suspect] = (voteCount[suspect] || 0) + 1;
    });
    
    const mostVoted = Object.keys(voteCount).reduce((a, b) => 
      voteCount[a] > voteCount[b] ? a : b
    );
    
    if (mostVoted === outsider) {
      setGameResult('فاز اللاعبون العاديون! تم اكتشاف الدخيل 🎉');
    } else {
      setGameResult('فاز الدخيل! لم يتم اكتشافه 🕵️');
    }
  };

  const resetGame = () => {
    setGamePhase('setup');
    setPlayers(['']);
    setCurrentWord('');
    setOutsider('');
    setPlayerCards({});
    setRevealedCards({});
    setVotes({});
    setGameResult('');
  };

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const updatePlayer = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  if (gamePhase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="mb-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">🕵️ برا السالفة</h1>
              <p className="text-white/80 text-lg">اللعبة الجزائرية الأصيلة للذكاء والخداع</p>
              <div className="mt-4 p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                <p className="text-yellow-200 text-sm">
                  <strong>طريقة اللعب:</strong> سيتم اختيار لاعب واحد كـ"دخيل" سراً. باقي اللاعبين سيحصلون على نفس الكلمة. 
                  الهدف: اكتشاف من هو الدخيل قبل أن يكتشف الكلمة!
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">أضف اللاعبين (3 لاعبين على الأقل):</h3>
              {players.map((player, index) => (
                <input
                  key={index}
                  type="text"
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  placeholder={`اللاعب ${index + 1}`}
                  className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              ))}
              
              <div className="flex gap-4">
                <button
                  onClick={addPlayer}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  إضافة لاعب
                </button>
                <button
                  onClick={startGame}
                  disabled={players.filter(p => p.trim()).length < 3}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                >
                  ابدأ اللعبة 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    const activePlayers = Object.keys(playerCards);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="mb-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🎭 مرحلة اللعب</h2>
              <p className="text-white/80 text-lg mb-6">اضغط على بطاقتك لرؤية كلمتك، ثم ابدأ النقاش!</p>
              <button
                onClick={startVoting}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                بدء التصويت 🗳️
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePlayers.map((player) => (
                <div key={player} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-4">{player}</h3>
                    
                    <div className="mb-6">
                      {revealedCards[player] ? (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {playerCards[player]}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl p-6 mb-4 cursor-pointer hover:from-gray-500 hover:to-gray-600 transition-all duration-300">
                          <p className="text-xl text-white">🎴 بطاقة مخفية</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => revealCard(player)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        كشف
                      </button>
                      <button
                        onClick={() => hideCard(player)}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <EyeOff size={16} />
                        إخفاء
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">💬 مرحلة النقاش</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">نصائح للاعبين العاديين:</h4>
                  <ul className="text-white/80 space-y-2">
                    <li>• اطرح أسئلة غامضة حول الكلمة</li>
                    <li>• لاحظ من يبدو مرتبكاً أو يتجنب الإجابة</li>
                    <li>• تعاون مع الآخرين لكشف الدخيل</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-white">نصائح للدخيل:</h4>
                  <ul className="text-white/80 space-y-2">
                    <li>• اطرح أسئلة عامة لتعرف الكلمة</li>
                    <li>• تظاهر بأنك تعرف الكلمة</li>
                    <li>• حاول توجيه الشك لآخرين</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'voting') {
    const activePlayers = Object.keys(playerCards);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="mb-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🗳️ مرحلة التصويت</h2>
              <p className="text-white/80 text-lg mb-6">صوت لمن تعتقد أنه الدخيل!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {activePlayers.map((voter) => (
                <div key={voter} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">{voter}</h3>
                  <div className="space-y-3">
                    {activePlayers.filter(p => p !== voter).map((suspect) => (
                      <button
                        key={suspect}
                        onClick={() => vote(voter, suspect)}
                        className={`w-full p-3 rounded-xl font-bold transition-all duration-300 ${
                          votes[voter] === suspect
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {suspect} {votes[voter] === suspect && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={revealResults}
                disabled={Object.keys(votes).length < activePlayers.length}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                كشف النتائج 🎭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gamePhase === 'reveal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <div className="container mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="mb-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <Home size={20} />
            العودة للرئيسية
          </button>
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8">
              <h2 className="text-4xl font-bold text-white mb-6">🎉 انتهت اللعبة!</h2>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">الكلمة كانت:</p>
                <p className="text-3xl font-bold text-gray-900">{currentWord}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 mb-6">
                <p className="text-xl font-bold text-white mb-2">الدخيل كان:</p>
                <p className="text-2xl font-bold text-white">{outsider}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8">
                <p className="text-2xl font-bold text-white">{gameResult}</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={resetGame}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  لعبة جديدة 🎮
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  العودة للرئيسية 🏠
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const LetterGame = ({ onBack }) => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [answers, setAnswers] = useState({ name: '', animal: '', object: '', place: '' });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];

  const startGame = () => {
    const randomLetter = arabicLetters[Math.floor(Math.random() * arabicLetters.length)];
    setCurrentLetter(randomLetter);
    setGameStarted(true);
    setAnswers({ name: '', animal: '', object: '', place: '' });
  };

  const submitAnswers = () => {
    let points = 0;
    Object.values(answers).forEach(answer => {
      if (answer.trim() && answer.trim().startsWith(currentLetter)) {
        points += 10;
      }
    });
    setScore(prev => prev + points);
    alert(`حصلت على ${points} نقطة!`);
    startGame();
  };

  const updateAnswer = (category, value) => {
    setAnswers(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="mb-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
        >
          <Home size={20} />
          العودة للرئيسية
        </button>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">📝 حرف - اسم - حيوان - جماد - بلاد</h1>
            <div className="flex items-center justify-center gap-4">
              <Medal className="text-yellow-400" size={24} />
              <span className="text-xl font-bold text-white">النقاط: {score}</span>
            </div>
          </div>
          
          {!gameStarted ? (
            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                ابدأ اللعبة 🎯
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6">
                  <h2 className="text-4xl font-bold text-gray-900">الحرف: {currentLetter}</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'اسم إنسان', icon: '👤' },
                  { key: 'animal', label: 'حيوان', icon: '🐾' },
                  { key: 'object', label: 'جماد', icon: '📦' },
                  { key: 'place', label: 'بلد أو مكان', icon: '🏙️' }
                ].map(({ key, label, icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-white font-bold flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </label>
                    <input
                      type="text"
                      value={answers[key]}
                      onChange={(e) => updateAnswer(key, e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder={`${label} يبدأ بحرف ${currentLetter}`}
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={submitAnswers}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                إرسال الإجابات ✨
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    {
      id: 'bara-salfa',
      title: 'برا السالفة',
      description: 'اللعبة الجزائرية الأصيلة للذكاء والخداع. اكتشف من هو الدخيل قبل أن يكتشف الكلمة السرية!',
      icon: Brain,
      players: '3-8 لاعبين',
      difficulty: 4,
      featured: true
    },
    {
      id: 'letters',
      title: 'حرف - حيوان - جماد',
      description: 'اللعبة الكلاسيكية بأسلوب عصري. اختبر سرعة بديهتك ومعلوماتك!',
      icon: Lightbulb,
      players: '1+ لاعب',
      difficulty: 2
    },
    {
      id: 'riddles',
      title: 'ألغاز الحومة',
      description: 'مجموعة من الألغاز الجزائرية الشعبية لتحدي عقلك وتنمية ذكائك.',
      icon: GamepadIcon,
      players: '1+ لاعب',
      difficulty: 3
    },
    {
      id: 'memory',
      title: 'ذاكرة الأبطال',
      description: 'اختبر قوة ذاكرتك مع هذه اللعبة المسلية والمفيدة.',
      icon: Medal,
      players: '1+ لاعب',
      difficulty: 2
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'bara-salfa':
        return <BaraSalfaGame onBack={() => setCurrentGame(null)} />;
      case 'letters':
        return <LetterGame onBack={() => setCurrentGame(null)} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 flex items-center justify-center">
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-white mb-4">قريباً...</h2>
              <p className="text-white/80 mb-6">هذه اللعبة قيد التطوير</p>
              <button
                onClick={() => setCurrentGame(null)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        );
    }
  };

  if (currentGame) {
    return renderGame();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl">
                <Brain size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ألعاب الحومة</h1>
                <p className="text-white/70 text-sm">ألعاب جزائرية أصيلة للذكاء والتسلية</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <Users size={20} />
                <span>ألعاب جماعية</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <User size={20} />
                <span>ألعاب فردية</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            أهلاً وسهلاً في
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> ألعاب الحومة</span>
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            منصة الألعاب الجزائرية الأولى للتسلية والذكاء. استمتع بألعاب تراثية شعبية بلمسة عصرية مع أصدقائك وعائلتك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/30">
              🎭 برا السالفة الأصلية
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/30">
              🎮 تصميم حديث وأنيق
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/30">
              👥 للأصدقاء والعائلة
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">مجموعة الألعاب</h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              اختر لعبتك المفضلة واستمتع بوقت رائع مع الأصدقاء والعائلة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => setCurrentGame(game.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">لماذا ألعاب الحومة؟</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Brain size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">تنمية الذكاء</h4>
              <p className="text-white/80">ألعاب مصممة لتحفيز التفكير الإبداعي والمنطقي</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Users size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">تفاعل اجتماعي</h4>
              <p className="text-white/80">استمتع مع الأصدقاء والعائلة في جو من المرح</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-2xl mx-auto w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <Star size={32} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">تراث جزائري</h4>
              <p className="text-white/80">ألعاب مستوحاة من التراث الجزائري الأصيل</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm py-12 border-t border-white/20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Brain size={24} className="text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">ألعاب الحومة</h4>
          </div>
          <p className="text-white/70 mb-4">منصة الألعاب الجزائرية الأصيلة الأولى</p>
          <p className="text-white/50 text-sm">© 2025 ألعاب الحومة - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

export default App;