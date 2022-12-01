import { vi } from "vitest";
import { render } from "@solidjs/testing-library";

import { Home } from "./index";

vi.mock("@solidjs/router", () => ({
  A: (props: any) => <a {...props} />,
}));

describe("Home component", () => {
  test("matches the snapshot", () => {
    const { container } = render(() => <Home />);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
