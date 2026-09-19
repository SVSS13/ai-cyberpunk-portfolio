import { useRef } from "react";
import { motion } from "framer-motion";
import { useBrushHover } from "../utils/brushHover";

const projects = [
  {
    title: "AI Cyberpunk Cloud & DevOps Platform",
    subtitle: "Cloud Telemetry & Automated CI/CD",
    description: "Architected a personal cloud portfolio integrating Groq LLM AI chat endpoints, automated GitHub Actions CI/CD deployment pipelines, telemetry analytics dashboard, and Nginx reverse proxy architecture with Android webview deployment support.",
    tech: ["React", "Django", "Groq AI", "Docker", "CI/CD", "AWS", "Nginx"],
    github: "https://github.com/SVSS13/ai-cyberpunk-portfolio",
    icon: "🌃",
    featured: true,
  },
  {
    title: "Automated Pothole Detection & Road Hazard Assessment",
    subtitle: "Final Year Capstone Project",
    description: "Developed an automated real-time computer vision system to detect road surface distress and potholes from camera feeds. Implemented adaptive thresholding, contour segmentation, and classification models to generate automated geo-tagged road hazard logs.",
    tech: ["Python", "OpenCV", "Computer Vision", "CNN / ML", "Flask"],
    github: "https://github.com/SVSS13/patholedetection",
    icon: "🛣️",
    featured: true,
  },
  {
    title: "Aerial Object Detection & Airspace Surveillance",
    subtitle: "YOLOv8 & MobileNetV2 Deep Learning",
    description: "Engineered a deep learning system classifying birds vs. drones in aerial video. Implemented MobileNetV2 transfer learning (99% accuracy) alongside YOLOv8 for real-time bounding-box object localization in surveillance video feeds.",
    tech: ["Python", "YOLOv8", "MobileNetV2 (99% Acc)", "Transfer Learning", "PyTorch"],
    github: "https://github.com/SVSS13/Aerial-Object-Detection",
    icon: "🚁",
    featured: false,
  },
  {
    title: "PCB Defect Detection & Visual Quality Inspection",
    subtitle: "MATLAB Engine API & Anomaly Analysis",
    description: "Built an automated visual inspection web tool integrating MATLAB image processing via MATLAB Engine API with a Flask backend to execute edge detection, morphological filtering, and automated anomaly reporting.",
    tech: ["Python", "Flask", "MATLAB Engine API", "OpenCV", "Morphological Filters"],
    github: "https://github.com/SVSS13",
    icon: "🔬",
    featured: false,
  },
];

const VP = { once: true, amount: 0.05 };

function ProjectCard({ project, index }) {
  const cardRef = useRef();
  useBrushHover(cardRef);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card project-card ${project.featured ? 'project-featured' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
        background: "linear-gradient(105deg, transparent 40%, rgba(255,183,197,0.06) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-sweep 3.5s linear infinite",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "1.8rem" }}>{project.icon}</span>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {project.title}
          </h3>
        </div>
        {project.featured && (
          <span className="badge badge-gold" style={{ fontSize: "0.7rem" }}>Featured</span>
        )}
      </div>

      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "18px", flex: 1 }}>
        {project.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {project.tech.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost"
        style={{ fontSize: "0.8rem", width: "fit-content", padding: "8px 18px", zIndex: 10 }}
      >
        View on GitHub ↗
      </a>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // MISSIONS & CREATIONS
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Featured <span className="neon-cyan">Projects</span>
      </motion.h2>

      <div
        className="projects-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: "var(--gap)",
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>

      <style>{`
        .project-featured {
          grid-column: span 2;
        }
        @media (max-width: 768px) {
          .project-featured {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
