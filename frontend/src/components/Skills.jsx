import { motion } from "framer-motion";
import Reveal from "./Reveal";

const skills = [
  { name: "Python", level: 95 },
  { name: "Django", level: 90 },
  { name: "React", level: 88 },
  { name: "DevOps", level: 85 },
  { name: "Docker", level: 82 },
  { name: "Jenkins", level: 80 },
  { name: "Machine Learning", level: 87 },
  { name: "MATLAB", level: 84 },
  { name: "MongoDB", level: 80 },
  { name: "MySQL", level: 82 },
  { name: "Agile Methodology", level: 90 },
  { name: "AWS", level: 75 },
];

function Skills() {
  return (
    <Reveal>
      <section id="skills" className="section">
        <h2 className="text-4xl md:text-5xl font-bold neonPink mb-14">
          Skills & Technologies
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex justify-between mb-3">
                <span className="text-lg font-medium tracking-wide group-hover:text-cyan-400 transition duration-300">
                  {skill.name}
                </span>

                <span className="text-cyan-300">{skill.level}%</span>
              </div>

              <div className="w-full h-4 bg-[#111827] rounded-full overflow-hidden border border-cyan-900">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{
                    duration: 1.4,
                    delay: index * 0.08,
                  }}
                  viewport={{ once: true }}
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-400
                    to-cyan-300
                    shadow-[0_0_20px_#00FFFF]
                    group-hover:shadow-[0_0_35px_#00FFFF]
                    transition-all
                    duration-300
                  "
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

export default Skills;
