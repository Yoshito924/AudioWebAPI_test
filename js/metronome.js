
// Metronomeクラスを作る
class Metronome {

    //コンストラクタ（初期化メソッド）
    constructor(tempo = 120) {
        // BPM
        this.tempo = tempo;
        //オーディオコンテクスト
        this.audioContext = null;
        //ウェブオーディオに入れられた、まだ再生されていないかもしれないノート {note, time}
        this.notesInQueue = [];
        //何拍目かどうか
        this.currentBeatInBar = 0;
        // 拍子
        this.beatsPerBar = 4;
        //スケジューリング関数を呼び出す頻度 (ミリ秒)
        this.lookahead = 25;
        // どれぐらい先の音をスケジューリングするか(秒)
        this.scheduleAheadTime = 0.1;
        // 次の音符が出るタイミング
        this.nextNoteTime = 0.0;
        // メトロノームの進行・停止状態をBoole値で格納する
        this.isRunning = false;
        // setInterval関数の状態を格納する
        this.intervalID = null;
    };

    //何拍目を鳴らしているか判定するメソッド
    nextNote() {
        // 現在の音符と時間を4分音符分進めることができます。        (お洒落な人ならクロシェット)
        // これは、ビートの長さを計算するために現在のテンポ値をピックアップすることに注意してください。
        let secondsPerBeat = 60 / this.tempo;

        //最後のビートタイムにビート長を追加します。
        this.nextNoteTime += secondsPerBeat;

        // ビート番号を進め、ゼロにラップする。
        this.currentBeatInBar++;
        // 拍子のアタマで値をリセット
        if (this.currentBeatInBar == this.beatsPerBar) {
            this.currentBeatInBar = 0;
        };
    };

    //スケジュールされた音を鳴らすメソッド
    scheduleNote(beatNumber, time) {
        //演奏していなくても、キューにあるノートをプッシュします。
        this.notesInQueue.push({ note: beatNumber, time: time });
        //オシレーターを作る
        const osc = this.audioContext.createOscillator();
        //ヴォリューム調整
        const envelope = this.audioContext.createGain();

        // メトロノームのピッチを指定
        osc.frequency.value = (beatNumber % this.beatsPerBar == 0) ? 1000 : 800;

        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        //オシレーターにヴォリュームを教える
        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);

        osc.start(time);
        //0.03秒でクリックの音を止める
        osc.stop(time + 0.03);
    };

    //次の音をスケジュールするメソッド
    scheduler() {
        // nextNoteTimeの長さより、現在の時間＋scheduleAheadTimeが大きくなるまでwhile文で処理を繰り返す。
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            //スケジュールされた音を鳴らすメソッド
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            //何拍目を鳴らしているか判定するメソッド
            this.nextNote();
        };
    };

    //メトロノームを再生させるメソッド
    start() {
        //もし既にメトロノームが動いていたらreturn
        if (this.isRunning) {
            return;
        };

        // AudioContextを作成する関数
        if (this.audioContext == null) {
            //webkitプレフィックスをつける。（WebKit使用のブラウザに対応するため）
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        };

        // メトロノームが動いている状態を管理する変数をtrueにする
        this.isRunning = true;
        // 拍子を0にする（小節のアタマからメトロノームを開始させる）
        this.currentBeatInBar = 0;

        this.nextNoteTime = this.audioContext.currentTime + 0.05;
        //lookahead（スケジューリング関数を呼び出す頻度）ごとに、setIntervalでscheduler()を実行
        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    //メトロノームを停止させるメソッド
    stop() {
        this.isRunning = false;
        //インターバルをクリアする
        clearInterval(this.intervalID);
    }

    //メトロノームを再生・停止させるメソッド
    startStop() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        };
    }
}

