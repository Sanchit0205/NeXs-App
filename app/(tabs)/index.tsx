import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';

export default function DashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [shouldAnimate, setShouldAnimate] = useState(true);

  // Listen to focus on tab screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reset animation trigger on focus
      setShouldAnimate(false);
      setTimeout(() => setShouldAnimate(true), 20);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E3F2FD" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Banner */}
        <MotiView
          from={shouldAnimate ? { opacity: 0, translateY: -20 } : undefined}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.welcomeCard}
        >
          <Text style={styles.welcomeTitle}>👋 Welcome back, Sanchit!</Text>
          <Text style={styles.welcomeSubtitle}>
            Here's a quick overview of your productivity tools.
          </Text>
        </MotiView>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.cardRow}>
            {/* Card 1: Tasks */}
            <MotiView
              from={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 200, type: 'timing' }}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => router.push('/(tabs)/task')}>
                <Ionicons name="checkmark-done-circle-outline" size={32} color="#007AFF" />
                <Text style={styles.cardTitle}>Tasks</Text>
              </TouchableOpacity>
            </MotiView>

            {/* Card 2: Music */}
            <MotiView
              from={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 400, type: 'timing' }}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => router.push('/(tabs)/music')}>
                <FontAwesome5 name="music" size={28} color="#FF4081" />
                <Text style={styles.cardTitle}>My Music</Text>
              </TouchableOpacity>
            </MotiView>

            {/* Card 3: AI Tools */}
            <MotiView
              from={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 900, type: 'timing' }}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => router.push('/(tabs)/ai')}>
                <MaterialIcons name="smart-toy" size={32} color="#00C853" />
                <Text style={styles.cardTitle}>AI Tools</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </View>

        {/* Summary Section */}
        <MotiView
          from={shouldAnimate ? { opacity: 0, translateY: 20 } : undefined}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 800, type: 'timing' }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>✅ 3 Tasks scheduled</Text>
            <Text style={styles.summaryText}>🎵 1 Playlist Ready</Text>
            <Text style={styles.summaryText}>🔔 2 Notifications set</Text>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  welcomeCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0D47A1',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
});
