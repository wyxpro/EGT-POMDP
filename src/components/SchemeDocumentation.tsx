import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Layers,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export const SchemeDocumentation: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-200">
      {/* 顶部引导卡片 */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30 shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2">
              仿真实验全套实施指南 · 论文录用级标准
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              生成式AI数据投毒 EGT–POMDP 双向耦合仿真实验方案
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
              结合朱建明等（2014《通信学报》）的系统动力学攻防演化基础，以及您论文中提出的
              <strong className="text-indigo-300">“宏观演化（EGT）— 微观不完全信息决策（POMDP）双向闭环”</strong>
              理论，我们为您设计了以下完整的 4 大实验模块、6 套对比模型消融体系与全流程实验实施方案。
            </p>
          </div>
        </div>
      </div>

      {/* 1. 核心理论推导与假设映射 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            一、实验目的与论文命题验证映射表 (Hypothesis Mapping)
          </h3>
        </div>
        
        <p className="text-sm text-slate-400 leading-relaxed">
          仿真实验的核心使命不是堆砌数据，而是<strong>严密验证您论文第 3、4、5 章所提出的理论命题与推论</strong>。每个仿真子实验均应直接针对一个具体命题：
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="py-3 px-4 font-semibold">论文理论命题 / 机制</th>
                <th className="py-3 px-4 font-semibold">理论预测结论 (论文推导)</th>
                <th className="py-3 px-4 font-semibold">对应仿真实验方案</th>
                <th className="py-3 px-4 font-semibold">实验观测指标</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium text-indigo-300">命题 1：威慑门槛与治理联动</td>
                <td className="py-3.5 px-4">提高 F、CA 或 p0 压缩投毒净收益；处罚有效性以可检测为前提</td>
                <td className="py-3.5 px-4">单变量敏感度扫描：扫描处罚力度 F 与基础检测率 p0 对投毒收敛的影响</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono">稳态投毒率 x*, 收敛速度</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium text-indigo-300">命题 2：防御启动门槛 (xc, yc)</td>
                <td className="py-3.5 px-4">存在启动临界值 xc = (CD-RD)/(Lα)，低于该门槛平台维持高防御将造成资源冗余</td>
                <td className="py-3.5 px-4">设置不同初始投毒率 x0 ∈ [0.1, 0.9]，观察平台能力建设 y(t) 的分岔响应</td>
                <td className="py-3.5 px-4 text-emerald-400 font-mono">相图分岔轨线, 增量成本浪费率</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium text-amber-300">命题 3：纯演化内生振荡 (借鉴2014论文)</td>
                <td className="py-3.5 px-4">内部均衡 E5 为中心点，特征值为纯虚数，纯EGT无阻尼波动形成闭合极限环</td>
                <td className="py-3.5 px-4">纯 EGT / 单向耦合 vs 双向耦合相图对比（朱建明2014对比组）</td>
                <td className="py-3.5 px-4 text-amber-400 font-mono">相平面轨线闭合环 vs 螺旋收敛沉降</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium text-cyan-300">核心创新：双向耦合价值反馈</td>
                <td className="py-3.5 px-4">POMDP 动态价值 Ω_t 反馈内生化防御收益，促使系统稳定，显著压低折现累计损失</td>
                <td className="py-3.5 px-4">6套对比模型嵌套消融实验（单向 vs 双向 vs 仅POMDP等）</td>
                <td className="py-3.5 px-4 text-cyan-400 font-mono">累计折现损失(降低3.6%与27.2%), 动作分布</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. 6大对比模型消融设计 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">
            二、6 大嵌套对比模型消融实验设计 (Ablation Benchmark Suite)
          </h3>
        </div>

        <p className="text-sm text-slate-300">
          为了在顶级期刊/会议论文中充分展现您模型的科学严谨性，必须建立层次分明的对比基准，严格拆解
          <strong>“宏观演化引入”</strong>、<strong>“微观信念决策”</strong>与<strong>“双向反馈闭环”</strong>各自的边际治理贡献：
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">Model 1</span>
            <h4 className="font-semibold text-white">固定基准防御 (Fixed Defense)</h4>
            <p className="text-xs text-slate-400">
              平台在全周期内仅维持基础常规检测 a1，无视环境风险演化与信念信号。代表传统“静态被动防御”工业现状。
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Model 2</span>
            <h4 className="font-semibold text-white">仅 EGT 模型 (Pure EGT)</h4>
            <p className="text-xs text-slate-400">
              仅有宏观群体博弈复制动态，无微观不完全信息 POMDP。平台仅根据群体比例 y 粗暴决定防御强弱，易造成过度清洗或滞后漏报。
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Model 3</span>
            <h4 className="font-semibold text-white">仅 POMDP 模型 (Pure POMDP)</h4>
            <p className="text-xs text-slate-400">
              外生假定固定的攻击发生概率 λ 与静态防御能力，仅在微观进行贝叶斯信念更新。忽略了攻击者群体会根据平台行为产生策略演化。
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Model 4</span>
            <h4 className="font-semibold text-white">单向耦合模型 (One-Way Coupling)</h4>
            <p className="text-xs text-slate-400">
              设定 λ_Ω = 0。EGT 的投毒比例 xt 作为时变先验输入 POMDP，但 POMDP 的未来动态安全价值不反哺宏观能力收益，演化仍呈现周期震荡。
            </p>
          </div>

          <div className="bg-slate-800/60 border border-indigo-500/50 bg-indigo-950/20 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-bold">Model 5 (本文贡献)</span>
            <h4 className="font-semibold text-white">双向耦合闭环模型 (Two-Way Coupling)</h4>
            <p className="text-xs text-slate-300">
              设定 λ_Ω &gt; 0。风险先验内生化 + 动态增量安全价值 Ω_t 经 Lref 归一化反馈入 y 的复制动态方程，形成负反馈阻尼，引导攻防走向纳什收敛！
            </p>
          </div>

          <div className="bg-slate-800/60 border border-emerald-500/40 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Model 6</span>
            <h4 className="font-semibold text-white">完全信息基准 (Oracle Upper Bound)</h4>
            <p className="text-xs text-slate-400">
              理想天花板基准：假设平台具有“神之视角”，可无时延零误差观测到隐状态 st 并施加绝对最优动作，作为理论损失下限。
            </p>
          </div>
        </div>
      </div>

      {/* 3. 参数标定与量纲对齐 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">
            三、参数标定与基准赋值依据 (Parameter Calibration)
          </h3>
        </div>

        <p className="text-sm text-slate-300">
          为了确保论文评审人认可参数的合理性，参数分为<strong>宏观博弈参数</strong>、<strong>微观控制参数</strong>与<strong>耦合转换参数</strong>三类，均需满足内生中心点存在条件：
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              宏观 EGT 参数基准设置
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <li>• <strong>投毒收益 B = 8.0, 成本 CA = 2.5</strong>：体现投毒具有较高非法回报但存在爬虫清洗与后门植入技术门槛。</li>
              <li>• <strong>监管处罚 F = 6.0</strong>：反映封号、黑名单及法律追责带来的综合惩戒威慑。</li>
              <li>• <strong>检测基准 p0 = 0.15, 主动检测增量 α = 0.50</strong>：基础规则过滤拦截低，主动能力建设显著提高检测率至 0.65。</li>
              <li>• <strong>平台增量成本 CD = 3.5, 收益 RD = 1.5, 损失 L = 10.0</strong>：满足 RD &lt; CD &lt; RD + Lα（即 1.5 &lt; 3.5 &lt; 6.5），确保存在内部均衡中心点 (xc, yc)。</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              微观 POMDP 与耦合参数基准设置
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <li>• <strong>动作成本 C(a1)=0.5 &lt; C(a2)=2.0 &lt; C(a3)=5.5</strong>：常规检查极其廉价，而全量参数回滚与重训代价高昂。</li>
              <li>• <strong>状态损失 Ls0=0 &lt; Ls1=3.0 &lt; Ls2=12.0</strong>：严重后门后门触发将导致不可挽回业务信任危机，设为基准量纲 Lref = 12.0。</li>
              <li>• <strong>折现率 γ = 0.95, 决策时域 H = 2~3</strong>：满足中长期安全收益折现与平台滚动有限视野约束。</li>
              <li>• <strong>动态认知系数 λ_Ω = 1.2</strong>：控制微观安全超额收益反馈入宏观决策的灵敏度，验证是否能有效阻尼周期振荡。</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. 具体实验步骤与论文出图指南 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            四、四大核心实验套件实施与论文图表规划 (Step-by-step Plan)
          </h3>
        </div>

        <div className="space-y-4">
          {/* Exp 1 */}
          <div className="border border-slate-800 bg-slate-800/40 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">实验一</span>
                宏观攻防演化轨迹与相图稳定性检验 (对比朱建明2014)
              </h4>
              <span className="text-xs text-slate-400">对应论文：第 3 章 &amp; 第 5.3 节</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>实施方法：</strong>设定初始点 (x0, y0) = (0.5, 0.35) 偏离理论中心点 (xc, yc)。
              分别运行纯 EGT（或单向耦合）与双向耦合闭环模型，记录 t ∈ [0, 100] 内 xt 与 yt 的轨迹，并绘制以 x 为横轴、y 为纵轴的 2D 相图。
            </p>
            <div className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              💡 <strong>论文出图：</strong>图 1（时序曲线 x(t), y(t) 对比）与图 2（相平面轨线）。纯 EGT 呈现闭合椭圆轨迹（验证命题3）；双向耦合呈现向内螺旋收敛至 (xc*, yc*)，证明本文反馈机制解决了 2014 论文中提到的“仅靠防御投入无法达到演化均衡”的困境！
            </div>
          </div>

          {/* Exp 2 */}
          <div className="border border-slate-800 bg-slate-800/40 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">实验二</span>
                6 大基准模型消融与综合治理成效对比 (Ablation Benchmark)
              </h4>
              <span className="text-xs text-slate-400">对应论文：第 6 章基准检验</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>实施方法：</strong>在基准参数下，进行 N=50 轮蒙特卡洛仿真（各80步），统计 6 个模型的平均累计折现损失 ∑ γ^t Cost_t，并将其分解为：动作支出成本、假阳性误报惩罚与真实投毒破坏损失。
            </p>
            <div className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              💡 <strong>论文出图：</strong>表 1（各模型总损失与分项明细对比表）与图 3（分项堆叠柱状图）。准确复现并印证论文摘要所述结论：双向耦合较单向耦合进一步降低损失约 3.6%，较仅 POMDP 模型降低约 27.2%！
            </div>
          </div>

          {/* Exp 3 */}
          <div className="border border-slate-800 bg-slate-800/40 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">实验三</span>
                微观信念校准与动态分层处置决策机制
              </h4>
              <span className="text-xs text-slate-400">对应论文：第 4 章 &amp; 第 5.1 节</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>实施方法：</strong>抽取典型仿真周期内的时间窗口，绘制真实隐状态 st、带噪观测 ot、信念概率分布 [b(s0), b(s1), b(s2)] 及平台动作 at 的时序对齐图。计算平衡准确率 (Balanced Accuracy) 与 Brier Score 校准度。
            </p>
            <div className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              💡 <strong>论文出图：</strong>图 4（微观状态-信念-动作联动多层时序图）。解释说明平台如何通过连续异常信号累计抬升 b(s2) 信念，精准触发高成本回滚 a3，并在清洗成功后迅速平滑退回 a1，避免盲目常态化高成本投入。
            </div>
          </div>

          {/* Exp 4 */}
          <div className="border border-slate-800 bg-slate-800/40 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">实验四</span>
                非线性风险映射、观测噪声与突发投毒冲击鲁棒性检验
              </h4>
              <span className="text-xs text-slate-400">对应论文：第 7 章稳健性检验</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong>实施方法：</strong>
              (1) 替换攻击到达映射 h(x) 为饱和指数 1-e^(-1.8ρx) 与幂函数 ρx^1.5；
              (2) 扰动观测噪声 σ ∈ [0.05, 0.35]；
              (3) 在 t=30 步人为强行注入 x=0.95 的外部协同攻击突发冲击，测算系统恢复至平稳状态的“自愈周期” (Recovery Steps)。
            </p>
            <div className="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/20">
              💡 <strong>论文出图：</strong>图 5（不同噪声与映射下的损失箱线图）与图 6（突发攻击冲击下的脉冲响应恢复曲线）。证明双向耦合结论对函数形式不敏感，且具备强大的突发安全韧性！
            </div>
          </div>
        </div>
      </div>

      {/* 5. 常见审稿人提问与应答预案 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">
            五、审稿人可能提出的核心质询与仿真论证话术 (Reviewer Defense)
          </h3>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <p className="font-semibold text-amber-300 mb-1">Q1：为什么宏观投毒率 x 可以直接输入给微观平台作为到达概率？尺度上如何解释？</p>
            <p className="text-slate-300">
              <strong>答辩要点：</strong>论文在 3.1 和 5.1 节采用了代表性平台（Representative Agent）与平均场近似（Mean-Field Approximation）。x 描述的是宏观黑客社群的投毒行为活跃度，经非线性单调映射 λ = h(x) 转化为代表性平台面临的泊松到达强度。仿真实验第 4 组进一步替换了线性、饱和指数与幂函数三种映射，结果显示治理结论完全一致，证明了平均场近似的稳健性。
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <p className="font-semibold text-amber-300 mb-1">Q2：为什么双向反馈能消除纯演化博弈的极限环周期振荡？数学本质是什么？</p>
            <p className="text-slate-300">
              <strong>答辩要点：</strong>根据雅可比矩阵分析，纯 EGT 系统的特征值为一对纯虚数 λ1,2 = ±iω，系统缺乏耗散项（耗散为0）。引入微观 POMDP 未来价值反馈项 λ_Ω Ω_t 后，当风险高时微观决策产生的未来防损价值急剧升高，向宏观复制方程注入了与状态差相关的正阻尼（Damping Term），使得特征根实部由 0 变为负数，中心点转变为渐近稳定的稳定焦点（Stable Spiral Sink），从根本上消除了反复振荡。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
