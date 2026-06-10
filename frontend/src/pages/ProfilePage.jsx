import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Shield, Building, MapPin, Landmark } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useLanguage();

  // Load details from localStorage
  const fullName = localStorage.getItem('userFullName') || 'Dr. Julian Sterling';
  const email = localStorage.getItem('userEmail') || 'j.sterling@metrohealth.org';
  const roleKey = localStorage.getItem('userRole') || 'onboard_cso';
  const institution = localStorage.getItem('userInstitution') || 'Metro Health System';
  const address = localStorage.getItem('userAddress') || '123 Medical Center Blvd, City, State';
  const facilityName = localStorage.getItem('userFacilityName') || 'Main Campus — Building A';

  // Get initials for Avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(fullName);

  // Map role key to translation or label
  const getRoleLabel = (key) => {
    if (key === 'onboard_cso') return 'Chief Sustainability Officer (CSO)';
    if (key === 'onboard_fm') return 'Facility Manager';
    if (key === 'onboard_com') return 'Chief of Medicine';
    return key;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 animate-slide-up">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 dark:border-navy-800 pb-5">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">User Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your professional credentials and institutional authority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Avatar Card */}
          <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cobalt-500 to-teal-400 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-cobalt-500/10">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
            <p className="text-xs font-semibold text-cobalt-500 dark:text-cobalt-400 uppercase tracking-widest mt-1">
              {getRoleLabel(roleKey)}
            </p>
            <div className="w-full h-px bg-gray-100 dark:bg-navy-800 my-4" />
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Mail size={16} />
              <span>{email}</span>
            </div>
          </div>

          {/* Right: Detailed Credentials */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal credentials */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-teal-400" />
                Personal Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Full Name</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Email Address</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{email}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Institutional Role</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{getRoleLabel(roleKey)}</span>
                </div>
              </div>
            </div>

            {/* Institutional settings */}
            <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Landmark size={18} className="text-teal-400" />
                Institutional Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Institution Name</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{institution}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Primary Facility</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{facilityName}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1">Headquarters Address</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" />
                    {address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
