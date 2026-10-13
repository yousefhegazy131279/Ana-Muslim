import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const mobile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(mobile, "dist");
const destination = path.join(mobile, "../public/mobile");
await fs.access(path.join(source, "sw.js"));
await fs.cp(source, destination, { recursive: true });
console.log("Offline web app copied to public/mobile");
