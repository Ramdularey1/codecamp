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
    <div className="flex min-h-[calc(100vh-4rem)] justify-center px-4 py-6 sm:px-6 lg:px-10">
      <div className="flex w-full max-w-6xl flex-col rounded-md bg-[#423f3f] p-4 text-[#dbd7d7] sm:p-5">
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl">
            Top <br />
            <span className="text-green-600">DSA</span> Problem
          </h1>
          {/* <div className="absolute right-16">
              {message && <p>{message}</p>}
            </div> */}
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No problems found</p>
        ) : (
          data.map((item) => (
            <div
              key={item._id}
              className="mt-8 flex flex-col border-b-2 border-[#6e6b6b] p-4"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="break-words text-lg font-bold sm:text-xl">{item.title}</h1>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <p className="text-green-600">Amazon</p>
                    <p className="text-green-600">Facebook</p>
                  </div>
                </div>
                <div className="shrink-0 sm:text-right">
                  <button
                    className="h-10 w-full rounded border-2 border-green-600 px-4 font-medium text-green-600 hover:bg-green-600 hover:text-white sm:w-44"
                    onClick={() => handleSolveProblem(item._id)}
                  >
                    Solve Problem
                  </button>
                  <p className="text-center mt-2">{item.difficulty}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ProblemCategory;
