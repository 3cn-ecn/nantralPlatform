import {
  ControlElement,
  Internationalizable,
  JsonSchema,
  Layout,
  UISchemaElement,
} from '@jsonforms/core';
import { UUID } from 'crypto';
import { cloneDeep, get, mapValues, merge, omit, set } from 'lodash';

import { FormState, Node, Payload } from '#modules/form/types/form.type';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';

/**
 * Add a node to the form as child of the given parent
 * @param state Form state to use
 * @param parent Id of the parent node
 * @param payload The payload to include with the node
 * @param position Index of new node among the parent's children
 */
export function addNode(
  state: FormState,
  parent: UUID,
  payload: Node['payload'],
  position?: number,
): FormState {
  if (!state.nodes[parent]) {
    throw new Error('Parent not found');
  }
  const id = crypto.randomUUID();
  state.nodes[id] = { parent, children: [], payload };
  state.nodes[parent].children.splice(
    position ?? state.nodes[parent].children.length,
    0,
    id,
  );
  return state;
}

/**
 * Delete a node from the form without removing it from its parent
 * @param state Form state to use
 * @param id Id of the node to delete
 */
function deleteNode(state: FormState, id: UUID) {
  return {
    root: state.root,
    nodes: omit(
      state.nodes[id].children.reduce<FormState>(deleteNode, state).nodes,
      id,
    ),
  };
}

/**
 * Remove a node from its parent and delete it
 * @param state Form state to use
 * @param id Id of the node to delete
 */
export function removeNode(state: FormState, id: UUID) {
  const parent = state.nodes[id].parent;
  if (!parent) {
    throw new Error('Cannot remove the root node');
  }
  return {
    ...state,
    nodes: {
      ...deleteNode(state, id).nodes,
      [parent]: {
        ...state.nodes[parent],
        children: state.nodes[parent].children.filter(
          (childId) => childId !== id,
        ),
      },
    },
  };
}

/**
 * Move the given node into a new parent, at the given position
 * @param state Form state to use
 * @param id Id of the node to move
 * @param newParent Id of the destination node
 * @param position Index of the node in the new parent's children
 */
export function moveNode(
  state: FormState,
  id: UUID,
  newParent: UUID,
  position?: number,
) {
  if (isDescendent(state, newParent, id)) {
    throw new Error('Cannot move an element into one of its children');
  }
  const oldParent = state.nodes[id].parent;
  if (!oldParent) {
    throw new Error('Cannot move the root node');
  }
  if (oldParent === newParent) {
    if (
      position !== undefined &&
      position >= 0 &&
      position <= state.nodes[oldParent].children.length
    ) {
      const childrenWithoutNode = state.nodes[oldParent].children.filter(
        (childId) => childId !== id,
      );

      return {
        ...state,
        nodes: {
          ...state.nodes,

          [oldParent]: {
            ...state.nodes[oldParent],
            children: [
              ...childrenWithoutNode.slice(0, position),
              id,
              ...childrenWithoutNode.slice(position),
            ],
          },
        },
      };
    }
    // No position change
    return state;
  } else {
    return {
      ...state,
      nodes: {
        ...state.nodes,

        [oldParent]: {
          ...state.nodes[oldParent],
          children: state.nodes[oldParent].children.filter(
            (childId) => childId !== id,
          ),
        },

        [newParent]: {
          ...state.nodes[newParent],
          children: [
            ...state.nodes[newParent].children.slice(0, position),
            id,
            ...state.nodes[newParent].children.slice(position),
          ],
        },

        [id]: {
          ...state.nodes[id],
          parent: newParent,
        },
      },
    };
  }
}

/**
 * Check if a node is contained inside another one
 * @param state Form state to use
 * @param id Id of the node to check
 * @param potentialAncestor Id of the ancestor
 */
export function isDescendent(
  state: FormState,
  id: UUID,
  potentialAncestor: UUID,
) {
  return (
    id === potentialAncestor ||
    (state.nodes[id].parent &&
      isDescendent(state, state.nodes[id].parent, potentialAncestor))
  );
}

export function nodeToJsonForm(
  state: FormState,
  path?: string[],
): JsonFormSchema {
  const nodeId = path?.at(-1);
  if (!path) {
    path = [];
  }
  const node = state.nodes[nodeId ?? state.root];
  const result: JsonFormSchema = {
    uuid: state.uuid,
    name: state.name,
    description: state.description,
    schema: cloneDeep(node.payload.schema),
    uiSchema: {
      type: node.payload.type,
      options: node.payload.options,
      i18n: nodeId,
    },
    i18nKeys: mapValues(node.payload.translation, (value) =>
      // If it is the root node,put the translation to the root
      nodeId === undefined
        ? cloneDeep(value)
        : {
            [nodeId]: cloneDeep(value),
          },
    ),
  };

  if (node.children.length > 0) {
    result.schema.type = 'object';
    (result.uiSchema as Layout).elements = [];
    node.children.forEach((childId) => {
      const childResult = nodeToJsonForm(state, [...path, childId]);
      set(result, ['schema', 'properties', childId], childResult.schema);
      (result.uiSchema as Layout).elements.push(childResult.uiSchema);
      merge(result.i18nKeys, childResult.i18nKeys);
    });
  }

  if (result.uiSchema.type === 'Control') {
    (result.uiSchema as ControlElement).scope = ['#', ...path].join(
      '/properties/',
    );
  }

  return result;
}

/**
 * Convert a JsonFormSchema back to a FormState tree structure
 * This is the reverse operation of nodeToJsonForm
 * @param jsonForm The JsonFormSchema to convert
 * @returns The corresponding FormState
 */
export function jsonFormToNode(jsonForm: JsonFormSchema): FormState {
  const nodes: FormState['nodes'] = {};
  const remainingI18nKeys = mapValues(jsonForm.i18nKeys, (languageData) =>
    cloneDeep(languageData),
  );

  // Process the root node and its children recursively
  const rootId = processUISchemaElement(
    jsonForm.uiSchema,
    jsonForm.schema,
    remainingI18nKeys,
    undefined,
    nodes,
  );

  return {
    uuid: jsonForm.uuid as UUID,
    name: jsonForm.name,
    description: jsonForm.description,
    root: rootId,
    nodes,
  };
}

/**
 * Process a UI schema element and its children recursively
 * @param uiSchema The UI schema element to process
 * @param schema The corresponding JSON schema
 * @param remainingI18nKeys Mutable reference to i18n keys - consumed entries are deleted
 * @param parentId The ID of the parent node
 * @param nodes Accumulator object for all nodes
 * @returns The nodeId for this node
 */
function processUISchemaElement(
  uiSchema: UISchemaElement,
  schema: JsonSchema,
  remainingI18nKeys: JsonFormSchema['i18nKeys'],
  parentId: UUID | undefined,
  nodes: FormState['nodes'],
): UUID {
  // Use i18n field if available, otherwise generate a new UUID (root case)
  const nodeId: UUID =
    ((uiSchema as Internationalizable).i18n as UUID) ?? crypto.randomUUID();
  const children: UUID[] = [];

  // Process children if this is a layout element
  if ('elements' in uiSchema && Array.isArray(uiSchema.elements)) {
    uiSchema.elements.forEach((childUISchema) => {
      const childId = processUISchemaElement(
        childUISchema,
        schema,
        remainingI18nKeys,
        nodeId,
        nodes,
      );
      children.push(childId);
    });
  }

  // Extract translations for this node and remove them from remaining keys
  const translation = extractAndConsumeTranslations(remainingI18nKeys, nodeId);

  nodes[nodeId] = {
    parent: parentId,
    children,
    payload: {
      translation,
      type: uiSchema.type,
      options: uiSchema.options,
      schema: {},
    },
  };

  if ('scope' in uiSchema) {
    const scope = (uiSchema as ControlElement).scope.split('/').slice(1);
    nodes[nodeId].payload.schema = cloneDeep(
      scope.length > 0 ? get(schema, scope) : schema,
    );
    // Process required
    const requiredArray =
      get(schema, [...scope.slice(0, -2), 'required']) || [];
    nodes[nodeId].payload.required = requiredArray.includes(nodeId);
  }

  return nodeId;
}

/**
 * Extract and remove translation data for a specific node from the remaining i18n keys
 * For non-root nodes, the nodeId is a top-level key in each language's data
 * For the root node, all remaining data belongs to it
 * @param remainingI18nKeys Mutable i18n keys structure to extract from
 * @param nodeId The node ID to extract translations for
 * @returns Translation object for the node
 */
function extractAndConsumeTranslations(
  remainingI18nKeys: JsonFormSchema['i18nKeys'],
  nodeId: UUID,
): Payload['translation'] {
  const result: Payload['translation'] = { en: {}, fr: {} };

  Object.entries(remainingI18nKeys).forEach(([language, languageData]) => {
    if (nodeId in languageData) {
      // Non-root node: extract the data under the nodeId key and remove it
      result[language] = languageData[nodeId];
      remainingI18nKeys[language] = omit(languageData, [nodeId]);
    } else {
      // Root node: use all remaining data
      result[language] = languageData;
      remainingI18nKeys[language] = {};
    }
  });

  return result;
}
