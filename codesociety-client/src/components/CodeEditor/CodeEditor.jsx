import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { useEffect, useState } from "react";

const getLanguageExtension = (lang) => {
  switch (lang) {
    case "cpp":
      return cpp();
    case "java":
      return java();
    case "python":
      return python();
    default:
      return [];
  }
};

const Editor = ({
  value,
  onChange,
  language,
  onLanguageChange,
  onSubmit,
  onReset,
  showSubmit = true,
  height = "400px",
}) => {
  const [extension, setExtension] = useState([]);

  useEffect(() => {
    setExtension([getLanguageExtension(language)]);
  }, [language]);

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">
      {/* Language Dropdown + Reset */}
      <div className="flex justify-between items-center">
        <div>
          <label className="text-gray-700 font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="ml-2 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Language</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="border border-gray-400 text-gray-700 px-4 py-1 rounded hover:bg-gray-100 transition text-sm font-medium"
          >
            Reset to Template
          </button>
        )}
      </div>

      {/* Code Editor */}
      <CodeMirror
        value={value}
        height={height}
        extensions={extension}
        theme="light"
        onChange={(val) => onChange(val)}
      />

      {/* Buttons */}
      {showSubmit && (
        <div className="flex gap-4">
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Submit
          </button>
          <button
            onClick={onSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded transition"
          >
            Run Code
          </button>
        </div>
      )}
    </div>
  );
};

export default Editor;
