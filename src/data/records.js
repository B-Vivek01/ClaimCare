export function changesBetween(previous, next) {
  if (!Array.isArray(next)) throw new Error('Records must be an array.');
  const ids = new Set();
  for (const item of next) {
    if (!item.id || ids.has(item.id)) throw new Error('Records require unique IDs.');
    ids.add(item.id);
  }
  const old = new Map(previous.map(item => [item.id, item]));
  return {
    writes: next.filter(item => JSON.stringify(old.get(item.id)) !== JSON.stringify(item)),
    deletes: previous.filter(item => !ids.has(item.id)),
  };
}
