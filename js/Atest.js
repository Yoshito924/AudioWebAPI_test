
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


let dogBarkingBuffer = null;

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




//サウンドを再生する関数
function playSound(buffer) {
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
    source.start(0);
};

function FFF() {
    // サウンドの読み込み
    const buffer = loadSound('Audio/clave.mp3');

    // サウンドの再生
    playSound(buffer);
};


// (async () => {
//     // サウンドの読み込み
//     const buffer = await loadSound('sample.mp3')

//     // サウンドの再生
//     playSound(buffer)
// })().catch((err) => console.error(err));