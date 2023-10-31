import { Dispatch, useReducer } from 'react';

import { isFunction } from 'lodash-es';

export type SetObjectStateAction<T> =
  | Partial<T>
  | ((prevState: T) => Partial<T>);

function reducer<T>(prevState: T, action: SetObjectStateAction<T>): T {
  // if called with a function, returns the result of the function
  if (isFunction(action)) {
    return {
      ...prevState,
      ...action(prevState),
    };
  }
  // else return the merged object
  return {
    ...prevState,
    ...action,
  };
}

/**
 * Like a useState, but you are not forced to pass the whole object to update
 * an object.
 *
 * @example
 * With a useState:
 *  setValue((prevValue) => { ...prevValue, keyToChange: valueForKeyToChange })
 * With a useObjectState:
 *  setValue({ keyToChange: valueForKeyToChange })
 *
 * @param initialState - default value
 * @returns An array with the getter and the setter
 */
export function useObjectState<T extends object>(
  initialState: T,
): [T, Dispatch<SetObjectStateAction<T>>] {
  return useReducer(reducer<T>, initialState);
}
