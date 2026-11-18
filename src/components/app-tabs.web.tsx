import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Compass, House, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <View
        pointerEvents="none"
        style={[styles.brandOverlay, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.brandContent}>
          <View style={styles.wordmarkMark}>
            <Text style={styles.wordmarkZ}>Z</Text>
          </View>
          <Text style={styles.wordmarkText}>FEST</Text>
        </View>
      </View>
      <TabList style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TabTrigger name="home" href="/" asChild>
          <TabButton icon={House}>Home</TabButton>
        </TabTrigger>
        <TabTrigger name="explore" href="/explore" asChild>
          <TabButton icon={Compass}>Explore</TabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  children?: string;
  icon: LucideIcon;
  isFocused?: boolean;
};

function TabButton({ children, icon: Icon, isFocused, ...props }: TabButtonProps) {
  const color = isFocused ? '#FBBF24' : '#A1A1AA';

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <Icon color={color} size={17} strokeWidth={2} />
      <Text style={[styles.tabLabel, { color }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    maxWidth: 640,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#303030',
    backgroundColor: '#0B0B0B',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingLeft: 100,
  },
  brandOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#303030',
    backgroundColor: '#0B0B0B',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  brandContent: {
    width: '100%',
    maxWidth: 640,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkMark: {
    width: 23,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FBBF24',
    marginRight: 7,
  },
  wordmarkZ: {
    color: '#0B0B0B',
    fontSize: 13,
    fontWeight: '900',
  },
  wordmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  tabButton: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.65,
  },
});
