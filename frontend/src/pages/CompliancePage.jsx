import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Globe, Leaf, TrendingUp, Award, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import ComplianceDetailModal from '../components/ComplianceDetailModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const frameworks = [
  {
    id: 'ghg',
    name: 'GHG Protocol',
    description: 'Scope 1, 2, and 3 emission tracking across all facility operations.',
    status: 'Compliant',
    score: 96,
    icon: Shield,
    color: 'emerald',
    standards: ['Scope 1 – Direct combustion', 'Scope 2 – Purchased electricity', 'Scope 3 – Value chain'],
  },
  {
    id: 'iso14064',
    name: 'ISO 14064',
    description: 'International standard for greenhouse gas quantification and reporting.',
    status: 'Compliant',
    score: 94,
    icon: Award,
    color: 'blue',
    standards: ['Organizational boundary', 'Activity data verified', 'Third-party audit: Q3 2026'],
  },
  {
    id: 'sbti',
    name: 'SBTi 1.5°C Pathway',
    description: 'Science-Based Targets initiative alignment toward 1.5°C warming limit.',
    status: 'On Track',
    score: 75,
    icon: TrendingUp,
    color: 'teal',
    standards: ['Near-term target: 2030', 'Long-term target: 2050 net-zero', 'Annual reduction rate: 4.2%'],
  },
  {
    id: 'who',
    name: 'WHO Climate-Smart Healthcare',
    description: 'WHO roadmap to net-zero emissions in healthcare systems by 2050.',
    status: 'In Progress',
    score: 61,
    icon: Globe,
    color: 'purple',
    standards: ['Energy efficiency programs', 'Renewable procurement: 28%', 'Net-zero target: 2050'],
  },
  {
    id: 'sdg',
    name: 'UN SDGs Aligned',
    description: 'Sustainable Development Goals — SDGs 3, 7, 12, and 13.',
    status: 'Aligned',
    score: 88,
    icon: Leaf,
    color: 'amber',
    standards: ['SDG 3 – Good Health & Well-Being', 'SDG 7 – Affordable Clean Energy', 'SDG 12 – Responsible Consumption', 'SDG 13 – Climate Action'],
  },
];

function ScoreRing({ score, color }) {
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const colorMap = {
    emerald: '#10B981', blue: '#3B82F6', teal: '#00BFA5', purple: '#8B5CF6', amber: '#F59E0B',
  };
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="5" className="dark:stroke-navy-700" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke={colorMap[color]} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <span className="absolute text-sm font-black text-gray-900 dark:text-white">{score}%</span>
    </div>
  );
}

export default function CompliancePage() {
  const { t } = useLanguage();
  const [selectedFramework, setSelectedFramework] = useState(null);

  const handleDownloadAudit = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('MedCarbon OS - Full Compliance Audit Report', 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Overall Compliance Score: 83%`, 14, 36);
      
      const tableData = frameworks.map(f => [
        f.name,
        f.status,
        `${f.score}%`,
        f.standards.join('\n')
      ]);
      
      autoTable(doc, {
        startY: 45,
        head: [['Framework', 'Status', 'Score', 'Key Standards']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [13, 148, 136] },
        styles: { cellPadding: 4, fontSize: 10 },
      });
      
      doc.save('MedCarbon_Compliance_Audit.pdf');
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-navy-900 dark:to-navy-800 p-6 border border-gray-100 dark:border-navy-800 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('comp_title')}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl leading-relaxed">
              {t('comp_subtitle')} Explore each framework below to learn how MedCarbon OS maps your facility's operational telemetry directly to international reporting standards in real-time.
            </p>
          </div>
        </motion.div>

        {/* Overall Score Banner */}
        <div className="hero-gradient rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative w-24 h-24 flex shrink-0 items-center justify-center">
            <svg width="96" height="96" className="-rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="#00BFA5" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * (1 - 0.83)} />
            </svg>
            <span className="absolute text-2xl font-black text-white">83%</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold mb-1">Overall Compliance Score</h2>
            <p className="text-teal-300 text-sm mb-3">Metro Health System — Reporting Period: Q1–Q2 2026</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {['GHG Protocol', 'ISO 14064', 'SBTi 1.5°C'].map(b => (
                <span key={b} className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} className="text-teal-300" /> {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {frameworks.map(f => (
            <div key={f.id} className="card p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-4 items-start mb-4">
                <ScoreRing score={f.score} color={f.color} />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{f.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      f.status === 'Compliant' || f.status === 'Aligned' || f.status === 'On Track'
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{f.description}</p>
                  <ul className="space-y-1">
                    {f.standards.map(s => (
                      <li key={s} className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <CheckCircle size={10} className="text-teal-400 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end mt-auto pt-3 border-t border-gray-100 dark:border-navy-800/50">
                <button
                  onClick={() => setSelectedFramework(f.id)}
                  className="group flex items-center gap-1.5 text-xs font-bold text-cobalt-600 dark:text-teal-400 hover:text-cobalt-800 dark:hover:text-teal-300 transition-colors bg-cobalt-50 dark:bg-teal-900/10 px-3 py-1.5 rounded-lg"
                >
                  Learn more 
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Download Audit */}
        <div className="card p-5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Full Compliance Audit Report</h3>
            <p className="text-xs text-gray-400 mt-0.5">GHG Protocol + ISO 14064 + SBTi — Q2 2026 Verified</p>
          </div>
          <button id="download-audit-btn" onClick={handleDownloadAudit} className="btn-primary py-2.5 px-5 text-sm">
            Download Report PDF
          </button>
        </div>
      </div>
      
      <ComplianceDetailModal 
        isOpen={!!selectedFramework} 
        onClose={() => setSelectedFramework(null)} 
        frameworkId={selectedFramework} 
      />
    </DashboardLayout>
  );
}
