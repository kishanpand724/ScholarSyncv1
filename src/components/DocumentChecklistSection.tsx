import React from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { STANDARD_DOCUMENTS_CATALOG, DocumentItem } from '../services/documentChecklist';

interface DocumentChecklistSectionProps {
  possessedDocuments?: string[];
  onChange: (updatedDocuments: string[]) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const DocumentChecklistSection: React.FC<DocumentChecklistSectionProps> = ({
  possessedDocuments = [],
  onChange,
  title = 'Document Possession Checklist',
  subtitle = 'Mark the documents you currently hold in original or verified digital copy to verify readiness.',
  compact = false
}) => {
  const toggleDoc = (docId: string) => {
    if (possessedDocuments.includes(docId)) {
      onChange(possessedDocuments.filter((id) => id !== docId));
    } else {
      onChange([...possessedDocuments, docId]);
    }
  };

  const selectAll = () => {
    const allIds = STANDARD_DOCUMENTS_CATALOG.map((d) => d.id);
    onChange(allIds);
  };

  const clearAll = () => {
    onChange([]);
  };

  const possessedCount = STANDARD_DOCUMENTS_CATALOG.filter((d) =>
    possessedDocuments.includes(d.id)
  ).length;

  const totalCount = STANDARD_DOCUMENTS_CATALOG.length;
  const percentage = Math.round((possessedCount / totalCount) * 100);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header with stats & bulk controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-none bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#111827] flex items-center gap-2.5">
              <span>{title}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-none bg-emerald-50 text-emerald-800 border border-emerald-200">
                {possessedCount}/{totalCount} Ready ({percentage}%)
              </span>
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 rounded-none border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Mark All Possessed
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-1.5 rounded-none border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>Document Portfolio Readiness</span>
          <span className="text-gray-900 font-bold">{possessedCount} possessed</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-none overflow-hidden">
          <div
            className="bg-emerald-800 h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist items grouped or listed */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {STANDARD_DOCUMENTS_CATALOG.map((doc) => {
          const isSelected = possessedDocuments.includes(doc.id);

          return (
            <div
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className={`p-4 rounded-none border text-xs cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                isSelected
                  ? 'border-emerald-800 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-800/20'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-gray-50'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  <div className="w-4 h-4 rounded-none bg-emerald-800 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-none border border-gray-300 bg-white" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className={`block font-semibold ${isSelected ? 'text-emerald-900' : 'text-gray-800'}`}>
                  {doc.shortLabel}
                </span>
                <span className="text-[11px] text-gray-500 block leading-tight mt-1 line-clamp-2">
                  {doc.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-none bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-[11px] leading-relaxed">
          Toggling these documents allows ScholarSync to cross-reference with each scholarship's requirements to flag any missing paperwork before you begin your official NSP application.
        </span>
      </div>
    </div>
  );
};
