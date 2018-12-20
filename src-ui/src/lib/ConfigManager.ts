import * as axios from "axios";
import { resolveAllReferences } from "src/lib/swagger";
import { IConfig } from "src/types/config";
import { Spec } from "src/types/swagger";

let config: ConfigManager;

class ConfigManager {
  private resolvedSpecs: { [id: string]: Spec };
  private config: IConfig;

  constructor() {
    this.resolvedSpecs = {};
  }

  public async loadConfig(project: string): Promise<string | null> {
    const response = await axios.default.get(`http://localhost:8080/api/v1/projects/${project}`);

    if (!response.data) { return null; }

    this.config = JSON.parse(response.data.content);

    try {
      Object.keys(this.config.specs).forEach((specId: string) => {
        this.resolvedSpecs[specId] = resolveAllReferences(this.config.specs[specId]);
      });
    } catch (e) {
      return e.message;
    }

    return null;
  };

  public getResolvedSpecs(): { [id: string]: Spec } {
    return this.resolvedSpecs;
  }

  public getResolvedSpec(specId: string): Spec {
    return this.resolvedSpecs[specId];
  }

  public getResource(resourceId: string) {
    return this.config.resources.find(resource => resource.id === resourceId);
  }

  public getResources() {
    return this.config.resources;
  }

  public getConfig(): IConfig {
    return this.config;
  }
}

export const getConfigManager = () => {
  if (!config) {
    config = new ConfigManager();
  }
  return config;
};
