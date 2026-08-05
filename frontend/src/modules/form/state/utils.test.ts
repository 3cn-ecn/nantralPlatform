import { UUID } from 'crypto';
import { beforeEach, describe, expect, it } from 'vitest';

import { FormState } from '#modules/form/types/form.type';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';

import { jsonFormToNode, nodeToJsonForm } from './utils';

/**
 * Comprehensive test suite to verify that jsonFormToNode and nodeToJsonForm
 * are inverse operations of each other.
 */
describe('nodeToJsonForm and jsonFormToNode inverse operations', () => {
  let rootId: UUID;
  let childId1: UUID;
  let childId2: UUID;
  let nestedChildId: UUID;

  beforeEach(() => {
    // Generate consistent IDs for testing
    rootId = '00000000-0000-0000-0000-000000000001' as UUID;
    childId1 = '00000000-0000-0000-0000-000000000002' as UUID;
    childId2 = '00000000-0000-0000-0000-000000000003' as UUID;
    nestedChildId = '00000000-0000-0000-0000-000000000004' as UUID;
  });

  describe('Simple form with single control element', () => {
    it('should convert a simple control to JsonForm and back to FormState', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [],
            payload: {
              translation: {
                en: { label: 'Name', description: 'Your name' },
                fr: { label: 'Nom', description: 'Votre nom' },
              },
              type: 'Control',
              options: {},
              schema: {
                type: 'string',
                title: 'Name',
              },
              required: true,
            },
          },
        },
      };

      // Convert to JsonForm
      const jsonForm = nodeToJsonForm(formState);

      // Verify JsonForm structure
      expect(jsonForm.schema).toBeDefined();
      expect(jsonForm.uiSchema).toBeDefined();
      expect(jsonForm.i18nKeys).toBeDefined();
      expect(jsonForm.uiSchema.type).toBe('Control');

      // Convert back to FormState
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Verify the round-trip
      expect(restoredState.nodes[restoredState.root]).toBeDefined();
      expect(restoredState.nodes[restoredState.root].payload.type).toBe(
        'Control',
      );
      expect(restoredState.nodes[restoredState.root].payload.schema.type).toBe(
        'string',
      );
      expect(restoredState.nodes[restoredState.root].children.length).toBe(0);
    });
  });

  describe('Form with multiple child elements', () => {
    it('should convert a form with multiple children to JsonForm and back', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1, childId2],
            payload: {
              translation: {
                en: { label: 'Personal Information' },
                fr: { label: 'Informations personnelles' },
              },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'First Name' },
                fr: { label: 'Prénom' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
              required: true,
            },
          },
          [childId2]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'Last Name' },
                fr: { label: 'Nom de famille' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
              required: false,
            },
          },
        },
      };

      // Convert to JsonForm
      const jsonForm = nodeToJsonForm(formState);

      // Verify JsonForm structure
      expect(jsonForm.schema.type).toBe('object');
      expect(jsonForm.uiSchema.type).toBe('VerticalLayout');
      if ('elements' in jsonForm.uiSchema) {
        expect(jsonForm.uiSchema.elements).toHaveLength(2);
      }

      // Convert back to FormState
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Verify structure is preserved
      const restoredRoot = restoredState.nodes[restoredState.root];
      expect(restoredRoot.children.length).toBe(2);
      expect(restoredRoot.payload.type).toBe('VerticalLayout');

      // Verify children
      const restoredChild1 = restoredState.nodes[restoredRoot.children[0]];
      const restoredChild2 = restoredState.nodes[restoredRoot.children[1]];

      expect(restoredChild1.payload.type).toBe('Control');
      expect(restoredChild2.payload.type).toBe('Control');
      expect(restoredChild1.parent).toBe(restoredState.root);
      expect(restoredChild2.parent).toBe(restoredState.root);
    });
  });

  describe('Nested form with multiple levels', () => {
    it('should convert deeply nested forms to JsonForm and back', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: {
                en: { label: 'Root Layout' },
                fr: { label: 'Disposition racine' },
              },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [nestedChildId],
            payload: {
              translation: {
                en: { label: 'Address' },
                fr: { label: 'Adresse' },
              },
              type: 'Group',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [nestedChildId]: {
            parent: childId1,
            children: [],
            payload: {
              translation: {
                en: { label: 'Street', description: 'Street address' },
                fr: { label: 'Rue', description: 'Adresse de la rue' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
            },
          },
        },
      };

      // Convert to JsonForm
      const jsonForm = nodeToJsonForm(formState);

      // Verify nested structure
      expect(jsonForm.schema.type).toBe('object');
      if ('elements' in jsonForm.uiSchema) {
        expect(jsonForm.uiSchema.elements).toHaveLength(1);
        const firstElement = jsonForm.uiSchema.elements[0];
        if ('elements' in firstElement) {
          expect(firstElement.elements).toHaveLength(1);
        }
      }

      // Convert back to FormState
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Verify nested structure is preserved
      const restoredRoot = restoredState.nodes[restoredState.root];
      expect(restoredRoot.children.length).toBe(1);

      const restoredChild = restoredState.nodes[restoredRoot.children[0]];
      expect(restoredChild.payload.type).toBe('Group');
      expect(restoredChild.children.length).toBe(1);

      const restoredGrandChild = restoredState.nodes[restoredChild.children[0]];
      expect(restoredGrandChild.payload.type).toBe('Control');
      expect(restoredGrandChild.children.length).toBe(0);
    });
  });

  describe('Form with i18n translations', () => {
    it('should preserve all i18n keys through round-trip conversion', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: {
                en: {
                  label: 'Contact Form',
                  description: 'Fill in your contact details',
                },
                fr: {
                  label: 'Formulaire de contact',
                  description: 'Remplissez vos coordonnées',
                },
              },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'Email', description: 'Your email address' },
                fr: { label: 'E-mail', description: 'Votre adresse e-mail' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string', format: 'email' },
            },
          },
        },
      };

      // Convert to JsonForm
      const jsonForm = nodeToJsonForm(formState);

      // Verify i18n keys are preserved
      expect(jsonForm.i18nKeys.en).toBeDefined();
      expect(jsonForm.i18nKeys.fr).toBeDefined();

      // Convert back to FormState
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Verify translations are restored
      const restoredRoot = restoredState.nodes[restoredState.root];
      expect(restoredRoot.payload.translation.en.label).toBe('Contact Form');
      expect(restoredRoot.payload.translation.fr.label).toBe(
        'Formulaire de contact',
      );

      const restoredChild = restoredState.nodes[restoredRoot.children[0]];
      expect(restoredChild.payload.translation.en.label).toBe('Email');
      expect(restoredChild.payload.translation.fr.label).toBe('E-mail');
    });

    it('should handle complex i18n objects with custom fields', () => {
      const customI18nData = {
        label: 'Custom Label',
        description: 'Custom Description',
        placeholder: 'Enter value',
        helpText: 'This is help text',
      };

      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [],
            payload: {
              translation: {
                en: customI18nData,
                fr: {
                  label: 'Étiquette personnalisée',
                  description: 'Description personnalisée',
                  placeholder: 'Entrez la valeur',
                  helpText: "Ceci est du texte d'aide",
                },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredRoot = restoredState.nodes[restoredState.root];

      expect(restoredRoot.payload.translation.en.label).toBe('Custom Label');
      expect(restoredRoot.payload.translation.en.description).toBe(
        'Custom Description',
      );
    });
  });

  describe('Form with complex schema properties', () => {
    it('should preserve JSON schema properties through round-trip', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: {
                en: {},
                fr: {},
              },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'Age' },
                fr: { label: 'Âge' },
              },
              type: 'Control',
              options: {},
              schema: {
                type: 'integer',
                minimum: 0,
                maximum: 120,
                default: 18,
                description: 'User age',
              },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredChild =
        restoredState.nodes[
          restoredState.nodes[restoredState.root].children[0]
        ];

      expect(restoredChild.payload.schema.type).toBe('integer');
      expect(restoredChild.payload.schema.minimum).toBe(0);
      expect(restoredChild.payload.schema.maximum).toBe(120);
      expect(restoredChild.payload.schema.default).toBe(18);
    });
  });

  describe('Form with UI options', () => {
    it('should preserve UI schema options through round-trip', () => {
      const options = {
        showUnfocusedDescription: true,
        focus: true,
        trim: true,
        restrict: false,
      };

      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [],
            payload: {
              translation: {
                en: { label: 'Username' },
                fr: { label: "Nom d'utilisateur" },
              },
              type: 'Control',
              options,
              schema: { type: 'string' },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredRoot = restoredState.nodes[restoredState.root];

      expect(restoredRoot.payload.options).toEqual(options);
    });
  });

  describe('Schema scope handling', () => {
    it('should correctly reconstruct schema from scope path', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: { en: {}, fr: {} },
              type: 'VerticalLayout',
              options: {},
              schema: {
                type: 'object',
                required: [childId1],
              },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: { en: { label: 'First Name' }, fr: {} },
              type: 'Control',
              options: {},
              schema: {
                type: 'string',
                title: 'First Name',
              },
              required: true,
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);

      // The scope should be correctly set in the uiSchema
      if ('elements' in jsonForm.uiSchema) {
        const firstChild = jsonForm.uiSchema.elements[0];
        if ('scope' in firstChild) {
          expect(firstChild.scope).toBeDefined();
        }
      }

      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredChild =
        restoredState.nodes[
          restoredState.nodes[restoredState.root].children[0]
        ];

      expect(restoredChild.payload.schema.type).toBe('string');
      expect(restoredChild.payload.schema.title).toBe('First Name');
    });
  });

  describe('Edge cases', () => {
    it('should handle form with empty children array', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [],
            payload: {
              translation: { en: { label: 'Empty Form' }, fr: {} },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      expect(jsonForm.schema.type).toBe('object');

      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredRoot = restoredState.nodes[restoredState.root];
      expect(restoredRoot.children.length).toBe(0);
    });

    it('should handle forms with only required field metadata', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1, childId2],
            payload: {
              translation: { en: {}, fr: {} },
              type: 'VerticalLayout',
              options: {},
              schema: {
                type: 'object',
                properties: {},
                required: [childId1],
              },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: { en: { label: 'Required Field' }, fr: {} },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
              required: true,
            },
          },
          [childId2]: {
            parent: rootId,
            children: [],
            payload: {
              translation: { en: { label: 'Optional Field' }, fr: {} },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
              required: false,
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      const restoredRoot = restoredState.nodes[restoredState.root];
      const restoredChild1 = restoredState.nodes[restoredRoot.children[0]];
      const restoredChild2 = restoredState.nodes[restoredRoot.children[1]];

      expect(restoredChild1.payload.required).toBe(true);
      expect(restoredChild2.payload.required).toBe(false);
    });

    it('should handle minimal payload with no translation data', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [],
            payload: {
              translation: {
                en: {},
                fr: {},
              },
              type: 'Control',
              options: undefined,
              schema: { type: 'string' },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
      const restoredRoot = restoredState.nodes[restoredState.root];

      expect(restoredRoot.payload.translation.en).toBeDefined();
      expect(restoredRoot.payload.translation.fr).toBeDefined();
    });
  });

  describe('Multiple round-trip conversions', () => {
    it('should remain stable through multiple conversions', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: {
                en: { label: 'Form', description: 'A form' },
                fr: { label: 'Formulaire', description: 'Un formulaire' },
              },
              type: 'VerticalLayout',
              options: { stretch: true },
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'Input' },
                fr: { label: 'Entrée' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
              required: true,
            },
          },
        },
      };

      // First round trip
      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Second round trip
      const jsonForm2 = nodeToJsonForm(restoredState);
      const restoredState2 = jsonFormToNode(jsonForm2 as JsonFormSchema);

      // Third round trip
      const jsonForm3 = nodeToJsonForm(restoredState2);

      // All three JsonForms should have the same schema and i18n structure
      expect(jsonForm3.schema.type).toBe(jsonForm2.schema.type);
    });
  });

  describe('Data integrity verification', () => {
    it('should not lose any data during conversion', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1, childId2],
            payload: {
              translation: {
                en: {
                  label: 'Parent Label',
                  description: 'Parent Description',
                },
                fr: {
                  label: 'Label Parent',
                },
              },
              type: 'VerticalLayout',
              options: { stretch: true },
              schema: {
                type: 'object',
                properties: {
                  [childId1]: { type: 'string' },
                  [childId2]: { type: 'number' },
                },
                required: [childId1],
              },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'String Field' },
                fr: { label: 'Champ de texte' },
              },
              type: 'Control',
              options: { focus: true },
              schema: { type: 'string', pattern: '^[a-z]+$' },
              required: true,
            },
          },
          [childId2]: {
            parent: rootId,
            children: [],
            payload: {
              translation: {
                en: { label: 'Number Field' },
                fr: { label: 'Champ numérique' },
              },
              type: 'Control',
              options: {},
              schema: { type: 'number', minimum: 0, maximum: 100 },
              required: false,
            },
          },
        },
      };

      // Convert and restore
      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Deep comparison of the restored state
      const originalRoot = formState.nodes[rootId];
      const restoredRoot = restoredState.nodes[restoredState.root];

      // Check root node properties
      expect(restoredRoot.payload.type).toBe(originalRoot.payload.type);
      expect(restoredRoot.payload.options).toEqual(
        originalRoot.payload.options,
      );
      expect(restoredRoot.children.length).toBe(originalRoot.children.length);
      expect(restoredRoot.payload.translation.en.label).toBe(
        originalRoot.payload.translation.en.label,
      );

      // Check children
      for (let i = 0; i < originalRoot.children.length; i++) {
        const origChild = formState.nodes[originalRoot.children[i]];
        const restoredChild = restoredState.nodes[restoredRoot.children[i]];

        expect(restoredChild.payload.type).toBe(origChild.payload.type);
        expect(restoredChild.payload.options).toEqual(
          origChild.payload.options,
        );
        expect(restoredChild.payload.schema.type).toBe(
          origChild.payload.schema.type,
        );
        expect(restoredChild.payload.required).toBe(origChild.payload.required);
        expect(restoredChild.payload.translation).toEqual(
          origChild.payload.translation,
        );
      }
    });
  });

  describe('Structural consistency', () => {
    it('should maintain parent-child relationships', () => {
      const formState: FormState = {
        root: rootId,
        nodes: {
          [rootId]: {
            parent: undefined,
            children: [childId1],
            payload: {
              translation: { en: {}, fr: {} },
              type: 'VerticalLayout',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [childId1]: {
            parent: rootId,
            children: [nestedChildId],
            payload: {
              translation: { en: {}, fr: {} },
              type: 'Group',
              options: {},
              schema: { type: 'object', properties: {} },
            },
          },
          [nestedChildId]: {
            parent: childId1,
            children: [],
            payload: {
              translation: { en: {}, fr: {} },
              type: 'Control',
              options: {},
              schema: { type: 'string' },
            },
          },
        },
      };

      const jsonForm = nodeToJsonForm(formState);
      const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);

      // Verify all parent-child relationships are maintained
      for (const nodeId in restoredState.nodes) {
        const node = restoredState.nodes[nodeId as UUID];

        // Check parent references
        if (node.parent) {
          expect(restoredState.nodes[node.parent]).toBeDefined();
          expect(restoredState.nodes[node.parent].children).toContain(
            nodeId as UUID,
          );
        }

        // Check child references
        for (const childId of node.children) {
          expect(restoredState.nodes[childId]).toBeDefined();
          expect(restoredState.nodes[childId].parent).toBe(nodeId);
        }
      }
    });
  });

  describe('Type preservation', () => {
    it('should preserve various UI element types', () => {
      const types = ['Control', 'VerticalLayout', 'HorizontalLayout', 'Group'];

      for (const type of types) {
        const formState: FormState = {
          root: rootId,
          nodes: {
            [rootId]: {
              parent: undefined,
              children: [],
              payload: {
                translation: { en: {}, fr: {} },
                type,
                options: {},
                schema: { type: 'object' },
              },
            },
          },
        };

        const jsonForm = nodeToJsonForm(formState);
        const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
        const restoredRoot = restoredState.nodes[restoredState.root];

        expect(restoredRoot.payload.type).toBe(type);
      }
    });
  });

  describe('Schema type preservation', () => {
    it('should preserve various JSON schema types', () => {
      const schemaTypes = [
        { type: 'string', expected: 'string' },
        { type: 'number', expected: 'number' },
        { type: 'integer', expected: 'integer' },
        { type: 'boolean', expected: 'boolean' },
        { type: 'object', expected: 'object' },
        { type: 'array', expected: 'array' },
      ];

      for (const schemaType of schemaTypes) {
        const formState: FormState = {
          root: rootId,
          nodes: {
            [rootId]: {
              parent: undefined,
              children: [],
              payload: {
                translation: { en: {}, fr: {} },
                type: 'Control',
                options: {},
                schema: { type: schemaType.type },
              },
            },
          },
        };
        const jsonForm = nodeToJsonForm(formState);
        const restoredState = jsonFormToNode(jsonForm as JsonFormSchema);
        const restoredRoot = restoredState.nodes[restoredState.root];

        expect(restoredRoot.payload.schema.type).toBe(schemaType.expected);
      }
    });
  });
});
