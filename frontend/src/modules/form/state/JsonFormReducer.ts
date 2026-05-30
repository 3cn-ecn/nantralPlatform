import {
  Category,
  GroupLayout,
  JsonSchema,
  LabelElement,
  UISchemaElement,
} from '@jsonforms/core';
import { UUID } from 'crypto';
import { clone, set } from 'lodash';

import { FormStateError } from '#modules/form/types/errors';
import {
  AnyLayoutNode,
  CategoryNode,
  ContainerNode,
  ControlNode,
  GroupNode,
  LayoutNode,
} from '#modules/form/types/form.type';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { BaseLanguage } from '#shared/i18n/config';
import { TranslatedFieldObject } from '#shared/infra/translatedFields/translatedField.types';

export interface TreeState {
  rootId: UUID;
  nodes: Record<UUID, AnyLayoutNode>;
}

// Type guards
function isContainer(
  node: AnyLayoutNode,
): node is ContainerNode | GroupNode | CategoryNode {
  return 'elements' in node;
}

// Create empty tree
export function createInitialTree(): TreeState {
  const rootId = window.crypto.randomUUID();

  return {
    rootId,
    nodes: {
      [rootId]: {
        id: rootId,
        type: 'VerticalLayout',
        elements: [],
      } as ContainerNode,
    },
  };
}

// Add node
export function addNode(
  state: TreeState,
  parentId: UUID,
  node: Omit<LayoutNode, 'id' | 'parentId'>,
): TreeState {
  const parent = state.nodes[parentId];

  if (!parent) {
    throw new FormStateError(
      'Parent node not found in form tree. Unable to add child node.',
      { missingParentId: parentId },
      undefined,
      parentId,
    );
  }

  if (!isContainer(parent)) {
    throw new FormStateError(
      `Node is not a container. Cannot add children to ${parent.type} nodes.`,
      { parentType: parent.type },
      parentId,
      parentId,
    );
  }

  const id = window.crypto.randomUUID();

  const newNode: AnyLayoutNode = {
    id,
    parentId,
    ...node,
  } as AnyLayoutNode;

  return {
    ...state,
    nodes: {
      ...state.nodes,
      [id]: newNode,
      [parentId]: {
        ...parent,
        elements: [...parent.elements, id],
      },
    },
  };
}

// Update node
export function updateNode(
  state: TreeState,
  nodeId: string,
  updates: Partial<Omit<LayoutNode, 'id' | 'parentId'>>,
): TreeState {
  const node = state.nodes[nodeId];

  if (!node) {
    throw new FormStateError(
      'Node not found in form tree.',
      { operation: 'update' },
      nodeId,
    );
  }

  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeId]: {
        ...node,
        ...updates,
      },
    },
  };
}

// Remove node
export function removeNode(state: TreeState, nodeId: UUID): TreeState {
  const node = state.nodes[nodeId];

  if (!node) {
    throw new FormStateError(
      'Node not found in form tree.',
      { operation: 'remove' },
      nodeId,
    );
  }

  const parentId = node.parentId;
  if (!parentId) {
    return createInitialTree();
  }

  const parent = state.nodes[parentId];

  if (!parent || !isContainer(parent)) {
    throw new FormStateError(
      'Invalid parent node for removal operation.',
      { parentId },
      nodeId,
      parentId,
    );
  }

  const idsToDelete = collectSubtreeIds(state.nodes, nodeId);
  const nextNodes = { ...state.nodes };

  for (const id of idsToDelete) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete nextNodes[id];
  }

  nextNodes[parentId] = {
    ...parent,
    elements: parent.elements.filter((id) => id !== nodeId),
  };

  return {
    ...state,
    nodes: nextNodes,
  };
}

function collectSubtreeIds(
  nodes: Record<UUID, AnyLayoutNode>,
  nodeId: UUID,
): UUID[] {
  const node = nodes[nodeId];

  if (!node) {
    return [];
  }

  const ids = [nodeId];

  if (isContainer(node)) {
    for (const childId of node.elements) {
      ids.push(...collectSubtreeIds(nodes, childId));
    }
  }

  return ids;
}

// Check if a node is a descendant of another node
export function isDescendantOf(
  nodes: Record<UUID, AnyLayoutNode>,
  potentialDescendant: UUID,
  potentialAncestor: UUID,
): boolean {
  const descendantIds = collectSubtreeIds(nodes, potentialAncestor);
  return (
    descendantIds.includes(potentialDescendant) &&
    potentialDescendant !== potentialAncestor
  );
}

function saveTranslation(
  keys: Record<BaseLanguage, object>,
  field: TranslatedFieldObject,
  key: string,
) {
  Object.entries(keys).forEach(([lang, list]) => {
    if (lang in field && field[lang]) {
      set(list, key, field[lang]);
      return;
    }
    // Find the first non-empty string as a replacement
    set(
      list,
      key,
      Object.entries(field).find(([, val]) => val)?.[1] || '>EMPTY<',
    );
  });
}

// Export to tree JSON
export function exportTree(state: TreeState): {
  uiSchema: UISchemaElement;
  schema: JsonSchema;
  i18nKeys: Record<BaseLanguage, Record<string, object>>;
} {
  const jsonSchema: JsonSchema = {
    type: 'object',
    properties: {},
  };

  const i18nKeys = { fr: {}, en: {} };

  const normalizeName = (s?: string): string => {
    if (!s) return 'field';
    try {
      const n = (s as string)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      return n.length > 0 ? n : 'field';
    } catch {
      return (
        (s as string).replace(/[^a-z0-9]+/gi, '_').toLowerCase() || 'field'
      );
    }
  };

  const ensureUnique = (baseName: string, used: Set<string>) => {
    if (!used.has(baseName)) {
      used.add(baseName);
      return baseName;
    }
    let i = 2;
    let name = `${baseName}_${i}`;
    while (used.has(name)) {
      i += 1;
      name = `${baseName}_${i}`;
    }
    used.add(name);
    return name;
  };

  function traverse(
    nodeId: UUID,
    nodes: Record<UUID, AnyLayoutNode>,
    currentProperties: Record<string, JsonSchema>,
    path: string[],
    usedNamesAtLevel: Set<string>,
  ): UISchemaElement {
    const node = nodes[nodeId];
    if (!node) {
      return { type: 'Label', text: '' } as UISchemaElement;
    }

    if (node.type === 'Control') {
      const title = node.schema?.title || 'field';
      const baseName = normalizeName(title);
      const propName = ensureUnique(baseName, usedNamesAtLevel);

      currentProperties[propName] = node.schema
        ? clone(node.schema)
        : { type: 'string', title: title };

      const scope = '#/properties/' + [...path, propName].join('/properties/');

      return {
        type: 'Control',
        scope,
        i18n: nodeId,
      } as UISchemaElement;
    }

    if (node.type === 'Label') {
      saveTranslation(i18nKeys, node.text, nodeId);
      return {
        type: 'Label',
        text: nodeId, // will be used as translation key
      } as UISchemaElement;
    }

    const createsNestedObject =
      node.type === 'Category' ||
      (node.type === 'Group' &&
        node.label &&
        Object.entries(node.label).some(([, label]) => label));

    const elements: UISchemaElement[] = [];

    if (createsNestedObject) {
      const label = node.label;
      const baseName = normalizeName(label?.fr || label?.en || nodeId);
      const propName = ensureUnique(baseName, usedNamesAtLevel);

      const nestedSchema: JsonSchema = { type: 'object', properties: {} };
      currentProperties[propName] = nestedSchema;

      const nestedUsed = new Set<string>();
      for (const childId of node.elements) {
        const childUi = traverse(
          childId,
          nodes,
          nestedSchema.properties || {},
          [...path, propName],
          nestedUsed,
        );
        elements.push(childUi);
      }

      saveTranslation(i18nKeys, node.label, nodeId);

      return {
        type: node.type,
        label: nodeId, // wil be used as translation key
        elements,
      } as UISchemaElement;
    } else {
      for (const childId of (node as ContainerNode).elements) {
        const childUi = traverse(
          childId,
          nodes,
          currentProperties,
          path,
          usedNamesAtLevel,
        );
        elements.push(childUi);
      }
      const out = { type: node.type, elements };
      // if ('label' in node && node.label) {
      //   (out as unknown as GroupNode | CategoryNode).label = node.label;
      // }
      return out;
    }
  }

  const rootId = state.rootId;
  const topUsed = new Set<string>();
  const uiSchema = traverse(
    rootId,
    state.nodes,
    jsonSchema.properties || {},
    [],
    topUsed,
  );

  return {
    uiSchema,
    schema: jsonSchema,
    i18nKeys,
  };
}

// Import from tree JSON
export function importJsonForm(jsonForm: JsonFormSchema): TreeState {
  const nodes: Record<string, AnyLayoutNode> = {};
  const rootId = buildNormalizedNodes(
    jsonForm.uiSchema,
    jsonForm.i18nKeys,
    nodes,
  );

  return {
    rootId,
    nodes,
  };
}

function buildNormalizedNodes(
  node: UISchemaElement,
  i18nKeys: Record<BaseLanguage, object>,
  nodes: Record<UUID, AnyLayoutNode>,
  parentId?: UUID,
): UUID {
  const id = window.crypto.randomUUID();

  if (node.type === 'Control') {
    nodes[id] = {
      id,
      parentId,
      type: 'Control',
      schema: clone(node),
    } as ControlNode;
  } else if (node.type === 'Label') {
    nodes[id] = {
      id,
      parentId,
      type: 'Label',
      text: Object.fromEntries(
        Object.entries(i18nKeys).map(([lang, val]) => [
          lang,
          val[(node as LabelElement).text],
        ]),
      ) as Record<BaseLanguage, string>,
    };
  } else if (node.type === 'Group') {
    const elements = (node as GroupLayout).elements.map((child) =>
      buildNormalizedNodes(child, i18nKeys, nodes, id),
    );
    const groupNode = node as GroupLayout;

    nodes[id] = {
      id,
      parentId,
      type: 'Group',
      elements,
      label: Object.fromEntries(
        Object.entries(i18nKeys).map(([lang, val]) => [
          lang,
          val[groupNode.label as string],
        ]),
      ) as Record<BaseLanguage, string>,
    };
  } else if (node.type === 'Category') {
    const elements = (node as Category).elements.map((child) =>
      buildNormalizedNodes(child, i18nKeys, nodes, id),
    );

    nodes[id] = {
      id,
      parentId,
      type: 'Category',
      elements,
      label: Object.fromEntries(
        Object.entries(i18nKeys).map(([lang, val]) => [
          lang,
          val[(node as { label: string }).label],
        ]),
      ) as Record<BaseLanguage, string>,
    };
  } else if ('elements' in node) {
    const elements = node.elements.map((child) =>
      buildNormalizedNodes(child, i18nKeys, nodes, id),
    );

    nodes[id] = {
      id,
      parentId,
      type: node.type as
        | 'VerticalLayout'
        | 'HorizontalLayout'
        | 'Categorization',
      elements,
    };
  }

  return id;
}

// Move node
export function moveNode(
  state: TreeState,
  nodeId: UUID,
  newParentId: UUID,
  position?: number,
): TreeState {
  const node = state.nodes[nodeId];

  if (!node) {
    throw new FormStateError(
      'Node not found in form tree.',
      { operation: 'move' },
      nodeId,
    );
  }

  // Check if trying to move a node into itself
  if (nodeId === newParentId) {
    throw new FormStateError(
      'Cannot move a node into itself.',
      { nodeId, newParentId },
      nodeId,
      newParentId,
    );
  }

  // Check if trying to move a node into one of its descendants
  if (isDescendantOf(state.nodes, newParentId, nodeId)) {
    throw new FormStateError(
      'Cannot move a node into one of its descendants.',
      { nodeId, newParentId },
      nodeId,
      newParentId,
    );
  }

  const oldParentId = node.parentId;

  if (!oldParentId) {
    throw new FormStateError(
      'Cannot move root node.',
      { operation: 'move' },
      nodeId,
    );
  }

  const oldParent = state.nodes[oldParentId];
  const newParent = state.nodes[newParentId];

  if (!isContainer(oldParent) || !isContainer(newParent)) {
    throw new FormStateError(
      'Invalid parent node for move operation.',
      { oldParentId, newParentId },
      nodeId,
      newParentId,
    );
  }

  // Handle same-parent move (reordering within the same parent)
  if (oldParentId === newParentId) {
    const elements = oldParent.elements;
    const oldIndex = elements.indexOf(nodeId);

    if (oldIndex === -1) {
      console.error(
        'Node not found in parent elements.',
        { operation: 'move', parentId: oldParentId },
        nodeId,
      );
      return state;
    }

    // If position is provided, reorder; otherwise return unchanged state
    if (
      position !== undefined &&
      position >= 0 &&
      position <= elements.length
    ) {
      // Remove from old position and insert at new position
      const newElements = [...elements];
      newElements.splice(oldIndex, 1);
      newElements.splice(position, 0, nodeId);

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [oldParentId]: {
            ...oldParent,
            elements: newElements,
          },
        } as Record<UUID, AnyLayoutNode>,
      };
    }

    // No position change, return unchanged state
    return state;
  }

  // Handle cross-parent move
  // Remove from old parent
  const newOldParentElements = oldParent.elements.filter((id) => id !== nodeId);

  // Add to new parent at specified position or at the end
  let newNewParentElements: UUID[];
  if (
    position !== undefined &&
    position >= 0 &&
    position <= newParent.elements.length
  ) {
    newNewParentElements = [
      ...newParent.elements.slice(0, position),
      nodeId,
      ...newParent.elements.slice(position),
    ];
  } else {
    newNewParentElements = [...newParent.elements, nodeId];
  }

  return {
    ...state,
    nodes: {
      ...state.nodes,
      [nodeId]: {
        ...node,
        parentId: newParentId,
      },
      [oldParentId]: {
        ...oldParent,
        elements: newOldParentElements,
      },
      [newParentId]: {
        ...newParent,
        elements: newNewParentElements,
      },
    } as Record<UUID, AnyLayoutNode>,
  };
}

// Action types
export type JsonFormAction =
  | {
      type: 'add_node';
      parentId: UUID;
      node: {
        elements?: UUID[];
        type: string;
        label?: TranslatedFieldObject;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: TranslatedFieldObject;
        schema?: JsonSchema;
      };
    }
  | {
      type: 'update_node';
      nodeId: UUID;
      node: {
        elements?: UUID[];
        type?: string;
        label?: TranslatedFieldObject;
        inputType?: string;
        options?: UISchemaElement['options'];
        scope?: string;
        text?: TranslatedFieldObject;
        schema?: JsonSchema;
      };
    }
  | {
      type: 'remove_node';
      nodeId: UUID;
    }
  | {
      type: 'move_node';
      nodeId: UUID;
      newParentId: UUID;
      position?: number;
    }
  | { type: 'import'; jsonForm: JsonFormSchema }
  | {
      type: 'set';
      jsonForm: TreeState;
    };

// Reducer
export function jsonFormReducer(
  state: TreeState,
  action: JsonFormAction,
): TreeState {
  switch (action.type) {
    case 'add_node':
      return addNode(state, action.parentId, action.node);
    case 'update_node':
      return updateNode(state, action.nodeId, action.node);
    case 'remove_node':
      return removeNode(state, action.nodeId);
    case 'move_node':
      return moveNode(
        state,
        action.nodeId,
        action.newParentId,
        action.position,
      );
    case 'import':
      return importJsonForm(action.jsonForm);
    case 'set':
      return action.jsonForm;
    default:
      throw new Error(
        `Unknown action type in reducer: ${JSON.stringify(action)}`,
      );
  }
}

export const initialForm = createInitialTree();
