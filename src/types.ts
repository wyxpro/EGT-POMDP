export interface EGTParams {
  B: number;       // 投毒成功给攻击者带来的收益 (default: 8.0)
  CA: number;      // 攻击者实施投毒的技术与机会成本 (default: 2.5)
  F: number;       // 投毒被检测后的有效预期处罚 (default: 6.0)
  RD: number;      // 主动防御能力建设带来的独立收益 (声誉/合规) (default: 1.5)
  CD: number;      // 主动防御相对于基础防御的增量成本 (default: 3.5)
  L: number;       // 投毒成功给平台造成的综合损失 (default: 10.0)
  p0: number;      // 基础检测概率 (default: 0.15)
  alpha: number;   // 主动防御带来的检测概率增量 (default: 0.50)
  lambdaOmega: number; // 动态价值认知系数 (default: 1.2)
  rhoA: number;    // 攻击到达映射系数 (default: 0.8)
  mappingType: 'linear' | 'saturated' | 'power'; // h(x) 映射类型
}

export interface POMDPParams {
  costA1: number;  // 常规检测成本 C(a1) (default: 0.5)
  costA2: number;  // 强化检测与清洗成本 C(a2) (default: 2.0)
  costA3: number;  // 回滚重训成本 C(a3) (default: 5.5)
  CFP: number;     // 误报/过度防御惩罚 C_FP (default: 1.5)
  Ls0: number;     // 安全状态损失 (0)
  Ls1: number;     // 轻度投毒损失 (default: 3.0)
  Ls2: number;     // 严重后门损失 L_ref (default: 12.0)
  gamma: number;   // 折现因子 (default: 0.95)
  observationNoise: number; // 观测噪声方差或模糊度 (default: 0.15)
}

export interface SimulationConfig {
  steps: number;        // 总仿真期数 (e.g. 100)
  dt: number;           // 连续演化积分步长 (e.g. 0.1)
  initX: number;        // 初始投毒者比例 x0 (default: 0.45)
  initY: number;        // 初始主动防御比例 y0 (default: 0.35)
  initBelief: [number, number, number]; // [b0, b1, b2] (default: [0.8, 0.15, 0.05])
  seed?: number;        // 伪随机数发生器种子 (确保模型消融实验的可复现性与同源扰动)
  burstAttackAt?: number; // 突发攻击注入时间点 (optional)
  burstAttackIntensity?: number; // 突发攻击强度 (e.g. 0.95)
}

export type ModelType = 
  | 'fixed'        // 固定基线防御
  | 'egt_only'     // 纯 EGT 复制动态 (无微观信念动作)
  | 'pomdp_only'   // 纯 POMDP (外生静态环境)
  | 'one_way'      // 单向耦合 (lambdaOmega = 0)
  | 'two_way'      // 双向耦合 (论文核心模型)
  | 'oracle';      // 完全信息上限 (Oracle)

export interface StepRecord {
  step: number;
  time: number;
  // 宏观状态
  x: number; // 投毒者比例
  y: number; // 平台防御比例
  lambdaT: number; // 攻击到达强度
  // 微观状态与决策
  trueState: number; // 0: s0, 1: s1, 2: s2
  belief: [number, number, number]; // [b(s0), b(s1), b(s2)]
  observation: number; // 0: Low, 1: Med, 2: High
  action: number; // 0: a1, 1: a2, 2: a3
  // 成本与奖励
  actionCost: number;
  fpCost: number;
  damageLoss: number;
  stepTotalCost: number;
  discountedCumulativeLoss: number;
  // 反馈量
  omegaT: number; // 动态增量价值
  omegaNorm: number; // 归一化动态价值
  omegaTNormalized?: number; // 兼容别名
}

export interface ModelSimulationResult {
  modelType: ModelType;
  modelName: string;
  records: StepRecord[];
  totalLoss: number;
  avgCostBreakdown: {
    actionCost: number;
    fpCost: number;
    damageLoss: number;
  };
  balancedAccuracy: number;
  brierScore: number;
  convergenceStep: number | null; // 达到平衡的步数
  isStable: boolean;
}

export interface SimulationPreset {
  id: string;
  title: string;
  subtitle: string;
  egt: EGTParams;
  pomdp: POMDPParams;
  config: SimulationConfig;
  description: string;
}

export interface ModelMonteCarloStats {
  modelType: ModelType;
  modelName: string;
  meanLoss: number;
  stdLoss: number;
  meanActionCost: number;
  meanFpCost: number;
  meanDamageLoss: number;
  meanBalancedAccuracy: number;
  meanBrierScore: number;
  runs: number;
}

export interface RobustnessTestResult {
  mappingComparison: {
    mappingType: 'linear' | 'saturated' | 'power';
    name: string;
    formula: string;
    twoWayLoss: number;
    oneWayLoss: number;
    reduction: number;
  }[];
  noiseSensitivity: {
    noise: number;
    twoWayLoss: number;
    oneWayLoss: number;
    reduction: number;
    brierScore: number;
  }[];
  shockRecovery: {
    shockTime: number;
    shockIntensity: number;
    recordsTwoWay: StepRecord[];
    recordsOneWay: StepRecord[];
    recoveryStepsTwoWay: number | null; // steps until |x - xc| < 0.04
    recoveryStepsOneWay: number | null;
  };
}
