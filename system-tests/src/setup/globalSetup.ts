import { FullConfig } from "@playwright/test"
import { spawnSync } from "child_process"
import path from "path"
import playWrightPackageJson from "playwright/package.json"
import which from "which"

import systemTestsPackageLockJson from "../../package-lock.json"

async function globalSetup(config: FullConfig): Promise<void> {
  await makeSureNecessaryProgramsAreInstalled(config)
  await makeSureNpmCiHasBeenRan()
  await downloadTmcLangsCli()
  await setupSystemTestDb()
  // After this global.setup.spec.ts is ran
}

async function makeSureNecessaryProgramsAreInstalled(config: FullConfig) {
  if (config.updateSnapshots === "all" || !process.env.CI) {
    if (which.sync("oxipng", { nothrow: true }) === null) {
      throw new Error(
        "oxipng is not installed or is not in the $PATH. Please install it (see https://github.com/shssoichiro/oxipng).",
      )
    }
  }
}

async function makeSureNpmCiHasBeenRan() {
  // Make sure the user has ran npm ci after Playwright has been updated.
  // Using an older vesion might not work or might generate sligtly wrong screenshots.
  const requiredPlaywrightVersion =
    systemTestsPackageLockJson.packages["node_modules/playwright"].version
  const installedPlaywrightVersion = playWrightPackageJson.version
  if (installedPlaywrightVersion !== requiredPlaywrightVersion) {
    throw new Error(
      `The installed Playwright version ${installedPlaywrightVersion} is not the same as the required version ${requiredPlaywrightVersion}. Please run npm ci in the system-tests folder.`,
    )
  }
}

// Download the langs CLI binary for the TMC exercise service to work.
async function downloadTmcLangsCli() {
  try {
    console.time("tmc-langs-setup")
    const downloadTmcLangsPath = path.join(__dirname, "../../../bin/tmc-langs-setup")
    console.log("Downloading langs CLI.")
    const res = spawnSync(downloadTmcLangsPath, { stdio: "inherit" })
    if (res.status != 0) {
      console.error("Error: Could not download langs CLI.")
      if (res.error) {
        throw res.error
      } else {
        throw new Error(`Downloading langs CLI returned non-zero status code ${res.status}`)
      }
    }
    console.log("Successfully downloaded langs CLI.")
  } finally {
    console.timeEnd("tmc-langs-setup")
  }
}

// The setup system test db called by playwright to make the playwright vscode extension to work.
async function setupSystemTestDb() {
  try {
    console.time("system-test-db-setup")
    const setupSystemTestDbScriptPath = path.join(__dirname, "../../../bin/setup-system-test-db")
    console.log("Setting up system test db.")
    // spawnSync is the easiest way to wait for the script to finish while inheriting stdio.
    // Using a sync method hare shoud not be a problem since this is a setup script
    const res = spawnSync(setupSystemTestDbScriptPath, { stdio: "inherit" })
    if (res.status != 0) {
      console.error("Error: Could not setup system test db.")
      if (res.error) {
        throw res.error
      } else {
        throw new Error(`System test db setup script returned non-zero status code ${res.status}`)
      }
    }
    console.log("System test db setup complete.")
  } finally {
    console.timeEnd("system-test-db-setup")
  }
}

export default globalSetup
