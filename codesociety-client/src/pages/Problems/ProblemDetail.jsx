import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/problems/${slug}`);
        setProblem(res.data.problem);
      } catch (err) {
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!problem) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{problem.title}</h1>
      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {problem.difficulty}
        </span>
        {problem.tags.map((tag, idx) => (
          <span key={idx} className="bg-gray-200 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-700 whitespace-pre-line mb-4">{problem.description}</p>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Constraints</h2>
      <p className="text-gray-700 whitespace-pre-line">{problem.constraints}</p>
      <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Sample Testcases</h2>
      <ul className="bg-gray-50 border rounded p-4 space-y-2">
        {problem.sampleTestcases.map((tc, idx) => (
          <li key={idx}>
            <strong>Input:</strong> {tc.input}<br />
            <strong>Output:</strong> {tc.output}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProblemDetail;
