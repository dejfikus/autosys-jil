# jil-highlighter README

Simple (unofficial) syntax highlighter for Autosys Job Information Language (JIL).
This is a copy of outdated JIL extension, I tried to have updates to the official, but never got hold of the guy, so just expanding on existing work.
Original: https://github.com/chnicholas/jil-highlighter

## Features

One feature: provides some highlighting for JIL!

## Requirements

Main syntax definition file is syntaxes\jil.tmLanguage.yaml, but this has to be converted into json for VS Code:
```
npx js-yaml .\syntaxes\jil.tmLanguage.yaml > .\syntaxes\jil.tmLanguage.json
```

## Extension Settings

None.

## Known Issues

None.

-----------------------------------------------------------------------------------------------------------
