
let array = [];
let arraySize = document.querySelector('#size_input');
const minSize = 10;
let size = minSize;


// Event listener to update the bars on the UI
function updateSize() {
    console.log(arraySize.value, typeof(arraySize.value));
    const n = minSize + parseInt(arraySize.value);
    init(n);
}
init(minSize);
arraySize.addEventListener('input', updateSize);

let delay = 260;

// Selecting speed slider from DOM
let delayElement = document.querySelector('#speed_input');

// Event listener to update delay time 
delayElement.addEventListener('input', function(){
    console.log(delayElement.value, typeof(delayElement.value));
    delay = 320 - parseInt(delayElement.value);
});

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


function init(newSize) {
    array = [];
    for (let i = 0; i < newSize; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const choice = determineChoice();
    //disableInput();
    const copy = [...array];
    const moves = choice(copy, copy.length);
    animate(moves);
    //enableInput();
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
    }, delay);
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

function bubbleSort(array, n) {
    const moves = [];
    let swapped = false;
    do {
        swapped = false;
        for (let i = 1; i < n; i++) {
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

function selectionSort(array, n) {
    const moves = [];
    let i, j, min_idx;
    min_idx = 0;
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++) {
            moves.push({indices: [min_idx, j], type: "comparison"});
            if (array[j] < array[min_idx]) {
                min_idx = j;
            }
        }
        moves.push({indices: [i, min_idx], type: "swap"});
        let temp = array[min_idx];
        array[min_idx] = array[i];
        array[i] = temp;
        console.log(array);
    }
    console.log(array);
    return moves;
}


function insertionSort(arr, n) {
    const moves = [];
    let i, key, j;  
{  
    let i, key, j;  
    for (i = 1; i < n; i++) 
    {  
        key = arr[i];  
        j = i - 1;  
  
        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        moves.push({indices: [j, key], type: "comparison"});
        while (j >= 0 && arr[j] > key) 
        {  
            arr[j + 1] = arr[j];
            moves.push({indices: [j + 1, j], type: "swap"});  
            j = j - 1;  
        }  
        arr[j + 1] = key;
        moves.push({indices: [j + 1, key], type: "swap"});  
    }  
}  
    return moves;
}

function mergeSort(array, n) {
    sort(array, 0, n - 1);
}

function sort(arr, left, right) {
    if (left >= right) {
        return;
    }
    
    // Middle index to create subarray halves
    let middle = left + parseInt((right - left) / 2);
    
    // Apply mergeSort to both the halves
    sort(arr, left, middle);
    sort(arr, middle + 1, right);
    
    // Merge both sorted parts
    merge(arr, left, middle, right);
}

function merge(arr, left, middle, right) {
    
    // Length of both sorted aub arrays
    let l1 = middle - left + 1;
    let l2 = right - middle;
    // Create new subarrays
    let arr1 = new Array(l1);
    let arr2 = new Array(l2);
    
    // Assign values in subarrays
    for (let i = 0; i < l1; ++i) {
        arr1[i] = arr[left + i];
    }
    for (let i = 0; i < l2; ++i) {
        arr2[i] = arr[middle + 1 + i];
    }

    // To travesrse and modify main array
    let i = 0,
        j = 0,
        k = left;
        
    // Assign the smaller value for sorted output
    while (i < l1 && j < l2) {
        if (arr1[i] < arr2[j]) {
            arr[k] = arr1[i];
            ++i;
        } else {
            arr[k] = arr2[j];
            j++;
        }
        k++;
    }
    // Update the remaining elements
    while (i < l1) {
        arr[k] = arr1[i];
        i++;
        k++;
    }
    while (j < l2) {
        arr[k] = arr2[j];
        j++;
        k++;
    }
}

function quickSort(array, n) {

}

function heapSort(array, n) {

}






function makeGreen() {
    let childDivs = document.getElementById("container"),
        subDiv = document.getElementsByClassName("bar");
    
    for (let i = 0; i < subDiv.length; i++) {
        let elem = subDiv[i];
        elem.style.backgroundColor = "green";
    }

}

function determineChoice() {
    const choice = document.getElementById("SortingAlgoChoice");

    switch (choice.value) {
        case "Selection Sort":
            return selectionSort;
        case "Insertion Sort":
            return insertionSort;
        case "Merge Sort":
            return mergeSort;
        case "Quick Sort":
            return quickSort;
        case "Heap Sort":
            return heapSort;
        default:
            return bubbleSort;
    }
}

function disableInput() {
    document.getElementById("size_input").disabled = true;
    document.getElementById("init").disabled = true;
    document.getElementById("SortingAlgoChoice").disabled = true;
}

function enableInput() {
    document.getElementById("init").disabled = false;
    document.getElementById("size_input").disabled = false;
    document.getElementById("SortingAlgoChoice").disabled = false;
}