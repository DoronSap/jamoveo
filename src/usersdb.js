export const demo = {};

if (!window.indexedDB) {
    console.error("The web browser doesn't support IndexedDB.");}

else {
    demo.data = []; // Sample data for the database
    demo.currentId = 1; // Initialize ID counter

    demo.request = indexedDB.open("users", 1); // Open the database

    demo.request.onerror = function (event) {
        console.error("Error creating database:", event.target.error);};

    demo.request.onsuccess = function () {
        demo.db = demo.request.result;
        console.log("Database opened successfully", demo.db);
        demo.initializeIdCounter();};  // Initialize ID counter based on existing data

    demo.request.onupgradeneeded = function (event) {
        demo.db = event.target.result;
        const objectStore = demo.db.createObjectStore("usersStorage", { keyPath: "id" });
        demo.data.forEach((user) => objectStore.add(user));};

    // check that the database is initialized and ready
    demo.ensureDbReady = () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (demo.db) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    };


// Function to initialize the ID counter based on the current highest ID
    demo.initializeIdCounter = function () {
        const objectStore = demo.db.transaction("usersStorage").objectStore("usersStorage");
        let highestId = 0;

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {

                highestId = Math.max(highestId, parseInt(cursor.key));
                cursor.continue();}

            else {

                demo.currentId = highestId + 1;
                console.log("Highest ID:", highestId);
                console.log("Next ID:", demo.currentId);}
        };

        objectStore.openCursor().onerror = function () {
            console.error("Error opening cursor!");}; };

    // Add new user
    demo.addUser = async function (user) {
        await demo.ensureDbReady();
        return new Promise((resolve, reject) => {
            user.id = demo.currentId.toString();
            demo.currentId++;

            const request = demo.db.transaction(["usersStorage"], "readwrite")
                .objectStore("usersStorage").add(user);

            request.onsuccess = function () {
                console.log("adduser(): adding "+ user.id +"st user succeeded");
                resolve(user);};

            request.onerror = function (event) {
                console.error("Error adding new user to the database", event.target.error, user.id);
                reject(event.target.error);};});};

    demo.getUserByUsername = async function (username) {
        await demo.ensureDbReady();

        return new Promise((resolve, reject) => {
            const tx = demo.db.transaction("usersStorage", "readonly");
            const store = tx.objectStore("usersStorage");

            const request = store.openCursor();
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.username === username) {
                        resolve(cursor.value);
                        return;
                    }
                    cursor.continue();
                } else {
                    resolve(null);
                }
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    };
    demo.checkUserCredentials = async function (username, password) {
        const user = await demo.getUserByUsername(username);
        if (user && user.password === password) {
            return user;
        }
        return null;
    };


}