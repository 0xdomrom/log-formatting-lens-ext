import { Common } from "@k8slens/extensions";
import { observable, makeObservable } from "mobx";

export type MultiPodLogsSternPreferenceModel = {
  maxLogRequests: number;
  builtInTemplate: string;
  customTemplate: string;
};

export class PreferencesStore extends Common.Store
  .ExtensionStore<MultiPodLogsSternPreferenceModel> {
  // Store properties
  @observable maxLogRequests = 300;
  @observable builtInTemplate = "";
  @observable customTemplate = "";

  constructor() {
    super({
      // Store name
      configName: "stern-preference-store",
      // Store default property values
      defaults: {
        maxLogRequests: 300,
        builtInTemplate: "default",
        customTemplate: "",
      },
    });
    makeObservable(this);
  }

  protected fromStore({
    maxLogRequests,
    builtInTemplate,
    customTemplate,
  }: MultiPodLogsSternPreferenceModel): void {
    this.maxLogRequests = maxLogRequests;
    this.builtInTemplate = builtInTemplate;
    this.customTemplate = customTemplate;
  }

  toJSON(): MultiPodLogsSternPreferenceModel {
    return {
      maxLogRequests: this.maxLogRequests,
      builtInTemplate: this.builtInTemplate,
      customTemplate: this.customTemplate,
    };
  }
}

export const preferenceStore = new PreferencesStore();
