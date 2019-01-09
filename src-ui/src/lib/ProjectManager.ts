import * as axios from "axios";
import { getAxios } from "src/lib/axiosManager";
import { resolveAllReferences } from "src/lib/swagger";
import { IProject } from "src/types/Project";
import { Spec } from "src/types/swagger";

let config: ProjectManager;

class ProjectManager {
  private resolvedSpecs: { [id: string]: Spec };
  private config: IProject;

  constructor() {
    this.resolvedSpecs = {};
  }

  public async loadConfig(project: string): Promise<string | null> {
    const response = await axios.default.get(`http://localhost:8080/api/v1/projects/${project}`);

    if (!response.data) { return null; }

    this.config = {
      specs: JSON.parse(response.data.specs),
      resources: JSON.parse(response.data.resources),
      getTotalResults: response.data.getTotalResults,
      initialize: response.data.initialize,
      addPageParams: response.data.addPageParams
    };

    this.evalField(this.config, "initialize");
    this.evalField(this.config, "getTotalResults");
    this.evalField(this.config, "addPageParams");

    for (const resource of this.config.resources) {
      this.evalField(resource, "getListItems");
    }

    if (this.config.initialize) {
      this.config.initialize(getAxios());
    }

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

  public getConfig(): IProject {
    return this.config;
  }

  private evalField(object: {}, field?: string) {
    if (!field) { return; }
    if (object[field]) {
      try {
        // tslint:disable:no-eval
        eval(`window.___tempFunction = ${object[field]}`);
        object[field] = (window as any).___tempFunction;
        delete (window as any).___tempFunction;
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const getProjectManager = () => {
  if (!config) {
    config = new ProjectManager();
  }
  return config;
};
