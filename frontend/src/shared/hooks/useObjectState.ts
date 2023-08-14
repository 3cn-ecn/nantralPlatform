import { Dispatch, useReducer } from 'react';

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
 * @param initializer - default value
 * @returns An array with the getter and the setter
 */
export function useObjectState<ObjectType extends object>(
  initializer: ObjectType
): [ObjectType, Dispatch<Partial<ObjectType>>] {
  return useReducer(
    (prevObj: ObjectType, newObj: Partial<ObjectType>): ObjectType => ({
      ...prevObj,
      ...newObj,
    }),
    initializer
  );
}
