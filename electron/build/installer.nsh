; Custom NSIS include (electron-builder) — widoczne checkboxy skrótów: pulpit + menu Start.
; Obie domyślnie ZAZNACZONE. Strona pojawia się po wyborze katalogu instalacji.
; electron-builder dostarcza w kontekście: nsDialogs, LogicLib, MUI2, WinMessages,
; oraz definicje PRODUCT_NAME i APP_EXECUTABLE_FILENAME.

Var UW_DeskCB
Var UW_MenuCB
Var UW_DeskState
Var UW_MenuState

!macro customPageAfterChangeDir
  Page custom uwShortcutsPageCreate uwShortcutsPageLeave
!macroend

Function uwShortcutsPageCreate
  !insertmacro MUI_HEADER_TEXT "Skróty" "Wybierz, gdzie utworzyć skróty do gry."
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 22u "Gdzie utworzyć skróty do Trap Simulator?"
  Pop $1
  ${NSD_CreateCheckbox} 0 30u 100% 14u "Utwórz skrót na pulpicie"
  Pop $UW_DeskCB
  ${NSD_Check} $UW_DeskCB
  ${NSD_CreateCheckbox} 0 50u 100% 14u "Utwórz skrót w menu Start"
  Pop $UW_MenuCB
  ${NSD_Check} $UW_MenuCB
  nsDialogs::Show
FunctionEnd

Function uwShortcutsPageLeave
  ${NSD_GetState} $UW_DeskCB $UW_DeskState
  ${NSD_GetState} $UW_MenuCB $UW_MenuState
FunctionEnd

!macro customInstall
  ${If} $UW_DeskState == ${BST_CHECKED}
    CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  ${EndIf}
  ${If} $UW_MenuState == ${BST_CHECKED}
    CreateDirectory "$SMPROGRAMS\${PRODUCT_NAME}"
    CreateShortcut "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  ${EndIf}
!macroend

!macro customUnInstall
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\${PRODUCT_NAME}\${PRODUCT_NAME}.lnk"
  RMDir "$SMPROGRAMS\${PRODUCT_NAME}"
!macroend
