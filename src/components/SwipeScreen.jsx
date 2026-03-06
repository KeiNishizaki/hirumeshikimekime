import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { LUNCH_OPTIONS } from '../data/lunches';
import { Clock, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const ROUND_TIME_SECONDS = 60;

const SwipeScreen = ({ currentPlayer, totalParticipants, onRoundComplete }) => {
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
    const [lunches, setLunches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [roundScores, setRoundScores] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [showNextPlayerPrompt, setShowNextPlayerPrompt] = useState(false);

    const controls = useAnimation();
    const x = useMotionValue(0);

    // Transform x position to rotation and opacity for swipe effect
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color indicators for swipe direction
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

    useEffect(() => {
        // Shuffle lunches and reset state when component mounts or player changes
        const shuffled = [...LUNCH_OPTIONS].sort(() => 0.5 - Math.random());
        setLunches(shuffled);
        setCurrentIndex(0);
        setRoundScores({});
        setIsFinished(false);
        setShowNextPlayerPrompt(false);
        setTimeLeft(ROUND_TIME_SECONDS);
    }, [currentPlayer]);

    useEffect(() => {
        // Timer logic
        if (isFinished || showNextPlayerPrompt) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishRound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished, showNextPlayerPrompt]);

    const handleVote = async (isLike) => {
        if (isFinished || currentIndex >= lunches.length) return;

        const currentLunch = lunches[currentIndex];

        // Record vote
        setRoundScores(prev => ({
            ...prev,
            [currentLunch.id]: isLike ? 1 : 0
        }));

        // Trigger visual animation if button was clicked (not dragged)
        if (x.get() === 0) {
            await controls.start({
                x: isLike ? 300 : -300,
                opacity: 0,
                transition: { duration: 0.3 }
            });
        }

        // Move to next card
        if (currentIndex < lunches.length - 1) {
            setCurrentIndex(prev => prev + 1);
            // Reset card position instantly
            controls.set({ x: 0, opacity: 1 });
            x.set(0);
        } else {
            finishRound();
        }
    };

    const finishRound = () => {
        setIsFinished(true);
        setShowNextPlayerPrompt(true);
    };

    const handleNextPlayer = () => {
        onRoundComplete(roundScores);
    };

    const handleDragEnd = (_, info) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            handleVote(true); // Swiped right (Like)
        } else if (info.offset.x < -threshold) {
            handleVote(false); // Swiped left (Nope)
        } else {
            // Return to center
            controls.start({ x: 0, transition: { type: "spring", bounce: 0.5 } });
        }
    };

    // --- Render Next Player Prompt ---
    if (showNextPlayerPrompt) {
        const isLastPlayer = currentPlayer === totalParticipants;
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full bg-pink-50 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-slate-100">
                    <h2 className="text-3xl font-black text-slate-700 mb-6 tracking-tight">
                        {isLastPlayer ? "全員お疲れ様！" : `${currentPlayer}人目完了！`}
                    </h2>
                    <p className="text-lg text-slate-500 mb-8 font-bold">
                        {isLastPlayer ? "いよいよ結果を表示します" : "次の人にスマホを渡してね"}
                    </p>
                    <button
                        onClick={handleNextPlayer}
                        className="w-full py-4 text-xl font-bold text-white bg-rose-400 rounded-full shadow-md shadow-rose-200/50 hover:bg-rose-500 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center"
                    >
                        {isLastPlayer ? "中間発表へ" : "スマホを受け取った"}
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    // --- Render Main Swiping UI ---
    const currentLunch = lunches[currentIndex];

    // Progress calculations
    const progressPercent = ((currentPlayer - 1) / totalParticipants) * 100;

    return (
        <div className="flex flex-col w-full flex-1 pb-8 pt-4 px-4 max-w-md mx-auto relative isolate">
            {/* Header Info */}
            <div className="flex justify-between items-center mb-4 z-10 w-full px-2">
                <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full font-bold shadow-sm text-slate-600 flex items-center border border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 mr-2"></span>
                    {currentPlayer} / {totalParticipants} 人目
                </div>

                <div className={clsx(
                    "bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full font-bold shadow-sm flex items-center border",
                    timeLeft <= 10 ? "text-rose-500 border-rose-200 animate-pulse shadow-rose-100" : "text-slate-600 border-slate-100"
                )}>
                    <Clock className="w-4 h-4 mr-2" />
                    00:{timeLeft.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Main Progress Bar (Overall) */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 relative overflow-hidden shrink-0 z-10">
                <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-teal-400"
                    initial={{ width: `${progressPercent}%` }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Card Swipe Area */}
            <div className="flex-1 relative w-full flex items-center justify-center my-2 min-h-[250px] z-20">
                <AnimatePresence>
                    {currentLunch && !isFinished && (
                        <motion.div
                            key={currentLunch.id}
                            className="absolute w-[90%] h-[95%] max-w-[320px] max-h-[420px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 border border-slate-100 cursor-grab active:cursor-grabbing origin-bottom"
                            style={{ x, rotate, opacity }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.8}
                            onDragEnd={handleDragEnd}
                            animate={controls}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Like / Nope Indicators Overlay */}
                            <motion.div
                                className="absolute top-8 right-8 border-[3px] border-rose-400 text-rose-400 text-3xl font-black py-2 px-6 rounded-2xl rotate-12 z-10 uppercase tracking-widest bg-white/50 backdrop-blur-md"
                                style={{ opacity: likeOpacity }}
                            >
                                あり
                            </motion.div>
                            <motion.div
                                className="absolute top-8 left-8 border-[3px] border-slate-400 text-slate-500 text-3xl font-black py-2 px-6 rounded-2xl -rotate-12 z-10 uppercase tracking-widest bg-white/50 backdrop-blur-md"
                                style={{ opacity: nopeOpacity }}
                            >
                                なし
                            </motion.div>

                            <div className="text-[120px] mb-8 select-none filter drop-shadow-sm transition-transform duration-300 transform hover:scale-105">
                                {currentLunch.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-700 text-center uppercase tracking-tight">
                                {currentLunch.name}
                            </h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stack effect base card */}
                {currentIndex < lunches.length - 1 && !isFinished && (
                    <div className="absolute w-[85%] h-[90%] max-w-[300px] max-h-[400px] bg-white rounded-[2.5rem] shadow-md border border-slate-100 translate-y-4 scale-95 opacity-50 -z-10 flex flex-col items-center justify-center">
                        <div className="text-8xl opacity-20 blur-[2px]">{lunches[currentIndex + 1]?.icon}</div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center space-x-16 h-28 shrink-0 z-30 pb-6 w-full">
                <button
                    onClick={() => handleVote(false)}
                    className="w-20 h-20 rounded-full bg-slate-100 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 border border-slate-200"
                    aria-label="Bad"
                >
                    <ThumbsDown className="w-8 h-8" />
                </button>
                <button
                    onClick={() => handleVote(true)}
                    className="w-20 h-20 rounded-full bg-rose-400 shadow-[0_8px_30px_rgb(251,113,133,0.3)] flex items-center justify-center text-white hover:bg-rose-500 transition-all hover:scale-105 active:scale-95"
                    aria-label="Good"
                >
                    <ThumbsUp className="w-8 h-8" fill="currentColor" />
                </button>
            </div>
        </div>
    );
};

export default SwipeScreen;
