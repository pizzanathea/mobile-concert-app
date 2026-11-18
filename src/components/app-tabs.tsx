import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#0B0B0B"
      indicatorColor="#312407"
      iconColor={{ default: '#A1A1AA', selected: '#FBBF24' }}
      labelStyle={{
        default: { color: '#A1A1AA' },
        selected: { color: '#FBBF24' },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
