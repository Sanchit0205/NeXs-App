import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isPlaying: boolean;
  onPress: () => void;
};

export default function AnimatedPlayPauseButton({ isPlaying, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animate();
  }, [isPlaying]);

  return (
    <Pressable onPress={() => {
      onPress();
      animate();
    }}>
      <Animated.View style={[styles.button, { transform: [{ scale }] }]}>
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={60}
          color="#1DB954"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
