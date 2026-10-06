import { cpSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { execFileSync } from "node:child_process"

const temporaryDirectory = mkdtempSync(join(tmpdir(), "herba-export-"))
const projectDirectory = join(temporaryDirectory, "herba")
try {
  mkdirSync(projectDirectory)
  for (const file of [
    "src", "public", "docs", "scripts", ".github", "index.html", "package.json",
    "pnpm-lock.yaml", "tsconfig.json", "vite.config.ts", "README.md",
    ".gitignore", ".editorconfig", ".env.example",
  ]) {
    cpSync(file, join(projectDirectory, file), {
      recursive: true,
      filter: (source) => !source.endsWith("herba-export.tar.gz"),
    })
  }
  mkdirSync("public", { recursive: true })
  execFileSync("tar", ["-czf", "public/herba-export.tar.gz", "-C", temporaryDirectory, "herba"])
  console.log("Export ready: public/herba-export.tar.gz")
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
