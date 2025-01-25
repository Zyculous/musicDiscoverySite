export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MusicDiscoveryDB', 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('playlists')) {
        db.createObjectStore('playlists', { keyPath: 'id' });
      }
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onerror = event => {
      reject(event.target.error);
    };
  });
}

export function getPlaylists() {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['playlists'], 'readonly');
      const objectStore = transaction.objectStore('playlists');
      const request = objectStore.getAll();

      request.onsuccess = event => {
        resolve(event.target.result);
      };

      request.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}

export function savePlaylists(playlists) {
  return openDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['playlists'], 'readwrite');
      const objectStore = transaction.objectStore('playlists');

      playlists.forEach(playlist => {
        objectStore.put(playlist);
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = event => {
        reject(event.target.error);
      };
    });
  });
}
