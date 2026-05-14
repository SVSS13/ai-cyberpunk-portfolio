import Reveal from "./Reveal";

function About() {
  return (
    <Reveal>
      <section id="about" className="section">
        <h2 className="text-4xl font-bold neonText mb-10">About Me</h2>

        <div className="glass rounded-2xl p-8 text-lg leading-9 text-gray-300">
          I am an aspiring Build Engineer and Cloud platform geek with strong
          interests in Full Stack Development, DevOps, Artificial Intelligence
          and Agile Project Management.
          <br />
          <br />
          I specialize in creating scalable applications, automation workflows
          and intelligent systems using technologies like React, Django, Python,
          Docker, Jenkins and Machine Learning frameworks.
          <br />
          <br />
          My experience includes image processing systems, interactive data
          visualization platforms, e-commerce applications and AI-powered
          solutions.
          <br />
          <br />I enjoy combining technical expertise with leadership,
          communication and problem-solving skills to deliver impactful digital
          experiences.
        </div>
      </section>
    </Reveal>
  );
}

export default About;
