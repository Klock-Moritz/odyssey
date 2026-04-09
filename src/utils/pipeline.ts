export type Pipeline<T, U> = {
  apply: (input: T) => Promise<U>,
  next: <V>(fn: (input: U) => V) => Pipeline<T, V>,
  nextAsync: <V>(fn: (input: U) => Promise<V>) => Pipeline<T, V>,
}

abstract class BasePipeline<T, U> implements Pipeline<T, U> {
  abstract apply(input: T): Promise<U>;
  abstract nextAsync<V>(fn: (input: U) => Promise<V>): Pipeline<T, V>;
  next<V>(fn: (input: U) => V): Pipeline<T, V> {
    return this.nextAsync((input) => Promise.resolve(fn(input)));
  }
}

class IdentityPipeline<T> extends BasePipeline<T, T> {
  apply(input: T): Promise<T> {
    return Promise.resolve(input);
  }

  nextAsync<V>(fn: (input: T) => Promise<V>): Pipeline<T, V> {
    return new PipelineImpl((input: T) => Promise.resolve(input), fn);
  }
}

class PipelineImpl<T, U, V> extends BasePipeline<T, V> {
  #applyFn: (input: T) => Promise<V>;

  constructor(previous: (input: T) => Promise<U>, applyFn: (input: U) => Promise<V>) {
    super();
    this.#applyFn = async (input: T) => previous(input).then(applyFn);
  }

  apply(input: T): Promise<V> {
    return this.#applyFn(input);
  }

  nextAsync<W>(fn: (input: V) => Promise<W>): Pipeline<T, W> {
    return new PipelineImpl(this.#applyFn, fn);
  }
}

export function startPipeline<T>(): Pipeline<T, T> {
  return new IdentityPipeline<T>();
}