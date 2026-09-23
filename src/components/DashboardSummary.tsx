import React from 'react';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Network,
  Sparkles
} from 'lucide-react';

interface DashboardSummaryProps {
  totalAnalyzed: number;
  eligibleCount: number;
  undeterminedCount?: number;
  ineligibleCount: number;
  validCombinationsCount: number;
  auditPercentage?: number | null;
  selectedMetric?: string;
  onSelectMetric?: (metric: 'all' | 'eligible' | 'undetermined' | 'ineligible' | 'combinations') => void;
  onNavigateToNetwork?: () => void;
  onNavigateToWhatIf?: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalAnalyzed,
  eligibleCount,
  undeterminedCount = 0,
  ineligibleCount,
  validCombinationsCount,
  auditPercentage,
  selectedMetric,
  onSelectMetric,
  onNavigateToNetwork,
  onNavigateToWhatIf
}) => {
  const cards = [
    ...(typeof auditPercentage === 'number'
      ? [
          {
            id: 'eligible' as const,
            label: 'Eligibility Match',
            value: `${auditPercentage}%`,
            icon: ShieldCheck,
            accentColor: 'text-emerald-800',
            iconBg: 'bg-emerald-50',
            helper: 'Profile match score'
          }
        ]
      : []),
    {
      id: 'all' as const,
      label: 'Total Scholarships',
      value: totalAnalyzed,
      icon: FileText,
      accentColor: 'text-emerald-800',
      iconBg: 'bg-emerald-50',
      helper: 'Available scholarships'
    },
    {
      id: 'eligible' as const,
      label: 'Eligible (✓)',
      value: eligibleCount,
      icon: CheckCircle2,
      accentColor: 'text-emerald-800',
      iconBg: 'bg-emerald-50',
      helper: 'All criteria satisfied'
    },
    {
      id: 'undetermined' as const,
      label: 'Needs Info (?)',
      value: undeterminedCount,
      icon: HelpCircle,
      accentColor: 'text-amber-700',
      iconBg: 'bg-amber-50',
      helper: 'Additional info needed'
    },
    {
      id: 'ineligible' as const,
      label: 'Not Eligible (✗)',
      value: ineligibleCount,
      icon: XCircle,
      accentColor: 'text-[#6B7280]',
      iconBg: 'bg-[#F3F4F6]',
      helper: 'Criteria not met'
    },
    {
      id: 'combinations' as const,
      label: 'Valid Combinations',
      value: validCombinationsCount,
      icon: Layers,
      accentColor: 'text-emerald-800',
      iconBg: 'bg-emerald-50',
      helper: 'Compatible scholarship stacks'
    }
  ];

  return (
    <div className="space-y-6 mb-10">
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${typeof auditPercentage === 'number' ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-4 sm:gap-5`}>
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedMetric === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectMetric && onSelectMetric(card.id)}
              className={`bg-white border rounded-none p-5 sm:p-6 shadow-xs transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-800 ring-2 ring-emerald-800/20'
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-none ${card.iconBg} flex items-center justify-center ${card.accentColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] tracking-tight">
                  {card.value}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#9CA3AF] mt-1 flex items-center justify-between">
                  <span className="truncate">{card.helper}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Shortcuts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {onNavigateToNetwork && (
          <div
            onClick={onNavigateToNetwork}
            className="p-4 sm:p-5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/90 rounded-none flex items-center justify-between gap-4 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-none bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <Network className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Interactive Compatibility Network
                </span>
                <span className="text-[11px] text-emerald-800 mt-0.5 block">
                  Inspect connections and compatibility between scholarships
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}

        {onNavigateToWhatIf && (
          <div
            onClick={onNavigateToWhatIf}
            className="p-4 sm:p-5 bg-purple-50/50 hover:bg-purple-50 border border-purple-200/90 rounded-none flex items-center justify-between gap-4 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-none bg-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-purple-950 block">
                  What-If? Scenario Simulator
                </span>
                <span className="text-[11px] text-purple-800 mt-0.5 block">
                  Simulate score or income changes to discover more scholarships
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-purple-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
};
