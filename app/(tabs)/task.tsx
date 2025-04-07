import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification } from '../../utils/notificationHelper';

export default function TaskScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingId, setEditingId] = useState(null);

  const TASKS_KEY = '@tasks';

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const saveTasks = async (tasksToSave) => {
    try {
      const jsonValue = JSON.stringify(tasksToSave);
      await AsyncStorage.setItem(TASKS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
      if (jsonValue != null) {
        setTasks(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading tasks:', e);
    }
  };

  const handleAddTask = async () => {
    if (!task) {
      Alert.alert('Task Required', 'Please enter a task before adding.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Date Required', 'Please select a date from the calendar.');
      return;
    }

    const formattedTime = selectedTime.toTimeString().slice(0, 5); // "HH:mm"
    const dateTime = new Date(`${selectedDate}T${formattedTime}`);

    if (editingId) {
      const updated = tasks.map((item) =>
        item.id === editingId
          ? {
              ...item,
              text: task,
              date: selectedDate,
              time: formattedTime,
            }
          : item
      );
      setTasks(updated);
      setEditingId(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        date: selectedDate,
        time: formattedTime,
      };
      setTasks([...tasks, newTask]);
      await scheduleNotification('Reminder', `Task: ${task}`, dateTime);
    }

    setTask('');
    setSelectedDate('');
  };

  const handleTimeChange = (event, selected) => {
    const currentTime = selected || selectedTime;
    setShowPicker(Platform.OS === 'ios');
    setSelectedTime(currentTime);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleEdit = (item) => {
    setTask(item.text);
    setSelectedDate(item.date);
    const [hours, minutes] = item.time.split(':');
    const editTime = new Date();
    editTime.setHours(parseInt(hours), parseInt(minutes));
    setSelectedTime(editTime);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this task?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const updatedTasks = tasks.filter((item) => item.id !== id);
          setTasks(updatedTasks);
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Task & Reminder Manager</Text>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{ [selectedDate]: { selected: true } }}
          theme={{
            selectedDayBackgroundColor: '#2196F3',
            todayTextColor: '#2196F3',
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your task"
          value={task}
          onChangeText={setTask}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.timeButton} onPress={() => setShowPicker(true)}>
          <Text style={styles.timeText}>
            Select Time: {selectedTime.toTimeString().slice(0, 5)}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Button title={editingId ? 'Update Task' : 'Add Task'} onPress={handleAddTask} />

        <FlatList
          data={tasks.filter((item) => item.date === selectedDate)}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            selectedDate ? (
              <Text style={{ textAlign: 'center', marginTop: 10, color: '#999' }}>
                No tasks for this date.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.timeInfo}>
                📅 {item.date} 🕒 {item.time}
              </Text>
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0D47A1',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    borderColor: '#2196F3',
    backgroundColor: '#e6f0ff',
    color: '#000',
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 6,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
  },
  timeInfo: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
