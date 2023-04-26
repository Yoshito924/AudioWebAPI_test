

// Metronomeクラスからmetronomeインスタンスを作成する
let metronome = new Metronome();

// メトロノーム画面からテンポを取得する
let tempo = document.getElementById('tempo');
tempo.textContent = metronome.tempo;

// ポーズ状態のアイコン
let playPauseIcon = document.getElementById('play-pause-icon');
//プレイ状態のアイコン
let playButton = document.getElementById('play-button');

//playButtonをクリックするとメトロノームを再生・停止させるメソッドが実行される

playButton.addEventListener('click', function () {
    // メトロノームを再生・停止させるメソッド
    metronome.startStop();

    //再生と停止のクラスを書き換える
    if (metronome.isRunning) {
        playPauseIcon.className = 'pause';
    } else {
        playPauseIcon.className = 'play';
    };
});

let tempoChangeButtons = document.getElementsByClassName('tempo-change');

for (let i = 0; i < tempoChangeButtons.length; i++) {
    tempoChangeButtons[i].addEventListener('click', function () {
        // メトロノームのテンポを変更する
        metronome.tempo += parseInt(this.dataset.change);
        tempo.textContent = metronome.tempo;
    });
}