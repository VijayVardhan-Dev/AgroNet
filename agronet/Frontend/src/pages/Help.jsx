import React from 'react';
import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

const Help = () => {
    return (
        <div className="bg-[#F9FAFB] min-h-screen text-slate-800 antialiased pt-8 md:pt-14 px-4 md:px-10 lg:px-12 w-full max-w-4xl mx-auto pb-32">
            <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                    Help & Support
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                    Find answers or get in touch with our team.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Live Chat</h3>
                        <p className="text-sm text-slate-500 mb-4">Chat instantly with our AI assistant or a support agent.</p>
                        <button className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">Start Chat</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Email Support</h3>
                        <p className="text-sm text-slate-500 mb-4">Drop us an email and we'll get back to you within 24 hours.</p>
                        <button className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors">Send Email</button>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 md:col-span-2">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Frequently Asked Questions</h3>
                        <p className="text-sm text-slate-500 mb-4">Browse our comprehensive list of guides and tutorials.</p>
                        <button className="px-5 py-2 bg-slate-100 text-slate-900 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">Browse FAQ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
