
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


// const context = new AudioContext();

function FFF() {
    // Setup

    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.frequency.value = 1200;
    gain.gain.value = 0;
    osc.connect(gain).connect(context.destination);
    osc.start();

    // AudioContextの開始時刻をDOMHighResTimeStampで記憶する。
    const baseTimeStamp = performance.now() - context.currentTime * 1000;

    // コンテキストのcurrentTimeをDOMHighResTimeStampで返す関数
    function currentTimeStamp() {
        return baseTimeStamp + context.currentTime * 1000;
    }

    // DOMHighResTimeStampをAudioContextのcurrenTimeに変換する関数
    function timeStampToAudioContextTime(timeStamp) {
        return (timeStamp - baseTimeStamp) / 1000;
    }

    // 最後に予定されていたクリックの時間をDOMHighResTimeStampで表したもの
    let lastClickTimeStamp = performance.now();
    const tick = 60 * 1000 / 120;  // for tempo=120

    timerId = setInterval(() => {
        const now = currentTimeStamp();
        for (let nextClickTimeStamp = lastClickTimeStamp + tick;
            nextClickTimeStamp < now + 1500;
            nextClickTimeStamp += tick) {
            const nextClickTime = timeStampToAudioContextTime(nextClickTimeStamp);
            gain.gain.setValueAtTime(1, nextClickTime);
            gain.gain.linearRampToValueAtTime(0, nextClickTime + 0.05);
            lastClickTimeStamp = nextClickTimeStamp;
        }
    }, 1000);

};

function Stop() {
    //setIntervalを停止する
    clearInterval(timerId);
}