import { useEffect, useState } from "react";

import { FaGithub, FaCodeBranch, FaStar } from "react-icons/fa";

import { motion } from "framer-motion";

import API from "../services/api";
import Reveal from "./Reveal";

function GitHubStats() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    API.get("github/")

      .then((res) => {
        console.log("GITHUB DATA:", res.data);

        if (Array.isArray(res.data)) {
          setRepos(res.data);
        } else {
          console.log("NOT ARRAY");

          setRepos([]);
        }
      })

      .catch((err) => {
        console.log("ERROR:", err);

        setRepos([]);
      });
  }, []);

  return (
    <Reveal>
      <section className="section">
        <div className="flex items-center gap-5 mb-14">
          <FaGithub className="text-5xl neonText" />

          <h2 className="text-4xl md:text-5xl font-bold neonText">
            GitHub Repositories
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {Array.isArray(repos) &&
            repos.slice(0, 6).map((repo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
              >
                <div
                  className="
                  glass
                  rounded-3xl
                  p-8
                  border
                  border-cyan-500/20
                  hover:border-cyan-400
                  hover:shadow-[0_0_40px_#00FFFF33]
                  transition-all
                  duration-500
                  group
                  min-h-[280px]
                "
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className="
                      text-2xl
                      font-bold
                      mb-5
                      group-hover:text-cyan-300
                      transition
                      duration-300
                    "
                    >
                      {repo.name}
                    </h3>

                    <FaGithub className="text-3xl text-cyan-400" />
                  </div>

                  <p className="text-gray-300 leading-8 min-h-[90px]">
                    {repo.description || "Cyberpunk development repository."}
                  </p>

                  <div className="flex gap-6 mt-8 text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-400" />

                      <span>{repo.stargazers_count}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCodeBranch className="text-cyan-400" />

                      <span>{repo.forks_count}</span>
                    </div>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    className="
                    inline-block
                    mt-8
                    px-6
                    py-3
                    rounded-full
                    border
                    border-cyan-500
                    hover:bg-cyan-400
                    hover:text-black
                    transition-all
                    duration-300
                  "
                  >
                    View Repository
                  </a>
                </div>
              </motion.div>
            ))}
        </div>
      </section>
    </Reveal>
  );
}

export default GitHubStats;
