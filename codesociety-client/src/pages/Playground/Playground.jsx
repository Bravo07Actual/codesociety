import { useEffect, useState } from "react";
import axios from "axios";
import Body from "../../components/Layout/Body";
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

const Playground = () => {
  const [codes, setCodes] = useState({
    cpp: "",
    java: "",
    python: ""
  });

  const [language, setLanguage] = useState("");
  const [testInput, setTestInput] = useState("");
  const [output, setOutput] = useState("");

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
      alert("Please select a language and enter some code.");
      return;
    }

    const normalizedCode = codes[language].replace(/\t/g, "    ");

    try {
      const res = await axios.post("http://localhost:8002/run", {
        code: normalizedCode,
        language,
        input: testInput,
      });

      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Body>
      <div className="min-h-[calc(100vh-160px)] px-4 py-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💡 Playground</h1>
        <p className="text-gray-600 mb-6">
          Write and test code freely with your own input.
        </p>

        <Editor
          value={codes[language] || ""}
          onChange={handleCodeChange}
          language={language}
          onLanguageChange={handleLanguageChange}
          showSubmit={true}
          onSubmit={handleRun}
          onReset={handleReset}
        />

        {/* Input Box */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Input
          </label>
          <textarea
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter input for your code (e.g., test cases)"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
          />
        </div>

        {/* Output Section */}
        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded border">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Output:</h3>
            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </Body>
  );
};

export default Playground;
