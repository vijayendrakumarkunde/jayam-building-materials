"use client";

import React from "react";
import { Star, Quote, Building2, UserCheck, CheckCircle2 } from "lucide-react";

export const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Er. K. Raghunath",
      role: "Chief Structural Consultant",
      project: "Sri Krishna Towers (G+5 Commercial)",
      rating: 5,
      comment: "We tested the river sand supplied by Jayam Materials in our laboratory. Silt content was strictly under 2.2%, and concrete cube strength achieved 32 N/mm² in 28 days for M25 mix. Very dependable supplier.",
    },
    {
      name: "S. Venkatesh",
      role: "Independent Home Builder",
      project: "Individual Duplex Villa (3,200 sq.ft)",
      rating: 5,
      comment: "Being a first-time home builder, I was worried about sand adulteration and false weighing. Jayam Materials provided digital weighbridge slips for both 16-ton tippers. Every ton was accounted for.",
    },
    {
      name: "R. Murali Krishna",
      role: "Civil Contractor",
      project: "Greenwood Enclave (12 Villa Layout)",
      rating: 5,
      comment: "Their VSI M-sand and 20mm blue metal aggregate quality is uniform across all truck deliveries. Their tipper drivers know how to unload safely even in narrow site lanes without damaging neighbor walls.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F5F6F8] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#F47B20]/30 text-[#F47B20] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F47B20]" />
            <span>Proven Track Record</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#14243A] tracking-tight">
            What Builders & Homeowners Say
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Real feedback from civil engineers, structural consultants, and homeowners who build with Jayam Building Materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#F47B20]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#14243A]">{t.name}</h4>
                  <p className="text-xs text-[#F47B20] font-bold">{t.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.project}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E8F7F0] text-[#159B68] flex items-center justify-center shrink-0" title="Verified Customer">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
