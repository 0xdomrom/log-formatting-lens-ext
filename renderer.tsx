import { Renderer } from "@k8slens/extensions"
import React from "react"
import { PodLogsMenuItem } from "./src/pod-logs-menu"
import {preferenceStore} from "./src/settings/preference-store";
import { PreferenceHint, SettingsPage} from "./src/settings/settings-page";

type Pod = Renderer.K8sApi.Pod

/**
 *
 * RendererExtension which extends LensRendererExtension runs in Lens' 'renderer' process (NOT 'main' process)
 * main vs renderer <https://www.electronjs.org/docs/tutorial/quick-start#main-and-renderer-processes>
 *
 * LensRendererExtension is the interface to Lens' renderer process. Its api allows you to access, configure,
 * and customize Lens data add custom Lens UI elements, and generally run custom code in Lens' renderer process.
 *
 * To see console statements in 'renderer' process, go to the console tab in DevTools in Lens
 * View > Toggle Developer Tools > Console.
 *
 */
export default class OciImageExtensionRenderer extends Renderer.LensExtension {
  /**
   * onActivate is called when your extension has been successfully enabled.
   */
  onActivate() {
    console.log("lens-multi-pod-logs renderer | activating...");
    preferenceStore.loadExtension(this);
    console.log("lens-multi-pod-logs renderer | activated");
  }


  // Array of objects for extension preferences
  appPreferences = [
    {
      title: "",
      components: {
        Input: () => <SettingsPage />,
        Hint: () => <PreferenceHint />,
      },
    },
  ];


  kubeObjectMenuItems = [
    {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod>) => (
          <PodLogsMenuItem {...props} />
        ),
      },
    },
    {
      kind: "Jobs",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod>) => (
          <PodLogsMenuItem {...props} />
        ),
      },
    },
  ]
}
