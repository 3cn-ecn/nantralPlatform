export class FormStateError extends Error {
  readonly context: Record<string, unknown>;
  readonly nodeId?: string;
  readonly parentId?: string;

  constructor(
    message: string,
    context?: Record<string, unknown>,
    nodeId?: string,
    parentId?: string,
  ) {
    super(message);
    this.name = 'FormStateError';
    this.context = context || {};
    this.nodeId = nodeId;
    this.parentId = parentId;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, FormStateError.prototype);
  }
}

export class FormContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormContextError';
    Object.setPrototypeOf(this, FormContextError.prototype);
  }
}
