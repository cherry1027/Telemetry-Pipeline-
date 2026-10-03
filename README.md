# TelemetryFlow — Vehicle-to-Cloud Telemetry Optimizer

TelemetryFlow is a lightweight React + TypeScript research prototype for exploring vehicle-to-cloud telemetry transport trade-offs over a simulated MQTT pipeline.

**Live demo:**  
https://telemetryflow-vehicle-cloud.charanvaranasi44.workers.dev/

## Features

### Telemetry Pipeline

- Visual vehicle-to-cloud transport pipeline
- Synthetic XCP-style signal representation
- Simulated MQTT and network transport
- Cloud-side signal reconstruction
- Four deterministic driving profiles:
  - Urban
  - Highway
  - Stop-and-go
  - High-load
- Six synthetic vehicle signals:
  - Vehicle speed
  - Engine RPM
  - Coolant temperature
  - Battery voltage
  - Accelerator position
  - Energy/fuel consumption

### Encoding Comparison

Compares four telemetry strategies:

1. JSON
2. Binary / Protobuf-like representation
3. Delta encoding
4. Predictive + residual encoding

Simulated metrics include:

- Bytes transmitted
- Bandwidth reduction
- Estimated latency
- CPU cost
- Memory cost
- RMSE
- Reconstruction fidelity

The best strategy is highlighted for the selected driving profile.

### Experiment Lab

Interactive controls for:

- Driving profile
- Encoding strategy
- MQTT QoS 0, 1, or 2
- Batch size
- Network quality: 5G, 4G, or Poor

Visualizations include:

- Original vehicle-speed signal
- Reconstructed signal
- Compute-cost versus bandwidth scatter chart
- Comparison of all four encoding strategies

### Adaptive Recommendation

A deterministic rule engine recommends:

- An encoding strategy
- A suitable batch size
- An explanation based on driving profile and network quality

No machine learning or external AI services are used.

## Technology

- React
- TypeScript
- Vinext/Vite
- Recharts
- Tailwind CSS
- Cloudflare Workers
- Wrangler

## Local Development

```bash
npm install
npm run dev
