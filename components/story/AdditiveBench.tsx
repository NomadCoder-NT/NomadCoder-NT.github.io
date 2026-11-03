'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scan,
  Cpu,
  Layers,
  Send,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Terminal,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '@/components/sound/sound-synthesizer';

interface StageData {
  id: string;
  number: string;
  title: string;
  kicker: string;
  metric: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  description: string;
  deepDive: {
    step: string;
    title: string;
    detail: string;
  }[];
  telemetry: Record<string, string>;
}

const STAGES: StageData[] = [
  {
    id: 'scan-sculpt',
    number: '01',
    title: 'SCAN & SCULPT',
    kicker: 'Photogrammetric Mesh & Digital Clay',
    metric: '1.24M Polys',
    badge: 'SURFACE EXTRACTION',
    icon: Scan,
    accentColor: 'text-cyan-400',
    accentBorder: 'border-cyan-400/40',
    accentBg: 'bg-cyan-500/10',
    description:
      'High-resolution photogrammetric capture of Odisha’s 10th-century Mukteshvara Torana arch. Processing 480+ multi-angle RAW exposures into a dense, non-destructive digital clay sculpt preserving intricate floral scrollwork and sacred Kalinga geometric motifs.',
    deepDive: [
      {
        step: '01.A',
        title: 'Structure-from-Motion Point Cloud',
        detail:
          'Triangulated 480 high-contrast calibrated camera exposures resolving 18.2 million spatial point cloud descriptors with sub-millimeter positional parity.',
      },
      {
        step: '01.B',
        title: 'Digital Clay Dynamesh Restoration',
        detail:
          'Non-destructive sculpt reconstruction repairing centuries of weathered stone erosion while preserving genuine 10th-century temple architectural proportions.',
      },
      {
        step: '01.C',
        title: 'Tangent-Space Normal Projection',
        detail:
          'Baking 8K high-frequency normal and displacement maps capturing 0.08mm surface grain relief for accurate physical reflection and tooling.',
      },
    ],
    telemetry: {
      'Source Resolution': '480 RAW Captures (61MP Full-Frame)',
      'Raw Point Cloud': '18,240,000 Points',
      'Target Polycount': '1,240,000 Quad Polygons',
      'Curvature Parity': '99.4% Archaeological Accuracy',
    },
  },
  {
    id: 'topology-engine',
    number: '02',
    title: 'TOPOLOGY ENGINE',
    kicker: 'Manifold Decimation & Wall Thickness',
    metric: '0 Non-Manifold Errors',
    badge: 'GEOMETRIC INTEGRITY',
    icon: Cpu,
    accentColor: 'text-emerald-400',
    accentBorder: 'border-emerald-400/40',
    accentBg: 'bg-emerald-500/10',
    description:
      'Algorithmic mesh conditioning for physical fabrication. Eliminating intersecting self-facets, zero-area polygons, and non-manifold edges while enforcing uniform 2.2mm shell wall thickness to eliminate thermal shrinkage warp during curing.',
    deepDive: [
      {
        step: '02.A',
        title: 'Uniform Shelling & Internal Hollow',
        detail:
          'Generated 2.2mm uniform internal wall offsets, reducing mass by 42% while retaining high compressive rigidity and structural equilibrium.',
      },
      {
        step: '02.B',
        title: 'Suction Relief Drainage Conduits',
        detail:
          'Strategically integrated dual 4.0mm internal drainage ports eliminating vacuum cupping forces during VAT resin peel separation cycles.',
      },
      {
        step: '02.C',
        title: 'Watertight Euler Verification',
        detail:
          'Automated validation pipeline enforcing Euler characteristic χ = 2, guaranteeing zero open boundaries, degenerate vertices, or non-manifold edges.',
      },
    ],
    telemetry: {
      'Shell Wall Gauge': '2.20mm ± 0.04mm Uniform',
      'Non-Manifold Edges': '0 (100% Watertight Closed Mesh)',
      'Internal Cavity Volume': '-42% Resin Consumption',
      'Euler Integrity': 'χ = 2 (Watertight Polyhedron)',
    },
  },
  {
    id: 'precision-slicing',
    number: '03',
    title: 'PRECISION SLICING',
    kicker: 'Volumetric Additive Fabrication',
    metric: '±0.15mm Tolerance',
    badge: 'VOLUMETRIC SLICING',
    icon: Layers,
    accentColor: 'text-amber-400',
    accentBorder: 'border-amber-400/40',
    accentBg: 'bg-amber-500/10',
    description:
      'Micro-layer toolpath preparation. Converting continuous parametric surfaces into sub-50µm exposure layers with optimized contact-tree orientation to prevent shear deflection across the 240mm Mukteshvara arch span.',
    deepDive: [
      {
        step: '03.A',
        title: 'Adaptive Layer Slicing (25µm – 50µm)',
        detail:
          'Variable layer height interpolation resolving intricate Makara torana cusps at 25µm while accelerating structural column shafts at 50µm.',
      },
      {
        step: '03.B',
        title: 'Algorithmic Support Tree Synthesis',
        detail:
          'Designed branching support lattices with 0.30mm micro-touchpoints situated exclusively on non-aesthetic undercut surfaces for zero-scar release.',
      },
      {
        step: '03.C',
        title: 'Dynamic UV Exposure Profiling',
        detail:
          'Calibrated layer cure dynamics (2.3s layer / 18s base burn) neutralizing resin shrinkage stress and locking ±0.15mm dimensional tolerance.',
      },
    ],
    telemetry: {
      'Z-Axis Layer Height': '25µm (Fine) / 50µm (Coarse)',
      'Toolpath Precision': '±0.15mm Dimensional Tolerance',
      'Support Touchpoint': '0.30mm Micro-Release Tips',
      'Peel Lift Cycle': '3.2s Controlled Linear Retract',
    },
  },
  {
    id: 'material-dispatch',
    number: '04',
    title: 'MATERIAL DISPATCH',
    kicker: 'Cold-Cast Bronze & Multi-Stage Finishing',
    metric: 'Next.js + ICICI Gateway',
    badge: 'COMMERCE & LOGISTICS',
    icon: Send,
    accentColor: 'text-yellow-400',
    accentBorder: 'border-yellow-400/40',
    accentBg: 'bg-yellow-500/10',
    description:
      'From raw photopolymer print to physical collector sculpture and global distribution. Cold-casting in real bronze powder matrix, hand-patination with liver of sulfur, and headless automated e-commerce order routing.',
    deepDive: [
      {
        step: '04.A',
        title: 'Cold-Cast Bronze Metal Matrix',
        detail:
          'Infused ultra-fine 325-mesh atomized bronze powder into liquid polyurethane resin, followed by steel-wool hand buffing to yield genuine cold metallic mass.',
      },
      {
        step: '04.B',
        title: 'Chemical Liver of Sulfur Oxidation',
        detail:
          'Artisanal multi-stage acid patina inducing deep aged bronze shadows and authentic verdigris highlights across carved arch medallions.',
      },
      {
        step: '04.C',
        title: 'Automated ICICI Gateway & Fulfillment',
        detail:
          'Headless Next.js 15 App Router web store synchronizing real-time inventory, automated PDF verification certificates, and secure ICICI payment routing.',
      },
    ],
    telemetry: {
      'Metal Powder Matrix': '80% Real Atomized Bronze (325 Mesh)',
      'Surface Finishing': 'Steel Wool Buff + Chemical Patina',
      'Finished Sculpture Mass': '1.42kg Solid Structural Feel',
      'E-Commerce Pipeline': 'Next.js 15 + ICICI Merchant Gateway',
    },
  },
];

export function AdditiveBench() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const currentStage = STAGES[activeStageIdx];
  const Icon = currentStage.icon;

  const handleSelectStage = (idx: number) => {
    setActiveStageIdx(idx);
    soundEngine.playHapticFeedback('subtle');
  };

  return (
    <section className="py-24 px-4 md:px-12 relative overflow-hidden flex items-center justify-center">
      {/* Container Card in bbsrguy.github.io Obsidian Glass Styling */}
      <div className="w-full max-w-5xl rounded-2xl bg-[#090d16]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle Accent Glow Ring in Current Stage Hue */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-500 ${currentStage.accentBg}`}
          aria-hidden="true"
        />

        {/* Header Kicker Badge & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono font-semibold tracking-wider text-neutral-300 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                05½ // SYSTEMS PIPELINE
              </span>
              <span className="text-white/20 select-none font-mono">/</span>
              <span className="text-[11px] font-mono text-neutral-400">
                TEMPLECITY ATELIER
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              THE MANUFACTURING & COMPUTATIONAL BENCH
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl font-normal">
              An end-to-end cyber-physical pipeline transforming 10th-century Kalinga temple architecture into precision-engineered, manifold additive sculptures.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-neutral-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>4 Pipeline Stages Online</span>
          </div>
        </div>

        {/* 4 Interactive Stage Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {STAGES.map((stage, idx) => {
            const isSelected = idx === activeStageIdx;
            const StageIcon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => handleSelectStage(idx)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                  isSelected
                    ? `bg-white/[0.06] ${stage.accentBorder} shadow-lg shadow-black/40`
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="activeBenchTab"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 rounded-t-xl"
                  />
                )}

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isSelected ? stage.accentColor : 'text-neutral-500'
                      }`}
                    >
                      {stage.number}
                    </span>
                    <span className="text-xs font-mono font-semibold tracking-wider text-neutral-200">
                      {stage.title}
                    </span>
                  </div>
                  <StageIcon
                    className={`w-4 h-4 transition-colors ${
                      isSelected ? stage.accentColor : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}
                  />
                </div>

                <span className="text-[11px] text-neutral-400 font-sans line-clamp-1 mb-2">
                  {stage.kicker}
                </span>

                <div className="mt-auto pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-500">Benchmark:</span>
                  <span className={`font-semibold ${isSelected ? stage.accentColor : 'text-neutral-300'}`}>
                    {stage.metric}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Deep Dive */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Stage Title, Badge & Overview */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#040711]/90 border border-white/[0.08] shadow-inner">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${currentStage.accentBg} ${currentStage.accentColor} border ${currentStage.accentBorder}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                      STAGE {currentStage.number} // {currentStage.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {currentStage.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono">
                  <span className="text-neutral-400">Spec:</span>
                  <span className={`font-bold ${currentStage.accentColor}`}>
                    {currentStage.metric}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                {currentStage.description}
              </p>
            </div>

            {/* Step-by-Step Engineering Execution Protocol */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">
                <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                <span>Execution Steps & Verification Protocol</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentStage.deepDive.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`font-bold ${currentStage.accentColor}`}>
                        {item.step}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
                    </div>
                    <h4 className="text-sm font-semibold text-neutral-100 font-sans">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Specs Telemetry Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Engineering Telemetry & Verification Grid</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-[#03060d]/90 border border-white/[0.08]">
                {Object.entries(currentStage.telemetry).map(([key, val], idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                      {key}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-neutral-100 block">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Pipeline Footnote */}
        <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Fabrication Stack: Photogrammetry → Blender CAD → Chitubox Slicer → MSLA Additive</span>
          </div>
          <span className="text-neutral-400">Precision: ±0.15mm · Real Bronze Cold-Cast</span>
        </div>
      </div>
    </section>
  );
}
