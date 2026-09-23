import React from 'react';
import {
  LayoutDashboard,
  User,
  BookOpen,
  Layers,
  Settings,
  RotateCcw,
  GraduationCap,
  Sparkles,
  Network,
  GitFork,
  X
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'profile'
  | 'scholarships'
  | 'combinations'
  | 'network'
  | 'whatif';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  validCombinationsCount: number;
  eligibleCount: number;
  onOpenSettings: () => void;
  onResetProfile: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  validCombinationsCount,
  eligibleCount,
  onOpenSettings,
  onResetProfile,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'profile' as NavigationTab,
      label: 'My Profile',
      icon: User,
      badge: null
    },
    {
      id: 'scholarships' as NavigationTab,
      label: 'Scholarships',
      icon: BookOpen,
      badge: eligibleCount > 0 ? `${eligibleCount} eligible` : null
    },
    {
      id: 'combinations' as NavigationTab,
      label: 'Smart Plans',
      icon: Layers,
      badge: validCombinationsCount > 0 ? `${validCombinationsCount}` : null
    },
    {
      id: 'network' as NavigationTab,
      label: 'Compatibility Network',
      icon: Network,
      badge: 'Live Graph'
    },
    {
      id: 'whatif' as NavigationTab,
      label: 'What-If? Simulator',
      icon: Sparkles,
      badge: 'Scenario'
    }
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-18 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-bold text-[#111827] tracking-tight block leading-tight">
                  ScholarSync
                </span>
                <span className="text-[10px] font-medium text-[#6B7280] tracking-wide block mt-0.5">
                  by Team Scholar IQ
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 rounded-none text-[#6B7280] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-5 space-y-1.5">
            <div className="px-3 pb-2.5 pt-1 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-none text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-800'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-800' : 'text-[#6B7280]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-none ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-[#F3F4F6] text-[#4B5563]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-[#E5E7EB] space-y-2 bg-white">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors text-left cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#6B7280]" />
            <span>Profile &amp; Settings</span>
          </button>

          <button
            onClick={onResetProfile}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-none text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-700" />
            <span>Reset Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
};
