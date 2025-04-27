import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AiScreen() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'NeX', content: "Hello, I'm NeX! Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), sender: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch("https://your-backend.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const reply = data.reply || 'Something went wrong.';

      setMessages([
        ...updatedMessages,
        { id: Date.now().toString() + '-ai', sender: 'NeX', content: reply },
      ]);
    } catch (error) {
      console.error("Error contacting backend:", error);
      setMessages([
        ...updatedMessages,
        { id: Date.now().toString() + '-error', sender: 'NeX', content: '🚨 Error connecting to server.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.header}>AI Chat</Text>

        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={item.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />

        {isTyping && <Text style={styles.typing}>NeX is typing...</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#ccc"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  chatContainer: { flex: 1, justifyContent: 'flex-end' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ffffff',
    marginTop: Platform.OS === 'android' ? 35 : 0,
  },
  messagesContainer: { padding: 16 },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a73e8',
    padding: 10,
    borderRadius: 20,
    marginVertical: 4
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 20,
    marginVertical: 4
  },
  messageText: { color: 'white' },
  typing: { fontStyle: 'italic', color: '#888', padding: 10 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#444',
    padding: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    color: 'white',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#1a73e8',
    borderRadius: 20
  },
});
