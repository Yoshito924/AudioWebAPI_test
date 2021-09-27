
//AudioContextを作成するコード

//ページがロードされたときに関数initを実行するイベントリスナーを設定する
window.addEventListener('load', init, false);

//変数contextを定義する
let context;

//AudioContextを作成する関数
function init() {
    try {
        //webkitプレフィックスをつける。（WebKit使用のブラウザに対応するため）
        window.AudioContext
            = window.AudioContext || window.webkitAudioContext;
        //AudioContextを生成する
        context = new AudioContext();
        console.log('init!');
    } catch (e) {
        //try内の処理がエラーの場合、それをユーザーに伝える。
        alert('このブラウザではWeb Audio APIはサポートされていません。');
    };
};

// // Fix up prefixing
// window.AudioContext = window.AudioContext || window.webkitAudioContext;
// let context = new AudioContext();


for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(kick, time);
    playSound(kick, time + 4 * eighthNoteTime);

    // Play the snare drum on beats 3, 7
    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);

    // Play the hi-hat every eighth note.
    for (var i = 0; i < 8; ++i) {
        playSound(hihat, time + i * eighthNoteTime);
    }
}

function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
}

//サウンドを再生する関数
function playSound(buffer, time) {
    // サウンドソースを作る
    let source = context.createBufferSource();
    // どの音を再生するかソースに伝達する
    source.buffer = buffer;

    //-----------------------------------
    // GainNodeの設定
    const gainNode = context.createGain();
    // ボリュームを指定する
    gainNode.gain.value = 0.1
    // ボリュームを指定する
    source.connect(gainNode);

    //-----------------------------------
    // ソースとデスティネーションを接続する
    source.connect(context.destination);

    //-----------------------------------
    // 今すぐソースを再生する
    source.start(time);
};


//音声を読み込む関数
function loadSound(url) {
    //XMLHttpRequestを使う
    let request = new XMLHttpRequest();

    //openメソッドで初期化
    request.open('GET', url, true);

    //音声ファイルはバイナリデータ（非テキスト）なので
    //レスポンスのタイプは'arraybuffer'を指定。
    request.responseType = 'arraybuffer';

    //返ってきたレスポンスに行う処理をアロー関数で指定する
    request.onload = () => {
        // ArrayBuffer に書き込まれた音声ファイルデータを非同期にデコードする
        context.decodeAudioData(request.response, (buffer) => {
            resolve(buffer);
        })
    };

    //APIにリクエストを送信する
    request.send();

};

var start = Date.now();
setInterval(function () {
    var delta = Date.now() - start; //milliseconds elapsed since start

    output(Math.floor(delta / 1000)); //in seconds
    //alternatively just show wall clock time:
    output(new Date().toUTCString());
}, 1000); //update about every second

var interval = 1000; //ms
var expected = Date.now() + interval;
setTimeout(step, interval);
function step() {
    var dt = Date.now() - expected; //the drift (positive for overshooting)
    if (dt > interval) {
        //something really bad happened. Maybe the browser (tab) was inactive?
        //possibly special handling to avoid futile "catch up" run
    }
    //do what is to be done
    expected += interval;
    setTimeout(step, Math.max(0, interval - dt)); //take into account drift
}



// function FFF() {
//     // サウンドの読み込み
//     const buffer = loadSound('Audio/clave.mp3');

//     // サウンドの再生
//     playSound(buffer);
// };



function FFF() {
    // Setup
    const context = new AudioContext();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.frequency.value = 1200;
    gain.gain.value = 0;
    osc.connect(gain).connect(context.destination);
    osc.start();
    // Repeat at ♩=120
    setInterval(() => {
        // Generate one-shot click sound
        const now = context.currentTime;
        gain.gain.setValueAtTime(1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.05);
    }, 60 * 1000 / 120);
};