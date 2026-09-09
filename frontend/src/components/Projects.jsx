import { useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Aerial Object Detection",
    description: "Deep learning system that classifies and detects birds and drones in aerial images for safety and surveillance applications.",
    tech: ["Python", "YOLOv8", "OpenCV", "TensorFlow"],
    github: "https://github.com/SVSS13/Aerial-Object-Detection",
    icon: "🚁",
    featured: true,
  },
  {
    title: "AI Cyberpunk Portfolio",
    description: "AI-powered futuristic portfolio with React, Django, Groq AI, analytics dashboard, and Android deployment support.",
    tech: ["React", "Django", "Groq AI", "Tailwind"],
    github: "https://github.com/SVSS13/ai-cyberpunk-portfolio",
    icon: "🌃",
    featured: true,
  },
  {
    title: "Footfall Counter",
    description: "Smart AI-powered footfall counting system using YOLOv8 and centroid tracking for crowd analytics.",
    tech: ["Python", "YOLOv8", "OpenCV"],
    github: "https://github.com/SVSS13/Footfall-Counter",
    icon: "👥",
    featured: false,
  },
  {
    title: "Pothole Detection System",
    description: "AI-powered pothole detection and smart traffic monitoring system using computer vision and deep learning.",
    tech: ["React", "Django", "YOLO", "OpenCV"],
    github: "https://github.com/SVSS13/patholedetection",
    icon: "🛣️",
    featured: false,
  },
];

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="bento-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: project.featured ? "span 2" : "span 1",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "2rem" }}>{project.icon}</span>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {project.title}
          </h3>
        </div>
        {project.featured && (
          <span className="tag tag-accent" style={{ fontSize: "0.7rem" }}>Featured</span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "18px" }}>
        {project.description}
      </p>

      {/* Tech tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
        {project.tech.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* GitHub link */}
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
        style={{ fontSize: "0.8rem" }}
      >
        View on GitHub ↗
      </a>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <h2 className="section-title">Featured Projects</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--gap)" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
