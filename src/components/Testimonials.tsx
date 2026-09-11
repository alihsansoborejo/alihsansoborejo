import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Quote, Heart, Users } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = useDataContext();
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-[#f8faf9]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase font-bold tracking-widest text-[#0b3c26] bg-[#e8f3ee] px-3.5 py-1 rounded-full inline-block mb-3 border border-[#0b3c26]/20">
          KATA MEREKA
        </span>
        <h3 className="font-heading text-2xl sm:text-4xl text-[#072217] font-bold tracking-tight">
          Apresiasi Wali Murid & Masyarakat
        </h3>
        <p className="font-body text-sm sm:text-base text-[#52635c] mt-2">
          Kepercayaan dan kebahagiaan para orang tua melihat putra-putri mereka tumbuh shalih, tertib sholat, dan berakhlakul karimah di Soborejo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((item) => (
          <div
            key={item.id}
            id={`testimonial-card-${item.id}`}
            className="bg-white rounded-2xl p-7 border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative"
          >
            <Quote className="w-8 h-8 text-[#d4af37]/30 mb-4" />

            <p className="font-body text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-6">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]"
              />
              <div>
                <h4 className="font-heading text-sm font-bold text-[#072217]">
                  {item.name}
                </h4>
                <p className="text-[11px] text-[#0b3c26] font-semibold">
                  {item.role}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                  <Users className="w-3 h-3 text-[#d4af37]" />
                  <span>{item.childName} ({item.childGrade})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
