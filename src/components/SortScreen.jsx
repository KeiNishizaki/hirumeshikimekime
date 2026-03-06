import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, CheckCircle2 } from 'lucide-react';

const SortScreen = ({ topLunches, currentPlayer, totalParticipants, onRoundComplete }) => {
    const [items, setItems] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [showNextPlayerPrompt, setShowNextPlayerPrompt] = useState(false);

    useEffect(() => {
        // Initialize items with current top lunches for the new player
        setItems([...topLunches]);
        setIsFinished(false);
        setShowNextPlayerPrompt(false);
    }, [currentPlayer, topLunches]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destIndex = result.destination.index;

        const newItems = Array.from(items);
        const [reorderedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(destIndex, 0, reorderedItem);

        setItems(newItems);
    };

    const handleFinishSort = () => {
        setIsFinished(true);
        setShowNextPlayerPrompt(true);
    };

    const handleNextPlayer = () => {
        onRoundComplete(items); // Pass the sorted items back
    };

    // --- Render Next Player Prompt ---
    if (showNextPlayerPrompt) {
        const isLastPlayer = currentPlayer === totalParticipants;
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center w-full h-full bg-slate-50 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-sm w-full border border-slate-100">
                    <h2 className="text-3xl font-black text-slate-700 mb-6 tracking-tight">
                        {isLastPlayer ? "全員お疲れ様！" : `${currentPlayer}人目完了！`}
                    </h2>
                    <p className="text-lg text-slate-500 mb-8 font-bold">
                        {isLastPlayer ? "いよいよ結果を発表します..." : "次の人にスマホを渡してね"}
                    </p>
                    <button
                        onClick={handleNextPlayer}
                        className="w-full py-5 text-xl font-bold text-white bg-rose-400 rounded-full shadow-[0_8px_30px_rgb(251,113,133,0.3)] active:bg-rose-500 transition-all font-sans"
                    >
                        {isLastPlayer ? "結果発表へ！" : "スマホを受け取った"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full pb-8 pt-4 px-4 max-w-md mx-auto">
            {/* Header Info */}
            <div className="flex justify-between items-center mb-6 z-10 w-full px-2">
                <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full font-bold shadow-sm text-slate-600 flex items-center border border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 mr-2"></span>
                    {currentPlayer} / {totalParticipants} 人目
                </div>

                <div className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                    最終審査
                </div>
            </div>

            <div className="text-center mb-6 px-4">
                <h2 className="text-2xl font-black text-slate-700 tracking-tight leading-tight mb-2">
                    食べたい順に並び替えて！
                </h2>
                <p className="text-sm text-slate-400 font-bold">
                    リストをドラッグして、1位（上）から並び替えます
                </p>
            </div>

            {/* Draggable List */}
            <div className="flex-1 w-full relative z-20">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="lunch-list">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-3 w-full"
                            >
                                {items.map((item, index) => (
                                    <Draggable key={`item-${item.id}`} draggableId={`item-${item.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`
                          flex items-center p-4 rounded-3xl border transition-all duration-200 select-none
                          ${snapshot.isDragging ? 'bg-white shadow-xl border-slate-200 scale-[1.02] z-50' : 'bg-white shadow-sm border-slate-100'}
                        `}
                                            >
                                                <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-black mr-4 shrink-0 
                          ${index === 0 ? 'bg-rose-50 text-rose-500 border border-rose-100 text-lg' :
                                                        index === 1 ? 'bg-slate-50 text-slate-500 border border-slate-100 text-base' :
                                                            index === 2 ? 'bg-slate-50 text-slate-400 border border-slate-50 text-base' :
                                                                'bg-transparent text-slate-300'}
                        `}>
                                                    {index + 1}
                                                </div>

                                                <div className="text-4xl mr-4">{item.icon}</div>

                                                <div className="text-left flex-1 font-bold text-lg text-slate-700">
                                                    {item.name}
                                                </div>

                                                <div className="text-slate-200 ml-2 active:text-slate-400 transition-colors">
                                                    <GripVertical className="w-6 h-6" />
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Done Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 flex justify-center pointer-events-none bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-30">
                <div className="w-full max-w-sm pointer-events-auto">
                    <button
                        onClick={handleFinishSort}
                        className="group relative flex items-center justify-center w-full px-8 py-5 text-xl font-bold text-white transition-all bg-rose-400 rounded-full shadow-[0_8px_30px_rgb(251,113,133,0.3)] active:bg-rose-500 active:scale-[0.98]"
                    >
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        この順番でOK！
                    </button>
                </div>
            </div>
        </div >
    );
};

export default SortScreen;
