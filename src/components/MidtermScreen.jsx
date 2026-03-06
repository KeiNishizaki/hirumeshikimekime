import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Trophy } from 'lucide-react';

const MidtermScreen = ({ topLunches, onNext }) => {
    return (
        <div className="flex flex-col items-center justify-between w-full h-full p-6 text-center bg-slate-50">

            <div className="w-full mt-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center bg-white px-6 py-2.5 rounded-full mb-6 shadow-sm font-bold text-teal-600 border border-teal-100"
                >
                    <Trophy className="w-5 h-5 mr-2" />
                    1次審査 通過メニュー
                </motion.div>
                <h2 className="text-3xl font-black text-slate-700 tracking-tight leading-tight">
                    みんなの「あり」が<br />多かった上位5つ！
                </h2>
            </div>

            <div className="flex-1 w-full max-w-sm mt-8 relative">
                <ul className="space-y-4 w-full">
                    {topLunches.map((lunch, index) => (
                        <motion.li
                            key={lunch.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.15, type: "spring" }}
                            className="flex items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-100"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-500 mr-4 shrink-0 shadow-sm border border-slate-100">
                                {index + 1}
                            </div>
                            <div className="text-4xl mr-4 drop-shadow-sm">{lunch.icon}</div>
                            <div className="text-left flex-1">
                                <h3 className="font-bold text-lg text-slate-700">{lunch.name}</h3>
                                <div className="text-sm font-medium text-slate-400">
                                    {lunch.score} あり
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>

            <div className="w-full max-w-sm mb-6 mt-4">
                <div className="text-sm font-bold text-slate-500 mb-6 bg-white/60 backdrop-blur-sm py-4 rounded-2xl border border-slate-200 shadow-sm">
                    次は各自の「食べたい順」に並び替えます
                </div>
                <button
                    onClick={onNext}
                    className="group relative inline-flex items-center justify-center w-full px-8 py-5 text-xl font-bold text-white transition-all bg-rose-400 rounded-full shadow-[0_8px_30px_rgb(251,113,133,0.3)] hover:bg-rose-500 hover:-translate-y-0.5"
                >
                    最終審査（並び替え）へ
                    <ChevronRight className="w-6 h-6 ml-2" />
                </button>
            </div>

        </div>
    );
};

export default MidtermScreen;
