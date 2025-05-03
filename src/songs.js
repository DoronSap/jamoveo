import hey_jude from './songsData/hey_jude.json';
import veech_shelo from './songsData/veech_shelo.json';
import { songsDB } from './songsdb';

export async function seedSongsOnce() {

    await songsDB.ensureDbReady();

    const existingSongs = await songsDB.getAllSongs();

    // Only seed if the DB is empty
    if (existingSongs.length === 0) {
        await songsDB.addSong({
            title: "Hey Jude",
            heb_title: "היי ג'וד",
            artist: "The Beatles",
            lyrics: hey_jude,
        });

        await songsDB.addSong({
            title: "Veech Shelo",
            heb_title: "ואיך שלא",
            artist: "Ariel Zilber",
            lyrics: veech_shelo,
        });

        console.log("Songs seeded into DB.");
    } else {
        console.log("Songs already exist. Skipping seed.");
    }
}
