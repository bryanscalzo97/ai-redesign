import { Button, ContextMenu, Host, Image } from "@expo/ui/swift-ui";
import { buttonStyle, frame } from "@expo/ui/swift-ui/modifiers";
import * as React from "react";

export function ContextMenuProfileIOS() {
  return (
    <Host matchContents>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            systemImage="person.crop.circle.badge.xmark"
            onPress={() => console.log("Pressed1")}
            label="Hello"
          />
          <Button
            modifiers={[buttonStyle("bordered")]}
            systemImage="heart"
            onPress={() => console.log("Pressed2")}
            label="Love it"
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Image
            systemName="ellipsis"
            size={18}
            modifiers={[frame({ width: 36, height: 18 })]}
          />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
