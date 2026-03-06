import React, { useState } from 'react';
import { Users } from 'lucide-react';

const StartScreen = ({ onStart }) => {
    const [participants, setParticipants] = useState(2);

    const handleStart = () => {
        onStart(participants);
    };

    return (
        <div className="flex flex-col items-center w-full flex-1 pb-32">
            {/* Main Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm px-6 py-10">
                {/* Logo/Title Area */}
                <div className="mb-12 text-center flex flex-col items-center mt-12">
                    <img src="/icon.png" alt="HirumeshiKimeKime Icon" className="w-36 h-36 md:w-44 md:h-44 mb-6 drop-shadow-md" />
                    <h1 className="text-4xl font-black text-slate-700 tracking-tight leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Hirumeshi<br />KimeKime
                    </h1>
                    <p className="mt-5 text-slate-400 font-bold text-sm tracking-wide">くだらないことで、くだらない</p>
                </div>

                {/* Input Area */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full mb-8 relative">
                    <label className="flex items-center justify-center text-slate-700 font-bold mb-8 text-lg">
                        <Users className="w-5 h-5 mr-2 text-rose-400" />
                        ランチに行く人数
                    </label>

                    <div className="flex items-center justify-center space-x-8 mb-2">
                        <button
                            onClick={() => setParticipants(p => Math.max(2, p - 1))}
                            className="w-14 h-14 rounded-full bg-slate-50 text-slate-500 text-2xl font-medium flex items-center justify-center active:bg-slate-100 active:scale-95 transition-all shadow-sm"
                        >
                            -
                        </button>

                        <div className="text-5xl font-black w-20 text-center text-slate-700 tabular-nums">
                            {participants}
                        </div>

                        <button
                            onClick={() => setParticipants(p => Math.min(10, p + 1))}
                            className="w-14 h-14 rounded-full bg-slate-50 text-slate-500 text-2xl font-medium flex items-center justify-center active:bg-slate-100 active:scale-95 transition-all shadow-sm"
                        >
                            +
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Fixed Area for Start Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 flex justify-center pointer-events-none bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent">
                <div className="w-full max-w-sm pointer-events-auto">
                    <button
                        onClick={handleStart}
                        className="group relative flex items-center justify-center w-full px-8 py-5 text-xl font-bold text-white transition-all bg-rose-400 rounded-full shadow-[0_8px_30px_rgb(251,113,133,0.3)] active:bg-rose-500 active:scale-[0.98]"
                    >
                        スタート！
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
