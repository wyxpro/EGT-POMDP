import React, { useState } from 'react';
import { StepRecord, EGTParams } from '../types';
import { computeCriticalPoints, calculateEGTDerivatives } from '../simulation/engine';
import { Info, Crosshair, RefreshCw } from 'lucide-react';

interface PhasePortraitProps {
  twoWayRecords: StepRecord[];
  oneWayRecords?: StepRecord[];
  egtParams: EGTParams;
  onSetInitCoords?: (x: number, y: number) => void;
}

export const PhasePortrait: React.FC<PhasePortraitProps> = ({
  twoWayRecords,
  oneWayRecords,
  egtParams,
  onSetInitCoords
}) => {
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; step: number; model: string } | null>(null);
  const [showVectorField, setShowVectorField] = useState(true);

  const { pc, xc, yc } = computeCriticalPoints(egtParams);

  // SVG coordinate dimensions
  const width = 500;
  const height = 500;
  const padding = 55;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const toSvgX = (val: number) => padding + Math.max(0, Math.min(1, val)) * plotWidth;
  const toSvgY = (val: number) => height - padding - Math.max(0, Math.min(1, val)) * plotHeight;
  const fromSvgX = (svgX: number) => Math.max(0, Math.min(1, (svgX - padding) / plotWidth));
  const fromSvgY = (svgY: number) => Math.max(0, Math.min(1, (height - padding - svgY) / plotHeight));

  // Generate vector field arrows
  const gridCount = 10;
  const vectorArrows = [];
  if (showVectorField) {
    for (let i = 1; i < gridCount; i++) {
      for (let j = 1; j < gridCount; j++) {
        const gx = i / gridCount;
        const gy = j / gridCount;
        const { dxdt, dydt } = calculateEGTDerivatives(gx, gy, 0, egtParams);
        const norm = Math.sqrt(dxdt * dxdt + dydt * dydt);
        if (norm > 1e-4) {
          const arrowLen = 14;
          const u = (dxdt / norm) * arrowLen;
          const v = (dydt / norm) * arrowLen;
          const sx = toSvgX(gx);
          const sy = toSvgY(gy);
          vectorArrows.push({
            x1: sx,
            y1: sy,
            x2: sx + u,
            y2: sy - v // SVG y is inverted
          });
        }
      }
    }
  }

  // Create SVG path string for twoWay
  const twoWayPath = twoWayRecords.reduce((acc, rec, idx) => {
    const sx = toSvgX(rec.x);
    const sy = toSvgY(rec.y);
    return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
  }, '');

  // Create SVG path string for oneWay if provided
  const oneWayPath = oneWayRecords ? oneWayRecords.reduce((acc, rec, idx) => {
    const sx = toSvgX(rec.x);
    const sy = toSvgY(rec.y);
    return idx === 0 ? `M ${sx} ${sy}` : `${acc} L ${sx} ${sy}`;
  }, '') : '';

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSetInitCoords) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (width / rect.width);
    const clickY = (e.clientY - rect.top) * (height / rect.height);
    const modelX = Number(fromSvgX(clickX).toFixed(2));
    const modelY = Number(fromSvgY(clickY).toFixed(2));
    if (modelX >= 0.05 && modelX <= 0.95 && modelY >= 0.05 && modelY <= 0.95) {
      onSetInitCoords(modelX, modelY);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (width / rect.width);
    const svgY = (e.clientY - rect.top) * (height / rect.height);
    const curX = fromSvgX(svgX);
    const curY = fromSvgY(svgY);

    // Find closest step in twoWayRecords
    let closestDist = Infinity;
    let closestStep = 0;
    for (let i = 0; i < twoWayRecords.length; i++) {
      const dx = twoWayRecords[i].x - curX;
      const dy = twoWayRecords[i].y - curY;
      const d = dx * dx + dy * dy;
      if (d < closestDist) {
        closestDist = d;
        closestStep = i;
      }
    }

    if (closestDist < 0.02) {
      const rec = twoWayRecords[closestStep];
      setHoverPoint({
        x: rec.x,
        y: rec.y,
        step: rec.step,
        model: '两方双向耦合'
      });
    } else {
      setHoverPoint(null);
    }
  };

  const handleTouch = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (touch.clientX - rect.left) * (width / rect.width);
    const clickY = (touch.clientY - rect.top) * (height / rect.height);
    const modelX = Number(fromSvgX(clickX).toFixed(2));
    const modelY = Number(fromSvgY(clickY).toFixed(2));
    if (onSetInitCoords && modelX >= 0.05 && modelX <= 0.95 && modelY >= 0.05 && modelY <= 0.95) {
      onSetInitCoords(modelX, modelY);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-6 flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-slate-800 pb-3">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            宏观攻防相图平面 (Phase Portrait: x - y)
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-400">
            横轴：投毒比例 x ∈ [0, 1] ； 纵轴：平台主动防御比例 y ∈ [0, 1]
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowVectorField(!showVectorField)}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-all touch-manipulation cursor-pointer ${
              showVectorField 
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 font-medium' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {showVectorField ? '矢量场: 开' : '矢量场: 关'}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row items-center gap-4 sm:gap-6 justify-center">
        {/* SVG Canvas */}
        <div className="relative bg-slate-950/70 border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow-inner w-full max-w-[480px] mx-auto flex justify-center">
          <svg
            width={width}
            height={height}
            onClick={handleSvgClick}
            onTouchStart={handleTouch}
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={() => setHoverPoint(null)}
            className="cursor-crosshair select-none w-full h-auto aspect-square touch-manipulation"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <marker
                id="arrowhead-vf"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="#475569" />
              </marker>
              <marker
                id="arrowhead-path"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <polygon points="0 1, 7 4, 0 7" fill="#06b6d4" />
              </marker>
            </defs>

            {/* Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map(v => (
              <g key={`grid-${v}`}>
                <line
                  x1={toSvgX(v)}
                  y1={toSvgY(0)}
                  x2={toSvgX(v)}
                  y2={toSvgY(1)}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <line
                  x1={toSvgX(0)}
                  y1={toSvgY(v)}
                  x2={toSvgX(1)}
                  y2={toSvgY(v)}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
              </g>
            ))}

            {/* Axes */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={padding}
              y2={padding}
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Axis labels & Ticks */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(v => (
              <g key={`tick-${v}`}>
                <text
                  x={toSvgX(v)}
                  y={height - padding + 18}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {v.toFixed(1)}
                </text>
                <text
                  x={padding - 10}
                  y={toSvgY(v) + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ))}

            <text
              x={width / 2}
              y={height - 12}
              textAnchor="middle"
              className="text-xs fill-slate-300 font-semibold"
            >
              投毒者策略比例 x (Attacker Proportion)
            </text>
            <text
              x={16}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90 16 ${height / 2})`}
              className="text-xs fill-slate-300 font-semibold"
            >
              平台主动防御能力比例 y (Defense Capability)
            </text>

            {/* Nullclines (Zero-Growth Lines) */}
            {/* x-nullcline: y = yc */}
            {yc >= 0 && yc <= 1 && (
              <line
                x1={toSvgX(0)}
                y1={toSvgY(yc)}
                x2={toSvgX(1)}
                y2={toSvgY(yc)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.75"
              />
            )}
            {/* y-nullcline: x = xc */}
            {xc >= 0 && xc <= 1 && (
              <line
                x1={toSvgX(xc)}
                y1={toSvgY(0)}
                x2={toSvgX(xc)}
                y2={toSvgY(1)}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.75"
              />
            )}

            {/* Vector Field Arrows */}
            {showVectorField && vectorArrows.map((arrow, idx) => (
              <line
                key={`arrow-${idx}`}
                x1={arrow.x1}
                y1={arrow.y1}
                x2={arrow.x2}
                y2={arrow.y2}
                stroke="#334155"
                strokeWidth="1"
                markerEnd="url(#arrowhead-vf)"
              />
            ))}

            {/* One-way coupling trajectory (Dashed Amber, undamped limit cycle/oscillation) */}
            {oneWayPath && (
              <path
                d={oneWayPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.6"
              />
            )}

            {/* Two-way coupling trajectory (Solid Cyan / Emerald gradient, inward spiral) */}
            {twoWayPath && (
              <path
                d={twoWayPath}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
            )}

            {/* Critical Center / Equilibrium Point E5 = (xc, yc) */}
            {xc >= 0 && xc <= 1 && yc >= 0 && yc <= 1 && (
              <g>
                <circle
                  cx={toSvgX(xc)}
                  cy={toSvgY(yc)}
                  r="5"
                  fill="#f43f5e"
                  stroke="#ffe4e6"
                  strokeWidth="2"
                />
                <text
                  x={toSvgX(xc) + 8}
                  y={toSvgY(yc) - 6}
                  className="text-[11px] fill-rose-400 font-mono font-bold"
                >
                  E5({xc.toFixed(2)}, {yc.toFixed(2)})
                </text>
              </g>
            )}

            {/* Start Point (x0, y0) */}
            {twoWayRecords.length > 0 && (
              <g>
                <circle
                  cx={toSvgX(twoWayRecords[0].x)}
                  cy={toSvgY(twoWayRecords[0].y)}
                  r="6"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={toSvgX(twoWayRecords[0].x) + 8}
                  y={toSvgY(twoWayRecords[0].y) + 14}
                  className="text-[11px] fill-indigo-300 font-mono font-bold"
                >
                  起点 (x₀={twoWayRecords[0].x}, y₀={twoWayRecords[0].y})
                </text>
              </g>
            )}

            {/* End Point */}
            {twoWayRecords.length > 0 && (
              <g>
                <circle
                  cx={toSvgX(twoWayRecords[twoWayRecords.length - 1].x)}
                  cy={toSvgY(twoWayRecords[twoWayRecords.length - 1].y)}
                  r="5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
            {/* Hover Inspection Indicator */}
            {hoverPoint && (
              <g>
                <circle
                  cx={toSvgX(hoverPoint.x)}
                  cy={toSvgY(hoverPoint.y)}
                  r="7"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                <circle
                  cx={toSvgX(hoverPoint.x)}
                  cy={toSvgY(hoverPoint.y)}
                  r="3.5"
                  fill="#ffffff"
                />
                <g transform={`translate(${Math.min(width - 150, Math.max(padding + 10, toSvgX(hoverPoint.x) - 55))}, ${Math.max(padding + 15, toSvgY(hoverPoint.y) - 35)})`}>
                  <rect
                    x="0"
                    y="0"
                    width="110"
                    height="28"
                    rx="6"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="55"
                    y="18"
                    textAnchor="middle"
                    className="text-[11px] fill-cyan-200 font-mono font-bold"
                  >
                    t={hoverPoint.step}: ({hoverPoint.x.toFixed(2)}, {hoverPoint.y.toFixed(2)})
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Phase Portrait Legend & Theoretical Explanation */}
        <div className="space-y-4 max-w-sm text-xs text-slate-300">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
            <h5 className="font-semibold text-white text-sm flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              相平面特征与理论对照
            </h5>
            
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-cyan-400"></span>
              <span className="text-cyan-300 font-medium">实线蓝：双向耦合 (本文模型)</span>
            </div>
            <p className="text-slate-400 text-[11px] pl-6">
              受 POMDP 动态安全价值阻尼调节，轨线呈<strong>向内螺旋衰减</strong>，迅速收敛至渐近稳定中心 (Sink)。
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="w-4 h-0.5 bg-amber-400 border-dashed"></span>
              <span className="text-amber-300 font-medium">虚线橙：单向耦合/纯EGT (对比文献)</span>
            </div>
            <p className="text-slate-400 text-[11px] pl-6">
              对应朱建明(2014)无动态阻尼情景，特征根为纯虚数，轨线为<strong>无休止闭合极限环</strong>。
            </p>

            <div className="pt-2 border-t border-slate-700/60 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">内部平衡中心 E5:</span>
                <span className="text-rose-400 font-bold">({xc.toFixed(3)}, {yc.toFixed(3)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">零增长线 yc (水平):</span>
                <span className="text-amber-300">{yc.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">零增长线 xc (垂直):</span>
                <span className="text-emerald-300">{xc.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-500/20 text-indigo-300 text-[11px] leading-relaxed">
            💡 <strong>交互提示：</strong>可以直接在左侧相图方框内<strong>鼠标点击任意位置</strong>，即时将该坐标设置为仿真初始点 (x₀, y₀)，观察不同初始距离下的向心收敛螺旋！
          </div>
        </div>
      </div>
    </div>
  );
};
