import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPlayPauseButton from '../../components/ui/AnimatedPlayPauseButton';


const playlist = [
    {
      title: 'Lofi Chill',
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Chill Vibes',
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Smooth Jazz',
      uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      cover: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=500&q=80',
    },
  ];
  
  

export default function MusicScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playMode, setPlayMode] = useState<'normal' | 'loop' | 'shuffle'>('normal');

  
  const loadAndPlay = async (index) => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: playlist[index].uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Audio load error:', error);
    }
  };
  
  
  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    })();
  }, []);
  
  useEffect(() => {
    loadAndPlay(currentTrackIndex);
  
    return () => {
      if (sound) {
        sound.unloadAsync(); // ✅ Prevent memory leak
      }
    };
  }, [currentTrackIndex]);  
  

  const togglePlayback = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }

    setIsPlaying((prev) => !prev);
  };

  const skipToNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const skipToPrevious = () => {
    setCurrentTrackIndex((prev) =>
      (prev - 1 + playlist.length) % playlist.length
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.trackTitle}>{playlist[currentTrackIndex].title}</Text>
  
      {/* 🎵 Cover Art */}
      <Image
        source={{ uri: playlist[currentTrackIndex].cover }}
        style={styles.coverArt}
      />
  
      {/* 📝 Playlist Scroll */}
      <FlatList
        data={playlist}
        horizontal
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.playlistScroller}
        renderItem={({ item, index }) => (
            <TouchableOpacity
            style={[
                styles.trackItem,
                currentTrackIndex === index && styles.activeTrack,
            ]}
            onPress={() => setCurrentTrackIndex(index)}
            >
            <Image source={{ uri: item.cover }} style={styles.trackThumbnail} />
            <Text style={styles.trackName} numberOfLines={1}>
                {item.title}
            </Text>
            </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        />

  
      {/* ▶️ Controls */}
      <View style={styles.controls}>
        <Ionicons name="play-skip-back" size={44} color="#888" onPress={skipToPrevious} />
        <AnimatedPlayPauseButton isPlaying={isPlaying} onPress={togglePlayback} />
        <Ionicons name="play-skip-forward" size={44} color="#888" onPress={skipToNext} />
      </View>
    </View>
  );
  
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    trackTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  
    // 🎨 Album Art Style
    coverArt: {
      width: 250,
      height: 250,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
  
    // 🎵 Playlist Scroll (FlatList)
    playlistScroller: {
      paddingVertical: 10,
      marginBottom: 20,
    },
  
    trackItem: {
      alignItems: 'center',
      marginHorizontal: 10,
    },
  
    trackThumbnail: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
  
    trackName: {
      marginTop: 5,
      fontSize: 12,
      textAlign: 'center',
      maxWidth: 70,
      color: '#555',
    },
  
    activeTrack: {
      borderBottomWidth: 2,
      borderColor: '#00bcd4',
    },
  
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
  });
  
  
