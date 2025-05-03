export const songsDB = {};

if (!window.indexedDB) {
    console.error("IndexedDB is not supported.");
} else {
    songsDB.request = indexedDB.open("songs", 1);

    songsDB.request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("songsStorage", {
            keyPath: "id",
            autoIncrement: true,
        });
    };

    songsDB.request.onsuccess = function (event) {
        songsDB.db = event.target.result;
        console.log("Songs DB ready");
    };

    songsDB.ensureDbReady = () =>
        new Promise((resolve) => {
            const interval = setInterval(() => {
                if (songsDB.db) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });

    songsDB.addSong = async function (song) {
        await songsDB.ensureDbReady();
        return new Promise((resolve, reject) => {
            const tx = songsDB.db.transaction("songsStorage", "readwrite");
            const store = tx.objectStore("songsStorage");
            const request = store.add(song);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    };

    songsDB.getAllSongs = async function () {
        await songsDB.ensureDbReady();
        return new Promise((resolve, reject) => {
            const tx = songsDB.db.transaction("songsStorage", "readonly");
            const store = tx.objectStore("songsStorage");
            const songs = [];

            store.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    songs.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(songs);
                }
            };

            store.openCursor().onerror = (e) => reject(e.target.error);
        });
    };
}
songsDB.getSongByFile = async function (lyricsFile) {
    await songsDB.ensureDbReady();
    return new Promise((resolve, reject) => {
        const tx = songsDB.db.transaction("songsStorage", "readonly");
        const store = tx.objectStore("songsStorage");
        const request = store.index('lyricsFile').get(lyricsFile);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = (e) => reject(e.target.error);
    });
};