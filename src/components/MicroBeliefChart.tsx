import React, { useState } from 'react';
import { StepRecord } from '../types';
import { Eye, Shield, Activity, AlertTriangle } from 'lucide-react';

interface MicroBeliefChartProps {
  records: StepRecord[];
}

export const MicroBeliefChart: React.FC<MicroBeliefChartProps> = ({ records }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const steps = records.length;
  if (steps === 0) return null;

  const width = 800;
  const height = 240;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 35;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const toSvgX = (idx: number) => padLeft + (idx / (steps - 1)) * plotW;
  const toSvgY = (prob: number) => padTop + plotH - prob * plotH;

  // Build stacked paths for b(s0), b(s1), b(s2)
  // Base 0 -> b0 -> b0+b1 -> 1.0 (b0+b1+b2)
  let pathS0 = `M ${toSvgX(0)} ${toSvgY(0)}`;
  for (let i = 0; i < steps; i++) {
    pathS0 += ` L ${toSvgX(i)} ${toSvgY(records[i].belief[0])}`;
  }
  pathS0 += ` L ${toSvgX(steps - 1)} ${toSvgY(0)} Z`;

  let pathS1 = `M ${toSvgX(0)} ${toSvgY(records[0].belief[0])}`;
  for (let i = 0; i < steps; i++) {
    const top = records[i].belief[0] + records[i].belief[1];
    pathS1 += ` L ${toSvgX(i)} ${toSvgY(top)}`;
  }
  for (let i = steps - 1; i >= 0; i--) {
    pathS1 += ` L ${toSvgX(i)} ${toSvgY(records[i].belief[0])}`;
  }
  pathS1 += ` Z`;

  let pathS2 = `M ${toSvgX(0)} ${toSvgY(records[0].belief[0] + records[0].belief[1])}`;
  for (let i = 0; i < steps; i++) {
    pathS2 += ` L ${toSvgX(i)} ${toSvgY(1.0)}`;
  }
  for (let i = steps - 1; i >= 0; i--) {
    const bottom = records[i].belief[0] + records[i].belief[1];
    pathS2 += ` L ${toSvgX(i)} ${toSvgY(bottom)}`;
  }
  pathS2 += ` Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (width / rect.width);
    const relX = mouseX - padLeft;
    if (relX >= 0 && relX <= plotW) {
      const idx = Math.round((relX / plotW) * (steps - 1));
      setHoverIdx(Math.max(0, Math.min(steps - 1, idx)));
    }
  };

  const handleTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (touch.clientX - rect.left) * (width / rect.width);
    const relX = mouseX - padLeft;
    if (relX >= 0 && relX <= plotW) {
      const idx = Math.round((relX / plotW) * (steps - 1));
      setHoverIdx(Math.max(0, Math.min(steps - 1, idx)));
    }
  };

  const activeRec = hoverIdx !== null ? records[hoverIdx] : records[records.length - 1];

  const stateNames = ['安全未污染 (s₀)', '轻度可疑样本 (s₁)', '严重后门植入 (s₂)'];
  const actionNames = ['a₁ 常规检测', 'a₂ 强化检测清洗', 'a₃ 回滚重训'];
  const actionBadges = [
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'bg-rose-500/20 text-rose-300 border-rose-500/30'
  ];
  const obsNames = ['低异常 (Low)', '中异常 (Med)', '高异常 (High)'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            微观 POMDP 信念分布堆叠演化 (Belief Simplex: b(s₀), b(s₁), b(s₂))
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400">
            带噪观测滤波与动态处置升级时序联动
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/60 border border-emerald-400"></span>
            <span className="text-slate-300">b(s₀) 安全概率</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/60 border border-amber-400"></span>
            <span className="text-slate-300">b(s₁) 轻度投毒</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/60 border border-rose-400"></span>
            <span className="text-slate-300">b(s₂) 严重后门</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none touch-manipulation"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
          onTouchMove={handleTouch}
          onTouchEnd={() => setHoverIdx(null)}
        >
          {/* Y ticks & grid */}
          {[0, 0.5, 1.0].map(v => (
            <g key={`belief-y-${v}`}>
              <line
                x1={padLeft}
                y1={toSvgY(v)}
                x2={width - padRight}
                y2={toSvgY(v)}
                stroke="#1e293b"
                strokeDasharray="2 2"
              />
              <text
                x={padLeft - 8}
                y={toSvgY(v) + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-mono"
              >
                {v.toFixed(1)}
              </text>
            </g>
          ))}

          {/* Stacked areas */}
          <path d={pathS0} fill="#10b981" fillOpacity="0.45" stroke="#10b981" strokeWidth="1" />
          <path d={pathS1} fill="#f59e0b" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="1" />
          <path d={pathS2} fill="#f43f5e" fillOpacity="0.55" stroke="#f43f5e" strokeWidth="1" />

          {/* Action indicator glyphs at bottom */}
          {records.map((rec, i) => {
            if (i % 2 === 0) {
              const glyphY = padTop + plotH + 14;
              const col = rec.action === 0 ? '#10b981' : (rec.action === 1 ? '#38bdf8' : '#f43f5e');
              return (
                <circle
                  key={`act-dot-${i}`}
                  cx={toSvgX(i)}
                  cy={glyphY}
                  r="2"
                  fill={col}
                />
              );
            }
            return null;
          })}

          {/* Hover indicator line */}
          {hoverIdx !== null && (
            <line
              x1={toSvgX(hoverIdx)}
              y1={padTop}
              x2={toSvgX(hoverIdx)}
              y2={padTop + plotH}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}
        </svg>
      </div>

      {/* Synchronized Micro Event Card: 移动端采用2列网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] sm:text-xs">
            <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            真实隐状态 s_t
          </span>
          <p className="font-semibold text-white text-[11px] sm:text-xs">
            {stateNames[activeRec.trueState]}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] sm:text-xs">
            <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            异常观测 o_t
          </span>
          <p className="font-mono text-amber-300 font-semibold text-[11px] sm:text-xs">
            {obsNames[activeRec.observation]}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] sm:text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            处置决策 a_t
          </span>
          <span className={`inline-block px-2 py-0.5 rounded border text-[10px] sm:text-[11px] font-semibold ${actionBadges[activeRec.action]}`}>
            {actionNames[activeRec.action]}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] sm:text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            当前信念 b_t
          </span>
          <p className="font-mono text-[10px] sm:text-[11px] text-slate-300 truncate">
            [{activeRec.belief[0]}, {activeRec.belief[1]}, {activeRec.belief[2]}]
          </p>
        </div>
      </div>
    </div>
  );
};
