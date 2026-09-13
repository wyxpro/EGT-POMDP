import React from 'react';
import { EGTParams, POMDPParams, SimulationConfig, SimulationPreset } from '../types';
import { PRESETS } from '../simulation/engine';
import { Sliders, RotateCcw, Zap, Info, ShieldCheck, Flame } from 'lucide-react';

interface ParameterPanelProps {
  egt: EGTParams;
  setEgt: React.Dispatch<React.SetStateAction<EGTParams>>;
  pomdp: POMDPParams;
  setPomdp: React.Dispatch<React.SetStateAction<POMDPParams>>;
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  activePresetId: string;
  onSelectPreset: (preset: SimulationPreset) => void;
  onResetToDefault: () => void;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  egt,
  setEgt,
  pomdp,
  setPomdp,
  config,
  setConfig,
  activePresetId,
  onSelectPreset,
  onResetToDefault
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 space-y-5 sm:space-y-6">
      {/* 预设情景选择器 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            典型实验情景快速加载 (Experimental Presets)
          </label>
          <button
            onClick={onResetToDefault}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            重置参数
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="font-semibold text-xs text-white">{p.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {p.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 参数细调折叠栏 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-800 text-xs">
        {/* 宏观演化博弈 EGT 参数 */}
        <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between font-semibold text-indigo-300">
            <span>宏观 EGT 演化参数</span>
            <span className="font-mono text-[10px] text-slate-400">Equation (2)</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>投毒收益 B:</span>
                <span className="font-mono font-bold text-white">{egt.B}</span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                step="0.5"
                value={egt.B}
                onChange={(e) => setEgt(prev => ({ ...prev, B: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>攻击成本 CA:</span>
                <span className="font-mono font-bold text-white">{egt.CA}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.2"
                value={egt.CA}
                onChange={(e) => setEgt(prev => ({ ...prev, CA: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>监管处罚 F:</span>
                <span className="font-mono font-bold text-white">{egt.F}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={egt.F}
                onChange={(e) => setEgt(prev => ({ ...prev, F: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>主动防御增量成本 CD:</span>
                <span className="font-mono font-bold text-white">{egt.CD}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={egt.CD}
                onChange={(e) => setEgt(prev => ({ ...prev, CD: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>主动防御增量检测率 α:</span>
                <span className="font-mono font-bold text-white">{egt.alpha}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={egt.alpha}
                onChange={(e) => setEgt(prev => ({ ...prev, alpha: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 耦合与双向反馈系数 */}
        <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between font-semibold text-purple-300">
            <span>双向耦合接口参数</span>
            <span className="font-mono text-[10px] text-slate-400">Equation (15)</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>动态价值认知系数 λ_Ω:</span>
                <span className="font-mono font-bold text-purple-300">{egt.lambdaOmega}</span>
              </div>
              <input
                type="range"
                min="0"
                max="3.0"
                step="0.1"
                value={egt.lambdaOmega}
                onChange={(e) => setEgt(prev => ({ ...prev, lambdaOmega: parseFloat(e.target.value) }))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">
                {egt.lambdaOmega === 0 ? 'λ_Ω=0: 退化为单向耦合' : 'λ_Ω>0: 激活双向闭环阻尼'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>攻击到达映射类型 h(x):</span>
              </div>
              <select
                value={egt.mappingType}
                onChange={(e) => setEgt(prev => ({ ...prev, mappingType: e.target.value as any }))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="linear">线性映射: λ = ρ_A · x (基准)</option>
                <option value="saturated">饱和指数: λ = 1 - e^(-1.8ρx)</option>
                <option value="power">幂函数: λ = ρ_A · x^1.5</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>攻击到达强度系数 ρ_A:</span>
                <span className="font-mono font-bold text-white">{egt.rhoA}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={egt.rhoA}
                onChange={(e) => setEgt(prev => ({ ...prev, rhoA: parseFloat(e.target.value) }))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>初始投毒率 x₀:</span>
                <span className="font-mono font-bold text-rose-400">{config.initX}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={config.initX}
                onChange={(e) => setConfig(prev => ({ ...prev, initX: parseFloat(e.target.value) }))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>初始防御率 y₀:</span>
                <span className="font-mono font-bold text-cyan-400">{config.initY}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={config.initY}
                onChange={(e) => setConfig(prev => ({ ...prev, initY: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 微观 POMDP 参数 */}
        <div className="space-y-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center justify-between font-semibold text-emerald-300">
            <span>微观 POMDP 控制参数</span>
            <span className="font-mono text-[10px] text-slate-400">Equation (10)-(12)</span>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-slate-300">
                <span>观测噪声 σ (方差/模糊度):</span>
                <span className="font-mono font-bold text-white">{pomdp.observationNoise}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.02"
                value={pomdp.observationNoise}
                onChange={(e) => setPomdp(prev => ({ ...prev, observationNoise: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>误报与过度防御惩罚 CFP:</span>
                <span className="font-mono font-bold text-white">{pomdp.CFP}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.2"
                value={pomdp.CFP}
                onChange={(e) => setPomdp(prev => ({ ...prev, CFP: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>回滚重训成本 C(a₃):</span>
                <span className="font-mono font-bold text-white">{pomdp.costA3}</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="8.0"
                step="0.5"
                value={pomdp.costA3}
                onChange={(e) => setPomdp(prev => ({ ...prev, costA3: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>严重后门状态损失 L(s₂):</span>
                <span className="font-mono font-bold text-rose-400">{pomdp.Ls2}</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="20.0"
                step="1.0"
                value={pomdp.Ls2}
                onChange={(e) => setPomdp(prev => ({ ...prev, Ls2: parseFloat(e.target.value) }))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300">
                <span>仿真总步数 Steps:</span>
                <span className="font-mono font-bold text-white">{config.steps}</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                step="10"
                value={config.steps}
                onChange={(e) => setConfig(prev => ({ ...prev, steps: parseInt(e.target.value) }))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
