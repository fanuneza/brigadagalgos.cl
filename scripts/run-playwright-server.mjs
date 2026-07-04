import { spawn } from "node:child_process";

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      env: process.env,
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${command} exited with signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
        return;
      }

      resolve();
    });

    child.on("error", reject);
  });
}

const host = getArgValue("--host") ?? "127.0.0.1";
const port = getArgValue("--port") ?? "4325";

await run("npm", ["run", "build"]);
await new Promise((resolve, reject) => {
  const preview = spawn("npm", ["run", "preview", "--", "--host", host, "--port", port], {
    stdio: "inherit",
    shell: false,
    env: process.env,
  });

  const forwardSignal = (signal) => {
    if (!preview.killed) {
      preview.kill(signal);
    }
  };

  process.on("SIGINT", forwardSignal);
  process.on("SIGTERM", forwardSignal);
  process.on("exit", () => {
    if (!preview.killed) {
      preview.kill("SIGTERM");
    }
  });

  preview.on("error", reject);
  preview.on("exit", (code, signal) => {
    if (signal === "SIGTERM" || signal === "SIGINT" || code === 0) {
      resolve();
      return;
    }

    reject(new Error(`preview exited with code ${code ?? "unknown"}${signal ? ` (signal ${signal})` : ""}`));
  });
});
