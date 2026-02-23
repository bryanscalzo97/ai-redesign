import { Button, ContextMenu } from "@expo/ui/jetpack-compose";
import * as React from "react";

export function ContextMenuProfileAndroid() {
  return (
    <ContextMenu
      style={{
        width: 150,
        height: 50,
      }}
    >
      <ContextMenu.Items>
        <Button
          leadingIcon="outlined.Person"
          onPress={() => console.log("Pressed1")}
        >
          Hello
        </Button>

        <Button
          variant="bordered"
          leadingIcon="outlined.Add"
          onPress={() => console.log("Pressed2")}
        >
          Love it
        </Button>
      </ContextMenu.Items>
      <ContextMenu.Trigger>
        <Button variant="elevated" leadingIcon="outlined.MoreVert">
          {""}
        </Button>
      </ContextMenu.Trigger>
    </ContextMenu>
  );
}
