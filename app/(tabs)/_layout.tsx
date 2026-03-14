import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" drawable="ic_menu_home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="camera">
        <NativeTabs.Trigger.Label>Scan Room</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="camera.viewfinder" drawable="ic_menu_camera" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="redesigns">
        <NativeTabs.Trigger.Label>Redesigns</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="photo.fill.on.rectangle.fill"
          drawable="ic_menu_gallery"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="person.fill"
          drawable="ic_menu_manage"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
