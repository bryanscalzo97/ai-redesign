import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" drawable="ic_menu_home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="camera">
        <NativeTabs.Trigger.Label>{t("tabs.scanSpace")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="camera.viewfinder" drawable="ic_menu_camera" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="redesigns">
        <NativeTabs.Trigger.Label>{t("tabs.properties")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="building.2.fill"
          drawable="ic_menu_gallery"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{t("tabs.profile")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="person.fill"
          drawable="ic_menu_manage"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
