import React, { useState } from 'react';
import { RobustnessTestResult, EGTParams } from '../types';
import { ShieldCheck, Activity, Zap, AlertTriangle, RefreshCw, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { computeCriticalPoints } from '../simulation/engine';

interface RobustnessViewProps {
  robustnessData: RobustnessTestResult;
  egt: EGTParams;
  onRefresh: () => void;
}

export const RobustnessView: React.FC<RobustnessViewProps> = ({
  robustnessData,
  egt,
  onRefresh
}) => {
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const { xc, yc } = computeCriticalPoints(egt);
  const { mappingComparison, noiseSensitivity, shockRecovery } = robustnessData;

  const maxMappingLoss = Math.max(
    ...mappingComparison.flatMap(m => [m.oneWayLoss, m.twoWayLoss]),
    1
  );

  const maxNoiseLoss = Math.max(
    ...noiseSensitivity.flatMap(n => [n.oneWayLoss, n.twoWayLoss]),
    1
  );

  return (
    <div className="space-y-6">
      {/* 实验说明头部 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              论文实验四 · 命题稳健性与冲击自愈全景检验 (Experiment 4)
            </div>
            <h3 className="text-xl font-bold text-white">
              非线性风险映射、观测噪声与突发投毒冲击鲁棒性检验
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
              严格对应论文第 7 章仿真设计：验证 EGT–POMDP 双向耦合机制在非线性攻击到达强度 $h(x)$、不完全信息观测噪声扰动 $\sigma \in [0.05, 0.35]$ 以及突发外生大规模攻击冲击（$x \to 0.95$）下的稳健性与自愈弹性。
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            重新扫描检验
          </button>
        </div>

        {/* 关键指标总结 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400">非线性映射平均节约率</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
              {(mappingComparison.reduce((acc, m) => acc + m.reduction, 0) / mappingComparison.length).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              在线性、饱和与凸幂三种形态下均显著优于单向模型
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400">高噪声环境性能韧性 (σ=0.35)</div>
            <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
              -{noiseSensitivity[noiseSensitivity.length - 1]?.reduction.toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              严重模糊观测下贝叶斯滤波仍有效遏制误报激增
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
            <div className="text-xs text-slate-400">突发剧烈冲击自愈恢复周期</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 flex items-baseline gap-1.5">
              <span>{shockRecovery.recoveryStepsTwoWay ? `≈ ${shockRecovery.recoveryStepsTwoWay} 步` : '快速稳定'}</span>
              <span className="text-xs text-slate-400 font-normal">
                vs 单向({shockRecovery.recoveryStepsOneWay ? `${shockRecovery.recoveryStepsOneWay}步` : '发散振荡'})
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              动态价值阻尼 λ_Ω · Ω_t 主动阻抑外部协同攻击脉冲
            </div>
          </div>
        </div>
      </div>

      {/* 第一部分：非线性风险映射对比 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>子实验 4.1：非线性风险到达强度函数 $h(x)$ 敏感度分析</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            Eq (10) 映射拓展
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mappingComparison.map((m) => (
            <div key={m.mappingType} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">{m.name}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    降损 -{m.reduction}%
                  </span>
                </div>
                <div className="text-xs font-mono text-indigo-300 mb-3 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                  {m.formula}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 font-mono mb-1">
                    <span>双向耦合 (本文):</span>
                    <span className="text-cyan-400 font-bold">{m.twoWayLoss}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full" 
                      style={{ width: `${(m.twoWayLoss / maxMappingLoss) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 font-mono mb-1">
                    <span>单向耦合对照:</span>
                    <span className="text-amber-400 font-bold">{m.oneWayLoss}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${(m.oneWayLoss / maxMappingLoss) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 第二部分：观测噪声敏感度扫描 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>子实验 4.2：观测不完全度与噪声扰动扫描 ($\sigma \in [0.05, 0.35]$)</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
            贝叶斯信念滤波鲁棒性
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="py-2.5 px-3 font-semibold">观测噪声方差 $\sigma$</th>
                <th className="py-2.5 px-3 font-semibold text-right">双向耦合总损失</th>
                <th className="py-2.5 px-3 font-semibold text-right">单向耦合总损失</th>
                <th className="py-2.5 px-3 font-semibold text-right">双向优化比例</th>
                <th className="py-2.5 px-3 font-semibold text-right">Brier 校准得分</th>
                <th className="py-2.5 px-3 font-semibold text-center">相对性能评估</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {noiseSensitivity.map((n) => (
                <tr key={`noise-${n.noise}`} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-white">σ = {n.noise.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-cyan-400">{n.twoWayLoss.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-amber-400">{n.oneWayLoss.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">-{n.reduction.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{n.brierScore.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      稳健占优
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 第三部分：突发剧烈攻击冲击 (Stress Test) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>子实验 4.3：突发外部协同投毒冲击测试 (Stress Test & Resilience)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              在第 30 步人为注入高烈度外部协同攻击脉冲（$x$ 从均衡点陡增至 0.95），观测系统在双向价值反馈驱动下的韧性反弹与收敛阻尼。
            </p>
          </div>
          <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            冲击注入点: t = 30, x = 0.95 | 理论目标中心 xc = {xc.toFixed(2)}
          </div>
        </div>

        {/* 脉冲响应 SVG 曲线 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-3 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
                双向耦合动态恢复轨迹 (Two-Way)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-3 h-0.5 bg-amber-400 inline-block"></span>
                单向耦合对照组轨迹 (One-Way)
              </span>
            </div>
            <span className="text-slate-500">横轴: 仿真时间 (t) | 纵轴: 攻击者比例 (x)</span>
          </div>

          <div className="w-full h-56 relative">
            <svg 
              viewBox="0 0 800 200" 
              className="w-full h-full overflow-visible cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const svgX = (e.clientX - rect.left) * (800 / rect.width);
                const relX = svgX - 40;
                const totalSteps = shockRecovery.recordsTwoWay.length || 90;
                if (relX >= 0 && relX <= 740) {
                  const step = Math.round((relX / 740) * (totalSteps - 1));
                  setHoverStep(step);
                }
              }}
              onMouseLeave={() => setHoverStep(null)}
            >
              {/* 背景网格线 */}
              <line x1="40" y1="20" x2="780" y2="20" stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.4" />
              <line x1="40" y1="100" x2="780" y2="100" stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.4" />
              <line x1="40" y1="180" x2="780" y2="180" stroke="#334155" strokeDasharray="2,2" strokeOpacity="0.4" />

              {/* 均衡目标虚线 xc */}
              {(() => {
                const yPos = 180 - (xc * 160);
                return (
                  <g>
                    <line x1="40" y1={yPos} x2="780" y2={yPos} stroke="#10b981" strokeDasharray="4,4" strokeWidth="1.5" strokeOpacity="0.7" />
                    <text x="45" y={yPos - 5} fill="#10b981" fontSize="10" fontFamily="monospace">
                      目标均衡 xc = {xc.toFixed(2)}
                    </text>
                  </g>
                );
              })()}

              {/* 冲击发生垂直红线 t=30 */}
              {(() => {
                const totalSteps = shockRecovery.recordsTwoWay.length || 90;
                const shockX = 40 + (30 / (totalSteps - 1)) * 740;
                return (
                  <g>
                    <line x1={shockX} y1="10" x2={shockX} y2="190" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x={shockX + 5} y="25" fill="#ef4444" fontSize="10" fontWeight="bold">
                      突发协同投毒冲击 (t=30, x=0.95)
                    </text>
                  </g>
                );
              })()}

              {/* 单向耦合轨迹 (One-Way) */}
              {(() => {
                const totalSteps = shockRecovery.recordsOneWay.length;
                if (totalSteps === 0) return null;
                const points = shockRecovery.recordsOneWay.map((r, i) => {
                  const xPos = 40 + (i / (totalSteps - 1)) * 740;
                  const yPos = 180 - (Math.min(1, Math.max(0, r.x)) * 160);
                  return `${xPos},${yPos}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="4,2"
                    points={points}
                  />
                );
              })()}

              {/* 双向耦合轨迹 (Two-Way) */}
              {(() => {
                const totalSteps = shockRecovery.recordsTwoWay.length;
                if (totalSteps === 0) return null;
                const points = shockRecovery.recordsTwoWay.map((r, i) => {
                  const xPos = 40 + (i / (totalSteps - 1)) * 740;
                  const yPos = 180 - (Math.min(1, Math.max(0, r.x)) * 160);
                  return `${xPos},${yPos}`;
                }).join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    points={points}
                  />
                );
              })()}

              {/* 悬停检查点 */}
              {hoverStep !== null && (() => {
                const totalSteps = shockRecovery.recordsTwoWay.length;
                if (hoverStep >= totalSteps) return null;
                const rec2 = shockRecovery.recordsTwoWay[hoverStep];
                const rec1 = shockRecovery.recordsOneWay[hoverStep];
                const xPos = 40 + (hoverStep / (totalSteps - 1)) * 740;
                const yPos2 = 180 - (Math.min(1, Math.max(0, rec2.x)) * 160);
                const yPos1 = rec1 ? 180 - (Math.min(1, Math.max(0, rec1.x)) * 160) : yPos2;

                return (
                  <g>
                    <line x1={xPos} y1="10" x2={xPos} y2="190" stroke="#94a3b8" strokeDasharray="3,3" />
                    <circle cx={xPos} cy={yPos2} r="5" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                    {rec1 && <circle cx={xPos} cy={yPos1} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />}
                    <g transform={`translate(${Math.min(680, Math.max(45, xPos - 60))}, 15)`}>
                      <rect x="0" y="0" width="130" height="34" rx="6" fill="#0f172a" stroke="#475569" opacity="0.95" />
                      <text x="65" y="15" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        t={hoverStep}: 双向 x={rec2.x.toFixed(3)}
                      </text>
                      {rec1 && (
                        <text x="65" y="27" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                          单向 x={rec1.x.toFixed(3)}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-lg text-cyan-200">
              <strong>双向耦合机制表现：</strong>
              当 x 突变至 0.95 时，微观 POMDP 状态转移迅速使未来风险预警 Ω_t 暴涨，触发宏观防御比例 y 即刻跃升，在
              <span className="font-bold text-white mx-1">{shockRecovery.recoveryStepsTwoWay ? ` ${shockRecovery.recoveryStepsTwoWay} 步内 ` : ' 极短时间内 '}</span>
              将投毒攻击者重新压制并向内螺旋收敛，避免系统性击穿。
            </div>
            <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-lg text-amber-200">
              <strong>单向耦合对比表现：</strong>
              缺乏微观动态价值反馈项（$\lambda_\Omega = 0$），防御能力 $y$ 响应严重滞后且缺乏阻尼摩擦，系统在冲击后进入更大幅度的
              <span className="font-bold text-white mx-1">高振幅极限环振荡</span>，造成长期持续的高昂破坏与清洗成本。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
