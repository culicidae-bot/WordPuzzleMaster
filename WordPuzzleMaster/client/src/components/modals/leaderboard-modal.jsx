var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
export function LeaderboardModal({ open, onClose }) {
    const { toast } = useToast();
    const [view, setView] = useState("global");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (open) {
            fetchLeaderboard(view);
        }
    }, [open, view]);
    const fetchLeaderboard = (type) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        try {
            const endpoint = type === "weekly"
                ? "/api/leaderboard/weekly"
                : "/api/leaderboard";
            const response = yield apiRequest("GET", endpoint);
            const data = yield response.json();
            setEntries(data);
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to load leaderboard data.",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    });
    return (<Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card/90 border-accent/80 border-4 p-6 m-4 max-w-3xl w-full relative magic-star-bg">
        <div className="flex flex-row items-center justify-between gap-4">
          {/* Left Logo (ISU) */}
          <div className="hidden md:flex items-center justify-center w-28 h-28">
            <img src="/attached_assets/isu-logo.png" alt="ISU Logo" className="logo-glow border-4 border-green-600 shadow-green-400" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}/>
          </div>
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row gap-6">
            {/* Player Summary Card */}
            <div className="bg-background/80 rounded-2xl shadow-lg p-6 flex flex-col items-center min-w-[220px] max-w-xs w-full border-2 border-accent/60">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-3">
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#4cc9f0" opacity="0.2"/><path d="M24 26c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7 3.582 7 8 7Zm0 2c-5.33 0-16 2.686-16 8v4h32v-4c0-5.314-10.67-8-16-8Z" fill="#4361ee"/></svg>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">Player</div>
                <div className="text-xs text-muted-foreground mb-2">Time: 00:03:36</div>
                <div className="text-xs text-muted-foreground mb-2">Score: 4500pt</div>
                <div className="text-xs text-muted-foreground mb-2">Words: 29</div>
                <div className="text-xs text-muted-foreground">Accuracy: 77%</div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="flex-1 overflow-x-auto">
              <div className="bg-background/80 rounded-2xl shadow-lg p-4 border-2 border-accent/60">
                <div className="flex items-center border-b border-accent/40 pb-2 mb-2">
                  <div className="w-12 text-accent font-bold text-center">Rank</div>
                  <div className="flex-1 text-accent font-bold">Name</div>
                  <div className="w-20 text-accent font-bold text-center">Score</div>
                  <div className="w-20 text-accent font-bold text-center">Words</div>
                </div>
                <div className="divide-y divide-accent/20">
                  {entries.length === 0 ? (<div className="text-center py-8 text-muted-foreground">No entries found</div>) : (entries.map((entry, index) => (<div key={entry.id} className="flex items-center py-2">
                        <div className="w-12 text-center font-bold text-lg text-white/90">{String(index + 1).padStart(2, '0')}</div>
                        <div className="flex-1 font-medium text-white/90">Player #{entry.userId}</div>
                        <div className="w-20 text-center font-bold text-yellow-300">{entry.score}</div>
                        <div className="w-20 text-center font-bold text-accent">{entry.wordsFound ? entry.wordsFound.length : 0}</div>
                      </div>)))}
                </div>
              </div>
            </div>
          </div>
          {/* Right Logo (ICT) */}
          <div className="hidden md:flex items-center justify-center w-28 h-28">
            <img src="/attached_assets/ict-logo.png" alt="ICT Logo" className="logo-glow border-4 border-yellow-400 shadow-yellow-300" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}/>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Button className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-8 rounded-full magic-btn text-lg shadow-lg">
            Play Again
          </Button>
          <Button variant="outline" className="bg-card hover:bg-background/80 text-white font-bold py-2 px-8 rounded-full magic-btn text-lg shadow-lg">
            Main Menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>);
}
/*
  CSS for glowing effect and magical star background has been removed from this file.
  Please move the following CSS to your global stylesheet (e.g., index.css or App.css):

  .logo-glow {
    box-shadow: 0 0 24px 8px rgba(34,197,94,0.6), 0 0 0 6px rgba(255,255,255,0.2) inset;
    transition: box-shadow 0.3s;
  }
  .logo-glow.border-yellow-400 {
    box-shadow: 0 0 24px 8px rgba(251,191,36,0.7), 0 0 0 6px rgba(255,255,255,0.2) inset;
  }
  .magic-star-bg {
    position: relative;
    overflow: hidden;
  }
  .magic-star-bg::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    background: repeating-radial-gradient(circle at 20% 30%, #fff8, #fff0 10px),
                repeating-radial-gradient(circle at 80% 70%, #fff6, #fff0 12px),
                repeating-radial-gradient(circle at 50% 50%, #fff4, #fff0 8px);
    z-index: 0;
    animation: star-twinkle 3s infinite linear;
  }
  @keyframes star-twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
*/
