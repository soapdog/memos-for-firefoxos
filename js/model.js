/**
 * The memo app stores its data using localStorage.
 */

/**
 * This memo function is used to create new memos.
 * @constructor
 */

function Memo() {
    this.title = "Untitled Memo";
    this.content = "";
    this.created = Date.now();
    this.modified = Date.now();
}

/**
 * This function will load all memos and fire its callback routine for each
 * memo loaded.
 * @public
 * @param {Function} [inCallback]
 */
function listAllMemoTitles(inCallback) {
    var memosList = getMemos();

    memosList.forEach(inCallback);
}

/**
 * Update localStorage
 * @public
 * @param {Object} [inMemo]
 */
function saveMemo(inMemo) {
    var memosList = getMemos();

    // save inMemo in memosList array
    if (memosList.length && isMemoPresent(memosList, inMemo.created) ) {
        memosList.some(function (element) {
                    if (element.created === inMemo.created) {
                        element.title = inMemo.title;
                        element.content = inMemo.content;
                        element.modified = inMemo.modified;
                    }
            return element.created === inMemo.created;
        });
    }
    else {
        memosList.push(inMemo);
    }
    
    // save to localStorage
    localStorage.setItem("memosList", JSON.stringify(memosList));
}

/**
 * This function is used to remove a memo from the database. The only way to delete
 * a memo in this app is by using the trash button in the memo editing screen.
 * @public
 * @param {Number} [inId] Memo.created
 */
function deleteMemo(inId) {
    var memosList = getMemos(); // get stored memoList

    //filtered memoList
    var filteredList = memosList.filter(function (element) {
        return element.created !== inId;
    });

    // localStorage update
    localStorage.setItem("memosList", JSON.stringify(filteredList));
}


/**
 * Get memosList
 * @private
 * @return [Array] memosList
 */
 function getMemos () {
    return JSON.parse(localStorage.getItem("memosList")) || [];
 }
 /**
  *checks if Memo present in the localStorage
  *@private
  *@param {Array} [Memoslist] Memos Array
  *@param {Number} [Memo.created] Id to find match
  *@return {Boolean} retruns true if present , false if its not present 
  */
 function isMemoPresent (memosList, createdId) {

    var isMemoObject = memosList.some(function (element) {
        return element.created === createdId;
    });

    return isMemoObject;
 }