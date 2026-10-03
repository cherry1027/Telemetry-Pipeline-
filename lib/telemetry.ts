export const profiles = ["Urban", "Highway", "Stop-and-go", "High-load"] as const;
export const strategies = ["JSON", "Binary", "Delta", "Predictive"] as const;
export const networks = ["5G", "4G", "Poor"] as const;
export const qosLevels = ["0", "1", "2"] as const;

export type Profile = (typeof profiles)[number];
export type Strategy = (typeof strategies)[number];
export type NetworkQuality = (typeof networks)[number];
export type QoS = (typeof qosLevels)[number];

export type StrategyResult = {
  strategy: Strategy; bytes: number; bandwidth: number; reduction: number; ratio: number;
  latency: number; cpu: number; memory: number; rmse: number; fidelity: number;
};

const profileFactor: Record<Profile, number> = { Urban: 1, Highway: 0.86, "Stop-and-go": 1.14, "High-load": 1.28 };
const strategyModel: Record<Strategy, { size: number; cpu: number; memory: number; rmse: number }> = {
  JSON: { size: 1, cpu: 18, memory: 22, rmse: 0 },
  Binary: { size: 0.44, cpu: 27, memory: 28, rmse: 0 },
  Delta: { size: 0.23, cpu: 39, memory: 34, rmse: 0.12 },
  Predictive: { size: 0.16, cpu: 61, memory: 48, rmse: 0.24 },
};
const networkModel: Record<NetworkQuality, { bandwidth: number; latency: number }> = {
  "5G": { bandwidth: 1.3, latency: 15 }, "4G": { bandwidth: 1, latency: 38 }, Poor: { bandwidth: 0.48, latency: 118 },
};
const profileBest: Record<Profile, Strategy> = { Urban: "Predictive", Highway: "Delta", "Stop-and-go": "Delta", "High-load": "Predictive" };

export function runSimulation(profile: Profile, strategy: Strategy, qos: QoS = "1", batchSize = 20, network: NetworkQuality = "4G"): StrategyResult {
  const baseBytes = 86400 * profileFactor[profile];
  const model = strategyModel[strategy];
  const batchEfficiency = Math.max(0.78, 1 - Math.log2(Math.max(1, batchSize)) * 0.025);
  const qosOverhead = { "0": 1, "1": 1.08, "2": 1.18 }[qos];
  const bytes = Math.round(baseBytes * model.size * batchEfficiency * qosOverhead);
  const networkSpec = networkModel[network];
  const bandwidth = Number(((bytes * 8) / 60 / 1000 / networkSpec.bandwidth).toFixed(1));
  const latency = networkSpec.latency + Math.round(batchSize * 0.72) + { "0": 0, "1": 13, "2": 31 }[qos] + Math.round(model.cpu * 0.19);
  const cpu = Number((model.cpu * (profile === "High-load" ? 1.16 : profile === "Highway" ? 0.92 : 1)).toFixed(1));
  const memory = Number((model.memory + batchSize * 0.22).toFixed(1));
  const profileError = profile === "Stop-and-go" ? 1.3 : profile === "High-load" ? 1.15 : 1;
  const rmse = Number((model.rmse * profileError).toFixed(2));
  const fidelity = Number(Math.max(98.7, 100 - rmse * 0.72).toFixed(2));
  const reduction = Number((100 - (bytes / baseBytes) * 100).toFixed(1));
  return { strategy, bytes, bandwidth, reduction, ratio: Number((baseBytes / bytes).toFixed(2)), latency, cpu, memory, rmse, fidelity };
}

export const compareStrategies = (profile: Profile) => strategies.map((strategy) => runSimulation(profile, strategy));
export const bestStrategy = (profile: Profile) => profileBest[profile];
export type SignalPoint = { t: number; original: number; reconstructed: number };

export function generateSignal(profile: Profile, strategy: Strategy): SignalPoint[] {
  const model = strategyModel[strategy];
  return Array.from({ length: 40 }, (_, index) => {
    const t = index * 1.5;
    let speed = 0;
    if (profile === "Urban") speed = 31 + 13 * Math.sin(index * 0.34) + 5 * Math.sin(index * 0.86);
    else if (profile === "Highway") speed = 96 + 7 * Math.sin(index * 0.2) + 2 * Math.cos(index * 0.7);
    else if (profile === "Stop-and-go") speed = Math.max(0, 44 * Math.sin(index * 0.28));
    else speed = 74 + 16 * Math.sin(index * 0.25) + 6 * Math.cos(index * 0.52);
    const residual = model.rmse * (Math.sin(index * 1.7) + Math.cos(index * 0.43) * 0.6);
    return { t, original: Number(Math.max(0, speed).toFixed(2)), reconstructed: Number(Math.max(0, speed + residual).toFixed(2)) };
  });
}

export function recommendation(network: NetworkQuality, profile: Profile) {
  if (network === "Poor") return { strategy: "Predictive + residual", batch: 50, reason: "Constrained bandwidth makes payload size the dominant cost. Predictive residuals minimize transmitted bytes, while larger batches reduce MQTT framing overhead." };
  if (profile === "Stop-and-go") return { strategy: "Delta encoding", batch: 30, reason: "Frequent speed transitions favor local differences without the higher compute demand of prediction. Moderate batching keeps event latency controlled." };
  if (network === "5G") return { strategy: "Binary representation", batch: 10, reason: "Strong network capacity shifts the priority toward low compute cost and short batching delay while still avoiding verbose JSON payloads." };
  return { strategy: profile === "High-load" ? "Predictive + residual" : "Delta encoding", batch: 25, reason: "Balanced 4G conditions reward compression, but not at the expense of excessive onboard compute. The selected method offers a practical middle ground." };
}

export const signalInventory = [
  ["Vehicle speed", "km/h", "10 Hz"], ["Engine RPM", "rpm", "20 Hz"], ["Coolant temperature", "°C", "2 Hz"],
  ["Battery voltage", "V", "5 Hz"], ["Accelerator position", "%", "10 Hz"], ["Energy / fuel consumption", "kWh/100 km", "1 Hz"],
] as const;
