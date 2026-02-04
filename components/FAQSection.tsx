'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function FAQSection({ faqs }: { faqs: any[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // Logic to group FAQs by category
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <section className="py-24 px-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-white tracking-wide">
          Common Inquiries (FAQs)
        </h2>
        
        {categories.map((category) => (
          <div key={category} className="mb-12">
            {/* Category Heading */}
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-6 border-b border-white/10 pb-2">
              {category}
            </h3>

            <div className="space-y-2">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, i) => {
                  const uniqueId = `${category}-${i}`;
                  return (
                    <div key={uniqueId} className="border-b border-white/5 last:border-0">
                      <button
                        onClick={() => setOpenIndex(openIndex === uniqueId ? null : uniqueId)}
                        className="w-full py-5 flex justify-between items-center text-left group"
                      >
                        <span className="text-base font-sans text-white/80 group-hover:text-white transition-colors">
                          {faq.question}
                        </span>
                        <span className="text-white/30">
                          {openIndex === uniqueId ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </button>

                      <AnimatePresence>
                        {openIndex === uniqueId && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 text-white/50 leading-relaxed font-light text-sm">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}