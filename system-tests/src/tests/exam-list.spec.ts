import { test } from "@playwright/test"

import expectUrlPathWithRandomUuid from "../utils/expect"
import expectScreenshotsToMatchSnapshots from "../utils/screenshot"

test.use({
  storageState: "src/states/admin@example.com.json",
})

test("exam list renders, can create exam", async ({ page, headless }, testInfo) => {
  await page.goto("http://project-331.local/organizations")

  await Promise.all([
    page.click(
      '[aria-label="University of Helsinki, Department of Computer Science"] div:has-text("University of Helsinki, Department of Computer ScienceOrganization for Computer ")',
    ),
  ])

  await page.getByText("Exams").nth(1).click()

  await page.getByText("Introduction to Everything").first().waitFor()
  await page.getByRole("link", { name: "Automatic course exam" }).last().waitFor()
  await expectUrlPathWithRandomUuid(page, "/org/uh-cs")

  await expectScreenshotsToMatchSnapshots({
    screenshotTarget: page,
    headless,
    testInfo,
    snapshotName: "exam-listing",
    useCoordinatesFromTheBottomForSavingYCoordinates: true,
    waitForTheseToBeVisibleAndStable: [
      page.getByRole("link", { name: "Automatic course exam" }).last(),
    ],
  })

  await page.getByRole("button", { name: "Create" }).nth(1).click()

  await expectScreenshotsToMatchSnapshots({
    screenshotTarget: page.locator("id=new-exam-dialog"),
    headless,
    testInfo,
    snapshotName: "create-exam-dialog",
    waitForTheseToBeVisibleAndStable: [
      page.getByText("Name"),
      page.getByText("Starts at"),
      page.getByText("Ends at"),
      page.getByText("Time in minutes"),
      page.getByText("duplicate"),
    ],
  })

  // Fill [label="Name"]
  await page.locator('[label="Name"]').fill("new exam")

  // Fill [label="starts\ at"]
  await page.locator('[label="Starts\\ at"]').fill("2099-11-11T13:15")

  // Fill [label="starts\ at"]
  await page.locator('[label="Ends\\ at"]').fill("2099-11-12T13:15")

  // Fill [label="Time\ in\ minutes"]
  await page.locator('[label="Time\\ in\\ minutes"]').fill("120")

  await expectScreenshotsToMatchSnapshots({
    screenshotTarget: page.locator("id=new-exam-dialog"),
    headless,
    testInfo,
    snapshotName: "create-exam-dialog-filled",
    waitForTheseToBeVisibleAndStable: [
      page.getByText("Name"),
      page.getByText("Starts at"),
      page.getByText("Ends at"),
      page.getByText("Time in minutes"),
      page.getByText("duplicate"),
    ],
  })

  await page.getByText("Submit").click()
})
