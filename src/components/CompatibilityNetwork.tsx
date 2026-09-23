/**
 * Compatibility Network Component
 * Interactive, data-driven relationship graph for ScholarSync.
 * Renders real scholarship nodes and verified edges (Compatible, Conflict, Unknown)
 * computed directly from ScholarSync's eligibility and combination engines.
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Network,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Search,
  SlidersHorizontal,
  Info,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  X,
  Sparkles,
  ChevronRight,
  Building,
  Filter
} from 'lucide-react';
import {
  Scholarship,
  ValidCombination,
  InvalidCombination,
  AnalysisResponse
} from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';

interface CompatibilityNetworkProps {
  scholarships: Scholarship[];
  eligibleScholarships: Scholarship[];
  validCombinations: ValidCombination[];
  invalidCombinations: InvalidCombination[];
  analysis?: AnalysisResponse | null;
  onSelectScholarship?: (scholarship: Scholarship) => void;
  onOpenPlan?: (combination: ValidCombination) => void;
}

export type EdgeFilterType = 'all' | 'compatible' | 'conflict';
export type EdgePortalType = 'ALL' | 'NSP' | 'MAHADBT' | 'COMBINED';

interface NetworkNode {
  id: string;
  scholarship: Scholarship;
  shortId: string;
  isEligible: boolean;
  x: number;
  y: number;
  radius: number;
}

interface NetworkEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'compatible' | 'conflict' | 'unknown';
  portalType: 'NSP' | 'MAHADBT' | 'COMBINED';
  reason: string;
  sourceScholarship: Scholarship;
  targetScholarship: Scholarship;
  conflictType?: string;
}

export const CompatibilityNetwork: React.FC<CompatibilityNetworkProps> = ({
  scholarships,
  eligibleScholarships,
  validCombinations,
  invalidCombinations,
  analysis,
  onSelectScholarship,
  onOpenPlan
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge | null>(null);
  const [edgeFilter, setEdgeFilter] = useState<EdgeFilterType>('all');
  const [edgePortalFilter, setEdgePortalFilter] = useState<EdgePortalType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'graph' | 'matrix'>('graph');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'NSP' | 'MAHADBT'>('ALL');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState<boolean>(true);

  // Active pool of scholarships for the graph
  const activeScholarships = useMemo(() => {
    let pool = eligibleScholarships.length > 0 ? eligibleScholarships : scholarships.slice(0, 15);
    if (sourceFilter !== 'ALL') {
      pool = pool.filter((s) => s.source_type === sourceFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.department && s.department.toLowerCase().includes(q)) ||
          s.provider.toLowerCase().includes(q)
      );
    }
    return pool;
  }, [eligibleScholarships, scholarships, sourceFilter, searchQuery]);

  // Generate real verified edges from combination engine output
  const edges: NetworkEdge[] = useMemo(() => {
    const list: NetworkEdge[] = [];
    const activeMap = new Map<string, Scholarship>(activeScholarships.map((s) => [s.id, s]));
    const processedPairs = new Set<string>();

    // Helper to determine edge portal interaction type
    const getPortalType = (s1: Scholarship, s2: Scholarship): 'NSP' | 'MAHADBT' | 'COMBINED' => {
      const t1 = s1.source_type || 'NSP';
      const t2 = s2.source_type || 'NSP';
      if (t1 === 'MAHADBT' && t2 === 'MAHADBT') return 'MAHADBT';
      if (t1 === 'NSP' && t2 === 'NSP') return 'NSP';
      return 'COMBINED';
    };

    // 1. Process Conflicts (Red Edges)
    invalidCombinations.forEach((inv, idx) => {
      const id1 = inv.scholarship_ids[0];
      const id2 = inv.scholarship_ids[1];
      const s1 = activeMap.get(id1) || scholarships.find((s) => s.id === id1);
      const s2 = activeMap.get(id2) || scholarships.find((s) => s.id === id2);

      if (s1 && s2 && activeMap.has(s1.id) && activeMap.has(s2.id)) {
        const pairKey = [s1.id, s2.id].sort().join(':::');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          list.push({
            id: `conflict-${idx}-${s1.id}-${s2.id}`,
            sourceId: s1.id,
            targetId: s2.id,
            type: 'conflict',
            portalType: getPortalType(s1, s2),
            reason: inv.reason,
            sourceScholarship: s1,
            targetScholarship: s2,
            conflictType: inv.conflict_type
          });
        }
      }
    });

    // 2. Process Compatible Pairs (Green Edges)
    validCombinations.forEach((val, idx) => {
      if (val.scholarships.length >= 2) {
        for (let i = 0; i < val.scholarships.length; i++) {
          for (let j = i + 1; j < val.scholarships.length; j++) {
            const s1 = val.scholarships[i];
            const s2 = val.scholarships[j];
            if (activeMap.has(s1.id) && activeMap.has(s2.id)) {
              const pairKey = [s1.id, s2.id].sort().join(':::');
              if (!processedPairs.has(pairKey)) {
                processedPairs.add(pairKey);
                list.push({
                  id: `compatible-${idx}-${s1.id}-${s2.id}`,
                  sourceId: s1.id,
                  targetId: s2.id,
                  type: 'compatible',
                  portalType: getPortalType(s1, s2),
                  reason:
                    val.compatibility_status ||
                    'Fully compatible according to verified statutory guidelines with no duplicate tuition subsidies.',
                  sourceScholarship: s1,
                  targetScholarship: s2
                });
              }
            }
          }
        }
      }
    });

    return list;
  }, [activeScholarships, invalidCombinations, validCombinations, scholarships]);

  // Aggregate stats across edge types
  const edgeStats = useMemo(() => {
    const nsp = edges.filter((e) => e.portalType === 'NSP');
    const mahadbt = edges.filter((e) => e.portalType === 'MAHADBT');
    const combined = edges.filter((e) => e.portalType === 'COMBINED');
    return {
      total: edges.length,
      nsp: nsp.length,
      nspCompatible: nsp.filter((e) => e.type === 'compatible').length,
      nspConflict: nsp.filter((e) => e.type === 'conflict').length,
      mahadbt: mahadbt.length,
      mahadbtCompatible: mahadbt.filter((e) => e.type === 'compatible').length,
      mahadbtConflict: mahadbt.filter((e) => e.type === 'conflict').length,
      combined: combined.length,
      combinedCompatible: combined.filter((e) => e.type === 'compatible').length,
      combinedConflict: combined.filter((e) => e.type === 'conflict').length,
      compatible: edges.filter((e) => e.type === 'compatible').length,
      conflict: edges.filter((e) => e.type === 'conflict').length
    };
  }, [edges]);

  // Filtered edges based on user's edge filter and edge portal filter
  const visibleEdges = useMemo(() => {
    return edges.filter((edge) => {
      // 1. Edge compatibility/conflict filter
      if (edgeFilter === 'compatible' && edge.type !== 'compatible') return false;
      if (edgeFilter === 'conflict' && edge.type !== 'conflict') return false;

      // 2. Edge portal type filter (NSP / MahaDBT / Combined)
      if (edgePortalFilter !== 'ALL' && edge.portalType !== edgePortalFilter) return false;

      return true;
    });
  }, [edges, edgeFilter, edgePortalFilter]);

  // Compute node layout (Circular / Elliptical arrangement with smart dynamic radii)
  const nodes: NetworkNode[] = useMemo(() => {
    const count = activeScholarships.length;
    if (count === 0) return [];

    const centerX = 450;
    const centerY = 330;
    const radiusX = Math.min(360, Math.max(220, count * 22));
    const radiusY = Math.min(260, Math.max(160, count * 15));

    return activeScholarships.map((s, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      const isEligible = eligibleScholarships.some((es) => es.id === s.id);

      // Short ID representation
      const shortId = s.source_type === 'MAHADBT'
        ? `MH-${s.id.slice(-4).toUpperCase()}`
        : `NSP-${s.id.slice(-4).toUpperCase()}`;

      return {
        id: s.id,
        scholarship: s,
        shortId,
        isEligible,
        x,
        y,
        radius: 28
      };
    });
  }, [activeScholarships, eligibleScholarships]);

  // Map of node connections
  const nodeConnections = useMemo(() => {
    const map = new Map<string, Set<string>>();
    visibleEdges.forEach((edge) => {
      if (!map.has(edge.sourceId)) map.set(edge.sourceId, new Set());
      if (!map.has(edge.targetId)) map.set(edge.targetId, new Set());
      map.get(edge.sourceId)!.add(edge.targetId);
      map.get(edge.targetId)!.add(edge.sourceId);
    });
    return map;
  }, [visibleEdges]);

  // Selected scholarship object
  const selectedScholarship = useMemo(() => {
    if (!selectedNodeId) return null;
    return activeScholarships.find((s) => s.id === selectedNodeId) || null;
  }, [selectedNodeId, activeScholarships]);

  // Connected relationships for selected scholarship
  const selectedRelationships = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges.filter((e) => e.sourceId === selectedNodeId || e.targetId === selectedNodeId);
  }, [selectedNodeId, edges]);

  // Auto-select first node on load if none selected
  useEffect(() => {
    if (!selectedNodeId && nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
    }
  }, [nodes, selectedNodeId]);

  return (
    <div className="space-y-7">
      {/* HEADER BAR & CONTROLS */}
      <div className="bg-white border border-[#E5E7EB] rounded-none p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                <Network className="w-4 h-4" />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Analytical Engine
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Scholarship Compatibility &amp; Conflict Network
                </h2>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 max-w-2xl">
              Real-time interactive relationship topology computed directly from statutory scheme rules.
              Click nodes or connecting edges to inspect verified compatibility reasons and conflict blocks.
            </p>
          </div>

          {/* Top Level Quick Metrics */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="px-3.5 py-2 rounded-none bg-gray-50 border border-gray-200 text-center">
              <span className="block font-mono text-xs font-bold text-gray-900">
                {nodes.length}
              </span>
              <span className="block text-[10px] font-medium text-gray-500 uppercase">
                Nodes (Schemes)
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-none bg-emerald-50 border border-emerald-200 text-center">
              <span className="block font-mono text-xs font-bold text-emerald-800">
                {edges.filter((e) => e.type === 'compatible').length}
              </span>
              <span className="block text-[10px] font-medium text-emerald-800 uppercase">
                Compatible Links
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-none bg-rose-50 border border-rose-200 text-center">
              <span className="block font-mono text-xs font-bold text-rose-700">
                {edges.filter((e) => e.type === 'conflict').length}
              </span>
              <span className="block text-[10px] font-medium text-rose-700 uppercase">
                Conflict Blocks
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER PANEL TOGGLE BAR */}
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filter Panel Open/Close Toggle Button */}
            <button
              onClick={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
              className={`px-3.5 py-2 rounded-none text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isFilterPanelExpanded || edgePortalFilter !== 'ALL' || edgeFilter !== 'all' || sourceFilter !== 'ALL'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
              <span>Edge &amp; Node Filters</span>
              {(edgePortalFilter !== 'ALL' || edgeFilter !== 'all' || sourceFilter !== 'ALL') && (
                <span className="w-2 h-2 rounded-none bg-emerald-800 animate-pulse" />
              )}
            </button>

            {/* Quick Edge Portal Type Pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-none text-xs">
              <button
                onClick={() => setEdgePortalFilter('ALL')}
                className={`px-3 py-1.5 rounded-none font-medium transition-all cursor-pointer ${
                  edgePortalFilter === 'ALL'
                    ? 'bg-white text-gray-900 font-semibold shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Show all edge types"
              >
                All Edges ({edgeStats.total})
              </button>
              <button
                onClick={() => setEdgePortalFilter('NSP')}
                className={`px-3 py-1.5 rounded-none font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  edgePortalFilter === 'NSP'
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : 'text-blue-700 hover:bg-blue-50'
                }`}
                title="Intra-NSP Central schemes only"
              >
                <span className={`w-1.5 h-1.5 rounded-none ${edgePortalFilter === 'NSP' ? 'bg-white' : 'bg-blue-600'}`} />
                <span>NSP ({edgeStats.nsp})</span>
              </button>
              <button
                onClick={() => setEdgePortalFilter('MAHADBT')}
                className={`px-3 py-1.5 rounded-none font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  edgePortalFilter === 'MAHADBT'
                    ? 'bg-emerald-800 text-white font-semibold shadow-2xs'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
                title="Intra-MahaDBT State schemes only"
              >
                <span className={`w-1.5 h-1.5 rounded-none ${edgePortalFilter === 'MAHADBT' ? 'bg-white' : 'bg-emerald-800'}`} />
                <span>MahaDBT ({edgeStats.mahadbt})</span>
              </button>
              <button
                onClick={() => setEdgePortalFilter('COMBINED')}
                className={`px-3 py-1.5 rounded-none font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  edgePortalFilter === 'COMBINED'
                    ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
                title="Cross-Portal NSP × MahaDBT interactions"
              >
                <span className={`w-1.5 h-1.5 rounded-none ${edgePortalFilter === 'COMBINED' ? 'bg-white' : 'bg-purple-600'}`} />
                <span>Combined ({edgeStats.combined})</span>
              </button>
            </div>
          </div>

          {/* Search & View Mode */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search node / scheme..."
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-none text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center bg-gray-100 p-1 rounded-none text-xs">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-3 py-1.5 rounded-none font-medium cursor-pointer ${
                  viewMode === 'graph' ? 'bg-white text-gray-900 font-semibold shadow-2xs' : 'text-gray-600'
                }`}
              >
                Graph
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-none font-medium cursor-pointer ${
                  viewMode === 'matrix' ? 'bg-white text-gray-900 font-semibold shadow-2xs' : 'text-gray-600'
                }`}
              >
                Matrix
              </button>
            </div>
          </div>
        </div>

        {/* EXPANDABLE DEDICATED FILTER PANEL */}
        {isFilterPanelExpanded && (
          <div className="mt-5 pt-5 border-t border-gray-100 bg-gray-50/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-none animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide font-mono">
                  Network Edge &amp; Node Filter Panel
                </span>
              </div>

              {/* Reset Filters */}
              {(edgePortalFilter !== 'ALL' || edgeFilter !== 'all' || sourceFilter !== 'ALL' || searchQuery.trim() !== '') && (
                <button
                  onClick={() => {
                    setEdgePortalFilter('ALL');
                    setEdgeFilter('all');
                    setSourceFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-xs">
              {/* FILTER 1: EDGE PORTAL TYPE (NSP / MahaDBT / Combined) */}
              <div className="bg-white border border-gray-200 rounded-none p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">
                    1. Edge Portal Interaction
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">
                    {visibleEdges.length} visible
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 mb-3">
                  Filter relationships by portal scope (Intra-portal vs. Cross-portal stacking):
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEdgePortalFilter('ALL')}
                    className={`p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                      edgePortalFilter === 'ALL'
                        ? 'border-gray-900 bg-gray-900 text-white shadow-2xs font-semibold'
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="block font-bold text-xs">All Types</span>
                    <span className={`block text-[10px] ${edgePortalFilter === 'ALL' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {edgeStats.total} total edges
                    </span>
                  </button>

                  <button
                    onClick={() => setEdgePortalFilter('NSP')}
                    className={`p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                      edgePortalFilter === 'NSP'
                        ? 'border-blue-600 bg-blue-600 text-white shadow-2xs font-semibold'
                        : 'border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">NSP Only</span>
                      <span className={`w-2 h-2 rounded-none ${edgePortalFilter === 'NSP' ? 'bg-white' : 'bg-blue-600'}`} />
                    </div>
                    <span className={`block text-[10px] ${edgePortalFilter === 'NSP' ? 'text-blue-100' : 'text-blue-700'}`}>
                      {edgeStats.nsp} Central edges
                    </span>
                  </button>

                  <button
                    onClick={() => setEdgePortalFilter('MAHADBT')}
                    className={`p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                      edgePortalFilter === 'MAHADBT'
                        ? 'border-emerald-800 bg-emerald-800 text-white shadow-2xs font-semibold'
                        : 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">MahaDBT</span>
                      <span className={`w-2 h-2 rounded-none ${edgePortalFilter === 'MAHADBT' ? 'bg-white' : 'bg-emerald-800'}`} />
                    </div>
                    <span className={`block text-[10px] ${edgePortalFilter === 'MAHADBT' ? 'text-emerald-100' : 'text-emerald-800'}`}>
                      {edgeStats.mahadbt} State edges
                    </span>
                  </button>

                  <button
                    onClick={() => setEdgePortalFilter('COMBINED')}
                    className={`p-2.5 rounded-none border text-left transition-all cursor-pointer ${
                      edgePortalFilter === 'COMBINED'
                        ? 'border-purple-600 bg-purple-600 text-white shadow-2xs font-semibold'
                        : 'border-purple-100 bg-purple-50/50 hover:bg-purple-100/70 text-purple-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Combined</span>
                      <span className={`w-2 h-2 rounded-none ${edgePortalFilter === 'COMBINED' ? 'bg-white' : 'bg-purple-600'}`} />
                    </div>
                    <span className={`block text-[10px] ${edgePortalFilter === 'COMBINED' ? 'text-purple-100' : 'text-purple-700'}`}>
                      {edgeStats.combined} Cross-portal
                    </span>
                  </button>
                </div>
              </div>

              {/* FILTER 2: RELATIONSHIP STATUS */}
              <div className="bg-white border border-gray-200 rounded-none p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">
                    2. Relationship Status
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 mb-3">
                  Isolate verified compatible pairs vs. statutory conflict blocks:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => setEdgeFilter('all')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      edgeFilter === 'all'
                        ? 'border-gray-900 bg-gray-900 text-white font-semibold'
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>All Relations (Compatible + Conflicts)</span>
                    <span className="font-mono text-[10px]">
                      {edgeStats.total}
                    </span>
                  </button>

                  <button
                    onClick={() => setEdgeFilter('compatible')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      edgeFilter === 'compatible'
                        ? 'border-emerald-800 bg-emerald-800 text-white font-semibold'
                        : 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Compatible Only (Stackable)</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {edgeStats.compatible}
                    </span>
                  </button>

                  <button
                    onClick={() => setEdgeFilter('conflict')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      edgeFilter === 'conflict'
                        ? 'border-rose-600 bg-rose-600 text-white font-semibold'
                        : 'border-rose-100 bg-rose-50/50 hover:bg-rose-100/70 text-rose-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Conflict Blocks Only</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold">
                      {edgeStats.conflict}
                    </span>
                  </button>
                </div>
              </div>

              {/* FILTER 3: SCHEME NODES SCOPE */}
              <div className="bg-white border border-gray-200 rounded-none p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wide">
                    3. Scheme Nodes Scope
                  </span>
                  <span className="font-mono text-[10px] text-gray-500">
                    {nodes.length} nodes
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 mb-3">
                  Filter evaluated scholarship nodes in the graph canvas:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => setSourceFilter('ALL')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      sourceFilter === 'ALL'
                        ? 'border-gray-900 bg-gray-900 text-white font-semibold'
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>All Portals (NSP + MahaDBT)</span>
                    <span className="font-mono text-[10px]">
                      {eligibleScholarships.length || scholarships.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSourceFilter('NSP')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      sourceFilter === 'NSP'
                        ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                        : 'border-blue-100 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900'
                    }`}
                  >
                    <span>Central NSP Schemes Only</span>
                    <span className="font-mono text-[10px]">
                      {(eligibleScholarships.length ? eligibleScholarships : scholarships).filter((s) => s.source_type === 'NSP').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSourceFilter('MAHADBT')}
                    className={`w-full p-2.5 rounded-none border text-left transition-all flex items-center justify-between cursor-pointer ${
                      sourceFilter === 'MAHADBT'
                        ? 'border-emerald-800 bg-emerald-800 text-white font-semibold'
                        : 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900'
                    }`}
                  >
                    <span>State MahaDBT Schemes Only</span>
                    <span className="font-mono text-[10px]">
                      {(eligibleScholarships.length ? eligibleScholarships : scholarships).filter((s) => s.source_type === 'MAHADBT').length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Summary Bar */}
            <div className="mt-4 pt-4 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-600 flex-wrap gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-700">Active View:</span>
                <span className="px-2.5 py-0.5 rounded-none bg-white border border-gray-200 text-gray-800 font-mono text-[10px]">
                  Edge Type: <strong>{edgePortalFilter}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-none bg-white border border-gray-200 text-gray-800 font-mono text-[10px]">
                  Relation: <strong>{edgeFilter}</strong>
                </span>
                <span className="px-2.5 py-0.5 rounded-none bg-white border border-gray-200 text-gray-800 font-mono text-[10px]">
                  Nodes: <strong>{sourceFilter}</strong>
                </span>
              </div>

              <div className="font-mono text-[10px] text-gray-500">
                Rendering {visibleEdges.length} edges across {nodes.length} nodes
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GRAPH VIEW OR MATRIX VIEW */}
      {viewMode === 'graph' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAIN GRAPH CANVAS */}
          <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-none shadow-xs overflow-hidden flex flex-col relative min-h-[580px]">
            {/* Top Canvas Bar */}
            <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3.5">
                <span className="font-mono text-[10px] uppercase font-bold text-gray-500">
                  Network Canvas
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <span className="w-2.5 h-0.5 bg-emerald-700 rounded-none" />
                    Compatible
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <span className="w-2.5 h-0.5 bg-rose-500 rounded-none" />
                    Conflict
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <span className="w-2 h-2 rounded-none border border-gray-400" />
                    Node
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 font-mono">
                Click node or line to inspect
              </div>
            </div>

            {/* SVG Interactive Topology */}
            <div className="relative flex-1 w-full h-full min-h-[500px] flex items-center justify-center p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {nodes.length === 0 ? (
                <div className="text-center p-8 max-w-sm">
                  <Network className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No scholarships match filter</p>
                  <p className="text-xs text-gray-500 mt-1">Try resetting search or adjusting profile.</p>
                </div>
              ) : (
                <svg
                  viewBox="0 0 900 660"
                  className="w-full h-full max-h-[560px] select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="compatibleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#065F46" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="conflictGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#E11D48" />
                    </linearGradient>
                    <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
                    </filter>
                  </defs>

                  {/* EDGES */}
                  <g className="edges-group">
                    {visibleEdges.map((edge) => {
                      const sourceNode = nodes.find((n) => n.id === edge.sourceId);
                      const targetNode = nodes.find((n) => n.id === edge.targetId);
                      if (!sourceNode || !targetNode) return null;

                      const isSelectedEdge = selectedEdge?.id === edge.id;
                      const isConnectedToSelectedNode =
                        selectedNodeId === edge.sourceId || selectedNodeId === edge.targetId;

                      const isConflict = edge.type === 'conflict';
                      const strokeColor = isConflict ? '#F43F5E' : '#065F46';
                      const strokeWidth = isSelectedEdge ? 3.5 : isConnectedToSelectedNode ? 2.5 : 1.2;
                      const strokeOpacity = selectedNodeId
                        ? isConnectedToSelectedNode
                          ? 0.95
                          : 0.15
                        : 0.6;

                      // Calculate midpoint for label / click area
                      const midX = (sourceNode.x + targetNode.x) / 2;
                      const midY = (sourceNode.y + targetNode.y) / 2;

                      return (
                        <g
                          key={edge.id}
                          className="cursor-pointer group"
                          onClick={() => setSelectedEdge(edge)}
                        >
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                            strokeOpacity={strokeOpacity}
                            strokeDasharray={!isConflict && isConnectedToSelectedNode ? '6 4' : undefined}
                            className="transition-all duration-200"
                          />
                          {/* Invisible thicker line for easier clicking */}
                          <line
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke="transparent"
                            strokeWidth={14}
                          />
                          {/* Mini indicator badge on midpoint */}
                          {(isConnectedToSelectedNode || isSelectedEdge) && (
                            <circle
                              cx={midX}
                              cy={midY}
                              r={6}
                              fill={strokeColor}
                              stroke="#ffffff"
                              strokeWidth={1.5}
                              className="transition-transform group-hover:scale-125"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* NODES */}
                  <g className="nodes-group">
                    {nodes.map((node) => {
                      const isSelected = selectedNodeId === node.id;
                      const isHovered = hoveredNodeId === node.id;
                      const isConnected =
                        selectedNodeId && nodeConnections.get(selectedNodeId)?.has(node.id);
                      const isMaha = node.scholarship.source_type === 'MAHADBT';

                      const opacity =
                        selectedNodeId && !isSelected && !isConnected ? 0.35 : 1;

                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          className="cursor-pointer transition-all duration-200"
                          opacity={opacity}
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            setSelectedEdge(null);
                            onSelectScholarship?.(node.scholarship);
                          }}
                          onMouseEnter={() => setHoveredNodeId(node.id)}
                          onMouseLeave={() => setHoveredNodeId(null)}
                        >
                          {/* Selection Pulse Ring */}
                          {isSelected && (
                            <circle
                              r={36}
                              fill="none"
                              stroke="#065F46"
                              strokeWidth={2}
                              strokeDasharray="4 3"
                              className="animate-spin-slow"
                            />
                          )}

                          {/* Base Node Circle */}
                          <circle
                            r={node.radius}
                            fill={isSelected ? '#0F172A' : '#FFFFFF'}
                            stroke={
                              isSelected
                                ? '#065F46'
                                : isConnected
                                ? '#047857'
                                : isMaha
                                ? '#047857'
                                : '#3B82F6'
                            }
                            strokeWidth={isSelected ? 3 : isConnected ? 2.5 : 2}
                            filter="url(#shadowFilter)"
                          />

                          {/* Inner Accent Dot / Provider marker */}
                          <circle
                            cx={0}
                            cy={-10}
                            r={3}
                            fill={isMaha ? '#047857' : '#3B82F6'}
                          />

                          {/* Node Text Label (Short ID) */}
                          <text
                            textAnchor="middle"
                            dy={4}
                            fontSize={9}
                            fontFamily="monospace"
                            fontWeight="bold"
                            fill={isSelected ? '#FFFFFF' : '#1E293B'}
                          >
                            {node.shortId}
                          </text>

                          {/* Max Benefit Hint below node */}
                          <text
                            textAnchor="middle"
                            dy={14}
                            fontSize={7.5}
                            fontFamily="sans-serif"
                            fontWeight="600"
                            fill={isSelected ? '#6EE7B7' : '#64748B'}
                          >
                            {node.scholarship.benefit_amount
                              ? formatINR(node.scholarship.benefit_amount)
                              : 'Tuition Waiver'}
                          </text>

                          {/* Full Name Tooltip Box (on hover / selection) */}
                          {(isSelected || isHovered) && (
                            <g transform="translate(0, -42)">
                              <rect
                                x={-110}
                                y={-22}
                                width={220}
                                height={26}
                                rx={0}
                                fill="#0F172A"
                                opacity={0.95}
                              />
                              <text
                                textAnchor="middle"
                                y={-5}
                                fontSize={9.5}
                                fontWeight="bold"
                                fill="#FFFFFF"
                              >
                                {node.scholarship.name.length > 32
                                  ? `${node.scholarship.name.slice(0, 30)}...`
                                  : node.scholarship.name}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              )}
            </div>

            {/* EDGE INSPECTION BANNER (When edge is clicked) */}
            {selectedEdge && (
              <div className="absolute bottom-4 left-4 right-4 bg-gray-900 text-white p-5 rounded-none shadow-xl border border-gray-700 animate-in fade-in slide-in-from-bottom-2 z-20">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-none ${
                          selectedEdge.type === 'conflict'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {selectedEdge.type === 'conflict' ? 'Conflict Block' : 'Compatible Relationship'}
                      </span>

                      {/* Edge Portal Type Badge */}
                      <span
                        className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-none flex items-center gap-1 ${
                          selectedEdge.portalType === 'COMBINED'
                            ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30'
                            : selectedEdge.portalType === 'MAHADBT'
                            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/25 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {selectedEdge.portalType === 'COMBINED' && <Layers className="w-3 h-3" />}
                        <span>
                          {selectedEdge.portalType === 'COMBINED'
                            ? 'Cross-Portal: NSP × MahaDBT'
                            : selectedEdge.portalType === 'MAHADBT'
                            ? 'Intra-Portal: MahaDBT'
                            : 'Intra-Portal: NSP'}
                        </span>
                      </span>

                      {selectedEdge.conflictType && (
                        <span className="font-mono text-[9px] uppercase text-gray-400">
                          Type: {selectedEdge.conflictType}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-gray-200">
                      Between:{' '}
                      <span className="text-white font-bold">{selectedEdge.sourceScholarship.name}</span>{' '}
                      &amp;{' '}
                      <span className="text-white font-bold">{selectedEdge.targetScholarship.name}</span>
                    </p>

                    <p className="text-xs text-gray-300 leading-relaxed pt-1">
                      <strong className="text-gray-100">Statutory Reason:</strong> {selectedEdge.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedEdge(null)}
                    className="p-1 rounded-none text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDE DETAILS PANEL (Selected Node & Connections) */}
          <div className="lg:col-span-4 space-y-4.5">
            {selectedScholarship ? (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-5 sm:p-6 shadow-xs space-y-5">
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-200 uppercase">
                      Selected Node ({selectedScholarship.source_type || 'NSP'})
                    </span>
                    <span className="text-xs font-bold text-gray-900 font-mono">
                      {selectedScholarship.benefit_amount
                        ? formatINR(selectedScholarship.benefit_amount)
                        : 'Tuition Waiver'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug">
                    {selectedScholarship.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{selectedScholarship.department || selectedScholarship.provider}</span>
                  </p>
                </div>

                {/* Compatibility Summary */}
                <div className="p-4 rounded-none bg-gray-50 border border-gray-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">Connected Relationships</span>
                    <span className="font-mono text-xs font-bold text-gray-900">
                      {selectedRelationships.length} Mapped
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 rounded-none bg-emerald-50 border border-emerald-200">
                      <span className="block text-[10px] font-semibold text-emerald-900 uppercase">
                        Compatible
                      </span>
                      <span className="font-mono font-bold text-emerald-950 text-sm">
                        {selectedRelationships.filter((r) => r.type === 'compatible').length}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-none bg-rose-50 border border-rose-200">
                      <span className="block text-[10px] font-semibold text-rose-800 uppercase">
                        Conflicts
                      </span>
                      <span className="font-mono font-bold text-rose-900 text-sm">
                        {selectedRelationships.filter((r) => r.type === 'conflict').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Relationship Breakdown List */}
                <div className="space-y-2.5">
                  <span className="font-mono text-[10px] uppercase font-bold text-gray-500 block">
                    Relationship Breakdown
                  </span>

                  {selectedRelationships.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-2">
                      No direct paired rules mapped in the current visible set.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {selectedRelationships.map((rel) => {
                        const partner =
                          rel.sourceId === selectedScholarship.id
                            ? rel.targetScholarship
                            : rel.sourceScholarship;
                        const isConflict = rel.type === 'conflict';

                        return (
                          <div
                            key={rel.id}
                            onClick={() => setSelectedEdge(rel)}
                            className={`p-3 rounded-none border transition-all cursor-pointer text-xs ${
                              isConflict
                                ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                                : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-none ${
                                  isConflict
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-emerald-100 text-emerald-900'
                                }`}
                              >
                                {isConflict ? 'Conflict' : 'Compatible'}
                              </span>
                              <span className="font-mono text-[10px] text-gray-500 font-medium">
                                {partner.source_type}
                              </span>
                            </div>

                            <p className="font-semibold text-gray-900 line-clamp-1">
                              {partner.name}
                            </p>

                            <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">
                              {rel.reason}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5">
                  <button
                    onClick={() => onSelectScholarship?.(selectedScholarship)}
                    className="flex-1 px-4 py-2.5 rounded-none bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {selectedScholarship.official_application_url && (
                    <a
                      href={selectedScholarship.official_application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-none bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors flex items-center gap-1"
                      title="Open official portal application page"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-6 text-center shadow-xs">
                <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700">Select any node to inspect details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* MATRIX TABLE VIEW */
        <div className="bg-white border border-[#E5E7EB] rounded-none shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pairwise Compatibility &amp; Conflict Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Tabular audit of all evaluated scholarship pairs and statutory rulings.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-gray-600">
              {edges.length} Paired Rulings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-mono text-[10px] uppercase">
                  <th className="py-3.5 px-4.5">Scholarship A</th>
                  <th className="py-3.5 px-4.5">Scholarship B</th>
                  <th className="py-3.5 px-4.5">Edge Scope</th>
                  <th className="py-3.5 px-4.5">Status</th>
                  <th className="py-3.5 px-4.5">Statutory Rule / Reasoning</th>
                  <th className="py-3.5 px-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleEdges.map((edge) => {
                  const isConflict = edge.type === 'conflict';
                  return (
                    <tr key={edge.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4.5">
                        <span className="font-bold text-gray-900 block line-clamp-1">
                          {edge.sourceScholarship.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {edge.sourceScholarship.source_type} · {edge.sourceScholarship.department || edge.sourceScholarship.provider}
                        </span>
                      </td>

                      <td className="py-3.5 px-4.5">
                        <span className="font-bold text-gray-900 block line-clamp-1">
                          {edge.targetScholarship.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {edge.targetScholarship.source_type} · {edge.targetScholarship.department || edge.targetScholarship.provider}
                        </span>
                      </td>

                      <td className="py-3.5 px-4.5">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-none border ${
                            edge.portalType === 'COMBINED'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : edge.portalType === 'MAHADBT'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}
                        >
                          {edge.portalType === 'COMBINED'
                            ? 'Combined'
                            : edge.portalType === 'MAHADBT'
                            ? 'MahaDBT'
                            : 'NSP'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4.5">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-none ${
                            isConflict
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {isConflict ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          <span>{isConflict ? 'Conflict' : 'Compatible'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4.5 text-gray-700 leading-relaxed max-w-md">
                        {edge.reason}
                      </td>

                      <td className="py-3.5 px-4.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedNodeId(edge.sourceScholarship.id);
                            setViewMode('graph');
                            setSelectedEdge(edge);
                          }}
                          className="px-3 py-1.5 rounded-none bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
