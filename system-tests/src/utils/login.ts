import { expect } from "@playwright/test"
import { Page } from "playwright"

export async function login(
  user: string,
  password: string,
  page?: Page | undefined,
  stayLoggedIn?: boolean | undefined,
): Promise<void> {
  await page.goto("http://project-331.local/")

  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://project-331.local/login?return_to=%2F' }*/),
    page.click("text=Login"),
  ])

  await page.click('input[name="email"]')
  await page.fill('input[name="email"]', user)

  await page.click('input[name="password"]')
  await page.fill('input[name="password"]', password)

  await Promise.all([
    page.waitForNavigation(/*{ url: "http://project-331.local/" }*/),
    page.click("button[name=login]"),
  ])

  // Ensure we are logged in
  const afterLogin = await page.content()
  expect(afterLogin).toContain("Logout")
  expect(afterLogin).not.toContain("Login")

  // Store login state
  await page.context().storageState({ path: `src/states/${user}.json` })
  if (!stayLoggedIn) {
    await page.click("text=Logout")
    await page.waitForSelector("text=Login")
  }
}
