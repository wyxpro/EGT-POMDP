import React, { useState, useMemo, useCallback } from 'react';
import { 
  EGTParams, 
  POMDPParams, 
  SimulationConfig, 
  SimulationPreset, 
  ModelType, 
  ModelSimulationResult,
  ModelMonteCarloStats
} from './types';
import { 
  PRESETS, 
  runSimulation, 
  runMonteCarloBenchmark, 
  runRobustnessSweep 
} from './simulation/engine';
import { SchemeDocumentation } from './components/SchemeDocumentation';
import { PhasePortrait } from './components/PhasePortrait';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { MicroBeliefChart } from './components/MicroBeliefChart';
import { AblationView } from './components/AblationView';
import { RobustnessView } from './components/RobustnessView';
import { ParameterPanel } from './components/ParameterPanel';
import { PythonExporter } from './components/PythonExporter';

import { 
  BookOpen, 
  Compass, 
  Activity, 
  BarChart3, 
  FileCode2, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Sliders,
  Dices
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scheme' | 'dynamics' | 'micro' | 'ablation' | 'robustness' | 'python'>('scheme');
  const [activePresetId, setActivePresetId] = useState<string>('benchmark');

  // Parameters state initialized to Benchmark preset
  const [egt, setEgt] = useState<EGTParams>(PRESETS[0].egt);
  const [pomdp, setPomdp] = useState<POMDPParams>(PRESETS[0].pomdp);
  const [config, setConfig] = useState<SimulationConfig>({
    ...PRESETS[0].config,
    seed: 42
  });

  // Simulation execution state
  const [simCounter, setSimCounter] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Monte Carlo stats state
  const [monteCarloStats, setMonteCarloStats] = useState<ModelMonteCarloStats[] | undefined>(undefined);
  const [isComputingMonteCarlo, setIsComputingMonteCarlo] = useState<boolean>(false);

  // Run all 6 models based on current parameters
  const simulationResults = useMemo<ModelSimulationResult[]>(() => {
    // Force re-run on simCounter change
    const _ = simCounter;
    const modelTypes: ModelType[] = ['fixed', 'egt_only', 'pomdp_only', 'one_way', 'two_way', 'oracle'];
    return modelTypes.map(mType => runSimulation(mType, egt, pomdp, config));
  }, [egt, pomdp, config, simCounter]);

  // Robustness sweep for Experiment 4
  const robustnessData = useMemo(() => {
    const _ = simCounter;
    return runRobustnessSweep(egt, pomdp, config);
  }, [egt, pomdp, config, simCounter]);

  const twoWayResult = simulationResults.find(r => r.modelType === 'two_way')!;
  const oneWayResult = simulationResults.find(r => r.modelType === 'one_way')!;

  const handleSelectPreset = (preset: SimulationPreset) => {
    setActivePresetId(preset.id);
    setEgt(preset.egt);
    setPomdp(preset.pomdp);
    setConfig({ ...preset.config, seed: config.seed ?? 42 });
    setMonteCarloStats(undefined);
    setSimCounter(prev => prev + 1);
  };

  const handleResetToDefault = () => {
    const defaultPreset = PRESETS[0];
    handleSelectPreset(defaultPreset);
  };

  const handleSetInitCoords = (newX: number, newY: number) => {
    setConfig(prev => ({
      ...prev,
      initX: newX,
      initY: newY
    }));
    setSimCounter(prev => prev + 1);
  };

  const handleNewSeed = () => {
    const randomSeed = Math.floor(Math.random() * 100000);
    setConfig(prev => ({ ...prev, seed: randomSeed }));
    setMonteCarloStats(undefined);
    setSimCounter(prev => prev + 1);
  };

  const handleRunMonteCarlo = useCallback((runs: number = 50) => {
    setIsComputingMonteCarlo(true);
    // Use setTimeout to allow UI to update loading state
    setTimeout(() => {
      const stats = runMonteCarloBenchmark(egt, pomdp, config, runs);
      setMonteCarloStats(stats);
      setIsComputingMonteCarlo(false);
    }, 50);
  }, [egt, pomdp, config]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 顶部主导航栏 */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
                  EGT–POMDP 仿真平台
                </h1>
                <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden md:block max-w-xl">
                面向生成式人工智能训练数据投毒的宏微观双向耦合治理机制仿真与推理有效性验证
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleNewSeed}
              title={`当前随机种子: ${config.seed ?? 42} (点击重置伪随机种子)`}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-all cursor-pointer touch-manipulation active:scale-95"
            >
              <Dices className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">种子:</span>
              <span>{config.seed ?? 42}</span>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer touch-manipulation active:scale-95 ${
                showSettings 
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{showSettings ? '收起参数' : '调整参数'}</span>
              <span className="sm:hidden">{showSettings ? '收起' : '参数'}</span>
            </button>

            <button
              onClick={() => setSimCounter(prev => prev + 1)}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer touch-manipulation"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">重新仿真</span>
              <span className="sm:hidden">仿真</span>
            </button>
          </div>
        </div>

        {/* Tab 选项卡：移动端支持横向丝滑滑动与隐藏滚动条 */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar space-x-1 py-1.5 border-t border-slate-800/40 text-xs scroll-smooth">
          <button
            onClick={() => setActiveTab('scheme')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'scheme'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>仿真全景</span>
          </button>

          <button
            onClick={() => setActiveTab('dynamics')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'dynamics'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>宏观相图 [实验一]</span>
          </button>

          <button
            onClick={() => setActiveTab('micro')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'micro'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>微观 POMDP [实验三]</span>
          </button>

          <button
            onClick={() => setActiveTab('ablation')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'ablation'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>6大模型消融 [实验二]</span>
          </button>

          <button
            onClick={() => setActiveTab('robustness')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'robustness'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>鲁棒冲击 [实验四]</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 touch-manipulation ${
              activeTab === 'python'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Python代码出图</span>
          </button>
        </div>
      </header>

      {/* 核心主工作区：移动端内边距自适应 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* 折叠参数面板 */}
        {showSettings && (
          <ParameterPanel
            egt={egt}
            setEgt={setEgt}
            pomdp={pomdp}
            setPomdp={setPomdp}
            config={config}
            setConfig={setConfig}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {/* Tab 1: 仿真实验实施方案全景 */}
        {activeTab === 'scheme' && (
          <div className="space-y-6">
            <SchemeDocumentation />
          </div>
        )}

        {/* Tab 2: 宏观相图与稳定性 */}
        {activeTab === 'dynamics' && (
          <div className="space-y-6">
            <PhasePortrait
              twoWayRecords={twoWayResult.records}
              oneWayRecords={oneWayResult.records}
              egtParams={egt}
              onSetInitCoords={handleSetInitCoords}
            />

            <TimeSeriesChart
              twoWayRecords={twoWayResult.records}
              oneWayRecords={oneWayResult.records}
              showFeedback={true}
            />
          </div>
        )}

        {/* Tab 3: 微观 POMDP 与信念决策 */}
        {activeTab === 'micro' && (
          <div className="space-y-6">
            <MicroBeliefChart records={twoWayResult.records} />

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                微观 POMDP 不完全信息治理机制深度剖析
              </h4>
              <p className="leading-relaxed">
                在生成式 AI 数据投毒场景下，真实投毒状态 <code className="text-indigo-300">s_t ∈ {'{s0, s1, s2}'}</code> 无法被直接观察。
                传统规则检测往往在收到单次中高异常信号时就激进触发<strong>模型回滚与重训 (a3)</strong>，造成严重的假阳性惩罚 <code className="text-amber-300">C_FP</code> 与算力浪费；
                而放任不管又会导致后门在增量微调中固化为参数污染。
              </p>
              <p className="leading-relaxed">
                如上图所示，本模型通过<strong>贝叶斯信念更新公式 (11)</strong>，结合连续几期的带噪观测序列 <code className="text-cyan-300">o_t</code> 持续修正信念分布向量 <code className="text-emerald-300">[b(s0), b(s1), b(s2)]</code>。
                仅当严重后门概率 <code className="text-rose-400">b(s2)</code> 突破临界风险边界时，才精准触发强化清洗 <code className="text-blue-300">a2</code> 或回滚 <code className="text-rose-400">a3</code>，
                并在状态恢复后迅速回落至常规低成本检测 <code className="text-emerald-300">a1</code>，实现了防御效能与计算资源开销的最优平衡。
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: 6 大模型消融对比 */}
        {activeTab === 'ablation' && (
          <AblationView 
            results={simulationResults}
            monteCarloStats={monteCarloStats}
            onRunMonteCarlo={handleRunMonteCarlo}
            isComputingMonteCarlo={isComputingMonteCarlo}
          />
        )}

        {/* Tab 5: 鲁棒性与冲击检验 (实验四) */}
        {activeTab === 'robustness' && (
          <RobustnessView
            robustnessData={robustnessData}
            egt={egt}
            onRefresh={() => setSimCounter(prev => prev + 1)}
          />
        )}

        {/* Tab 6: Python 论文出图代码导出 */}
        {activeTab === 'python' && (
          <PythonExporter egt={egt} pomdp={pomdp} config={config} />
        )}
      </main>

      {/* 底部文献与版权说明 */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          学术参考依据：朱建明等 (2014) 《基于系统动力学的网络安全攻防演化博弈模型》 · 本文模型：EGT–POMDP 双向耦合数据投毒动态治理
        </p>
      </footer>
    </div>
  );
}
