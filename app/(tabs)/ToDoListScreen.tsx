import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  task: string;
  completed: boolean;
}

const ToDoListScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      task,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    setTask('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks.', e);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem('tasks');
      if (data) setTasks(JSON.parse(data));
    } catch (e) {
      console.error('Failed to load tasks.', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.heading}>To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add your task"
          placeholderTextColor="#888"
          value={task}
          onChangeText={setTask}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Ionicons
                name={item.completed ? 'checkbox' : 'square-outline'}
                size={24}
                color="#00ffcc"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedTask,
              ]}
            >
              {item.task}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#ff6666" />
            </TouchableOpacity>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default ToDoListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#00ffcc',
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '600',
  },
  taskItem: {
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  taskText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
