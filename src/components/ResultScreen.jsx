import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MapPin, RotateCcw, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultScreen = ({ topLunches, scores, onReset }) => {
    const [winner, setWinner] = useState(null);
    const [otherRanks, setOtherRanks] = useState([]);

    useEffect(() => {
        // Calculate final rankings based on total scores
        const finalRankings = [...topLunches].map(lunch => ({
            ...lunch,
            finalScore: scores[lunch.id]
        })).sort((a, b) => b.finalScore - a.finalScore);

        setWinner(finalRankings[0]);
        setOtherRanks(finalRankings.slice(1));

        // Fire confetti sequence
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FF7A00', '#FFC900', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FF7A00', '#FFC900', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, [topLunches, scores]);

    const handleOpenMap = () => {
        if (!winner) return;
        const query = encodeURIComponent(`近くの ${winner.name}`);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(mapUrl, '_blank');
    };

    if (!winner) return null;

    return (
        <div className="flex flex-col w-full h-full px-4 pt-12 pb-8 max-w-md mx-auto items-center overflow-y-auto no-scrollbar relative min-h-screen">

            {/* Title */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="text-center mb-8 relative z-10"
            >
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                    今日のランチは<br />これに決定！
                </h1>
            </motion.div>

            {/* Winner Card */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.4 }}
                className="w-full bg-white rounded-[2rem] shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-6 mb-10 relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-teal-50/30 rounded-[2rem] pointer-events-none"></div>
                <div className="p-6 text-center flex flex-col items-center justify-center relative z-10">
                    <div className="text-[120px] mb-4 drop-shadow-xl animate-bounce">
                        {winner.icon}
                    </div>
                    <div className="text-3xl text-slate-700 font-extrabold mb-3 px-2 whitespace-pre-wrap tracking-tight">
                        {winner.name}
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full flex-col space-y-4 shrink-0 z-20 flex"
            >
                <button
                    onClick={handleOpenMap}
                    className="group relative inline-flex items-center justify-center w-full px-8 py-5 text-xl font-bold text-white transition-all bg-teal-500 rounded-full shadow-[0_8px_30px_rgb(20,184,166,0.25)] active:bg-teal-600 active:scale-[0.98]"
                >
                    <MapPin className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                    近くのお店を探す
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full flex justify-center mb-6 mt-4 shrink-0 z-20"
            >
                <button
                    onClick={onReset}
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-bold text-slate-500 bg-transparent rounded-full hover:bg-slate-100 transition-all active:scale-95"
                >
                    最初からやり直す
                </button>
            </motion.div>

            {/* Other Rankings */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="w-full pb-8 z-10"
            >
                <h3 className="text-center font-bold text-slate-400 mb-4 text-sm tracking-widest">その他の最終結果</h3>
                <div className="space-y-3">
                    {otherRanks.map((lunch, index) => (
                        <div key={lunch.id} className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-4 rounded-3xl shadow-sm border border-slate-100/50">
                            <div className="flex items-center">
                                <span className="w-6 text-center text-slate-400 font-bold text-sm mr-2">{index + 2}</span>
                                <span className="text-2xl mr-3">{lunch.icon}</span>
                                <span className="font-bold text-slate-600">{lunch.name}</span>
                            </div>
                            <span className="text-sm font-bold text-teal-600 bg-teal-50 py-1.5 px-4 rounded-full border border-teal-100">{lunch.finalScore}pt</span>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
};

export default ResultScreen;
