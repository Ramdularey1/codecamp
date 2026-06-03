import React from "react";
import { Link } from "react-router-dom";

const Card = ({ customClass }) => {
  const cards = [
    {
      title: "All Problems",
      label: "Complete DSA set",
      description: "Practice from the full problem library.",
      to: "/problem",
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "Easy",
      label: "Warm-up track",
      description: "Build confidence with beginner-friendly challenges.",
      to: "/easyProblem",
      accent: "from-lime-500 to-emerald-500",
    },
    {
      title: "Medium",
      label: "Core practice",
      description: "Sharpen patterns used in real interviews.",
      to: "/mediumProblem",
      accent: "from-sky-500 to-cyan-500",
    },
    {
      title: "Hard",
      label: "Advanced set",
      description: "Push your problem-solving depth.",
      to: "/hardProblem",
      accent: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <div className={customClass}>
      {cards.map((card) => (
        <Link
          key={card.title}
          to={card.to}
          className="panel group flex min-h-64 w-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-emerald-500/40"
        >
          <div className={`h-2 bg-gradient-to-r ${card.accent}`} />
          <div className="flex flex-1 flex-col p-5">
            <p className="text-sm font-semibold text-emerald-300">{card.label}</p>
            <h2 className="mt-4 text-2xl font-bold text-white">{card.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{card.description}</p>
            <span className="mt-6 text-sm font-semibold text-emerald-300 group-hover:text-emerald-200">
              Explore now
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default Card;
