'use strict'

console.log("aa")

// AudioContextの作成
const audioContext = new AudioContext();
let audioSource = audioContext.createBufferSource();
audioSource.loop = true;

//任意のwavファイルを再生させる関数
function playAudio(audioFileURL) {
    // AudioContextの作成
    const audioContext = new AudioContext();

    // Fetch APIを使用してwavファイルを取得する
    fetch(audioFileURL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
            // 取得したデータをデコードする
            return audioContext.decodeAudioData(arrayBuffer);
        })
        .then(audioBuffer => {
            // AudioBufferSourceNodeを作成する
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            // 再生する
            source.connect(audioContext.destination);
            source.start(0);
            osc.stop(time + 0.03);
        })
        .catch(error => console.error(error));

}
// -------------------------------------------------

let bpm = 120;
let interval = (60 / bpm) * 1000;
let nextTickTime = 0;
let isRunning = false; // メトロノームの状態を追跡する変数を追加
let requestId; // requestAnimationFrameのIDを格納する変数を追加

let audioFileURL = 'Audio/Snare.wav'

// メトロノームの音を鳴らす関数
function playBeat(audioFileURL) {
    // ここでビートを実行（例：音を鳴らす、画面を点滅させるなど）
    console.log("ビート:", performance.now());
    let consoleOutput = performance.now(); // console.logの出力内容
    document.getElementById("console-output").innerHTML = consoleOutput;
    playAudio(audioFileURL)
}

//メトロノームを実行する関数
function metronome() {
    const currentTime = performance.now();

    if (currentTime >= nextTickTime) {
        playBeat(audioFileURL);
        nextTickTime += interval;
    }

    // isRunningがtrueの場合のみ、次のフレームでmetronome関数を再度実行
    if (isRunning) {
        requestId = requestAnimationFrame(metronome);
    }

    // 再生が停止された場合に再開する
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

//メトロノームをスタートさせる関数
function startMetronome() {
    if (!isRunning) {
        isRunning = true;
        nextTickTime = performance.now();
        requestId = requestAnimationFrame(metronome);
    }
}

//メトロノームをストップさせる関数
function stopMetronome() {
    if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(requestId); // メトロノームを停止するため、requestAnimationFrameをキャンセル
    }
}

// スタート・ストップボタン
function toggleFunction() {
    if (isRunning) {
        stopMetronome();
        isRunning = false;
        console.log('Stopped!');
    } else {
        startMetronome();
        isRunning = true;
        console.log('Started!');
    }
}






const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const x = 100; // 音符の中心のX座標
const y = 100; // 音符の中心のY座標
const radius = 15; // 音符の半径
const stemLength = 60; // 符尾の長さ
const stemThickness = 4; // 符尾の太さ

// 音符の描画
ctx.beginPath();
ctx.arc(x, y, radius, 0, 2 * Math.PI);
ctx.stroke();
ctx.fillStyle = "black";
ctx.fill();

// 符幹の描画
ctx.beginPath();
ctx.moveTo(x + radius, y);
ctx.lineTo(x + radius, y - stemLength);
ctx.lineWidth = stemThickness;
ctx.stroke();

// 符尾の描画
ctx.beginPath();
ctx.moveTo(x + radius, y - stemLength);
ctx.lineTo(x + radius + stemThickness, y - stemLength - (stemLength / 2));
ctx.stroke();