# TEQ (That Escalated Quickly) — See it. Understand it. Respond before it spreads.

TEQ is a multimodal real-time urban emergency response and predictive traffic intelligence command system built on a Big Data streaming architecture. It ingests 6 simultaneous data streams, processes them via Apache Kafka and Apache Spark Structured Streaming, runs 4 ML models simultaneously, and executes automated ambulance dispatch and civilian traffic diversion with sub-minute latency.

---

## Quick Navigation

- **Developer Learning Guide & Architecture Crash Course**: See [TEQ_DEVELOPER_LEARNING_GUIDE.md](file:///c:/Users/astro/Desktop/College%20Ayush/BDA/CityPulse/TEQ_DEVELOPER_LEARNING_GUIDE.md) for deep dives into Kafka, Spark, YOLO, ML models, and how to code each part yourself.
- **Detailed Project Audit & Roadmap**: See [PROJECT_STATUS_ROADMAP.md](file:///c:/Users/astro/Desktop/College%20Ayush/BDA/CityPulse/PROJECT_STATUS_ROADMAP.md) for what is currently built vs what is left to be made.
- **Tech Stack**: React 19, Tailwind CSS v4, Leaflet, Remix Icons (`react-icons/ri`), Tabler Icons (`react-icons/tb`).
- **Target Backend Pipeline**: Apache Kafka, Apache Spark Structured Streaming, PyTorch/XGBoost/scikit-learn, OSMnx + NetworkX, FastAPI.

---

## Running the Frontend Command Center

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

