import React from 'react';
import {
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Plus,
  Network
} from 'lucide-react';
import { ValidCombination } from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';

interface CombinationCardProps {
  combination: ValidCombination;
  rank: number;
  isFeatured?: boolean;
  onInspect: (combo: ValidCombination) => void;
  onInspectNetwork?: (combo: ValidCombination) => void;
}

export const CombinationCard: React.FC<CombinationCardProps> = ({
  combination,
  rank,
  isFeatured = false,
  onInspect,
  onInspectNetwork
}) => {
  const planCode = `PLAN-${String(rank).padStart(2, '0')}`;

  return (
    <div
      className={`bg-white rounded-none border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xs ${
        isFeatured
          ? 'border-emerald-800 ring-2 ring-emerald-800/20'
          : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
      }`}
    >
      <div className="p-6 sm:p-7">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none ${
                isFeatured
                  ? 'bg-emerald-800 text-white'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              {planCode} {isFeatured ? '· MAX BENEFIT' : ''}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Verified Compatible</span>
          </span>
        </div>

        {/* Large Benefit Display */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <div className="font-mono text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {formatINR(combination.total_potential_benefit)}
          </div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            Total Combined Potential Grant
          </div>
        </div>

        {/* Included Schemes with "+" connector */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase font-bold text-gray-500">
              Stacked Schemes ({combination.scholarships.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-bold">
              0 Conflict Overlap
            </span>
          </div>

          {combination.scholarships.map((s, idx) => (
            <React.Fragment key={s.id}>
              {idx > 0 && (
                <div className="flex items-center justify-center py-1">
                  <span className="w-5 h-5 rounded-none bg-gray-100 text-gray-600 text-[10px] font-bold font-mono flex items-center justify-center border border-gray-200">
                    +
                  </span>
                </div>
              )}
              <div className="p-3.5 rounded-none bg-gray-50/80 border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-none bg-white text-gray-600 border border-gray-200">
                      {s.source_type || 'NSP'}
                    </span>
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {s.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    {s.department || s.provider}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    +{formatINR(s.benefit_amount)}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Count and Synergy tag */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span className="font-medium text-gray-900">
            {combination.count} {combination.count === 1 ? 'Scheme' : 'Schemes Stacked'}
          </span>
          <span className="text-[11px] text-gray-600 font-medium truncate max-w-[170px]">
            {combination.compatibility_status}
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 sm:px-7 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="font-mono text-[11px] text-gray-500">
          {combination.merged_documents.length} docs required
        </span>

        <div className="flex items-center gap-3">
          {onInspectNetwork && (
            <button
              type="button"
              onClick={() => onInspectNetwork(combination)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Inspect combination in Compatibility Network"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onInspect(combination)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
          >
            <span>Plan Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

