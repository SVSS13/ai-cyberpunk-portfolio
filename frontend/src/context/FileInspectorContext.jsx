import { createContext, useContext, useState } from 'react';
import resumePdf from '../assets/resume.pdf';

const FileInspectorContext = createContext(null);

export const DEFAULT_FILES = {
  resume: {
    id: 'resume',
    title: 'SVS_Sujal_Resume.pdf',
    subtitle: 'Official Resume & Professional Credentials',
    type: 'pdf',
    icon: '📄',
    path: '~/portfolio/credentials/SVS_Sujal_Resume.pdf',
    url: resumePdf || '/resume.pdf',
    downloadUrl: resumePdf || '/resume.pdf',
    downloadName: 'SVS_Sujal_Resume.pdf',
    size: '3.8 MB',
    date: '2026',
    author: 'SVS Sujal',
  },
  aerial: {
    id: 'aerial',
    title: 'Aerial Object Detection',
    subtitle: 'YOLOv8 Deep Learning Computer Vision Pipeline',
    type: 'project',
    icon: '🚁',
    path: '~/projects/aerial-object-detection',
    github: 'https://github.com/SVSS13/Aerial-Object-Detection',
    tech: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'TensorFlow'],
    activeTab: 'architecture',
    tabs: [
      {
        id: 'architecture',
        label: 'Architecture.md',
        icon: '📐',
        language: 'markdown',
        content: `# Aerial Object Detection System (YOLOv8 + PyTorch)
## Mission Overview
Autonomous deep learning pipeline engineered to detect, track, and classify micro-drones, UAVs, and avian wildlife in high-altitude 4K aerial video feeds.

### Key Highlights
- **Model Backbone**: Custom-trained YOLOv8x feature pyramid network with spatial attention.
- **Inference Latency**: ~14.2ms per frame on TensorRT / CUDA.
- **mAP@50**: 94.8% precision across multi-class aerial dataset (drones vs birds).
- **Tracking Algorithm**: Centroid Kalman Filter with DeepSORT trajectory association.

\`\`\`
[ 4K Drone Feed ] ──> [ Frame Decimation ] ──> [ YOLOv8 Feature Extractor ]
                                                          │
                                                          ▼
[ Live Alert Stream ] <── [ Centroid DeepSORT ] <── [ NMS & Bounding Boxes ]
\`\`\`
`,
      },
      {
        id: 'detector',
        label: 'detector.py',
        icon: '🐍',
        language: 'python',
        content: `import cv2
import torch
from ultralytics import YOLO

class AerialDetector:
    """High-precision YOLOv8 Aerial Inference Engine with Real-Time Tracking"""
    def __init__(self, model_path: str = "weights/aerial_yolov8x.pt", conf_thresh: float = 0.45):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = YOLO(model_path).to(self.device)
        self.conf_thresh = conf_thresh
        self.class_names = ["drone_quad", "drone_fixed_wing", "bird_flock", "aircraft"]
        print(f"[AerialDetector] Loaded model on {self.device.upper()} with confidence > {conf_thresh}")

    def process_frame(self, frame):
        results = self.model.predict(
            source=frame,
            conf=self.conf_thresh,
            iou=0.5,
            device=self.device,
            verbose=False
        )
        detections = []
        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            confs = r.boxes.conf.cpu().numpy()
            clss = r.boxes.cls.cpu().numpy().astype(int)
            for box, conf, cls_idx in zip(boxes, confs, clss):
                detections.append({
                    "bbox": box.tolist(),
                    "confidence": float(conf),
                    "class": self.class_names[cls_idx] if cls_idx < len(self.class_names) else "unknown"
                })
        return detections
`,
      },
      {
        id: 'config',
        label: 'config.yaml',
        icon: '⚙️',
        language: 'yaml',
        content: `model:
  name: yolov8x_aerial
  epochs: 150
  batch_size: 16
  image_size: 1280
  optimizer: AdamW
  learning_rate: 0.001
  augmentation:
    mosaic: 1.0
    mixup: 0.15
    flip_lr: 0.5
classes:
  0: drone_quad
  1: drone_fixed_wing
  2: bird_flock
  3: aircraft
`,
      }
    ]
  },
  cyberpunk: {
    id: 'cyberpunk',
    title: 'AI Cyberpunk & Tsushima Portfolio',
    subtitle: 'React 19 + Three.js + Django RAG & Neural Voice Guide',
    type: 'project',
    icon: '🌃',
    path: '~/projects/ai-cyberpunk-portfolio',
    github: 'https://github.com/SVSS13/ai-cyberpunk-portfolio',
    tech: ['React 19', 'Three.js / R3F', 'Django REST', 'Groq AI (Qwen)', 'Edge-TTS'],
    activeTab: 'architecture',
    tabs: [
      {
        id: 'architecture',
        label: 'Architecture.md',
        icon: '📐',
        language: 'markdown',
        content: `# AI Samurai Portfolio Architecture
Interactive full-stack portfolio integrating 3D WebGL Three.js scenes, 4 dynamic Tsushima Stance Realms, RAG-augmented AI Agent, and Neural Samurai Voice synthesis.

### Tech Stack Breakdown
- **Frontend**: Vite + React 19 + Three.js + React Three Fiber + Framer Motion.
- **3D Graphics**: Procedural curved Sakai Katana blade with touch/drag 360° physics & 1,250 multi-depth Momiji particles.
- **Backend**: Django REST Framework + Groq LLM (Qwen 3.8-27B) + RAG Document Retrieval.
- **Audio Engine**: Streaming Neural Japanese-English Samurai Speech (3 Personas: Ghost, Shimura, Ronin).
`,
      },
      {
        id: 'ai_engine',
        label: 'ai_engine.py',
        icon: '🐍',
        language: 'python',
        content: `import os
from groq import Groq
from .search_engine import search_portfolio

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_samurai_response(user_query: str) -> dict:
    # 1. RAG search across indexed portfolio data
    context_docs = search_portfolio(user_query, top_k=4)
    system_prompt = f"""You are Sujal's AI Spirit Guide on the Island of Tsushima.
Answer questions accurately using this verified knowledge:
{context_docs}
"""
    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        temperature=0.4,
        max_tokens=350,
    )
    return {"reply": response.choices[0].message.content, "confidence": 0.98}
`,
      }
    ]
  },
  footfall: {
    id: 'footfall',
    title: 'Footfall Counter System',
    subtitle: 'AI-Powered Crowd Density & Centroid Bi-Directional Tracking',
    type: 'project',
    icon: '👥',
    path: '~/projects/footfall-counter',
    github: 'https://github.com/SVSS13/Footfall-Counter',
    tech: ['Python', 'YOLOv8', 'OpenCV', 'DeepSORT'],
    activeTab: 'architecture',
    tabs: [
      {
        id: 'architecture',
        label: 'Architecture.md',
        icon: '📐',
        language: 'markdown',
        content: `# Footfall Counter & Crowd Flow Analytics
Bi-directional real-time people counting system designed for retail spaces, event venues, and smart infrastructure.

### Capabilities
- **Bi-Directional Counting**: Tracks entry and exit counts across customizable virtual tripwires.
- **Centroid Association**: Robust against occlusion and grouping using Euclidean distance matching.
- **Analytics Dashboard**: Real-time hourly throughput graphs and peak density alerts.
`,
      },
      {
        id: 'tracker',
        label: 'centroid_tracker.py',
        icon: '🐍',
        language: 'python',
        content: `from scipy.spatial import distance as dist
import numpy as np

class CentroidTracker:
    def __init__(self, max_disappeared=30):
        self.next_object_id = 0
        self.objects = {}
        self.disappeared = {}
        self.max_disappeared = max_disappeared

    def register(self, centroid):
        self.objects[self.next_object_id] = centroid
        self.disappeared[self.next_object_id] = 0
        self.next_object_id += 1
`,
      }
    ]
  },
  pothole: {
    id: 'pothole',
    title: 'Pothole Detection System',
    subtitle: 'Smart Road Safety Computer Vision & Geo-Tagging Dashboard',
    type: 'project',
    icon: '🛣️',
    path: '~/projects/pothole-detection',
    github: 'https://github.com/SVSS13/patholedetection',
    tech: ['React', 'Django', 'YOLO', 'OpenCV', 'Leaflet GPS'],
    activeTab: 'architecture',
    tabs: [
      {
        id: 'architecture',
        label: 'Architecture.md',
        icon: '📐',
        language: 'markdown',
        content: `# Pothole Detection & Smart Road Infrastructure
Edge AI computer vision system deployed on dashcams to automatically identify road hazards, potholes, and surface deterioration with GPS coordinate logging.
`,
      }
    ]
  }
};

export function FileInspectorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowMode, setWindowMode] = useState('fullscreen'); // 'fullscreen' | 'large' | 'small' | 'minimized'
  const [activeFile, setActiveFile] = useState(DEFAULT_FILES.resume);
  const [selectedTabId, setSelectedTabId] = useState(null);

  const openFile = (fileKeyOrConfig) => {
    if (typeof fileKeyOrConfig === 'string' && DEFAULT_FILES[fileKeyOrConfig]) {
      const f = DEFAULT_FILES[fileKeyOrConfig];
      setActiveFile(f);
      setSelectedTabId(f.tabs ? f.tabs[0].id : null);
    } else if (typeof fileKeyOrConfig === 'object') {
      setActiveFile(fileKeyOrConfig);
      setSelectedTabId(fileKeyOrConfig.tabs ? fileKeyOrConfig.tabs[0].id : null);
    }
    if (windowMode === 'minimized') {
      setWindowMode('fullscreen');
    }
    setIsOpen(true);
  };

  const closeFile = () => {
    setIsOpen(false);
  };

  const minimizeFile = () => {
    setWindowMode('minimized');
  };

  const maximizeFile = () => {
    setWindowMode(prev => (prev === 'fullscreen' ? 'large' : 'fullscreen'));
  };

  const restoreFile = () => {
    setWindowMode('fullscreen');
    setIsOpen(true);
  };

  return (
    <FileInspectorContext.Provider
      value={{
        isOpen,
        windowMode,
        activeFile,
        selectedTabId,
        setSelectedTabId,
        openFile,
        closeFile,
        minimizeFile,
        maximizeFile,
        setWindowMode,
        restoreFile,
      }}
    >
      {children}
    </FileInspectorContext.Provider>
  );
}

export function useFileInspector() {
  const context = useContext(FileInspectorContext);
  if (!context) {
    throw new Error('useFileInspector must be used within a FileInspectorProvider');
  }
  return context;
}
