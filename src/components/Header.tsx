import React from 'react';
import { Menu } from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface HeaderProps {
  activeTab: NavigationTab;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar
}) => {
  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Scholarship Dashboard',
          description: 'Overview of your eligible scholarships and combinations.'
        };
      case 'profile':
        return {
          title: 'Student Profile',
          description: 'Set your academic, financial, and quota details.'
        };
      case 'scholarships':
        return {
          title: 'Scholarship Directory',
          description: 'Browse all available scholarship schemes.'
        };
      case 'combinations':
        return {
          title: 'Compatible Plans & Combinations',
          description: 'View conflict-free scholarship packages and stacked financial benefit.'
        };
      case 'network':
        return {
          title: 'Compatibility & Conflict Network',
          description: 'Interactive topological relationship graph across official scholarships.'
        };
      case 'whatif':
        return {
          title: 'What-If? Scenario Simulator',
          description: 'Simulate hypothetical profile adjustments without mutating saved data.'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Overview of scholarships and recommendations.'
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#111827] leading-tight">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-[#6B7280] hidden sm:block leading-tight mt-0.5">
            {pageInfo.description}
          </p>
        </div>
      </div>
    </header>
  );
};
