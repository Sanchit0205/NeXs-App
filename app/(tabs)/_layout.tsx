import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'task':
              iconName = 'checkbox-outline';
              break;
            case 'music':
              iconName = 'musical-notes';
              break;
            case 'settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="task" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="music" options={{ title: 'Music' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
