const n = 10;
const array = [];

init();

let audioCtx = null;

function stop() {
    container.innerHTML = "";
}

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext || webKitAudioContext || window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}


function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const copy = [...array];
    const moves = bubbleSort(copy);
    animate(moves);
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        makeGreen();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    showBars(move)
    setTimeout(function() {
        animate(moves);
    }, 500);
}

function showBars(move) {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ?  "red" : "blue";
        }
        container.appendChild(bar);
    }
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {
            moves.push({indices: [i - 1, i], type: "comparison"});
            if (array[i - 1] > array[i]) {
                moves.push({indices: [i - 1, i], type: "swap"});
                swapped = true;
                let temp = array[i - 1];
                array[i - 1] = array[i];
                array[i] = temp;
            }
        }
    } while (swapped)
    return moves;
}

function selectionSort(array) {
    const moves = [];
    let i, j, min_idx;
    for (i = 0; i < array.length - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < array.length; j++) {
            moves.push({indices: [j, min_idx], type: "comparison"});
            if (array[j] < array[min_idx]) {
                moves.push({indices: [j, min_idx], type: "swap"});
                min_idx = j;
            }
            let temp = array[min_idx];
            array[min_idx] = array[i];
            array[i] = temp;
        }
    }
    return moves;
}

function makeGreen() {
    var childDivs = document.getElementById("container"),
        subDiv = document.getElementsByClassName("bar");
    
    for (let i = 0; i < subDiv.length; i++) {
        let elem = subDiv[i];
        elem.style.backgroundColor = "green";
    }

}

