import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#fff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: isDark ? '#000' : '#ccc',
          paddingBottom: 6,
          height: 62,
        },
        tabBarActiveTintColor: isDark ? '#00e6cf' : '#007aff',
        tabBarInactiveTintColor: isDark ? '#666' : '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'task':
              iconName = 'calendar-outline';
              break;
            case 'ToDoListScreen':
              iconName = 'checkbox-outline';
              break;
            case 'music':
              iconName = 'musical-notes';
              break;
            case 'aichat':
              iconName = 'chatbubble-ellipses-outline';
              break;
            case 'settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return (
            <Animatable.View
              animation={focused ? 'pulse' : undefined}
              duration={500}
              useNativeDriver
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name={iconName} size={size} color={color} />
            </Animatable.View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="task" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="ToDoListScreen" options={{ title: 'ToDo' }} />
      <Tabs.Screen name="music" options={{ title: 'Music' }} />
      <Tabs.Screen name="aichat" options={{ title: 'AI Chat' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
