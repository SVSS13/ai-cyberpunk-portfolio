import { motion } from "framer-motion";

const experiences = [
  {
    icon: "☁️",
    title: "Exdion Health — Technology Intern",
    subtitle: "Feb 2026 – Present · Bengaluru, India · Production Engineering",
    description: "Engineered automated data monitoring pipelines (ExdionCode) integrating MySQL and AWS CloudWatch Logs. Developed scheduled anomaly detection services executing 10-minute automated health checks to flag hung batch processing jobs, built stuck job trend analytics dashboards, and designed CASH claims telemetry with PostgreSQL.",
    tags: ["AWS CloudWatch", "Python", "MySQL", "PostgreSQL", "Anomaly Detection", "Stuck Job Trends", "Telemetry", "Docker"],
    isCurrent: true,
  },
  {
    icon: "⚡",
    title: "Cloud Observability & Telemetry Systems",
    subtitle: "Health Monitoring, Alarms & Incident Resolution",
    description: "Architecting real-time telemetry aggregation and automated pipeline diagnostics. Proficient in AWS CloudWatch Logs, CloudWatch Metrics, CloudWatch Alarms, EC2 provisioning, Linux/Unix system administration, and zero-downtime health checking.",
    tags: ["AWS CloudWatch", "EC2", "Linux / Unix", "Telemetry Aggregation", "Alarms", "Pipeline Monitoring"],
  },
  {
    icon: "🐳",
    title: "DevOps CI/CD & Infrastructure Automation",
    subtitle: "Continuous Integration, Containers & Delivery",
    description: "Engineering production-ready CI/CD pipelines with Docker, Jenkins, Git, and GitHub Actions. Experienced in containerization, automated artifact deployment, Ansible configuration, and Nginx reverse proxy architecture.",
    tags: ["Docker", "Jenkins", "GitHub Actions", "Ansible", "Nginx", "CI/CD Automation"],
  },
  {
    icon: "🧠",
    title: "AI Engineering & Computer Vision",
    subtitle: "Deep Learning, YOLOv8 & Real-Time Detection",
    description: "Building intelligent computer vision systems using Python, OpenCV, MATLAB Engine API, and YOLOv8. Developed capstone automated pothole detection with geo-tagging, aerial bird vs. drone classifier (MobileNetV2 99% accuracy), and PCB defect inspection tools.",
    tags: ["YOLOv8", "OpenCV", "MATLAB Engine", "MobileNetV2", "Groq AI LLMs", "Anomaly Detection"],
  },
];

const VP = { once: true, amount: 0.05 };

export default function Experience() {
  return (
    <section id="experience" className="section">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VP}
        style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--sakura)", marginBottom: 8 }}
      >
        // DOMAINS & MASTERY
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ delay: 0.05 }}
        className="section-title"
      >
        Experience & <span className="neon-violet">Expertise</span>
      </motion.h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.title}
            className="glass-card"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VP}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              {/* Icon */}
              <div style={{
                flexShrink: 0,
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "rgba(204,34,51,0.15)",
                border: "1px solid rgba(255,183,197,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}>
                {exp.icon}
              </div>
              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>{exp.title}</h3>
                  <span style={{ fontSize: "0.78rem", color: "var(--sakura)", fontWeight: 600 }}>{exp.subtitle}</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "14px" }}>
                  {exp.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {exp.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
