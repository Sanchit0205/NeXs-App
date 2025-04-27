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
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShouldAnimate(false);
      setTimeout(() => setShouldAnimate(true), 20);
      fetchUpcomingTasks(); // refresh on focus
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUpcomingTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('@tasks');
      if (stored) {
        const parsed = JSON.parse(stored);

        const now = new Date();
        const futureTasks = parsed
          .map((task) => {
            const dateTime = new Date(`${task.date} ${task.time}`);
            return { ...task, dateTime };
          })
          .filter((t) => t.dateTime > now)
          .sort((a, b) => a.dateTime - b.dateTime)
          .slice(0, 3);

        setUpcomingTasks(futureTasks);
      }
    } catch (e) {
      console.error('Error loading tasks:', e);
    }
  };

  useEffect(() => {
    fetchUpcomingTasks();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
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

        {/* Upcoming Tasks */}
        <MotiView
          from={shouldAnimate ? { opacity: 0, translateY: 20 } : undefined}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000, type: 'timing' }}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>⏳ Upcoming Tasks</Text>
          {upcomingTasks.length === 0 ? (
            <Text style={{ color: '#777', marginTop: 10 }}>No upcoming tasks.</Text>
          ) : (
            upcomingTasks.map((task, index) => (
              <View
                key={task.id}
                style={[
                  styles.summaryCard,
                  { marginBottom: index !== upcomingTasks.length - 1 ? 10 : 0 }, // 10px space except last item
                ]}
              >
                <Text style={styles.summaryText}>📝 {task.text}</Text>
                <Text style={styles.summaryText}>
                  📅 {task.date} | 🕒 {task.time}
                </Text>
              </View>
            ))
            
          )}
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
  },
  welcomeCard: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#BBBBBB',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#eeeeee',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    backgroundColor: '#1F1F1F',
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
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#E0E0E0',
  },
});

