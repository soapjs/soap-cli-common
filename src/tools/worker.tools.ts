import { parentPort } from "worker_threads";

export const workerLog = (...data: any[]) => {
  const logs: string[] = [];
  data.forEach((d) => {
    logs.push(typeof d === "object" ? JSON.stringify(d, null, 2) : d);
  });
  if (parentPort) {
    parentPort.postMessage({ status: "log", data: logs.join(" ") });
  } else {
    console.log(logs.join(" "));
  }
};
