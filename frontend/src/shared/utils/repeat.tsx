import React from 'react';

/**
 * A very particular component to repeat multiple times the same component.
 * Idea is to avoid having to write Array.from() and disable eslint each time.
 * It looks bad but it is safe, trust me :)
 */
export function repeat(nb: number, children: React.ReactElement) {
  return (
    <>
      {Array.from({ length: nb }).map((_, index) =>
        // eslint-disable-next-line react/no-array-index-key
        React.cloneElement(children, { key: index }),
      )}
    </>
  );
}
