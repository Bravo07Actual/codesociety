import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";

function ProblemsList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const availableTags = ["Array", "DP", "Graph", "Greedy", "Math"];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
      };
      if (search) params.search = search;
      if (difficulty) params.difficulty = difficulty;
      if (tags.length > 0) params.tags = tags.join(",");

      const res = await axiosInstance.get("/problems", { params });
      setProblems(res.data.problems);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching problems:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, tags, currentPage]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("");
    setTags([]);
    setShowTagsDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Problems</h2>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <div className="relative">
          <button
            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
            className="border border-gray-300 rounded px-4 py-2 bg-white"
          >
            Filter Tags
          </button>
          {showTagsDropdown && (
            <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-300 rounded shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">Tags</span>
                <button
                  className="text-sm text-red-500 hover:underline"
                  onClick={() => setShowTagsDropdown(false)}
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded text-sm border ${
                      tags.includes(tag)
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={clearFilters}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p>Loading problems...</p>
      ) : problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <div
              key={problem._id}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/problems/${problem.slug}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {problem.title}
                </Link>
                <p className="text-sm text-gray-600">
                  Difficulty: {problem.difficulty}
                </p>
                <div className="text-sm text-gray-500">
                  Tags: {problem.tags.join(", ")}
                </div>
              </div>
              <div className="text-sm font-medium text-blue-500">Unsolved</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProblemsList;
