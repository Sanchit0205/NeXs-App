import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

export default function useLocalMusic() {
  const [localTracks, setLocalTracks] = useState<MediaLibrary.Asset[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
          first: 100, // You can increase this
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        });
        setLocalTracks(media.assets);
      } else {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  return { localTracks, hasPermission };
}
