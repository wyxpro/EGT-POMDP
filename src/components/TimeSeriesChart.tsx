import React, { useState } from 'react';
import { StepRecord } from '../types';

interface TimeSeriesChartProps {
  twoWayRecords: StepRecord[];
  oneWayRecords?: StepRecord[];
  showFeedback?: boolean;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  twoWayRecords,
  oneWayRecords,
  showFeedback = true
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const steps = twoWayRecords.length;
  if (steps === 0) return null;

  const width = 800;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const plotW = width - paddingLeft - paddingRight;
  const plotH = height - paddingTop - paddingBottom;

  const toSvgX = (stepIdx: number) => paddingLeft + (stepIdx / (steps - 1)) * plotW;
  const toSvgY = (val: number, maxVal = 1.0) => paddingTop + plotH - (Math.max(0, Math.min(maxVal, val)) / maxVal) * plotH;

  const twoWayXPath = twoWayRecords.reduce((acc, rec, idx) => {
    return idx === 0 ? `M ${toSvgX(idx)} ${toSvgY(rec.x)}` : `${acc} L ${toSvgX(idx)} ${toSvgY(rec.x)}`;
  }, '');

  const twoWayYPath = twoWayRecords.reduce((acc, rec, idx) => {
    return idx === 0 ? `M ${toSvgX(idx)} ${toSvgY(rec.y)}` : `${acc} L ${toSvgX(idx)} ${toSvgY(rec.y)}`;
  }, '');

  const oneWayXPath = oneWayRecords ? oneWayRecords.reduce((acc, rec, idx) => {
    return idx === 0 ? `M ${toSvgX(idx)} ${toSvgY(rec.x)}` : `${acc} L ${toSvgX(idx)} ${toSvgY(rec.x)}`;
  }, '') : '';

  const oneWayYPath = oneWayRecords ? oneWayRecords.reduce((acc, rec, idx) => {
    return idx === 0 ? `M ${toSvgX(idx)} ${toSvgY(rec.y)}` : `${acc} L ${toSvgX(idx)} ${toSvgY(rec.y)}`;
  }, '') : '';

  const omegaPath = showFeedback ? twoWayRecords.reduce((acc, rec, idx) => {
    // scale omega to [0, 1] relative to max approx 0.8
    const scaled = Math.min(1.0, rec.omegaNorm * 2.0);
    return idx === 0 ? `M ${toSvgX(idx)} ${toSvgY(scaled)}` : `${acc} L ${toSvgX(idx)} ${toSvgY(scaled)}`;
  }, '') : '';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (width / rect.width);
    const relX = mouseX - paddingLeft;
    if (relX >= 0 && relX <= plotW) {
      const idx = Math.round((relX / plotW) * (steps - 1));
      setHoverIndex(Math.max(0, Math.min(steps - 1, idx)));
    }
  };

  const activeRec = hoverIndex !== null ? twoWayRecords[hoverIndex] : twoWayRecords[twoWayRecords.length - 1];
  const activeOneWayRec = (hoverIndex !== null && oneWayRecords) ? oneWayRecords[hoverIndex] : (oneWayRecords ? oneWayRecords[oneWayRecords.length - 1] : null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            博弈策略概率时序演化曲线 (Temporal Dynamics: t ↦ x, y)
          </h4>
          <p className="text-xs text-slate-400">
            对比双向阻尼收敛与无反馈周期振荡
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-rose-400"></span>
            <span className="text-slate-300">投毒者比例 x(t) [双向]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-cyan-400"></span>
            <span className="text-slate-300">防御能力 y(t) [双向]</span>
          </div>
          {oneWayRecords && (
            <>
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="w-3.5 h-0.5 bg-rose-400 border-dashed border-t"></span>
                <span className="text-slate-400">x(t) [单向震荡]</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="w-3.5 h-0.5 bg-cyan-400 border-dashed border-t"></span>
                <span className="text-slate-400">y(t) [单向震荡]</span>
              </div>
            </>
          )}
          {showFeedback && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-purple-400"></span>
              <span className="text-purple-300">动态反馈价值 Ω̃_t</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map(v => (
            <g key={`y-grid-${v}`}>
              <line
                x1={paddingLeft}
                y1={toSvgY(v)}
                x2={width - paddingRight}
                y2={toSvgY(v)}
                stroke="#1e293b"
                strokeDasharray="2 2"
              />
              <text
                x={paddingLeft - 10}
                y={toSvgY(v) + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-mono"
              >
                {v.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X ticks */}
          {[0, Math.floor(steps * 0.25), Math.floor(steps * 0.5), Math.floor(steps * 0.75), steps - 1].map(sIdx => (
            <g key={`x-tick-${sIdx}`}>
              <line
                x1={toSvgX(sIdx)}
                y1={paddingTop + plotH}
                x2={toSvgX(sIdx)}
                y2={paddingTop + plotH + 5}
                stroke="#475569"
              />
              <text
                x={toSvgX(sIdx)}
                y={paddingTop + plotH + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-400 font-mono"
              >
                t={sIdx}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={paddingLeft}
            y1={paddingTop + plotH}
            x2={width - paddingRight}
            y2={paddingTop + plotH}
            stroke="#64748b"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={paddingTop + plotH}
            stroke="#64748b"
          />

          {/* One-way curves (dashed) */}
          {oneWayXPath && (
            <path
              d={oneWayXPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.45"
            />
          )}
          {oneWayYPath && (
            <path
              d={oneWayYPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.45"
            />
          )}

          {/* Feedback Omega curve */}
          {showFeedback && omegaPath && (
            <path
              d={omegaPath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              opacity="0.8"
            />
          )}

          {/* Two-way curves (solid) */}
          <path
            d={twoWayXPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
          />
          <path
            d={twoWayYPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
          />

          {/* Hover indicator line */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={toSvgX(hoverIndex)}
                y1={paddingTop}
                x2={toSvgX(hoverIndex)}
                y2={paddingTop + plotH}
                stroke="#94a3b8"
                strokeDasharray="3 3"
              />
              <circle
                cx={toSvgX(hoverIndex)}
                cy={toSvgY(activeRec.x)}
                r="4"
                fill="#f43f5e"
              />
              <circle
                cx={toSvgX(hoverIndex)}
                cy={toSvgY(activeRec.y)}
                r="4"
                fill="#06b6d4"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Dynamic Values Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-slate-500 block">当前步数 step</span>
          <span className="text-white font-bold text-sm">t = {activeRec.step}</span>
        </div>
        <div>
          <span className="text-rose-400 block">投毒者比例 x(t)</span>
          <span className="text-rose-300 font-bold text-sm">{activeRec.x.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-cyan-400 block">主动防御比例 y(t)</span>
          <span className="text-cyan-300 font-bold text-sm">{activeRec.y.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-purple-400 block">归一化动态价值 Ω̃_t</span>
          <span className="text-purple-300 font-bold text-sm">{activeRec.omegaNorm.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
};
