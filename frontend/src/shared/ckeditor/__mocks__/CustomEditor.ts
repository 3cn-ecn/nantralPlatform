export class CustomEditor {
  static builtinPlugins = []; // Mock this if required

  static defaultConfig = {}; // Mock this if required
  config: unknown;

  constructor(config) {
    this.config = config;
  }

  init() {
    // Simulate initialization
    return Promise.resolve();
  }

  destroy() {
    // Simulate destruction
    return Promise.resolve();
  }
}
