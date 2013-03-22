console.log("Loading app.js");

var listView, detailView, currentMemo;

function showMemoDetail(inMemo) {
    currentMemo = inMemo;
    displayMemo();
    listView.classList.add("hidden");
    detailView.classList.remove("hidden");
}

function displayMemo() {
    document.getElementById("memo-title").value = currentMemo.title;
    document.getElementById("memo-content").value = currentMemo.content;
    var elem1 = document.getElementById("memo-content");
    var style = window.getComputedStyle(elem1, null);
    console.log("style", style.height, style.width);

}

function textChanged(e) {
    console.log("text change!",e);
    currentMemo.title = document.getElementById("memo-title").value;
    currentMemo.content = document.getElementById("memo-content").value;
    saveMemo(currentMemo, function(err, succ) {
        console.log("callback", err, succ);
        if (!err) {
            currentMemo.id = succ;
        }
    });
}

function newMemo() {
    var newMemo = new Memo();
    showMemoDetail(newMemo);
}

function deleteCurrentMemo() {
    deleteMemo(currentMemo.id, function(err, succ) {
        console.log("callback from delete", err, succ);
        if (!err) {
            showMemoList();
        }
    })
}

function showMemoList() {
    currentMemo = null;
    refreshMemoList();
    listView.classList.remove("hidden");
    detailView.classList.add("hidden");
}


function refreshMemoList() {
    console.log("Refreshing memo list");

    var memoListContainer = document.getElementById("memoList");


    while (memoListContainer.hasChildNodes()) {
        memoListContainer.removeChild(memoListContainer.lastChild);
    }

    var memoList = document.createElement("ul");
    memoListContainer.appendChild(memoList);

    listAllMemoTitles(function(err, value) {
        var memoItem = document.createElement("li");
        var memoP = document.createElement("p");
        var memoTitle = document.createTextNode(value.title);

        memoItem.addEventListener("click", function(e) {
            console.log("clicked memo #" + value.id);
            showMemoDetail(value);

        });

        memoP.appendChild(memoTitle);
        memoItem.appendChild(memoP);
        memoList.appendChild(memoItem);


    });
}


window.onload = function() {
    listView = document.getElementById("memo-list");
    detailView = document.getElementById("memo-detail");

    document.getElementById("back-to-list").addEventListener("click", showMemoList);
    document.getElementById("new-memo").addEventListener("click", newMemo);
    document.getElementById("delete-memo").addEventListener("click", deleteCurrentMemo);
    document.getElementById("memo-content").addEventListener("input", textChanged);
    document.getElementById("memo-title").addEventListener("input", textChanged);

    refreshMemoList();
}
