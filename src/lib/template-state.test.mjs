import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("ChoreLoop app state", () => {
  it("ships the chore exchange workspace as the default experience", () => {
    const shellModules = readFileSync(join(process.cwd(), "src/components/shell-modules.ts"), "utf8");
    const homeRoute = readFileSync(join(process.cwd(), "src/routes/_app.index.tsx"), "utf8");
    assert.match(shellModules, /defaultModules = defineNavigationModules\(\[/);
    assert.match(shellModules, /Discover chores/);
    assert.match(shellModules, /Post a chore/);
    assert.match(homeRoute, /HomePage/);
  });

  it("uses the ChoreLoop identity assets instead of the scaffold placeholder", () => {
    const chrome = readFileSync(join(process.cwd(), "src/lib/app-chrome.ts"), "utf8");
    assert.match(chrome, /APP_NAME = "ChoreLoop"/);
    assert.match(chrome, /APP_ICON = "\/app-icon\.png"/);
    assert.equal(existsSync(join(process.cwd(), "public/app-icon.png")), true);
  });
});
