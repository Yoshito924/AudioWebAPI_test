"use strict";

// (function () {

//     var
//         elAudio, elButton, elGain, elGainValue, setGain,
//         ctx, gain, mediaElementSource, isPlaying;

//     elAudio = document.getElementById('audio');
//     elButton = document.getElementById('button');
//     elGain = document.getElementById('gain');
//     elGainValue = document.getElementById('gain-value');

//     // コンテキストを生成
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     ctx = new AudioContext();

//     // 各AudioNodeを生成
//     mediaElementSource = ctx.createMediaElementSource(elAudio);
//     gain = ctx.createGain();

//     // 中間処理（音量調整処理）を表すAudioNodeが持つAudioParamに
//     // input要素の値を代入。表示にも値を反映する
//     setGain = function () {
//         gain.gain.value = elGainValue.innerText = elGain.value;
//     };
//     setGain();

//     // 音源を表すAudioNodeを、中間処理（音量調整処理）を表すAudioNodeに接続
//     mediaElementSource.connect(gain);
//     // 中間処理を表すAudioNodeを、最終出力を表すAudioNodeに接続
//     gain.connect(ctx.destination);

//     // DOMへのイベント登録
//     elButton.addEventListener('click', function () {
//         elAudio[!isPlaying ? 'play' : 'pause']();
//         isPlaying = !isPlaying;
//     });
//     elGain.addEventListener('mouseup', setGain);
// })();




function FFF() {
    // AudioContextの生成
    const context = new AudioContext();

    // サウンドの読み込み
    function loadSound(url) {
        return new Promise((resolve) => {
            // リクエストの生成
            const request = new XMLHttpRequest();

            request.open('GET', url, true);

            request.responseType = 'arraybuffer';

            // 読み込み完了時に呼ばれる
            request.onload = () => {
                context.decodeAudioData(request.response, (buffer) => {
                    resolve(buffer);
                });
            };

            request.send();

        });
    };

    // サウンドの再生
    function playSound(buffer) {
        // Source
        const source = context.createBufferSource();
        source.buffer = buffer;

        // Destination
        source.connect(context.destination);

        // Sourceの再生
        source.start(0);
    };

    // メイン
    (async () => {
        // サウンドの読み込み
        const buffer = await loadSound('./Audio/clave.mp3');
        const buffer2 = await loadSound('./Audio/conga808.mp3');

        // サウンドの再生
        playSound(buffer);
        // サウンドの再生
        playSound(buffer2);
    })().catch((err) => console.error(err));

};