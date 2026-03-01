import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Loader2, Trophy, Zap } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { useAuth } from '@/react-app/contexts/useAuth';

export default function GamesPage() {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const { user, isPending } = useAuth();
  const [currentGame, setCurrentGame] = useState<'rockpaperscissors' | 'trivia' | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/login');
    }
  }, [user, isPending, navigate]);

  const games = [
    {
      id: 'rockpaperscissors',
      name: '🪨 Rock Paper Scissors',
      description: 'Classic game - best of 3 rounds',
      icon: '🪨',
    },
    {
      id: 'trivia',
      name: '🧠 Quick Trivia',
      description: 'Answer trivia questions',
      icon: '🧠',
    },
    {
      id: 'tictactoe',
      name: '⭕ Tic Tac Toe',
      description: 'Classic 3x3 grid strategy',
      icon: '⭕',
    },
    {
      id: 'wordguess',
      name: '🎯 Guess the Word',
      description: 'Figure out the hidden word',
      icon: '🎯',
    },
    {
      id: 'numberguess',
      name: '🔢 Number Guess',
      description: 'Guess a number 1-100',
      icon: '🔢',
    },
    {
      id: 'memory',
      name: '🧩 Memory Game',
      description: 'Match pairs of cards',
      icon: '🧩',
    },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/chat/${friendId}`)}
              className="hover:bg-white/10 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Play Games</span>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* Games Grid */}
        <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setCurrentGame(game.id as 'rockpaperscissors' | 'trivia')}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all transform hover:scale-105 text-left space-y-3"
              >
                <span className="text-4xl">{game.icon}</span>
                <h3 className="text-xl font-bold text-white">{game.name}</h3>
                <p className="text-sm text-white/60">{game.description}</p>
                <div className="flex items-center gap-2 text-cyan-400 pt-2 font-semibold">
                  <span>Play Now</span>
                  <Zap className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 backdrop-blur rounded-2xl p-6 border border-amber-400/30 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              🎮 Game Features
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Play against your friends in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Multiple game types to keep things fun</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Earn bragging rights and keep score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">✓</span>
                <span>Great way to break the ice and get closer</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  if (currentGame === 'rockpaperscissors') {
    return <RockPaperScissorsGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'trivia') {
    return <TriviaGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'tictactoe') {
    return <TicTacToeGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'wordguess') {
    return <WordGuessGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'numberguess') {
    return <NumberGuessGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'memory') {
    return <MemoryGame onBack={() => setCurrentGame(null)} />;
  }

  return null;
}

function RockPaperScissorsGame({ onBack }: { onBack: () => void }) {
  const [userChoice, setUserChoice] = useState<'rock' | 'paper' | 'scissors' | null>(null);
  const [result, setResult] = useState<string>('');
  const [scores, setScores] = useState({ user: 0, opponent: 0 });
  const [round, setRound] = useState(1);

  const choices = ['rock', 'paper', 'scissors'] as const;

  const play = (choice: 'rock' | 'paper' | 'scissors') => {
    setUserChoice(choice);
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    if (choice === randomChoice) {
      setResult('It\'s a tie! 🤝');
    } else if (
      (choice === 'rock' && randomChoice === 'scissors') ||
      (choice === 'paper' && randomChoice === 'rock') ||
      (choice === 'scissors' && randomChoice === 'paper')
    ) {
      setResult(`You won this round! 🎉`);
      setScores(s => ({ ...s, user: s.user + 1 }));
    } else {
      setResult(`Opponent won this round! 😅`);
      setScores(s => ({ ...s, opponent: s.opponent + 1 }));
    }

    setTimeout(() => {
      if (round < 3) {
        setRound(r => r + 1);
        setUserChoice(null);
        setResult('');
      }
    }, 2000);
  };

  const gameOver = round > 3;
  const winner = scores.user > scores.opponent ? 'You won!' : scores.opponent > scores.user ? 'Opponent won!' : 'It\'s a tie!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <span>🪨 Rock Paper Scissors</span>
          </h2>
          {!gameOver && <p className="text-white/60">Round {round} of 3</p>}
        </div>

        {!gameOver ? (
          <>
            {/* Score Board */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 backdrop-blur rounded-2xl p-4 text-center border border-blue-400/30">
                <p className="text-sm text-white/60 mb-1">You</p>
                <p className="text-3xl font-bold text-blue-400">{scores.user}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur rounded-2xl p-4 text-center border border-purple-400/30">
                <p className="text-sm text-white/60 mb-1">Opponent</p>
                <p className="text-3xl font-bold text-purple-400">{scores.opponent}</p>
              </div>
            </div>

            {result && (
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 backdrop-blur rounded-2xl p-4 text-center border border-cyan-400/30">
                <p className="font-bold text-lg text-white">{result}</p>
              </div>
            )}

            {!result && (
              <div className="text-center">
                <p className="text-white/60 mb-4 font-semibold">Make your choice:</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['rock', 'paper', 'scissors'] as const).map(choice => (
                    <button
                      key={choice}
                      onClick={() => play(choice)}
                      className={`py-8 rounded-2xl font-bold text-2xl transition-all ${
                        userChoice === choice
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white scale-110'
                          : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-400/50 text-white'
                      }`}
                    >
                      {choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 backdrop-blur rounded-2xl p-6 text-center border border-cyan-400/30 space-y-3">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">{winner}</h3>
              <p className="text-lg text-white/80">Final Score: {scores.user} - {scores.opponent}</p>
            </div>
            <Button onClick={onBack} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold">
              Back to Games
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function TriviaGame({ onBack }: { onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ user: 0, opponent: 0 });
  const [selected, setSelected] = useState<number | null>(null);

  const questions = [
    {
      q: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2,
    },
    {
      q: 'Which planet is largest?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Venus'],
      correct: 1,
    },
    {
      q: 'Who painted the Mona Lisa?',
      options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
      correct: 1,
    },
  ];

  const question = questions[currentQ];
  const gameOver = currentQ >= questions.length;

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    if (idx === question.correct) {
      setScores(s => ({ ...s, user: s.user + 1 }));
    } else {
      setScores(s => ({ ...s, opponent: s.opponent + 1 }));
    }

    setTimeout(() => {
      setCurrentQ(c => c + 1);
      setSelected(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            🧠 Quick Trivia
          </h2>
          {!gameOver && <p className="text-white/60">Question {currentQ + 1} of {questions.length}</p>}
        </div>

        {!gameOver ? (
          <>
            {/* Score Board */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/10 backdrop-blur rounded-2xl p-4 text-center border border-pink-400/30">
                <p className="text-sm text-white/60 mb-1">You</p>
                <p className="text-3xl font-bold text-pink-400">{scores.user}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur rounded-2xl p-4 text-center border border-purple-400/30">
                <p className="text-sm text-white/60 mb-1">Opponent</p>
                <p className="text-3xl font-bold text-purple-400">{scores.opponent}</p>
              </div>
            </div>

            {/* Question */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/20">
              <h3 className="font-bold text-lg text-white mb-6">{question.q}</h3>
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !selected && handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`w-full p-4 rounded-xl font-medium transition-all ${
                      selected === null
                        ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-purple-400/50 text-white'
                        : idx === question.correct
                        ? 'bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/50 text-green-400'
                        : selected === idx
                        ? 'bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/50 text-red-400'
                        : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 opacity-50 text-white'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/10 backdrop-blur rounded-2xl p-6 text-center border border-pink-400/30 space-y-3">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white">
                {scores.user > scores.opponent ? 'You won!' : scores.opponent > scores.user ? 'Opponent won!' : 'It\'s a tie!'}
              </h3>
              <p className="text-lg text-white/80">Final Score: {scores.user} - {scores.opponent}</p>
            </div>
            <Button onClick={onBack} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
              Back to Games
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);
  const gameOver = winner || board.every(cell => cell !== null);

  function calculateWinner(squares: (string | null)[]) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  }

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    const newBoard = [...board];
    newBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">⭕ Tic Tac Toe</h2>
          <p className="text-white/60">{winner ? (winner === 'X' ? 'You won! 🎉' : 'Opponent won! 😅') : gameOver ? 'It\'s a tie! 🤝' : `Current: ${isXNext ? 'You (X)' : 'Opponent (O)'}`}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/20">
          {board.map((cell, idx) => (
            <button key={idx} onClick={() => handleClick(idx)} className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl text-3xl font-bold text-white hover:border-green-400/50 transition-all">
              {cell}
            </button>
          ))}
        </div>

        <Button onClick={onBack} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold">
          Back to Games
        </Button>
      </div>
    </div>
  );
}

function WordGuessGame({ onBack }: { onBack: () => void }) {
  const words = ['JAVASCRIPT', 'TYPESCRIPT', 'PROGRAMMING', 'ALGORITHM', 'FUNCTION', 'VARIABLE', 'DATABASE'];
  const [word] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const maxWrong = 6;
  const isGameOver = wrong >= maxWrong;
  const isWon = word.split('').every(c => guessed.includes(c));

  const handleGuess = (letter: string) => {
    if (guessed.includes(letter)) return;
    setGuessed([...guessed, letter]);
    if (!word.includes(letter)) setWrong(wrong + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">🎤 Guess the Word</h2>
          <p className="text-white/60">Wrong guesses: {wrong}/{maxWrong}</p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/20 text-center space-y-4">
          <div className="text-4xl font-bold text-white tracking-widest">
            {word.split('').map(letter => guessed.includes(letter) ? letter : '_').join(' ')}
          </div>
          {(isGameOver || isWon) && (
            <div className="text-2xl font-bold text-green-400">{isWon ? 'You Won! 🎉' : 'Game Over 😅'}</div>
          )}
        </div>

        {!isGameOver && !isWon && (
          <div className="grid grid-cols-4 gap-2">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
              <button key={letter} onClick={() => handleGuess(letter)} disabled={guessed.includes(letter)} className={`p-2 rounded font-bold text-sm transition-all ${guessed.includes(letter) ? 'bg-gray-700 text-gray-400' : 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-400/30 hover:border-orange-400/70 text-white'}`}>
                {letter}
              </button>
            ))}
          </div>
        )}

        <Button onClick={onBack} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold">
          Back to Games
        </Button>
      </div>
    </div>
  );
}

function NumberGuessGame({ onBack }: { onBack: () => void }) {
  const [target] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  const handleGuess = () => {
    if (guess === null) return;
    setAttempts(attempts + 1);
    if (guess === target) {
      setMessage(`🎉 You got it in ${attempts + 1} attempts!`);
    } else if (guess < target) {
      setMessage('📈 Too low! Try higher');
    } else {
      setMessage('📉 Too high! Try lower');
    }
    setGuess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">🔢 Guess the Number</h2>
          <p className="text-white/60">I'm thinking of a number from 1-100</p>
        </div>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-4">
          <input type="number" min="1" max="100" value={guess || ''} onChange={(e) => setGuess(parseInt(e.target.value))} placeholder="Enter your guess" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400/50" />
          <Button onClick={handleGuess} disabled={guess === null} className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold">
            Guess
          </Button>
          {message && <p className="text-center text-white font-semibold">{message}</p>}
          {attempts > 0 && <p className="text-center text-white/60">Attempts: {attempts}</p>}
        </div>

        <Button onClick={onBack} className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold">
          Back to Games
        </Button>
      </div>
    </div>
  );
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];
  const [cards] = useState(emojis.flatMap(e => [e, e]).sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
      }
      setTimeout(() => setFlipped([]), 600);
    }
  };

  const isWon = matched.length === cards.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">🧩 Memory Game</h2>
          <p className="text-white/60">Match all pairs!</p>
          {isWon && <p className="text-2xl font-bold text-cyan-400">You won! 🎉</p>}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, idx) => (
            <button key={idx} onClick={() => handleCardClick(idx)} className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg text-3xl font-bold hover:border-cyan-400/50 transition-all" disabled={matched.includes(idx)}>
              {flipped.includes(idx) || matched.includes(idx) ? card : '?'}
            </button>
          ))}
        </div>

        <Button onClick={onBack} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold">
          Back to Games
        </Button>
      </div>
    </div>
  );
}
