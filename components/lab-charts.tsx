"use client";

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import type { SignalPoint, StrategyResult } from "@/lib/telemetry";

function SignalChart({ dataKey, color, title, data }: { dataKey: "original" | "reconstructed"; color: string; title: string; data: SignalPoint[] }) {
  return (
    <article className="chart-card signal-chart-card">
      <div className="chart-title"><div><p className="panel-kicker">VEHICLE SPEED · KM/H</p><h2>{title}</h2></div><span className="chart-key"><i style={{ background: color }} /> 10 Hz synthetic</span></div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 560, height: 218 }}>
          <LineChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#193747" strokeDasharray="2 5" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: "#6f8d9d", fontSize: 10 }} axisLine={{ stroke: "#28485a" }} tickLine={false} />
            <YAxis tick={{ fill: "#6f8d9d", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
            <Tooltip contentStyle={{ background: "#0b1c2a", border: "1px solid #2d5265", fontSize: 12 }} labelFormatter={(value) => `${value}s`} formatter={(value) => [`${value} km/h`, title]} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: color, stroke: "#07121f", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-axis-label"><span>0 s</span><span>time window</span><span>58.5 s</span></div>
    </article>
  );
}

export function SignalCharts({ data }: { data: SignalPoint[] }) {
  return (
    <section className="signal-charts">
      <SignalChart dataKey="original" color="#ff9f43" title="Original signal" data={data} />
      <SignalChart dataKey="reconstructed" color="#23d3d3" title="Reconstructed signal" data={data} />
    </section>
  );
}

export function TradeoffScatter({ data }: { data: StrategyResult[] }) {
  return (
    <div className="scatter-area">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 720, height: 280 }}>
        <ScatterChart margin={{ top: 30, right: 36, bottom: 24, left: 6 }}>
          <CartesianGrid stroke="#193747" strokeDasharray="2 5" />
          <XAxis type="number" dataKey="cpu" name="CPU cost" unit="%" tick={{ fill: "#6f8d9d", fontSize: 10 }} axisLine={{ stroke: "#28485a" }} tickLine={false} label={{ value: "Computational cost →", position: "insideBottom", offset: -16, fill: "#7893a2", fontSize: 11 }} domain={[0, 80]} />
          <YAxis type="number" dataKey="bandwidth" name="Bandwidth" unit=" kbps" tick={{ fill: "#6f8d9d", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Bandwidth usage →", angle: -90, position: "insideLeft", fill: "#7893a2", fontSize: 11 }} />
          <ZAxis range={[130, 130]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0b1c2a", border: "1px solid #2d5265", fontSize: 12 }} />
          <Scatter data={data} fill="#23d3d3" stroke="#b7ffff" strokeWidth={1}><LabelList dataKey="strategy" position="top" fill="#aec6d0" fontSize={11} /></Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
