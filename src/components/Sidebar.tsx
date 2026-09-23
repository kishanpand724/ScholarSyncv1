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
          <div className="h-16 px-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] shadow-2xs">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-base font-bold text-[#111827] tracking-tight block leading-tight">
                  ScholarSync
                </span>
                <span className="text-[10px] font-medium text-[#6B7280] tracking-wide block">
                  by Team Scholar IQ
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1">
            <div className="px-3 pb-2 pt-1 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
              Main Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#F0FDF4] text-[#16A34A] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#16A34A]' : 'text-[#6B7280]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#DCFCE7] text-[#15803D]'
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

        {/* Bottom Actions & Data Provenance */}
        <div className="p-4 border-t border-[#E5E7EB] space-y-2 bg-white">
          <div className="px-2 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]/60">
            <span className="text-[10px] font-bold text-[#374151] uppercase tracking-wider block mb-1">
              Official Data Portals
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-[#4B5563]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  NSP (Central)
                </span>
                <span className="font-mono text-[10px] text-gray-500 font-medium">AY 2026-27</span>
              </div>
              <div className="flex items-center justify-between text-[#4B5563]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  MahaDBT (Maharashtra)
                </span>
                <span className="font-mono text-[10px] text-gray-500 font-medium">Govt of MH</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors text-left cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#6B7280]" />
            <span>Preferences</span>
          </button>

          <button
            onClick={onResetProfile}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors text-left cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#DC2626]" />
            <span>Reset Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
};
