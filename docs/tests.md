# Tests

## Filling form fields, checkboxes and radio buttons

A good way to fill a text field with the label "Name" is

```js
await page.fill('input[label="First name"]', "User")
```

Checking a checkbox or radio button with the label "Draft" can be done in a similar manner

```js
await page.check("input[label=Draft]")
```

## Skipping accessibility in tests / Guide to axeSkip

Skipping accessibility violations is done by axeSkip, below we have some instructions.

You can obtain the ID for the rule from browser by pressing 'more info' and then in the top left corner there is 'Rule ID'. Below there's also example of the violation in console, in console it is just "id"

![More info-button location showed](./img/example1.png)

axeSkip is given to the expectScreenshotsMatchSnapshots function

```js
await expectScreenshotsToMatchSnapshots({
  axeSkip: ["aria-hidden-focus"],
  page,
  headless,
  snapshotName: "search-continuous-phrases-ranked-higher-than-word-matches",
  waitForThisToBeVisibleAndStable: "text=banana cat enim",
})
```

For example if you get the following violation

```js
Violation 1
-----------
  Rule: landmark-one-main
  Description: Ensures the document has a main landmark
  Impact: moderate
  Help: Document should have one main landmark
  Help URL: https://dequeuniversity.com/rules/axe/4.3/landmark-one-main?application=playwright
  Affected DOM nodes:{
    ...
  }

```

You can skip it with this

```js

axeSkip: ["landmark-one-main"],

```
