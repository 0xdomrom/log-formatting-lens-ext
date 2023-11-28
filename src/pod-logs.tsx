import React from "react"
import { Common, Renderer } from "@k8slens/extensions"
import {preferenceStore} from "./settings/preference-store";

const {
  Component: { MenuItem, Icon, SubMenu, StatusBrick },
  Navigation,
} = Renderer

type Pod = Renderer.K8sApi.Pod

export class PodLogs {

  /**
   * Get the container name list by a list of pods.
   *
   * @param podList
   * @returns a set, without duplicates
   */
  public static getContainersByPodList(pod: Pod): Set<string> {
    const containerNameList: Set<string> = new Set()
    const containers = pod.getContainers()
    for (let j = 0; j < containers.length; j++) {
      containerNameList.add(containers[j].name)
    }

    return containerNameList
  }

  /**
   * Construct the menu voices.
   *
   * @param props
   * @param containerNames
   * @param resourceNs
   * @param resourceName
   * @param resourceTitle
   * @returns the MenuItem to show in Lens
   */
  public static uiMenu(
    props: any,
    containerNames: Set<string>,
    resourceNs: string,
    resourceName: string,
    resourceTitle: string
  ) {
    return (
      <MenuItem
        onClick={Common.Util.prevDefault(() =>
          this.podLogs(resourceNs, resourceName, resourceTitle, Array.from(containerNames)?.slice(-1)[0], "ob")
        )}
      >
        <Icon
          material="subject"
          interactive={props.toolbar}
          tooltip="Formatted logs"
        />
        <span className="title">Formatted logs</span>
        {
          containerNames.size >= 1 && (
            <>
              <Icon material="keyboard_arrow_right" />
              <SubMenu>
                {Array.from(containerNames).map((containerName) => {
                  return (
                    <MenuItem
                      key={`ob_${containerName}`}
                      onClick={Common.Util.prevDefault(() =>
                        this.podLogs(
                          resourceNs,
                          resourceName,
                          resourceTitle,
                          containerName,
                          "ob"
                        )
                      )}
                    >
                      <StatusBrick />
                      <span>{`ob_${containerName}`}</span>
                    </MenuItem>
                  )
                })
                }
                {Array.from(containerNames).map((containerName) => {
                  return (
                    <MenuItem
                      key={`ws_${containerName}`}
                      onClick={Common.Util.prevDefault(() =>
                        this.podLogs(
                          resourceNs,
                          resourceName,
                          resourceTitle,
                          containerName,
                          "ws"
                        )
                      )}
                    >
                      <StatusBrick />
                      <span>{`ws_${containerName}`}</span>
                    </MenuItem>
                  )
                })
                }
              </SubMenu>
            </>
          )
        }
      </MenuItem>
    )
  }
  public static wsMenu(
    props: any,
    containerNames: Set<string>,
    resourceNs: string,
    resourceName: string,
    resourceTitle: string
  ) {
    return (
      <MenuItem
        onClick={Common.Util.prevDefault(() =>
          this.podLogs(resourceNs, resourceName, resourceTitle, Array.from(containerNames)?.slice(-1)[0], "ws")
        )}
      >
        <Icon
          material="subject"
          interactive={props.toolbar}
          tooltip="WS Formatted logs"
        />
        <span className="title">WS Formatted logs</span>
        {
          containerNames.size >= 1 && (
            <>
              <Icon material="keyboard_arrow_right" />
              <SubMenu>
                {Array.from(containerNames).map((containerName) => {
                  return (
                    <MenuItem
                      key={`ws_${containerName}`}
                      onClick={Common.Util.prevDefault(() =>
                        this.podLogs(
                          resourceNs,
                          resourceName,
                          resourceTitle,
                          containerName,
                          "ws"
                        )
                      )}
                    >
                      <StatusBrick />
                      <span>{`ws_${containerName}`}</span>
                    </MenuItem>
                  )
                })}
              </SubMenu>
            </>
          )
        }
      </MenuItem>
    )
  }

  private static podLogs(
    resourceNs: string,
    resourceName: string,
    resourceTitle: string,
    containerName?: string,
    formatStyle?: string
  ) {
    let formattingOptions;

    const commandStart = "jq -R -r '. as $line | try (fromjson | \"";

    if (formatStyle == "ob") {
      formattingOptions = "\\(.[\"syslog.timestamp\"]) \\(.[\"syslog.severity\"] | if . == \"INFO\" then \"\\u001b[32m\\(.)\\u001b[0m\" else \"\\u001b[31m\\(.)\\u001b[0m\" end)\\t\\(.[\"logger.name\"])\\t\\(.[\"logger.method_name\"])\\t\\(.message)"
    } else {
      formattingOptions = "\\(.[\"timestamp\"]) \\(.[\"level\"] | if [[ . == \"info\" | . == \"debug\" ]] then \"\\u001b[32m\\(.)\\u001b[0m\" else \"\\u001b[31m\\(.)\\u001b[0m\" end)\\t\\(.[\"filename\"])\\t\\(.message)"
    }

    const commandEnd = "\") catch $line'";

    // Generate log command with jq
    const cmd = `kubectl logs -f -n ${resourceNs} ${resourceName} -c ${containerName} --tail=${preferenceStore.maxLogRequests || 300} | ${commandStart}${formattingOptions}${commandEnd}`;

    // Open new terminal
    this.openTerminal(
      `${resourceTitle}: ${resourceName}:${containerName} | Formatted logs`,
      cmd
    )
  }

  private static openTerminal(title: string, command: string) {
    const tab = Renderer.Component.createTerminalTab({
      title: title,
    })

    Renderer.Component.terminalStore.sendCommand(command, {
      enter: true,
      tabId: tab.id,
    })

    Renderer.Navigation.hideDetails()
  }
}
