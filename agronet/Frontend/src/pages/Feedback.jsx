import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;
        setSubmitted(true);
        setTimeout(() => {
            setFeedback('');
            setSubmitted(false);
        }, 3000);
    };

    return (
        <div className="bg-[#F9FAFB] min-h-screen text-slate-800 antialiased pt-8 md:pt-14 px-4 md:px-10 lg:px-12 w-full max-w-3xl mx-auto pb-32">
            <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                    Feedback
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                    We'd love to hear your thoughts on how we can improve AgroNet.
                </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <Send size={28} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Thank you!</h3>
                        <p className="text-slate-500 text-sm max-w-sm">Your feedback has been submitted successfully. We appreciate your input!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">How can we improve?</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your suggestions, feature requests, or report any bugs..."
                                rows={6}
                                className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                type="submit"
                                disabled={!feedback.trim()}
                                className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Send size={16} />
                                Send Feedback
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
