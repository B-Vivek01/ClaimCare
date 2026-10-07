// Each update is computed after the preceding write has settled.
export function createSerialWriter(read, persist, committed) {
  let tail = Promise.resolve();
  return update => {
    const operation = tail.then(async () => {
      const next = typeof update === 'function' ? update(read()) : update;
      await persist(next);
      committed(next);
      return true;
    });
    tail = operation.catch(() => {});
    return operation;
  };
}
