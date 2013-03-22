const dbName = "memos";
const dbVersion = 1;

var db;
var request = indexedDB.open(dbName,dbVersion);

request.onerror = function(event) {
    console.error("Why didn't you allow my web app to use IndexedDB?!", event);
};
request.onsuccess = function(event) {
    console.log("Database opened ok");
    db = event.target.result;
};

request.onupgradeneeded = function(event) {

    console.log("Running onUpgradeNeeded");

    db = event.target.result;

    if(!db.objectStoreNames.contains("memos")) {

        console.log("Creating objectStore for memos");

        var objectStore = db.createObjectStore("memos", { keyPath: "id", autoIncrement:true });
        objectStore.createIndex("title", "title", { unique: false });

        console.log("Adding sample memos");
        var sampleMemo1 = new Memo();
        sampleMemo1.title = "Welcome Memo";
        sampleMemo1.content = "Lorem ipsum";

        var sampleMemo2 = new Memo();
        sampleMemo2.title = "How to make a delicious sandwich";
        sampleMemo2.content = "Lorem ipsum";

        objectStore.add(sampleMemo1);
        objectStore.add(sampleMemo2);

    }
}

function Memo() {
    this.title = "Untitled Memo";
    this.content = "";
    this.created = Date.now();
    this.modified = Date.now();
}


function listAllMemoTitles(inCallback) {
    console.log("Listing memos...");

    var objectStore = db.transaction("memos").objectStore("memos");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("Found memo #" + cursor.value.id + " - " + cursor.value.title);
            inCallback(null, cursor.value);
            cursor.continue();
        }
    };
}

function saveMemo(inMemo, inCallback) {
    console.log("Saving memo");

    var transaction = db.transaction(["memos"], "readwrite");
    // Do something when all the data is added to the database.
    transaction.oncomplete = function(event) {
        console.log("All done");
    };

    transaction.onerror = function(event) {
       console.error("Error saving memo:", event);
       inCallback({error: event}, null);

    };

    var objectStore = transaction.objectStore("memos");

    inMemo.modified = Date.now();

    var request = objectStore.put(inMemo);
    request.onsuccess = function(event) {
        console.log("Memo saved with id: "+request.result);
        inCallback(null, request.result);

    }
}

function deleteMemo(inId, inCallback) {
    console.log("Deleting memo...");
    var request = db.transaction(["memos"], "readwrite")
        .objectStore("memos")
        .delete(inId);

    request.onsuccess = function(event) {
        console.log("Memo deleted!");
        inCallback();
    };
}

function getMemoById(inId, inCallback) {
    var transaction = db.transaction(["memos"]);
    var objectStore = transaction.objectStore("memos");
    var request = objectStore.get(inId);
    request.onerror = function(event) {
        console.error("Error getting memo:", event);
        inCallback({error: event}, null);
    };
    request.onsuccess = function(event) {
        console.log("Memo retrieved ok", event);
        inCallback(null, request.result);
    };
}




