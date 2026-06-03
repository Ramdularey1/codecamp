import { useNavigate } from "react-router-dom";

const ProblemCategory = ({ data, isLoading = false }) => {
  const navigate = useNavigate();

  const handleSolveProblem = (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/signup", { state: { from: "solveProblem" } });
      return;
    }
    navigate(`/code/${id}`);
  };

  return (
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Problem library</p>
        <h1 className="page-title">Top DSA Problems</h1>
        <p className="page-subtitle">Choose a challenge, review the difficulty, and jump into the editor when you are ready.</p>
      </div>
      <div className="panel p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-4">
          <p className="text-sm font-semibold text-slate-300">Available challenges</p>
          <span className="status-pill border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            {data.length} Problems
          </span>
        </div>
        {isLoading ? (
          <p className="py-8 text-center text-slate-400">Loading problems...</p>
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-slate-400">No problems found</p>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-5 border-b border-slate-800 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-bold text-white sm:text-xl">{item.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">Amazon</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">Facebook</span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">{item.difficulty}</span>
                  </div>
                </div>
                <div className="shrink-0 sm:text-right">
                  <button
                    className="primary-button w-full sm:w-44"
                    onClick={() => handleSolveProblem(item._id)}
                  >
                    Solve Problem
                  </button>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};
export default ProblemCategory;
