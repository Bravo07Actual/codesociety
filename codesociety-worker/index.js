import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const TIMEOUT = 10000;

const executeCode = (code, language, input = "") => {
  return new Promise((resolve) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cs-"));
    const inputFile = path.join(tmpDir, "input.txt");
    fs.writeFileSync(inputFile, input);

    let compileCmd = null;
    let runCmd;

    if (language === "python") {
      const srcFile = path.join(tmpDir, "solution.py");
      fs.writeFileSync(srcFile, code);
      runCmd = `python3 "${srcFile}" < "${inputFile}"`;
    } else if (language === "cpp") {
      const srcFile = path.join(tmpDir, "solution.cpp");
      const binary = path.join(tmpDir, "solution");
      fs.writeFileSync(srcFile, code);
      compileCmd = `clang++ -I/Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk/usr/include/c++/v1 -o "${binary}" "${srcFile}"`;
      runCmd = `"${binary}" < "${inputFile}"`;
    } else if (language === "java") {
      const srcFile = path.join(tmpDir, "Main.java");
      fs.writeFileSync(srcFile, code);
      compileCmd = `javac "${srcFile}"`;
      runCmd = `java -cp "${tmpDir}" Main < "${inputFile}"`;
    } else {
      return resolve({ error: "Unsupported language" });
    }

    const cleanup = () => {
      try { fs.rmSync(tmpDir, { recursive: true }); } catch {}
    };

    const runExec = () => {
      exec(runCmd, { timeout: TIMEOUT }, (err, stdout, stderr) => {
        cleanup();
        if (err) {
          resolve({ error: stderr || err.message });
        } else {
          resolve({ output: stdout });
        }
      });
    };

    if (compileCmd) {
      exec(compileCmd, { timeout: TIMEOUT }, (err, stdout, stderr) => {
        if (err) {
          cleanup();
          return resolve({ error: stderr || "Compilation failed" });
        }
        runExec();
      });
    } else {
      runExec();
    }
  });
};

app.post("/run", async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required" });
  }

  const result = await executeCode(code, language, input);

  if (result.error) {
    return res.status(200).json({ error: result.error });
  }

  return res.status(200).json({ output: result.output });
});

app.listen(8002, () => console.log("Execution server running on http://localhost:8002"));
