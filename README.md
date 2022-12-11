# log-viewer

```
plugin:
  logs:
    shortCut: Ctrl-L
    confirm: false
    description: "JSON Log"
    scopes:
      - pods
    command: bash
    background: false
    args:
      - -c
      - |
       cd ~/dev/logviewer/app
       node dist/index.js logs $NAMESPACE $NAME
```