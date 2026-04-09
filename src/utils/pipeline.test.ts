import { describe, expect, it } from "vitest";

import { startPipeline } from "./pipeline";

describe("Pipeline", () => {
  it("creates an identity pipeline that returns input unchanged", async () => {
    const pipeline = startPipeline<number>();
    const result = await pipeline.apply(42);

    expect(result).toBe(42);
  });

  it("chains a single transformation step", async () => {
    const pipeline = startPipeline<number>()
      .next((x) => x * 2);

    const result = await pipeline.apply(10);

    expect(result).toBe(20);
  });

  it("chains multiple transformation steps in sequence", async () => {
    const pipeline = startPipeline<number>()
      .next((x) => x + 5)
      .next((x) => x * 2)
      .next((x) => x - 3);

    const result = await pipeline.apply(10);

    expect(result).toBe((10 + 5) * 2 - 3);
  });

  it("handles type transformations across steps", async () => {
    const pipeline = startPipeline<string>()
      .next((str) => str.length)
      .next((len) => len > 5);

    const result1 = await pipeline.apply("hello");
    const result2 = await pipeline.apply("hello world");

    expect(result1).toBe(false);
    expect(result2).toBe(true);
  });

  it("chains object transformations", async () => {
    interface User {
      name: string;
    }

    const pipeline = startPipeline<User>()
      .next((user) => ({ ...user, age: 30 }))
      .next((user) => ({ ...user, name: user.name.toUpperCase() }));

    const result = await pipeline.apply({ name: "alice" });

    expect(result).toEqual({ name: "ALICE", age: 30 });
  });

  it("handles async operations with delays", async () => {
    const pipeline = startPipeline<number>()
      .nextAsync((x) => new Promise((resolve) => setTimeout(() => resolve(x * 2), 10)))
      .nextAsync((x) => new Promise((resolve) => setTimeout(() => resolve((x as number) + 5), 10)));

    const result = await pipeline.apply(5);

    expect(result).toBe(15);
  });

  it("propagates rejection from pipeline steps", async () => {
    const pipeline = startPipeline<number>()
      .nextAsync((x) => Promise.resolve(x * 2))
      .nextAsync(() => Promise.reject(new Error("Step failed")));

    await expect(pipeline.apply(10)).rejects.toThrow("Step failed");
  });

  it("propagates rejection from first step", async () => {
    const pipeline = startPipeline<number>()
      .nextAsync(() => Promise.reject(new Error("Initial step failed")));

    await expect(pipeline.apply(10)).rejects.toThrow("Initial step failed");
  });

  it("handles pipelines with no steps beyond identity", async () => {
    const pipeline = startPipeline<{ id: number }>();
    const obj = { id: 123 };

    const result = await pipeline.apply(obj);

    expect(result).toBe(obj);
  });

  it("reuses pipelines across multiple applications", async () => {
    const pipeline = startPipeline<number>()
      .next((x) => x * 2);

    const result1 = await pipeline.apply(5);
    const result2 = await pipeline.apply(10);
    const result3 = await pipeline.apply(15);

    expect(result1).toBe(10);
    expect(result2).toBe(20);
    expect(result3).toBe(30);
  });

  it("handles complex nested type transformations", async () => {
    const pipeline = startPipeline<string>()
      .next((str) => ({ value: str, length: str.length }))
      .next((obj) => [obj.value, obj.length])
      .next((arr) => ({ values: arr }));

    const result = await pipeline.apply("test");

    expect(result).toEqual({ values: ["test", 4] });
  });
});
