// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/svelte";

import Button from "../components/Button";
import SlotTest from "./SlotTest.svelte";

// Note: This is as an async test as we are using `fireEvent`
test("changes button handles click events", async () => {
  const handleClick = jest.fn();
  const {
    container: {
      firstChild: { firstChild: button },
    },
  } = render(Button, { handleClick });

  expect(handleClick.mock.calls).toHaveLength(0);

  await fireEvent.click(button);

  expect(handleClick.mock.calls).toHaveLength(1);
});

test("renders text", () => {
  const { container } = render(SlotTest, { Component: Button });

  expect(container).toHaveTextContent("Test Data");
});
