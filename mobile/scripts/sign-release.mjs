import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const mobile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = process.argv[2];
if (!source) throw Error("Pass the unsigned release APK path");
const java = process.env.AM_JAVA_HOME;
const jar = process.env.AM_APKSIG_JAR;
if (!java || !jar)
  throw Error(
    "Set AM_JAVA_HOME and AM_APKSIG_JAR to local Java and apksig paths",
  );
const signing = path.join(mobile, ".signing");
await fs.mkdir(signing, { recursive: true });
const configFile = path.join(signing, "credentials.json");
let credentials = JSON.parse(
  await fs.readFile(configFile, "utf8").catch(() => '{"password":null}'),
);
if (!credentials.password) {
  credentials = { password: randomBytes(36).toString("base64url") };
  await fs.writeFile(configFile, JSON.stringify(credentials), { mode: 0o600 });
}
const env = { ...process.env, AM_SIGNING_PASSWORD: credentials.password };
const key = path.join(signing, "release.jks");
function run(tool, args) {
  const r = spawnSync(
    path.join(java, "bin", tool + (process.platform === "win32" ? ".exe" : "")),
    args,
    { env, encoding: "utf8" },
  );
  if (r.status !== 0) throw Error(r.stderr || r.stdout || `${tool} failed`);
  if (tool === "java") console.log(r.stdout.trim());
}
if (!(await fs.stat(key).catch(() => null)))
  run("keytool", [
    "-genkeypair",
    "-alias",
    "anamuslim",
    "-keystore",
    key,
    "-storetype",
    "JKS",
    "-storepass:env",
    "AM_SIGNING_PASSWORD",
    "-keypass:env",
    "AM_SIGNING_PASSWORD",
    "-keyalg",
    "RSA",
    "-keysize",
    "4096",
    "-validity",
    "10000",
    "-dname",
    "CN=HGZ, OU=Ana Muslim, O=HGZ, C=EG",
  ]);
run("javac", [
  "-cp",
  jar,
  "-d",
  signing,
  path.join(mobile, "scripts/SignApk.java"),
]);
const dest = path.join(mobile, "../public/downloads/ana-muslim-1.0.0.apk");
await fs.mkdir(path.dirname(dest), { recursive: true });
run("java", [
  "-cp",
  signing + path.delimiter + jar,
  "SignApk",
  key,
  path.resolve(source),
  dest,
]);
const bytes = await fs.readFile(dest);
const sha256 = createHash("sha256").update(bytes).digest("hex");
await fs.writeFile(
  path.join(mobile, "../data/mobile-release.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      android: {
        url: "/downloads/ana-muslim-1.0.0.apk",
        bytes: bytes.length,
        sha256,
      },
      web: "/mobile/",
    },
    null,
    2,
  ) + "\n",
);
console.log("Release ready:", bytes.length, "bytes, SHA256", sha256);
