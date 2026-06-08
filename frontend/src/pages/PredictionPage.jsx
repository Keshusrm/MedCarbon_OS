import { useState } from 'react';
import { Sparkles, BarChart2, Cpu, Zap, Thermometer, Flame, Sun, Calendar, Clock, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const BASELINE_VALUES = {
  electricity_facility: 480.0,
  fans_electricity: 45.0,
  cooling_electricity: 110.0,
  heating_electricity: 25.0,
  interior_lights_electricity: 75.0,
  interior_equipment_electricity: 145.0,
  gas_facility: 280.0,
  heating_gas: 180.0,
  interior_equipment_gas: 35.0,
  water_heater_gas: 55.0,
  hour: 12,
  day_of_year: 180,
};

export default function PredictionPage() {
  const [form, setForm] = useState({ ...BASELINE_VALUES });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value === '' ? '' : Number(value)
    }));
  };

  const handleReset = () => {
    setForm({ ...BASELINE_VALUES });
    setResult(null);
    setErrorMsg('');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction failed');
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to connect to the prediction API');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get color code based on predicted total
  const getCarbonSeverityColor = (value) => {
    if (value < 0.1) return 'text-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/10';
    if (value < 0.25) return 'text-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10';
    if (value < 0.45) return 'text-yellow-500 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
    return 'text-red-500 border-red-500 bg-red-50/50 dark:bg-red-900/10';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <p className="text-xs font-bold text-cobalt-500 dark:text-cobalt-400 tracking-widest mb-1">
            CORE MACHINE LEARNING PIPELINE
          </p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Facility Carbon Predictor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl">
            Input facility electrical load distribution and natural gas consumption metrics to project 
            real-time Scope 1 and Scope 2 emissions, verified by our Random Forest ML models.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-900/40">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Side */}
          <form onSubmit={handlePredict} className="lg:col-span-7 card p-6 space-y-6">
            
            {/* Electricity Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-navy-800">
                <Zap size={18} className="text-amber-500" />
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wide">
                  ELECTRICAL SUB-SYSTEMS (kW)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'electricity_facility', label: 'Total Facility Baseline', min: 10, max: 2000, step: 10 },
                  { id: 'fans_electricity', label: 'Ventilation & Fans', min: 0, max: 500, step: 5 },
                  { id: 'cooling_electricity', label: 'Cooling / Chillers', min: 0, max: 800, step: 10 },
                  { id: 'heating_electricity', label: 'Space Heating (Electric)', min: 0, max: 300, step: 5 },
                  { id: 'interior_lights_electricity', label: 'Interior Lights', min: 0, max: 400, step: 5 },
                  { id: 'interior_equipment_electricity', label: 'Interior Med Equipment', min: 0, max: 800, step: 10 },
                ].map(({ id, label, min, max, step }) => (
                  <div key={id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <label className="font-medium text-gray-600 dark:text-gray-400">{label}</label>
                      <span className="font-bold text-gray-900 dark:text-white">{form[id]} kW</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={form[id]}
                      onChange={e => handleChange(id, e.target.value)}
                      className="w-full h-1.5 bg-gray-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-cobalt-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Gas Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-navy-800">
                <Flame size={18} className="text-orange-500" />
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wide">
                  NATURAL GAS SUB-SYSTEMS (kW)
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'gas_facility', label: 'Total Gas Supply', min: 10, max: 1500, step: 10 },
                  { id: 'heating_gas', label: 'Gas Boilers / Heating', min: 0, max: 800, step: 10 },
                  { id: 'interior_equipment_gas', label: 'Lab Equipment Gas', min: 0, max: 200, step: 5 },
                  { id: 'water_heater_gas', label: 'Water Systems / Heaters', min: 0, max: 300, step: 5 },
                ].map(({ id, label, min, max, step }) => (
                  <div key={id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <label className="font-medium text-gray-600 dark:text-gray-400">{label}</label>
                      <span className="font-bold text-gray-900 dark:text-white">{form[id]} kW</span>
                    </div>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={form[id]}
                      onChange={e => handleChange(id, e.target.value)}
                      className="w-full h-1.5 bg-gray-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Time parameters */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-navy-800">
                <Calendar size={18} className="text-teal-500" />
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 tracking-wide">
                  TEMPORAL CONTEXT
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> Hour of Day
                    </label>
                    <span className="font-bold text-gray-900 dark:text-white">{form.hour}:00</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    step="1"
                    value={form.hour}
                    onChange={e => handleChange('hour', e.target.value)}
                    className="w-full h-1.5 bg-gray-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Sun size={12} /> Day of Year
                    </label>
                    <span className="font-bold text-gray-900 dark:text-white">Day {form.day_of_year}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    step="1"
                    value={form.day_of_year}
                    onChange={e => handleChange('day_of_year', e.target.value)}
                    className="w-full h-1.5 bg-gray-200 dark:bg-navy-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit & Reset buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary py-3 flex items-center gap-2 justify-center flex-1"
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-3 flex items-center gap-2 justify-center flex-[2] text-base"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing metrics...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Predict Footprint
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Side */}
          <div className="lg:col-span-5 space-y-6">
            {!result && !loading && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-[500px] border-2 border-dashed border-gray-200 dark:border-navy-800">
                <div className="w-16 h-16 rounded-full bg-cobalt-50 dark:bg-navy-800 flex items-center justify-center mb-4 text-cobalt-500 dark:text-cobalt-400">
                  <Cpu size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Awaiting Prediction Parameters
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs">
                  Adjust the sub-system sliders on the left and click **Predict Footprint** to compute the overall building emission forecast.
                </p>
              </div>
            )}

            {loading && (
              <div className="card p-8 flex flex-col items-center justify-center text-center h-[500px]">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-cobalt-100 dark:border-navy-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-cobalt-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-cobalt-500">
                    <Cpu size={24} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Running ML Inference...
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs">
                  Running calculations through the trained baseline Regressors to compute Scope 1 and Scope 2 metrics.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-slide-up">
                
                {/* Main Prediction Score */}
                <div className="card p-6 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-cobalt-500 dark:text-cobalt-400 tracking-widest mb-4">
                    ESTIMATED TOTAL FOOTPRINT
                  </span>
                  
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="w-40 h-40 rounded-full border-8 border-gray-100 dark:border-navy-800 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        {result.predicted_total}
                      </span>
                      <span className="text-xs font-bold text-gray-400 tracking-wider mt-0.5">
                        tCO2e / hour
                      </span>
                    </div>
                    {/* Small tag badge */}
                    <div className="absolute -bottom-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      ML Validated
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <div className="p-3 bg-gray-50 dark:bg-navy-900/50 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">
                        Total Electricity
                      </p>
                      <p className="text-base font-black text-gray-900 dark:text-white">
                        {result.total_electricity_kwh} <span className="text-xs font-medium text-gray-400">kWh</span>
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-navy-900/50 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-1">
                        Total Gas
                      </p>
                      <p className="text-base font-black text-gray-900 dark:text-white">
                        {result.total_gas_kwh} <span className="text-xs font-medium text-gray-400">kWh</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scope Breakdown */}
                <div className="card p-5 space-y-4">
                  <h4 className="font-bold text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                    GHG Protocol Breakdown
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Scope 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                        <Flame size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-700 dark:text-gray-300">Scope 1 (Direct Gas)</span>
                          <span className="text-gray-900 dark:text-white">{result.scope1_calculated} tCO2e</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-navy-800 rounded-full h-1.5">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (result.scope1_calculated / (result.scope1_calculated + result.scope2_calculated || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scope 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <Zap size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-gray-700 dark:text-gray-300">Scope 2 (Indirect Electricity)</span>
                          <span className="text-gray-900 dark:text-white">{result.scope2_calculated} tCO2e</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-navy-800 rounded-full h-1.5">
                          <div 
                            className="bg-amber-500 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (result.scope2_calculated / (result.scope1_calculated + result.scope2_calculated || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card p-5 space-y-3">
                  <h4 className="font-bold text-xs text-gray-400 dark:text-gray-500 tracking-widest uppercase">
                    AI Interventions Suggested
                  </h4>
                  
                  <div className="space-y-2.5">
                    {result.scope2_calculated > 0.15 && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Peak Load Shedding Active</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                            Electrical consumption is high. Consider shifting heavy clinical operations or scanning loads off peak hours.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {result.scope1_calculated > 0.05 && (
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Optimize Boiler Settings</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                            Gas-fired heating exceeds baseline guidelines. Recommend applying a dynamic HVAC temperature setback.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Balanced Operations</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                          Sub-systems are currently operating within nominal compliance thresholds under GHG reporting frameworks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
