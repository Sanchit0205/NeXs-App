// app/(tabs)/music.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";



export default function MusicScreen() {
  const [playlists, setPlaylists] = useState<{ [key: string]: any[] }>({});
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const positionInterval = useRef<NodeJS.Timeout | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removeTrackIndex, setRemoveTrackIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPlaylists();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (currentPlaylist && playlists[currentPlaylist]) {
      playSong(playlists[currentPlaylist][currentTrackIndex]);
    }
  }, [currentTrackIndex, currentPlaylist]);

  const loadPlaylists = async () => {
    const stored = await AsyncStorage.getItem("playlists");
    if (stored) setPlaylists(JSON.parse(stored));
  };

  const savePlaylists = async (newPlaylists: any) => {
    await AsyncStorage.setItem("playlists", JSON.stringify(newPlaylists));
  };

  const pickSong = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.assets && result.assets.length > 0 && currentPlaylist) {
      const updated = {
        ...playlists,
        [currentPlaylist]: [...(playlists[currentPlaylist] || []), result.assets[0]],
      };
      setPlaylists(updated);
      savePlaylists(updated);
    }
  };

  const createPlaylist = () => {
    const name = `Playlist-${Object.keys(playlists).length + 1}`;
    const updated = { ...playlists, [name]: [] };
    setPlaylists(updated);
    setCurrentPlaylist(name);
    savePlaylists(updated);
  };

  const playSong = async (track: any) => {
    if (!track || !track.uri) return;

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.uri });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);

    const status = await newSound.getStatusAsync();
    setDuration(status.durationMillis || 0);

    if (positionInterval.current) clearInterval(positionInterval.current);
    positionInterval.current = setInterval(async () => {
      const pos = await newSound.getStatusAsync();
      if (pos.isLoaded) {
        setPosition(pos.positionMillis || 0);
      }
    }, 500);
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const skipTrack = (forward = true) => {
    const tracks = playlists[currentPlaylist || ""];
    if (!tracks || tracks.length === 0) return;

    const nextIndex = forward
      ? (currentTrackIndex + 1) % tracks.length
      : (currentTrackIndex - 1 + tracks.length) % tracks.length;

    setCurrentTrackIndex(nextIndex);
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlaylistLongPress = (name: string) => {
    setSelectedPlaylist(name);
    setRenameInput(name);
    setShowModal(true);
  };

  const handleRename = () => {
    if (!renameInput.trim() || !selectedPlaylist) return;
    const updatedPlaylists = { ...playlists };
    const tracks = updatedPlaylists[selectedPlaylist];
    delete updatedPlaylists[selectedPlaylist];
    updatedPlaylists[renameInput.trim()] = tracks;

    setPlaylists(updatedPlaylists);
    if (currentPlaylist === selectedPlaylist) setCurrentPlaylist(renameInput.trim());
    savePlaylists(updatedPlaylists);
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!selectedPlaylist) return;
    const updatedPlaylists = { ...playlists };
    delete updatedPlaylists[selectedPlaylist];

    if (currentPlaylist === selectedPlaylist) {
      setCurrentPlaylist(null);
      setCurrentTrackIndex(0);
    }

    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
    setShowModal(false);
  };

  const handleTrackLongPress = (index: number) => {
    setRemoveTrackIndex(index);
    setShowRemoveDialog(true);
  };

  const confirmRemoveTrack = () => {
    if (
      removeTrackIndex === null ||
      currentPlaylist === null ||
      !playlists[currentPlaylist]
    )
      return;

    const updatedPlaylist = [...playlists[currentPlaylist]];
    updatedPlaylist.splice(removeTrackIndex, 1);
    const updatedPlaylists = {
      ...playlists,
      [currentPlaylist]: updatedPlaylist,
    };
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);

    if (removeTrackIndex === currentTrackIndex) {
      setCurrentTrackIndex(0);
      sound?.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    } else if (removeTrackIndex < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }

    setShowRemoveDialog(false);
    setRemoveTrackIndex(null);
  };

  const renderPlaylistSelector = () => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 16 }}>
      {Object.keys(playlists).map((name) => (
        <TouchableOpacity
          key={name}
          onPress={() => setCurrentPlaylist(name)}
          onLongPress={() => handlePlaylistLongPress(name)}
          style={[
            styles.playlistButton,
            currentPlaylist === name && { backgroundColor: "#333" },
          ]}
        >
          <Text style={{ color: "#fff" }}>{name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={createPlaylist} style={styles.createButton}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={{ color: "#fff" }}>New Playlist</Text>
      </TouchableOpacity>
    </View>
  );

  const currentTrack =
    currentPlaylist && playlists[currentPlaylist]?.[currentTrackIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎵 NeXs Player</Text>

      {renderPlaylistSelector()}

      {currentPlaylist && (
        <>
          <Text style={styles.trackTitle}>
            {currentTrack?.name || "No track selected"}
          </Text>

          <Slider
            style={{ width: "90%", height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={async (val) => {
              if (sound) await sound.setPositionAsync(val);
            }}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#888"
            thumbTintColor="#1DB954"
          />
          <Text style={{ color: "#ccc", marginBottom: 5 }}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => skipTrack(false)}>
              <Ionicons name="play-skip-back" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={64}
                color="#1DB954"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => skipTrack(true)}>
              <Ionicons name="play-skip-forward" size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={pickSong} style={styles.addButton}>
            <Ionicons name="musical-notes" size={24} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 6 }}>Add Song</Text>
          </TouchableOpacity>

          <FlatList
            data={playlists[currentPlaylist]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setCurrentTrackIndex(index)}
                onLongPress={() => handleTrackLongPress(index)}
                style={styles.trackItem}
              >
                <Text style={{ color: "#fff" }}>{item.name || `Track ${index + 1}`}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Rename/Delete Modal */}
      <Modal visible={showModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Playlist Options</Text>
            <TextInput
              value={renameInput}
              onChangeText={setRenameInput}
              style={styles.input}
              placeholder="Rename Playlist"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleRename} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.modalButton, { backgroundColor: "#c0392b" }]}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={[styles.modalButton, { backgroundColor: "#444" }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Remove Song Confirmation Modal */}
      <Modal visible={showRemoveDialog} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Remove Song</Text>
            <Text style={{ color: "#ddd", marginBottom: 20, textAlign: "center" }}>
              Are you sure you want to remove this song from the playlist?
            </Text>
            <TouchableOpacity
              onPress={confirmRemoveTrack}
              style={[styles.modalButton, { backgroundColor: "#c0392b" }]}
            >
              <Text style={styles.modalButtonText}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRemoveDialog(false)}
              style={[styles.modalButton, { backgroundColor: "#444" }]}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  controls: { flexDirection: "row", alignItems: "center", marginTop: 20, gap: 30 },
  trackTitle: { fontSize: 20, color: "#fff", marginTop: 20 },
  playlistButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 12,
    margin: 5,
  },
  createButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  addButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  trackItem: {
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginVertical: 4,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContainer: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    marginBottom: 10,
  },
  modalButton: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#1DB954",
    marginVertical: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // or your dark background
    paddingTop: Platform.OS === "android" ? 25 : 0, // extra padding for Android status bar
  },  
});
