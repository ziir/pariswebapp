// @flow

export function ensureExists<T>(item: ?T, message: ?string): T {
  if (item === null) {
    throw new Error(message || 'Expected an item to exist, and it was null.');
  }
  if (item === undefined) {
    throw new Error(
      message || 'Expected an item to exist, and it was undefined.'
    );
  }
  return item;
}
