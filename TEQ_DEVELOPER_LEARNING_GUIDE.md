# TEQ (That Escalated Quickly) — Developer Master Guide & Self-Coding Roadmap

> **Mission**: *"See it. Understand it. Respond before it spreads."*
> **Purpose of this Guide**: This is your engineering bible for TEQ. It explains **why** every component exists, **how** it works under the hood, answers your architectural and dataset questions, and gives you the exact mental models and code snippets so **you can code every single part yourself**.

---

## Table of Contents
1. [The Big Questions Answered](#part-1--the-big-questions-answered)
   - [Q1: What could TEQ become with Unlimited Resources (Cloud/Supercomputers)?](#q1-the-unlimited-resource-universe-what-teq-looks-like-at-scale)
   - [Q2: Why filter CCTV videos? Does YOLO detect accidents out of the box?](#q2-the-truth-about-cctv-videos--yolo)
   - [Q3: How to train on the 3GB / 7.7M US Accidents Dataset without hanging?](#q3-training-on-the-3gb--77m-accident-dataset-without-crashing-ram)
   - [Q4: What is the Indian NCRB Dataset (`ADSI_Table_1A.2_2.csv`) and should we keep it?](#q4-what-is-the-indian-ncrb-accident-dataset)
2. [Deep Dive Crash Courses (Everything You Need to Know to Code It)](#part-2--deep-dive-crash-courses)
   - [Crash Course 1: Apache Kafka — The Real-Time Nervous System](#1-apache-kafka--the-distributed-commit-log)
   - [Crash Course 2: Apache Spark — The Streaming Factory](#2-apache-spark-structured-streaming--the-streaming-factory)
   - [Crash Course 3: OpenCV + YOLO — Computer Vision Video Ingestion](#3-computer-vision-opencv--yolo)
   - [Crash Course 4: The 4 Machine Learning Models](#4-the-4-machine-learning-models)
   - [Crash Course 5: Graph Theory, OSMnx & Dynamic Dijkstra Routing](#5-graph-theory-osmnx--dynamic-dijkstra-routing)
   - [Crash Course 6: FastAPI & WebSockets — The Real-Time Bridge](#6-fastapi--websockets-the-real-time-bridge)
3. [Your Step-by-Step Hands-On Coding Roadmap](#part-3--your-step-by-step-hands-on-coding-roadmap)

---

# Part 1 — The Big Questions Answered

---

### Q1: The Unlimited Resource Universe: What TEQ Looks Like at Scale

> *"Consider we don't have constraints like this laptop. If we had unlimited RAM, unlimited GPUs, and cloud infrastructure, what level could we reach?"*

If you had a production budget like Singapore's Smart Nation, London's TfL, or Waymo, here is what TEQ becomes:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SOVEREIGN-SCALE TEQ ARCHITECTURE                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 10,000 Live 4K RTSP IP Cameras ──> Distributed H100 GPU Cluster (Real-Time TensorRT)   │
│ 500,000 Connected Cars (CAN-Bus) ──> Apache Kafka Cluster (5M msgs/sec on AWS MSK)     │
│ City Microscopic Digital Twin (SUMO / Aimsun) ──> 20M Agent Real-Time Road Simulation   │
│ Physical Traffic Signal Overrides (NTCIP 1202) ──> Physical Green Lights Triggered     │
│ Spatio-Temporal Graph Neural Networks (ST-GCN) ──> Sub-second Citywide Speed Prediction │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### 1. Live Citywide Computer Vision (10,000+ Cameras)
- **Now (Laptop)**: We replay 5–10 video files sequentially and run YOLOv8 Nano on CPU.
- **Unlimited Scale**: An enterprise camera management system ingesting **10,000 simultaneous RTSP video streams** directly from municipal traffic poles. Each video stream runs on dedicated GPU nodes running **NVIDIA DeepStream + TensorRT**, performing vehicle counting, license plate recognition (ALPR), speed calculation, and pedestrian collision trajectory projection at 60 FPS in hardware.

#### 2. Connected Vehicle V2X (Vehicle-to-Everything) Telemetry
- **Now (Laptop)**: We simulate 5 ambulances on Delhi roads using Python math coordinates.
- **Unlimited Scale**: Every municipal bus, police cruiser, taxi, and ambulance streams live **CAN-Bus vehicle telemetry** (airbag deployment sensors, ABS trigger signals, sudden deceleration g-force accelerometer readings) directly via 5G cellular modems into Kafka at 5,000,000 events/second.

#### 3. Microscopic Traffic Digital Twin (SUMO / Aimsun)
- **Now (Laptop)**: We calculate route travel times using standard Dijkstra edge weights.
- **Unlimited Scale**: Running a **Digital Twin simulation** of 20 million citizens. Every single car is modeled as an autonomous agent. When an accident occurs, the simulation runs 500 Monte Carlo scenarios 15 minutes into the future to predict exactly which residential side-streets will suffer secondary gridlock.

#### 4. Physical Traffic Signal Actuation (Hardware Integration)
- **Now (Laptop)**: We display "Traffic Diversion Active" and simulated green corridors on our React HUD.
- **Unlimited Scale**: Integrating with SCADA / ATC (Adaptive Traffic Control) systems using the industry-standard **NTCIP 1202 protocol**. The system physically forces traffic lights along the ambulance's route to switch to solid green 30 seconds before the vehicle arrives, holding opposing traffic at red.

#### 5. Spatio-Temporal Graph Neural Networks (ST-GCN)
- **Now (Laptop)**: We use an LSTM on single road speed time-series.
- **Unlimited Scale**: A full Spatio-Temporal Graph Convolutional Network that models all 112,000 road segments in Delhi simultaneously, capturing spatial dependencies (traffic jam on Outer Ring Road propagating into Barakhamba Road within 8 minutes).

---

### Q2: The Truth About CCTV Videos & YOLO

> *"Why are we reducing the videos? Is YOLO pretrained? Does it just see any video and detect accidents with accuracy?"*

#### 1. What YOLO is (and what it IS NOT)
- **What it is**: YOLO (*You Only Look Once*) is an object detection neural network. The standard YOLO models (`yolov8n`, `yolov8s`, etc.) are pretrained on the **COCO (Common Objects in Context)** dataset.
- COCO has **80 classes**: `car`, `motorcycle`, `bus`, `truck`, `person`, `bicycle`, `traffic light`, `stop sign`, etc.
- **What it is NOT**: **YOLO does NOT know what an "accident" is out of the box!**
  - If a car crashes into a truck, YOLO will draw a bounding box around the car (`car: 0.94`) and another box around the truck (`truck: 0.91`). It will **not** magically output a label saying *"accident"*.

#### 2. How Real Accident Detection Works in TEQ
Accident detection combines **YOLO Detection + Kinematics & Spatial Overlap Logic**:
1. **Bounding Box Overlap (Intersection over Union - IoU)**:
   When two vehicle bounding boxes intersect significantly (`IoU > 0.45`), they are physically touching.
2. **Velocity Vector Breakdown**:
   If a vehicle was traveling at 50 km/h across frames and its centroid velocity drops to 0 km/h in 2 frames while overlapping with another box, **a collision has occurred**.
3. **Abnormal Orientation / Angle**:
   A car turned sideways perpendicular to the lane markings while stationary indicates a crash or spin-out.
4. **Smoke / Fire Detection**:
   A custom lightweight classifier head detects grey smoke plumes or pixel motion anomalies.

#### 3. Why Did We Suggest Reducing / Filtering the Videos?
- The dataset you downloaded is the **UCF-Crime / Anomaly Detection** dataset.
- In UCF-Crime, the `RoadAccidents` folder contains genuine traffic crashes. But `Testing_Normal_Videos_Anomaly` contains generic security camera clips: people talking in university hallways, corridors, shopping malls, and building lobbies.
- **Why filter out people talking?**:
  - In a smart traffic system, a video of two people standing in a room contains 0 vehicles, 0 lanes, and 0 traffic. Passing it into vehicle detection produces blank telemetry.
  - Furthermore, single videos in that folder are **905 MB (`Normal_Videos_935_x264.mp4`)** and **588 MB**. Keeping 150 huge videos consumes over **6 GB of your remaining 34 GB of disk space** with zero benefit to your project.
- **The Ideal Setup**:
  - Keep **5–10 representative road accident videos** (collisions, rollovers, blocked lanes).
  - Keep **5–10 representative normal traffic videos** (cars flowing smoothly on highways at 50 km/h).
  - Delete or archive the indoor non-traffic footage to keep your laptop fast and clean.

---

### Q3: Training on the 3GB / 7.7M Accident Dataset without Crashing RAM

> *"Can the model train on that big dataset? Won't it hang? You said generate a 200k row sample, but I don't want synthetic data — I want real data."*

Let's clear up a major misconception first:
#### 1. A 200,000-Row Sample IS 100% Real Data
- When we say "generate a 200,000-row sample", we do **NOT** mean synthetic fake data!
- We mean taking **200,000 real, genuine accident records** from your 7,700,000-row `large_file.csv` file using stratified sampling.
- In statistics and data science, **200,000 real samples gives a 99.99% confidence interval** with less than 0.2% margin of error. The ML model learns the exact same patterns, feature correlations, and weights as it would on 7.7M rows!

#### 2. Why `pd.read_csv('large_file.csv')` Hangs Your Laptop
- On disk, `large_file.csv` is 3.05 GB of compressed text.
- When Pandas reads a CSV into RAM, it converts strings into Python objects, numbers into 64-bit floats, and allocates contiguous memory arrays.
- A 3GB CSV expands to **~10 to 14 GB of uncompressed memory in RAM**!
- Because your laptop has **8 GB of total physical RAM** (and Windows uses ~4 GB for the OS), Pandas immediately runs out of memory. Windows starts thrashing the hard drive pagefile, causing your CPU to hit 100% and your machine to freeze.

#### 3. How Big Data Engineers Train on 7.7M Rows (Real Data)
If you want to train on the full dataset without crashing your laptop, you have 3 industry-standard choices:

##### Approach A: Cloud Training (Google Colab / Kaggle — Recommended & Free)
1. Upload your `large_file.csv` (or download the Kaggle US-Accidents dataset directly) to **Google Colab** or **Kaggle Notebooks**.
2. Both platforms provide **16 GB to 32 GB of high-speed cloud RAM and free NVIDIA T4/P100 GPUs**!
3. Run your training script on all 7.7 million rows in the cloud. It trains in ~10 minutes.
4. Export the trained model: `joblib.dump(model, 'xgboost_severity_full_7.7m.joblib')` (~20 MB).
5. Download that 20MB file to your laptop and load it locally. You now have a model trained on 7.7 million real records running with zero lag on your laptop!

##### Approach B: Out-of-Core Incremental Batch Learning (Locally on your laptop)
- In Python, you do not need to load 7.7M rows at once. You can stream chunks of 50,000 rows from disk, train incrementally using `partial_fit`, and discard the chunk from RAM:
```python
import pandas as pd
from sklearn.linear_model import SGDClassifier

model = SGDClassifier(loss='log_loss')
# Reads 50,000 rows at a time from disk (uses only ~80MB RAM!)
for chunk in pd.read_csv('large_file.csv', chunksize=50000):
    X_chunk, y_chunk = preprocess(chunk)
    model.partial_fit(X_chunk, y_chunk, classes=[1, 2, 3, 4])
```

##### Approach C: Big Data Streaming Proof (The Kafka Replay)
- The purpose of the 7.7M records in the project brief is **streaming validation**: demonstrating that your Kafka + Spark pipeline can handle a continuous stream of events at high velocity (1,000 events/second) without dropping packets.
- Your Python Kafka producer opens `large_file.csv` and reads it line-by-line using a Python generator (`for line in open(...)`), which consumes **less than 10 MB of RAM** while streaming millions of events!

---

### Q4: What is the Indian NCRB Accident Dataset?

In your folder, there are two files:
1. `rename it to what is this.xml` (77 KB)
2. `ADSI_Table_1A.2_2.csv` (5.6 KB)

#### What are they?
- We opened both files: they contain the **exact same government data**.
- The XML file is simply an raw XML export of the CSV file.
- **The Dataset**: It is the official **NCRB (National Crime Records Bureau, Ministry of Home Affairs, Government of India)** *Accidental Deaths & Suicides in India (ADSI)* Table 1A.2.
- It contains official state-by-state and city-by-city records of traffic accidents, injuries, and fatalities across India:
  - **All India**: 446,768 road accidents, 423,158 injuries, 171,100 deaths.
  - **Delhi City**: 5,387 road accidents, 4,572 injuries, 1,412 deaths (highest in India).
  - **Bengaluru**: 3,822 cases, 3,189 injuries, 772 deaths.
  - **Chennai**: 3,452 cases, 3,724 injuries, 507 deaths.

#### What to do with them:
- **`rename it to what is this.xml`**: **DELETE IT**. It is a redundant, unformatted duplicate of the CSV.
- **`ADSI_Table_1A.2_2.csv`**: **KEEP IT and RENAME IT to `NCRB_Indian_Road_Accidents_City_State.csv`**.
- **Why it is valuable**: In your viva/evaluation, this proves your real-world grounding in Indian urban emergency challenges with official government statistics.

---

# Part 2 — Deep Dive Crash Courses

Here is the exact developer knowledge you need to build and code each part yourself.

---

### 1. Apache Kafka — The Distributed Commit Log

#### Why Kafka? Why not a simple REST API or PostgreSQL?
- Imagine you have 6 data sources streaming data every second:
  - 10 CCTV camera feeds emitting vehicle detections 30 times a second.
  - 5 Ambulances streaming GPS coordinates every 2 seconds.
  - Weather API updating every 10 minutes.
  - Road sensors updating speed every 2 minutes.
  - Citizens submitting reports.
- **The Failure of Direct HTTP/Database architecture**:
  - If source #1 sends an HTTP request directly to your ML service, what happens if the ML service is busy or crashes? **The data is lost forever.**
  - If 6 sources write directly to PostgreSQL simultaneously at 1,000 writes/sec, database locks occur, connection pools exhaust, and queries slow to a crawl.
- **Kafka's Solution**:
  - Kafka is a **distributed, append-only, fault-tolerant commit log**.
  - Producers (CCTV, GPS, Weather) only dump messages into Kafka topics and immediately move on.
  - Consumers (Spark, ML models, Dashboard) read from topics at their own pace.
  - If your ML service goes down for 5 minutes, Kafka holds the messages on disk. When the service restarts, it resumes reading right where it left off!

```
[ CCTV Producer ] ────> [ Topic: cctv-events ] ───┐
[ GPS Producer  ] ────> [ Topic: gps-events  ] ───┼──> [ Spark Streaming Consumer ] ──> [ ML ]
[ Weather Prod  ] ────> [ Topic: weather-events ] ─┘
```

#### Where does Kafka store data? Is it an in-memory database?
- **NO**, Kafka is NOT purely in-memory. Kafka writes all messages directly to **append-only binary segment files on your hard drive** (e.g. `C:\tmp\kafka-logs\` or `/tmp/kafka-logs/`).
- Because sequential disk writes on modern SSDs are nearly as fast as RAM (hundreds of megabytes per second), Kafka achieves millions of messages per second while persisting everything to disk.

#### Key Kafka Concepts
1. **Topic**: A named stream/channel (e.g. `cctv-events`, `gps-events`).
2. **Partition**: Topics are divided into partitions for parallel processing.
3. **Offset**: A unique sequential integer assigned to each message in a partition (e.g., Message 0, 1, 2...).
4. **Consumer Group**: A group of consumers that cooperate to consume data. Kafka tracks the consumer group's *current offset* so it never re-reads duplicate data.

#### How to Code a Kafka Producer in Python:
```python
from kafka import KafkaProducer
import json
import time

# 1. Initialize Producer
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# 2. Emit structured event to Kafka topic
event_payload = {
    "camera_id": "CAM-104",
    "incident_type": "COLLISION",
    "confidence": 0.94,
    "timestamp": time.time(),
    "coordinates": {"lat": 28.5720, "lng": 77.2120}
}

producer.send('cctv-events', value=event_payload)
producer.flush()
print("Message successfully published to Kafka!")
```

#### How to Code a Kafka Consumer in Python:
```python
from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    'cctv-events',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='teq-cctv-processors',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

print("Listening for Kafka messages on 'cctv-events'...")
for message in consumer:
    data = message.value
    print(f"Received from partition {message.partition}, offset {message.offset}: {data}")
```

---

### 2. Apache Spark Structured Streaming — The Streaming Factory

#### Why Spark? Why not a simple Python `while True` loop?
- A simple Python loop can only process messages one-by-one on a single CPU thread.
- What if an accident occurs at 19:45:00, and you need to:
  1. Join the CCTV collision detection with the road speed sensor reading at that exact second.
  2. Join it with the weather precipitation reading within a 500m radius.
  3. Normalize all features into a numerical tensor.
  4. Pass the vector to 4 ML models simultaneously.
- Doing cross-stream time-window joins in raw Python requires writing hundreds of lines of complex buffer management, hash tables, thread locks, and memory eviction logic.
- **Spark Structured Streaming handles this automatically**:
  - Treats live streaming data as an **infinite appending table**.
  - Provides built-in **windowing** (`.groupBy(window("timestamp", "30 seconds"))`).
  - Provides **watermarking** to handle out-of-order or delayed mobile data.

#### The 30-Second Micro-Batch Explained
- Instead of firing expensive ML inference 1,000 times a second for every individual sensor packet, Spark aggregates incoming messages into **30-second micro-batches**.
- Every 30 seconds, Spark:
  1. Grabs all records received in that window across all 6 Kafka topics.
  2. Aligns them by timestamp and geohash coordinates.
  3. Emits one clean feature DataFrame to the decision engine.

#### PySpark Structured Streaming Code Skeleton:
```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, window
from pyspark.sql.types import StructType, StringType, DoubleType, TimestampType

# 1. Initialize Spark Session in Local Mode
spark = SparkSession.builder \
    .appName("TEQ-Streaming-Factory") \
    .master("local[2]") \
    .config("spark.driver.memory", "1g") \
    .getOrCreate()

# 2. Read Stream from Kafka Topic
df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "cctv-events") \
    .load()

# 3. Parse JSON bytes
schema = StructType() \
    .add("camera_id", StringType()) \
    .add("incident_type", StringType()) \
    .add("confidence", DoubleType())

parsed_df = df.select(from_json(col("value").cast("string"), schema).alias("data")).select("data.*")

# 4. Stream to Console / Sink
query = parsed_df.writeStream \
    .outputMode("append") \
    .format("console") \
    .start()

query.awaitTermination()
```

---

### 3. Computer Vision: OpenCV + YOLO

#### How OpenCV and YOLO work together in TEQ:
1. **OpenCV (`cv2.VideoCapture`)**: Opens the video file (or live RTSP IP camera feed) and extracts frames as NumPy image matrices `(height, width, 3)`.
2. **YOLO (`ultralytics.YOLO`)**: Takes the frame, performs a single forward pass through its convolutional/backbone layers, and returns detected bounding boxes with confidence scores.
3. **Frame Sampling**: Processing 30 FPS on CPU is wasteful. We process **every 10th frame** (3 FPS). If a crash happens, it lasts multiple seconds, so 3 FPS easily captures it while reducing CPU usage by 90%!

#### The OpenCV + YOLO Code Pattern:
```python
import cv2
from ultralytics import YOLO

# Load lightweight YOLOv8 Nano model (only ~6MB, runs fast on CPU)
model = YOLO('yolov8n.pt')

cap = cv2.VideoCapture('All datasets/CCTV/RoadAccidents/RoadAccidents001_x264.mp4')
frame_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    # Sample every 10th frame
    if frame_count % 10 != 0:
        continue

    # Run inference on vehicles (COCO classes: 2=car, 3=motorcycle, 5=bus, 7=truck)
    results = model(frame, classes=[2, 3, 5, 7], verbose=False)
    
    boxes = results[0].boxes
    vehicle_count = len(boxes)

    # Check for overlapping bounding boxes (possible collision)
    collision_detected = False
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            boxA = boxes[i].xyxy[0].tolist()
            boxB = boxes[j].xyxy[0].tolist()
            # Calculate IoU / intersection between boxA and boxB
            # If intersection > threshold, flag collision!
            pass

    print(f"Frame {frame_count}: Vehicles detected = {vehicle_count}")

cap.release()
```

---

### 4. The 4 Machine Learning Models

Why do we need 4 separate models instead of one big model?
Because each model solves a fundamentally different mathematical problem:

| Model | Algorithm | Input | Output | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1** | **Random Forest** | Sensor reading + Time + Location | Binary (`0` or `1`) | **Noise Filter**: Is this a real incident or a sensor glitch? |
| **Model 2** | **XGBoost** | Weather + Road speed + Vehicle count | 4 Classes (`Low`, `Mod`, `High`, `Critical`) | **Severity Classifier**: Does this require an ambulance or just monitoring? |
| **Model 3** | **LSTM Neural Net** | Sequence of road speeds (last 5 min) | Speed vector (next 15 min) | **Congestion Forecaster**: Knows a road will jam *before* it happens. |
| **Model 4** | **TF-IDF + LogReg** | Text from citizen report / Audio transcript | Incident Category & Urgency | **NLP Entity Extractor**: Analyzes citizen reports & 112 calls. |

---

### 5. Graph Theory, OSMnx & Dynamic Dijkstra Routing

#### What is OSMnx?
- **OSMnx** is a Python library that downloads real street networks directly from **OpenStreetMap** and converts them into a mathematical graph (`networkx.MultiDiGraph`).
- Every road intersection is a **Node** $(u, v)$ with GPS coordinates (`lat`, `lng`).
- Every road segment is a directed **Edge** with attributes: `length` (meters), `speed_kph`, `lanes`, `name`.

#### How Dynamic Dijkstra Works in TEQ:
1. Standard Dijkstra calculates the shortest path by distance:
   $$\text{Weight}(e) = \text{Length}(e)$$
2. **TEQ's Traffic-Aware Dynamic Edge Weight**:
   Instead of distance, TEQ routes by **time**, incorporating the LSTM predicted speed and weather friction:
   $$\text{Travel Time}(e) = \frac{\text{Length}(e)}{\text{Speed}_{\text{LSTM}}(e)} \times \text{RainPenalty}$$
3. If an accident occurs on Ring Road and the LSTM predicts its speed will collapse from 50 km/h to 10 km/h, the travel time along that edge multiplies by 5×.
4. Dijkstra automatically routes the ambulance and civilian traffic around the bottleneck via alternate parallel corridors!

---

### 6. FastAPI & WebSockets — The Real-Time Bridge

#### Why WebSockets instead of normal HTTP REST API?
- With standard HTTP REST, the React frontend must constantly poll the server (`fetch('/incidents')` every 1 second).
- 95% of those requests return empty data, wasting CPU cycles and battery.
- **WebSockets** establish a **persistent, two-way open pipeline** between the Python backend and the browser.
- When an incident is confirmed or an ambulance moves, the FastAPI server pushes the JSON packet instantly to the frontend in < 5 milliseconds.

```python
from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        # Push telemetry updates to React dashboard
        data = {"type": "INCIDENT_ALERT", "id": "INC-104", "eta": "4.2 min"}
        await websocket.send_json(data)
        await asyncio.sleep(2)
```

---

# Part 3 — Your Step-by-Step Hands-On Coding Roadmap

Here is the exact step-by-step sequence of tasks to build TEQ yourself:

```
[Phase 1: Dataset Prep & 200k Extraction] ➔ [Phase 2: Train the 4 ML Models Offline]
                              │
[Phase 3: Python Kafka / Streaming Setup] ➔ [Phase 4: YOLO Video Ingestion Pipeline]
                              │
[Phase 5: OSMnx Delhi Dijkstra Router] ➔ [Phase 6: FastAPI WebSocket Live Server]
```

### Milestone 1: Data Preparation & Hygiene
- [ ] **Task 1.1**: Delete redundant XML file `All datasets/rename it to what is this.xml`.
- [ ] **Task 1.2**: Rename `ADSI_Table_1A.2_2.csv` to `NCRB_Indian_Road_Accidents_City_State.csv`.
- [ ] **Task 1.3**: Delete the three 1GB split files (`part1.csv`, `part2.csv`, `part3.csv`) to recover 3.0 GB of disk space.
- [ ] **Task 1.4**: Run a Python script (`extract_sample.py`) to extract a clean **200,000-row sample** from `large_file.csv` into `us_accidents_sample_200k.csv` (~65 MB).
- [ ] **Task 1.5**: Curate 5–8 accident video clips and 5–8 normal road traffic clips in `All datasets/CCTV/`; remove the indoor non-traffic videos.

### Milestone 2: Model Training (Offline)
- [ ] **Task 2.1**: Write `train_incident_detector.py` (Random Forest binary classification on accident data).
- [ ] **Task 2.2**: Write `train_severity_classifier.py` (XGBoost multi-class severity prediction on weather + road features).
- [ ] **Task 2.3**: Write `train_traffic_lstm.py` (LSTM sequence-to-sequence speed forecaster on sensor time-series).
- [ ] **Task 2.4**: Save all trained model artifacts into a `models/` directory using `joblib`.

### Milestone 3: Streaming Producers & Video Pipeline
- [ ] **Task 3.1**: Write `producers/cctv_producer.py` running OpenCV + YOLOv8n to extract vehicle counts and collision alerts.
- [ ] **Task 3.2**: Write `producers/weather_producer.py` polling live OpenWeatherMap API every 10 minutes.
- [ ] **Task 3.3**: Write `producers/ambulance_gps_producer.py` moving 5 ambulances along Delhi road coordinates.

### Milestone 4: Graph Decision Engine
- [ ] **Task 4.1**: Write `router/delhi_graph.py` downloading Delhi's drivable street network using OSMnx and saving it locally as a graph file.
- [ ] **Task 4.2**: Implement Dijkstra shortest-path with dynamic LSTM congestion edge weights.
- [ ] **Task 4.3**: Implement civilian traffic diversion generator finding alternate bypass routes.

### Milestone 5: Full-Stack Integration
- [ ] **Task 5.1**: Build the FastAPI server (`backend/main.py`) with WebSocket broadcasting.
- [ ] **Task 5.2**: Connect your React dashboard to `ws://localhost:8000/ws/telemetry` so the live map, incident feed, and pipeline tabs render real backend signals!
