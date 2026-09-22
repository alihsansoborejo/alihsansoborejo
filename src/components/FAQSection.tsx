import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FormattedText } from './FormattedText';

export const FAQSection: React.FC = () => {
  const { faqs } = useDataContext();
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#d4af37] uppercase mb-2 block">
          Pusat Bantuan & Informasi
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#072217] font-bold relative inline-block">
          Tanya Jawab (FAQ)
        </h2>
        <div className="w-16 h-1 bg-[#d4af37] mx-auto mt-4 rounded-full" />
        <p className="font-body text-xs sm:text-sm text-[#52635c] mt-3">
          Jawaban atas pertanyaan yang paling sering diajukan oleh calon wali santri dan calon siswa.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              id={`faq-item-${faq.id}`}
              className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                id={`faq-toggle-${faq.id}`}
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0b3c26]/10 text-[#0b3c26] flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="font-heading text-sm sm:text-base font-semibold text-[#072217]">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#d4af37] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200"
                >
                  <FormattedText text={faq.answer} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
