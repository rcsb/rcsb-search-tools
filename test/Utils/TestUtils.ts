export function expectDefined<T>(x: T): asserts x is NonNullable<T> {
    expect(x).toBeDefined();
}