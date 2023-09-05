//////////////// UTILITIES ////////////////

export default class Env {
  static require = (
    value: string | undefined,
    tag : string | undefined = 'Environment variable'
  ) => {
    if (!value) throw new Error(`${tag} is not defined`);
    return value;
  };
}