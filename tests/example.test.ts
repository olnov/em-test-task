import myTestFunction from "../src/example";

describe("myTestFunction", () => {
  it("should return the same string being passed to the function", () => {
    const input = "test input";
    const result = myTestFunction(input);
    expect(result).toBe(input);
  });
});