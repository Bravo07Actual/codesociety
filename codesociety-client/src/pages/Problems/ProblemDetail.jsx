import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axios";
import Editor from "../../components/CodeEditor";

const codeTemplates = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`,
  python: `def main():
    # your code here
    pass

if __name__ == "__main__":
    main()`
};

const statusColors = {
  Accepted: "text-green-600 bg-green-50",
  Pending: "text-yellow-600 bg-yellow-50",
  "Wrong Answer": "text-red-600 bg-red-50",
  "Runtime Error": "text-red-600 bg-red-50",
  "Compilation Error": "text-orange-600 bg-orange-50",
  "Time Limit Exceeded": "text-purple-600 bg-purple-50",
};

const difficultyColor = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [language, setLanguage] = useState("");
  const [codes, setCodes] = useState({ cpp: "", java: "", python: "" });
  const [testResults, setTestResults] = useState([]);
  const [activeCase, setActiveCase] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosInstance.get(`/problems/${slug}`);
        setProblem(res.data.problem);
      } catch (err) {
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  useEffect(() => {
    if (activeTab !== "submissions") return;
    const fetchSubmissions = async () => {
      setSubmissionsLoading(true);
      try {
        const res = await axiosInstance.get(`/submissions/${slug}`);
        setSubmissions(res.data.submissions);
      } catch {
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }
    };
    fetchSubmissions();
  }, [activeTab, slug]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!codes[lang] && codeTemplates[lang]) {
      setCodes((prev) => ({ ...prev, [lang]: codeTemplates[lang] }));
    }
  };

  const handleCodeChange = (val) => {
    setCodes((prev) => ({ ...prev, [language]: val }));
  };

  const handleReset = () => {
    if (language) {
      setCodes((prev) => ({ ...prev, [language]: codeTemplates[language] || "" }));
    }
  };

  const handleRun = async () => {
    if (!language || !codes[language]) {
      setSubmitMsg("Please select a language and enter some code.");
      setSubmitSuccess(false);
      return;
    }
    setRunning(true);
    setTestResults([]);
    setSubmitMsg("");

    const results = await Promise.all(
      problem.sampleTestcases.map(async (tc) => {
        try {
          const res = await axios.post("http://localhost:8002/run", {
            code: codes[language],
            language,
            input: tc.input,
          });
          const actual = (res.data.output ?? "").trim();
          const expected = tc.output.trim();
          return {
            input: tc.input,
            expected,
            actual: res.data.error ? res.data.error.trim() : actual,
            passed: !res.data.error && actual === expected,
            isError: !!res.data.error,
          };
        } catch {
          return { input: tc.input, expected: tc.output.trim(), actual: "Execution server not reachable", passed: false, isError: true };
        }
      })
    );

    setTestResults(results);
    setActiveCase(0);
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!language || !codes[language]) {
      setSubmitMsg("Please select a language and enter some code.");
      setSubmitSuccess(false);
      return;
    }
    setSubmitting(true);
    setSubmitMsg("");
    setTestResults([]);
    try {
      const res = await axiosInstance.post(
        `/submissions/problems/${slug}/submit`,
        { language, code: codes[language] }
      );
      setSubmitMsg(`Submitted! Submission ID: ${res.data.submissionId}`);
      setSubmitSuccess(true);
      setActiveTab("submissions");
    } catch (err) {
      setSubmitMsg(err.response?.data?.message || "Submission failed. Are you logged in?");
      setSubmitSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!problem) return null;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">

      {/* Left Panel — Tabs */}
      <div className="w-[45%] flex flex-col border-r border-gray-200 bg-white overflow-hidden">

        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 px-4 pt-3 shrink-0">
          {["description", "submissions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-4 pb-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="overflow-y-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{problem.title}</h1>

            <div className="flex flex-wrap gap-2 text-sm mb-5">
              <span className={`px-2 py-1 rounded font-medium ${difficultyColor[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              {problem.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed mb-5">
              {problem.description}
            </p>

            <h2 className="text-base font-semibold text-gray-800 mb-2">Constraints</h2>
            <p className="text-gray-600 whitespace-pre-line text-sm mb-5">{problem.constraints}</p>

            <h2 className="text-base font-semibold text-gray-800 mb-3">Sample Testcases</h2>
            <div className="space-y-3">
              {problem.sampleTestcases.map((tc, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono">
                  <div className="mb-1"><span className="font-semibold text-gray-700">Input: </span>{tc.input}</div>
                  <div><span className="font-semibold text-gray-700">Output: </span>{tc.output}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Submissions</h2>

            {submissionsLoading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : submissions.length === 0 ? (
              <p className="text-sm text-gray-500">No submissions yet. Write some code and hit Submit!</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[s.status] || "text-gray-600 bg-gray-100"}`}>
                        {s.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(s.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Language: <span className="font-medium">{s.language}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel — split into editor (top) + results (bottom) */}
      <div className="w-[55%] flex flex-col bg-gray-50 overflow-hidden">

        {/* Top — Editor + Buttons (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <Editor
            value={codes[language] || ""}
            onChange={handleCodeChange}
            language={language}
            onLanguageChange={handleLanguageChange}
            onReset={handleReset}
            showSubmit={false}
            height="300px"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRun}
              disabled={running}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded transition disabled:opacity-50"
            >
              {running ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {submitMsg && (
            <div className={`mt-3 p-3 rounded text-sm font-medium ${submitSuccess ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
              {submitMsg}
            </div>
          )}
        </div>

        {/* Bottom — Testcase Results (fixed height, always visible) */}
        <div className="h-[280px] border-t border-gray-200 bg-white overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Run your code to see testcase results
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className={`px-4 py-2 text-sm font-semibold border-b ${testResults.every(r => r.passed) ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {testResults.every(r => r.passed)
                  ? `✅ All ${testResults.length} testcases passed`
                  : `❌ ${testResults.filter(r => !r.passed).length} of ${testResults.length} testcase(s) failed`}
              </div>

              {/* Case tabs */}
              <div className="flex border-b border-gray-200 px-3 pt-2">
                {testResults.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCase(idx)}
                    className={`mr-3 pb-2 text-xs font-medium border-b-2 transition-colors ${
                      activeCase === idx
                        ? r.passed ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {r.passed ? "✅" : "❌"} Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Case detail */}
              {testResults[activeCase] && (
                <div className="p-4 space-y-3 text-sm font-mono">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Input</p>
                    <div className="bg-gray-50 border rounded p-2 text-gray-700 whitespace-pre">{testResults[activeCase].input}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Expected Output</p>
                    <div className="bg-gray-50 border rounded p-2 text-gray-700">{testResults[activeCase].expected}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Your Output</p>
                    <div className={`border rounded p-2 whitespace-pre-wrap ${testResults[activeCase].isError ? "bg-red-50 text-red-600 border-red-200" : testResults[activeCase].passed ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                      {testResults[activeCase].actual || "(no output)"}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
