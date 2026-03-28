import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout, Landmark, ShieldCheck, Banknote, Calendar, ChevronRight } from 'lucide-react';

const SCHEMES = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    subtitle: 'Direct Benefit Transfer',
    amount: '₹6,000 / year',
    description: 'Under this scheme, all landholding farmers\' families are provided financial benefit of Rs. 6000 per annum, payable in three equal four-monthly installments of Rs. 2000 each.',
    icon: <Banknote className="text-emerald-600" />,
    color: 'bg-emerald-50 text-emerald-700',
    tags: ['Financial Aid', 'Direct Transfer'],
    lastDate: 'Ongoing'
  },
  {
    id: 'pkvy',
    title: 'Paramparagat Krishi Vikas Yojana',
    subtitle: 'Organic Farming Promotion',
    amount: '₹50,000 / hectare',
    description: 'Financial assistance is provided for 3 years towards cluster formation, capacity building, certification, and marketing to promote organic farming.',
    icon: <Sprout className="text-lime-600" />,
    color: 'bg-lime-50 text-lime-700',
    tags: ['Organic', 'Subsidy'],
    lastDate: 'Apply locally'
  },
  {
    id: 'pm-fsb',
    title: 'PM Fasal Bima Yojana',
    subtitle: 'Crop Insurance',
    amount: 'Premium 1.5% - 2%',
    description: 'Provides comprehensive insurance cover against failure of the crop thus helping in stabilizing the income of the farmers and encouraging innovative practices.',
    icon: <ShieldCheck className="text-cyan-600" />,
    color: 'bg-cyan-50 text-cyan-700',
    tags: ['Insurance', 'Risk Cover'],
    lastDate: 'Before Kharif/Rabi'
  }
];

const Govt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 antialiased pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <div className="mb-14 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-900 text-white mb-6 shadow-md">
            <Landmark size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-4">
            Government<br/>Schemes.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mx-auto md:mx-0 leading-relaxed">
            Discover verified financial aid, insurance, and organic farming benefits structured for your agricultural success.
          </p>
        </div>

        <div className="space-y-6">
          {SCHEMES.map((scheme) => (
            <article 
              key={scheme.id}
              className="group bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_8px_40px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 pointer-events-none">
                <ChevronRight className="text-slate-300" size={24} />
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                
                {/* Visual Icon & Amount Column */}
                <div className="flex justify-between items-start md:flex-col md:w-48 shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${scheme.color}`}>
                    {React.cloneElement(scheme.icon, { size: 28, strokeWidth: 2 })}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Benefit</span>
                    <span className="block text-2xl font-black tracking-tight text-slate-900">{scheme.amount}</span>
                  </div>
                </div>

                {/* Details Column */}
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {scheme.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-1">{scheme.title}</h2>
                  <h3 className="text-sm font-semibold text-emerald-600 tracking-wide uppercase mb-4">{scheme.subtitle}</h3>
                  
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">
                    {scheme.description}
                  </p>

                  <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Calendar size={16} />
                      Deadline: {scheme.lastDate}
                    </div>
                    <button className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors ml-auto flex items-center gap-1">
                      Check Eligibility <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

const ArrowRight = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default Govt;
