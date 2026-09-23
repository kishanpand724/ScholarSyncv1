import React from 'react';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Layers,
  ShieldCheck,
  ArrowUpRight
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
            label: 'Audit Percentage',
            value: `${auditPercentage}%`,
            icon: ShieldCheck,
            accentColor: 'text-[#16A34A]',
            iconBg: 'bg-[#F0FDF4]',
            helper: 'Statutory match rate'
          }
        ]
      : []),
    {
      id: 'all' as const,
      label: 'Schemes Evaluated',
      value: totalAnalyzed,
      icon: FileText,
      accentColor: 'text-[#16A34A]',
      iconBg: 'bg-[#F0FDF4]',
      helper: 'Official NSP 2026-27'
    },
    {
      id: 'eligible' as const,
      label: 'Eligible (✓)',
      value: eligibleCount,
      icon: CheckCircle2,
      accentColor: 'text-[#16A34A]',
      iconBg: 'bg-[#F0FDF4]',
      helper: 'All criteria satisfied'
    },
    {
      id: 'undetermined' as const,
      label: 'Additional Info Required (?)',
      value: undeterminedCount,
      icon: HelpCircle,
      accentColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      helper: 'Missing required inputs'
    },
    {
      id: 'ineligible' as const,
      label: 'Not Eligible (✗)',
      value: ineligibleCount,
      icon: XCircle,
      accentColor: 'text-[#6B7280]',
      iconBg: 'bg-[#F3F4F6]',
      helper: 'Criteria clearly failed'
    },
    {
      id: 'combinations' as const,
      label: 'Valid Stacks',
      value: validCombinationsCount,
      icon: Layers,
      accentColor: 'text-[#16A34A]',
      iconBg: 'bg-[#F0FDF4]',
      helper: 'Statutory combinations'
    }
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${typeof auditPercentage === 'number' ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-3 sm:gap-4`}>
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedMetric === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectMetric && onSelectMetric(card.id)}
              className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20'
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">
                  {card.label}
                </span>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${card.iconBg} flex items-center justify-center ${card.accentColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] tracking-tight">
                  {card.value}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#9CA3AF] mt-0.5 flex items-center justify-between">
                  <span className="truncate">{card.helper}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytical Shortcuts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onNavigateToNetwork && (
          <div
            onClick={onNavigateToNetwork}
            className="p-3.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/70 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ☊
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Interactive Compatibility Network
                </span>
                <span className="text-[11px] text-emerald-700">
                  Inspect topological relationships &amp; statutory conflict blocks
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}

        {onNavigateToWhatIf && (
          <div
            onClick={onNavigateToWhatIf}
            className="p-3.5 bg-purple-50/50 hover:bg-purple-50 border border-purple-200/70 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                ✦
              </span>
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  What-If? Scenario Simulator
                </span>
                <span className="text-[11px] text-purple-700">
                  Simulate income, score or quota shifts without modifying profile
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
};
