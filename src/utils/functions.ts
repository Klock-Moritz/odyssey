export function choose<T, U, V>(predicate: (input: T) => boolean,
  then: (input: T) => U,
  or: (input: T) => V): (input: T) => U | V {

  return (input: T) => predicate(input) ? then(input) : or(input);
}

export function condition<T, U>(predicate: (input: T) => boolean,
  then: (input: T) => U): (input: T) => U | T {

  return choose(predicate, then, identity);
}

export function compose<T, U, V>(f: (input: T) => U, g: (input: U) => V): (input: T) => V {
  return (input: T) => g(f(input));
}

export function identity<T>(input: T): T {
  return input;
}

export function resolve<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

export function setProperty<T, K extends PropertyKey, V>(key: K, value: V): (input: T) => T & { [key in K]: V } {
  return (input: T) => ({
    ...input,
    [key]: value,
  }) as T & { [key in K]: V };
}

export function setPropertyAsync<T, K extends PropertyKey, V>(key: K, value: Promise<V>): (input: T) => Promise<T & { [key in K]: V }> {
  return async (input: T) => ({
    ...input,
    [key]: await value,
  }) as T & { [key in K]: V };
}

export function copyProperty<K extends PropertyKey, L extends PropertyKey, V, T extends { [key in K]: V }>(fromKey: K, toKey: L): (input: T) => T & { [key in L]: V } {
  return (input: T) => setProperty(toKey, input[fromKey])(input) as T & { [key in L]: V };
}

export function removeProperty<T, K extends PropertyKey>(key: K): (input: T) => Omit<T, K> {
  return (input: T) => {
    const { [key]: _, ...rest } = input;
    return rest;
  }
}

export function log<T>(message: string): (input: T) => T {
  return (input: T) => {
    console.log(message, input);
    return input;
  }
}