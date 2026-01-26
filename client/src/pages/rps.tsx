import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Camera, Upload, RotateCcw, Trophy, X, Minus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/hooks/use-toast";
import { AdBanner } from "@/components/ad-banner";

declare global {
  interface Window {
    tf: any;
    tmImage: any;
  }
}

const URL_MODEL = "https://teachablemachine.withgoogle.com/models/_YVCVfRuR/";

const EMOJI_MAP: Record<string, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
  unknown: "❓"
};

export default function RPS() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'webcam' | 'image'>('webcam');
  const [prediction, setPrediction] = useState("-");
  const [computerMove, setComputerMove] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [scores, setScores] = useState({ win: 0, lose: 0, draw: 0 });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const webcamRef = useRef<any>(null);
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const modelRef = useRef<any>(null);
  const maxPredictionsRef = useRef<number>(0);

  // Load Scripts & Init Model
  useEffect(() => {
    const loadScripts = async () => {
      try {
        if (!window.tf) {
          await new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
            s.onload = resolve;
            document.head.appendChild(s);
          });
        }
        if (!window.tmImage) {
          await new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
            s.onload = resolve;
            document.head.appendChild(s);
          });
        }
        await initModel();
      } catch (error) {
        console.error("Failed to load scripts", error);
        toast({ title: "Error", description: "Failed to load AI model scripts.", variant: "destructive" });
      }
    };
    loadScripts();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const initModel = async () => {
    const modelURL = URL_MODEL + "model.json";
    const metadataURL = URL_MODEL + "metadata.json";

    try {
      modelRef.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictionsRef.current = modelRef.current.getTotalClasses();

      // Setup Webcam
      const flip = true; 
      webcamRef.current = new window.tmImage.Webcam(200, 200, flip); 
      await webcamRef.current.setup(); 
      await webcamRef.current.play();
      
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        webcamContainerRef.current.appendChild(webcamRef.current.canvas);
      }

      setIsModelLoaded(true);
      loop();
    } catch (error) {
      console.error("Error loading model:", error);
      toast({ title: "Error", description: "Failed to access webcam or load model.", variant: "destructive" });
    }
  };

  const loop = () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      if (mode === 'webcam' && !isPlaying) {
        predictWebcam();
      }
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  const normalizeClass = (className: string) => {
    const lower = className.toLowerCase();
    const CLASS_ROCK = ["Rock", "rock", "bawi", "stone", "주먹", "바위"];
    const CLASS_PAPER = ["Paper", "paper", "bo", "hand", "보", "보자기"];
    const CLASS_SCISSORS = ["Scissors", "scissors", "gawi", "scissor", "가위"];

    if (CLASS_ROCK.some(k => lower.includes(k.toLowerCase()))) return "rock";
    if (CLASS_PAPER.some(k => lower.includes(k.toLowerCase()))) return "paper";
    if (CLASS_SCISSORS.some(k => lower.includes(k.toLowerCase()))) return "scissors";
    return "unknown"; 
  };

  const predictWebcam = async () => {
    if (!modelRef.current || !webcamRef.current) return;
    const prediction = await modelRef.current.predict(webcamRef.current.canvas);
    updatePredictionDisplay(prediction);
  };

  const predictImage = async (imageElement: HTMLImageElement) => {
    if (!modelRef.current) return;
    const prediction = await modelRef.current.predict(imageElement);
    updatePredictionDisplay(prediction);
  };

  const updatePredictionDisplay = (prediction: any[]) => {
    let maxProb = 0;
    let bestClass = "";
    for (let i = 0; i < maxPredictionsRef.current; i++) {
      if (prediction[i].probability > maxProb) {
        maxProb = prediction[i].probability;
        bestClass = prediction[i].className;
      }
    }
    const normalized = normalizeClass(bestClass);
    if (!isPlaying) {
        setPrediction(`${bestClass} (${(maxProb * 100).toFixed(0)}%)`);
    }
    return normalized;
  };

  const getPredictionResult = async () => {
    if (!modelRef.current) return "unknown";
    let prediction;
    if (mode === 'webcam' && webcamRef.current) {
      prediction = await modelRef.current.predict(webcamRef.current.canvas);
    } else if (mode === 'image' && uploadedImage) {
      const img = document.getElementById('preview-img') as HTMLImageElement;
      if (img) prediction = await modelRef.current.predict(img);
    }
    
    if (!prediction) return "unknown";

    let maxProb = 0;
    let bestClass = "";
    for (let i = 0; i < maxPredictionsRef.current; i++) {
      if (prediction[i].probability > maxProb) {
        maxProb = prediction[i].probability;
        bestClass = prediction[i].className;
      }
    }
    return normalizeClass(bestClass);
  };

  const handleStartGame = () => {
    if (isPlaying) return;
    if (mode === 'image' && !uploadedImage) {
      toast({ title: "Image Required", description: "Please upload an image first.", variant: "destructive" });
      return;
    }

    setIsPlaying(true);
    setComputerMove(null);
    setResultMessage("");
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          finishGame();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const finishGame = async () => {
    const userMove = await getPredictionResult();
    
    // Computer Move
    const moves = ['rock', 'paper', 'scissors'];
    const compMove = moves[Math.floor(Math.random() * moves.length)];
    setComputerMove(compMove);

    // Determine Winner
    let result = 'draw';
    if (userMove === 'unknown') {
      setResultMessage(t('rps_unknown'));
    } else if (userMove === compMove) {
      result = 'draw';
      setResultMessage(t('rps_draw'));
      setScores(s => ({ ...s, draw: s.draw + 1 }));
    } else if (
      (userMove === 'rock' && compMove === 'scissors') ||
      (userMove === 'paper' && compMove === 'rock') ||
      (userMove === 'scissors' && compMove === 'paper')
    ) {
      result = 'win';
      setResultMessage(t('rps_win'));
      setScores(s => ({ ...s, win: s.win + 1 }));
    } else {
      result = 'lose';
      setResultMessage(t('rps_lose'));
      setScores(s => ({ ...s, lose: s.lose + 1 }));
    }
    
    setIsPlaying(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setTimeout(() => {
            const img = document.getElementById('preview-img') as HTMLImageElement;
            if (img) predictImage(img);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 relative overflow-hidden">
      <Helmet>
        <title>{language === "en" ? "Rock Paper Scissors - Lunch Picker" : "가위바위보 게임 - 오늘뭐먹지?"}</title>
        <meta name="description" content={language === "en" ? "Play Rock Paper Scissors with AI using your camera!" : "카메라를 이용해 AI와 가위바위보 대결을 펼쳐보세요! 점심 내기 게임으로 딱입니다."} />
        <link rel="canonical" href="https://product-builder-10l.pages.dev/rps" />
      </Helmet>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 pt-4 px-2">
          <Link href="/">
            <button className="flex items-center gap-2 text-foreground hover:text-primary transition-all group py-2 px-3 -ml-3 rounded-lg hover:bg-primary/5">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform stroke-[2.5px]" />
              <span className="text-base font-bold tracking-tight">{t('rps_back')}</span>
            </button>
          </Link>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLanguage(language === 'en' ? 'ko' : 'en')}
              className="rounded-full hover:bg-accent border border-border/50 font-bold text-xs"
            >
              {language === 'en' ? 'EN' : 'KO'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-accent border border-border/50"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </Button>
          </div>
        </header>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {t('rps_title')}
          </h1>
          <p className="text-muted-foreground">{t('rps_desc')}</p>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Side */}
          <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">You</h2>
              
              <div className="flex bg-muted rounded-full p-1 mb-4 w-full">
                <button 
                  className={`flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all ${mode === 'webcam' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-background/50'}`}
                  onClick={() => setMode('webcam')}
                >
                  <Camera className="w-4 h-4 inline mr-1" /> {t('rps_webcam')}
                </button>
                <button 
                  className={`flex-1 py-1 px-3 rounded-full text-sm font-medium transition-all ${mode === 'image' ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-background/50'}`}
                  onClick={() => setMode('image')}
                >
                  <Upload className="w-4 h-4 inline mr-1" /> {t('rps_image')}
                </button>
              </div>

              <div className="relative w-48 h-48 bg-black rounded-xl overflow-hidden mb-4 shadow-inner flex items-center justify-center">
                <div 
                  ref={webcamContainerRef} 
                  className={`${mode === 'webcam' ? 'block' : 'hidden'} w-full h-full`}
                />
                
                {mode === 'image' && (
                  <div className="w-full h-full relative group cursor-pointer" onClick={() => document.getElementById('img-upload')?.click()}>
                    {uploadedImage ? (
                      <img id="preview-img" src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-xs">{t('rps_click_upload')}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold">{t('rps_click_upload')}</span>
                    </div>
                    <input 
                      type="file" 
                      id="img-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                )}

                {!isModelLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              <div className="bg-muted px-4 py-2 rounded-lg font-mono text-sm w-full text-center">
                {prediction}
              </div>
            </CardContent>
          </Card>

          {/* Computer Side */}
          <Card className="bg-card/50 backdrop-blur border-primary/20 shadow-lg">
            <CardContent className="p-4 flex flex-col items-center h-full justify-between">
              <h2 className="text-xl font-bold mb-4">AI</h2>
              
              <div className="w-48 h-48 flex items-center justify-center text-8xl bg-muted/20 rounded-xl mb-4">
                {computerMove ? EMOJI_MAP[computerMove] : "🤖"}
              </div>

              <div className="bg-muted px-4 py-2 rounded-lg font-mono text-sm w-full text-center">
                {computerMove ? computerMove.toUpperCase() : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Result */}
        <div className="text-center mb-8">
          <div className="h-16 flex items-center justify-center mb-4">
            {countdown ? (
              <span className="text-5xl font-black text-primary animate-ping">{countdown}</span>
            ) : resultMessage ? (
              <span className="text-2xl font-bold animate-bounce">{resultMessage}</span>
            ) : (
              <span className="text-muted-foreground">{t('rps_ready')}</span>
            )}
          </div>

          <Button 
            size="lg" 
            className="w-full md:w-auto min-w-[200px] h-14 text-lg font-bold shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-none"
            onClick={handleStartGame}
            disabled={!isModelLoaded || isPlaying}
          >
            {isPlaying ? "Playing..." : t('rps_start')}
          </Button>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-green-600 dark:text-green-400 font-bold mb-1">{t('rps_score_win')}</div>
            <div className="text-3xl font-black">{scores.win}</div>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-4 text-center">
            <div className="text-gray-600 dark:text-gray-400 font-bold mb-1">{t('rps_score_draw')}</div>
            <div className="text-3xl font-black">{scores.draw}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-red-600 dark:text-red-400 font-bold mb-1">{t('rps_score_lose')}</div>
            <div className="text-3xl font-black">{scores.lose}</div>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6 text-sm text-muted-foreground">
          <section className="bg-card/30 p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-2">{t('rps_how_it_works')}</h3>
            <p className="leading-relaxed">{t('rps_how_it_works_desc')}</p>
          </section>
          <section className="bg-card/30 p-6 rounded-xl border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-2">{t('rps_psychology')}</h3>
            <p className="leading-relaxed">{t('rps_psychology_desc')}</p>
          </section>
        </div>

        <div className="my-8">
          <AdBanner />
        </div>

        {/* Detailed RPS Info for AdSense/SEO */}
        <section className="mt-12 space-y-8 max-w-none prose dark:prose-invert">
          <article className="bg-card/20 p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-foreground mb-4">가위바위보의 역사와 유래</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              가위바위보는 전 세계적으로 가장 널리 알려진 손 게임 중 하나입니다. 
              그 기원은 중국의 한나라 시대로 거슬러 올라가며, 당시에는 '수석충(수박, 돌, 벌레)'과 같은 형태로 불렸다고 합니다. 
              이후 일본으로 전해져 '가위바위보(Jan-Ken-Pon)' 형태로 발전하였고, 19세기 서양으로 전파되면서 
              오늘날 우리가 아는 Rock-Paper-Scissors가 되었습니다.
            </p>
          </article>

          <article className="bg-card/20 p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-foreground mb-4">필승 전략 가이드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-bold text-foreground mb-2">1. 승리한 사람은 같은 것을 낸다</h3>
                <p>
                  심리학 연구에 따르면, 가위바위보에서 이긴 사람은 무의식적으로 
                  자신에게 승리를 안겨준 손 모양을 다시 낼 확률이 높습니다. 
                  상대가 방금 '바위'로 이겼다면, 다음 판에 '보'를 내보세요.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">2. 진 사람은 바꾼다</h3>
                <p>
                  반대로 게임에서 진 사람은 본능적으로 다른 것을 내려 합니다. 
                  이때 순서는 보통 가위 → 바위 → 보 순서로 가는 경향이 있다는 '반시계 방향 법칙'을 기억하세요.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
