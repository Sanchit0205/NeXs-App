import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Switch,
  useColorScheme,
} from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const scheme = useColorScheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'You have been logged out.');
    // Add logout logic here
  };

  const handleSendFeedback = () => {
    Linking.openURL('mailto:feedback@nexs.app?subject=App Feedback');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://your-privacy-policy-url.com');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implement dark mode state app-wide using context or theme provider
  };

  const isDark = isDarkMode || scheme === 'dark';
  const themeStyles = styles(isDark);

  return (
    <SafeAreaView style={themeStyles.safeArea}>
      <ScrollView contentContainerStyle={themeStyles.container}>
        <Text style={themeStyles.title}>Settings</Text>

        <View style={themeStyles.option}>
          <Text style={themeStyles.optionText}>App Version</Text>
          <Text style={themeStyles.optionValue}>1.0.0</Text>
        </View>

        <View style={themeStyles.option}>
          <Text style={themeStyles.optionText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            thumbColor={isDarkMode ? '#fff' : '#000'}
          />
        </View>

        <TouchableOpacity style={themeStyles.option} onPress={handleSendFeedback}>
          <Text style={themeStyles.optionText}>Send Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={themeStyles.option} onPress={handlePrivacyPolicy}>
          <Text style={themeStyles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={themeStyles.option}>
          <Text style={themeStyles.optionText}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={themeStyles.option} onPress={handleLogout}>
          <Text style={[themeStyles.optionText, { color: '#ff3b30' }]}>Logout</Text>
        </TouchableOpacity>

        <View style={[themeStyles.option, { marginTop: 20 }]}>
          <Text style={themeStyles.optionText}>Developer</Text>
          <Text style={themeStyles.optionValue}>Sanchit Chavan</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (dark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: dark ? '#121212' : '#f2f2f2',
      paddingTop: StatusBar.currentHeight || 0,
    },
    container: {
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 30,
      color: dark ? '#fff' : '#333',
    },
    option: {
      backgroundColor: dark ? '#1e1e1e' : '#fff',
      paddingVertical: 18,
      paddingHorizontal: 15,
      borderRadius: 12,
      marginBottom: 15,
      elevation: 2,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '500',
      color: dark ? '#fff' : '#333',
    },
    optionValue: {
      fontSize: 14,
      color: dark ? '#bbb' : '#888',
      marginTop: 5,
    },
  });
