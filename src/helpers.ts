
export const tryCatch = async<T>(fn: Promise<T> | (() => T)): Promise<[undefined, T] | [Error]> => {
  try {
    const result = typeof fn === 'function' ? fn() : fn
    return [undefined, await result]
  } catch(err) {
    return [err as Error]
  }
}
