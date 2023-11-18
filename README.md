# log-formatting-lens-ext README

The log-formatting-lens-ext provides a bunyan log viewer for Lens. Inspiration came from
the [lens-mutli-pod-logs](https://github.com/andrea-falco/lens-multi-pod-logs) extension.

## Features

This plugin adds a menu item to the Pods menu in Lens.  When clicked, it will open a new terminal with logs formatted using jq.

## Requirements

Install jq globally:

```bash
brew install jq
```

## Installation Instructions

Start the Lens is running, and follow these simple steps:

1. Go to Extensions view (Menu -> File -> Extensions)
2. Enter the name of this extension, `@0xdomrom/log-formatting-lens-ext`
3. Click on the Install button
4. Make sure the extension is enabled (Lens → Extensions)

You may or may not need to refresh (or re-open) Lens for the plugin to render
the menu item. This may be necessary if Lens is already open on the Pods workload.

## Known Issues

On initial install, the log formatting log viewer may not appear in the menu. If this
occurs, refresh Lens and it should appear.
