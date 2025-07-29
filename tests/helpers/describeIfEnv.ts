// tests/helpers/describeIfEnv.ts
export function describeIfEnv(
  vars: string[],
  name: string,
  fn: () => void,
) {
  const missing = vars.filter(v => !process.env[v]);
  (missing.length ? describe.skip : describe)(name, () => {
    if (missing.length) {
      it(`skipped: missing ${missing.join(', ')}`, () => {
        console.warn(`Env vars missing: ${missing.join(', ')}`);
      });
    } else {
      fn();
    }
  });
}
