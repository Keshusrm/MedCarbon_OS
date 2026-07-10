import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Activity, ShieldCheck, Cpu } from 'lucide-react';

const frameworksData = {
  ghg: {
    title: 'GHG Protocol',
    subtitle: 'Scope 1, 2, and 3 emission tracking across all facility operations.',
    color: 'emerald',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'What it is',
        icon: Info,
        content: 'The Greenhouse Gas (GHG) Protocol is the world\'s most widely used greenhouse gas accounting standard for companies and organizations. It provides the foundational framework to measure, manage, and report emissions, ensuring global consistency and transparency in climate action.',
      },
      {
        heading: 'How it is measured',
        icon: Activity,
        content: 'Emissions are classified into three scopes: Scope 1 (Direct emissions from owned/controlled sources like boilers and medical gases), Scope 2 (Indirect emissions from purchased electricity, steam, heating, and cooling), and Scope 3 (All other indirect emissions that occur in the value chain, such as supply chain procurement and waste disposal).',
      },
      {
        heading: 'MedCarbon Integration',
        icon: Cpu,
        content: 'MedCarbon OS utilizes real-time IoT integrations and machine learning to automatically aggregate facility data, categorizing every kilowatt and therm into the exact GHG Protocol Scope boundaries, generating an audit-ready ledger continuously.',
      }
    ]
  },
  iso14064: {
    title: 'ISO 14064',
    subtitle: 'International standard for greenhouse gas quantification and reporting.',
    color: 'blue',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'What it is',
        icon: Info,
        content: 'ISO 14064 is an internationally recognized standard that specifies principles and requirements at the organization level for quantification and reporting of greenhouse gas emissions and removals. It focuses heavily on the verification and validation of climate data.',
      },
      {
        heading: 'How it is measured',
        icon: Activity,
        content: 'Compliance requires establishing strict organizational and operational boundaries, developing a precise GHG inventory, and implementing rigorous quality management for activity data. The final inventory must be capable of withstanding independent third-party audits.',
      },
      {
        heading: 'MedCarbon Integration',
        icon: Cpu,
        content: 'Our platform enforces ISO 14064 data integrity by maintaining immutable audit trails. Every calculation run through our prediction models is version-controlled and cryptographically verifiable, significantly reducing the cost and time of external Q3 audits.',
      }
    ]
  },
  sbti: {
    title: 'SBTi 1.5°C Pathway',
    subtitle: 'Science-Based Targets initiative alignment toward 1.5°C warming limit.',
    color: 'teal',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'What it is',
        icon: Info,
        content: 'The Science Based Targets initiative (SBTi) drives ambitious corporate climate action by enabling organizations to set science-based emissions reduction targets. The 1.5°C pathway ensures your targets align with the most ambitious goal of the Paris Agreement.',
      },
      {
        heading: 'How it is measured',
        icon: Activity,
        content: 'Healthcare organizations must set specific near-term targets (e.g., halving emissions by 2030) and long-term net-zero targets (by 2050). Progress is tracked via absolute contraction—requiring an annual linear reduction rate of at least 4.2% across Scope 1 and 2.',
      },
      {
        heading: 'MedCarbon Integration',
        icon: Cpu,
        content: 'MedCarbon OS overlays your live emission trajectory directly against the SBTi 4.2% reduction curve. Our predictive engine forecasts your end-of-year standing and automatically suggests load-shedding interventions if you veer off track.',
      }
    ]
  },
  who: {
    title: 'WHO Climate-Smart Healthcare',
    subtitle: 'WHO roadmap to net-zero emissions in healthcare systems by 2050.',
    color: 'purple',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'What it is',
        icon: Info,
        content: 'The World Health Organization\'s initiative provides a comprehensive framework to transition health systems toward low-carbon and climate-resilient operations, recognizing that healthcare itself is a significant contributor to global emissions.',
      },
      {
        heading: 'How it is measured',
        icon: Activity,
        content: 'Measurement goes beyond energy; it specifically targets healthcare-unique emission sources. This includes tracking the usage of high-GWP anesthetic gases (like Desflurane), optimizing specialized HVAC requirements for operating theaters, and managing clinical waste.',
      },
      {
        heading: 'MedCarbon Integration',
        icon: Cpu,
        content: 'Our system natively maps your facility telemetry to WHO-specific guidelines. We track specialized medical equipment loads and renewable procurement rates, ensuring your operational shifts directly advance the WHO net-zero mandate.',
      }
    ]
  },
  sdg: {
    title: 'UN SDGs Aligned',
    subtitle: 'Sustainable Development Goals — SDGs 3, 7, 12, and 13.',
    color: 'amber',
    icon: ShieldCheck,
    sections: [
      {
        heading: 'What it is',
        icon: Info,
        content: 'The United Nations Sustainable Development Goals are 17 interlinked global goals acting as a blueprint for peace and prosperity. The healthcare sector plays a pivotal role in achieving these targets.',
      },
      {
        heading: 'How it is measured',
        icon: Activity,
        content: 'Progress is quantified by mapping operational outcomes to specific goals: SDG 3 (Good Health & Well-Being via reduced air pollution), SDG 7 (Clean Energy via renewables), SDG 12 (Responsible Consumption via waste reduction), and SDG 13 (Climate Action via carbon reduction).',
      },
      {
        heading: 'MedCarbon Integration',
        icon: Cpu,
        content: 'MedCarbon OS automatically tags efficiency gains to their corresponding UN SDGs. Our dashboard generates visual ESG impact reports that translate raw carbon savings into tangible progress against these global humanitarian goals.',
      }
    ]
  }
};

const colorClasses = {
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  teal: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

const glowColors = {
  emerald: 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
  blue: 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
  teal: 'shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]',
  purple: 'shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
  amber: 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
};

export default function ComplianceDetailModal({ isOpen, onClose, frameworkId }) {
  if (!frameworkId) return null;
  const data = frameworksData[frameworkId];
  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden bg-white dark:bg-[#0A1633] rounded-3xl shadow-2xl border border-gray-100 dark:border-navy-800"
          >
            <div className="overflow-y-auto w-full flex-1">
              {/* Header / Banner */}
            <div className="relative p-8 overflow-hidden">
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl ${colorClasses[data.color].split(' ')[0].replace('text-', 'bg-')} -translate-y-1/2 translate-x-1/3`} />
              
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-gray-500 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colorClasses[data.color]} ${glowColors[data.color]}`}>
                  <data.icon size={28} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  {data.title}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                  {data.subtitle}
                </p>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-8 pt-0 space-y-6">
              {data.sections.map((sec, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.1) }}
                  key={sec.heading} 
                  className="bg-gray-50 dark:bg-navy-900/40 rounded-2xl p-6 border border-gray-100 dark:border-navy-800 hover:border-gray-200 dark:hover:border-navy-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl bg-white dark:bg-navy-800 shadow-sm text-gray-600 dark:text-gray-300`}>
                      <sec.icon size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {sec.heading}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 pl-11">
                    {sec.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-navy-800 flex justify-end">
              <button 
                onClick={onClose}
                className="btn-primary"
              >
                Understood
              </button>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
