import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Activity, Cpu, Zap } from 'lucide-react';

const telemetryData = {
  'GRID-INF-01': {
    title: 'Main Grid Inflow',
    subtitle: 'Primary electrical intake from the municipal power grid.',
    color: 'blue',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'The Main Grid Inflow monitors the massive baseline electrical consumption required to keep the facility operational. It tracks power fed directly from the municipal utility lines into the hospital\'s main distribution panels.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Measured in Megawatts (MW) and Megawatt-hours (MWh). Anomalies are triggered by sudden voltage drops, harmonic distortion, or exceeding contracted peak-load thresholds (which incur heavy financial penalties).',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'MedCarbon OS pulls real-time smart-meter data, multiplying the kW draw by the local grid\'s live carbon intensity factor to calculate exact Scope 2 GHG emissions down to the second.',
      }
    ]
  },
  'AUX-GEN-02': {
    title: 'Auxiliary Gen-Set',
    subtitle: 'Diesel-powered backup generation for critical loads.',
    color: 'amber',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Emergency backup generators ensure that life-support systems, operating theaters, and data centers remain online during municipal power failures. They typically run on diesel fuel and produce significant localized emissions.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Typically kept in STANDBY mode. When ACTIVE, it outputs high kW but at a massive carbon cost. Tracking fuel reserves, generator block temperature, and battery start-voltage is critical for reliability.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'MedCarbon OS automatically switches tracking logic from Scope 2 (Grid) to Scope 1 (Direct Fuel Combustion) the moment the transfer switch engages, precisely measuring diesel burn rates to maintain compliance logging.',
      }
    ]
  },
  'GAS-STM-B4': {
    title: 'Steam Plant B-4',
    subtitle: 'Natural gas boiler system for sterilization and heating.',
    color: 'red',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'High-pressure steam is vital for medical sterilization (autoclaves), humidification, and facility heating. The steam plant relies on large-scale natural gas combustion boilers.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Measured in PSI (pressure) and therms/hour (fuel consumption). Anomalies occur if pressure exceeds safety thresholds or if combustion efficiency drops, indicating burner fouling or scale buildup.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'Sensors monitor the inlet gas flow and boiler exhaust stack. MedCarbon calculates exact Scope 1 emissions, alerting operators if the fuel-to-steam conversion efficiency drops below optimal ranges.',
      }
    ]
  },
  'WTR-POT-01': {
    title: 'Potable Inlet',
    subtitle: 'Main municipal water supply for clinical and domestic use.',
    color: 'blue',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Tracks the primary incoming water feed from municipal sources. Hospitals are incredibly water-intensive, requiring massive volumes for scrub sinks, patient care, cooling towers, and sanitation.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Flow is measured in cubic meters per hour (m³/h). The system monitors flow rates against historical baselines to detect potential leaks or abnormal usage spikes during off-peak hours.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'While water itself isn\'t a direct GHG, the energy required to heat, pump, and treat it is immense. MedCarbon calculates the "water-energy nexus," translating water waste directly into associated carbon footprints.',
      }
    ]
  },
  'HVAC-CHL-A': {
    title: 'Chilled Loop A',
    subtitle: 'Primary chilled water circuit for HVAC cooling systems.',
    color: 'teal',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Large-scale chillers generate cold water that is pumped throughout the hospital to air handling units (AHUs). This maintains strict temperature and humidity controls in operating rooms and patient wards.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'The most critical metric is "Delta T" (the difference between supply and return temperatures). A low Delta T indicates the chilled water is returning too cold, meaning energy is being wasted pumping excess water.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'MedCarbon OS continuously tracks the chilled loop\'s Delta T. Using AI, it suggests flow adjustments to optimizing chiller staging, drastically reducing the electrical load (Scope 2 emissions) of the HVAC plant.',
      }
    ]
  },
  'WTR-REC-FLT': {
    title: 'Greywater Reclamation',
    subtitle: 'Filtration system for reusing non-clinical wastewater.',
    color: 'emerald',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Captures and treats greywater from sinks and showers to be reused in non-potable applications like toilet flushing or landscaping, reducing the burden on municipal water supplies.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Measured in % Reclaimed (efficiency) and Filter Health. A drop in filter health indicates clogging or bio-fouling, which requires maintenance to prevent system bypass.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'MedCarbon logs total gallons reclaimed and offsets this against the facility\'s Scope 3 supply chain emissions (water utilities), directly contributing to UN SDG targets for responsible consumption.',
      }
    ]
  },
  'GAS-AIR-MED': {
    title: 'Medical Air Supply',
    subtitle: 'Ultra-pure compressed air for patient ventilation.',
    color: 'purple',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Medical air is manufactured on-site using specialized, oil-free compressors. It is a critical life-support gas used in ventilators, incubators, and for driving surgical tools.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Pressure must be maintained at a perfectly stable 50-55 PSI. Even minor pressure drops trigger severe facility alarms. The system is highly redundant with multiple compressor stages.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'Medical air compressors are massive electricity hogs. MedCarbon monitors compressor cycling rates to detect micro-leaks in the wall-piping infrastructure, preventing wasted electrical energy (Scope 2).',
      }
    ]
  },
  'SOL-PV-TOP': {
    title: 'Rooftop Photovoltaic',
    subtitle: 'Solar array generating zero-emission electricity.',
    color: 'amber',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'A massive solar PV array installed on the hospital roof and parking structures, generating clean, renewable DC power that is inverted and fed directly into the facility\'s microgrid.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Output (kW) is highly dependent on irradiance and cloud cover. The system monitors inverter efficiency and panel string voltages to detect dirt buildup or shading issues.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'Every kW generated by the PV array directly offsets the Main Grid Inflow. MedCarbon calculates this in real-time, instantly lowering your live carbon intensity (gCO2e/kWh) on the dashboard.',
      }
    ]
  },
  'GAS-LN2-VLT': {
    title: 'Liquid Nitrogen Vault',
    subtitle: 'Cryogenic storage for biological samples and tissue.',
    color: 'purple',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Cryogenic vaults maintain temperatures at or below -196°C to preserve critical biological samples, stem cells, and genetic material indefinitely. These vaults rely on continuous supplies of Liquid Nitrogen (LN2).',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Temperature must remain perfectly stable at -196°C. The system monitors the physical level of LN2 in the dewars, triggering automatic refills from bulk exterior tanks when levels drop.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'While LN2 itself is not a greenhouse gas, its manufacturing and delivery are highly energy-intensive. MedCarbon tracks boil-off rates to detect vacuum insulation failures, preventing wasted cryogenic gas.',
      }
    ]
  },
  'HEAT-REC-WHR': {
    title: 'Waste Heat Recovery',
    subtitle: 'Cogeneration system capturing exhaust heat.',
    color: 'pink',
    icon: Zap,
    sections: [
      {
        heading: 'System Overview',
        icon: Info,
        content: 'Waste Heat Recovery (WHR) captures the extreme exhaust heat generated by the Steam Plant and Auxiliary Generators, recycling it to pre-heat domestic hot water or drive absorption chillers.',
      },
      {
        heading: 'Operational Parameters',
        icon: Activity,
        content: 'Measured in Gigajoules per day (GJ/d) and thermal efficiency. A highly efficient WHR system acts as a force multiplier for the fuel you are already burning.',
      },
      {
        heading: 'MedCarbon Tracking',
        icon: Cpu,
        content: 'MedCarbon calculates the exact volume of natural gas that was *not* burned because of the WHR system, logging it as a direct carbon offset and an improvement to your Scope 1 efficiency baseline.',
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
  red: 'text-red-500 bg-red-500/10 border-red-500/20',
  pink: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
};

const glowColors = {
  emerald: 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
  blue: 'shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]',
  teal: 'shadow-[0_0_40px_-10px_rgba(20,184,166,0.3)]',
  purple: 'shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]',
  amber: 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)]',
  red: 'shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]',
  pink: 'shadow-[0_0_40px_-10px_rgba(236,72,153,0.3)]',
};

export default function TelemetryDetailModal({ isOpen, onClose, telemetryId }) {
  const data = telemetryId ? telemetryData[telemetryId] : null;

  return (
    <AnimatePresence>
      {isOpen && data && (
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
                  Close Archive
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
