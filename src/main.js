function main() {
  // UI部分は↓のサイトの参考にしている
  // https://walking-succession-falls.com/vuejs%E3%81%A7websocket%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%9F%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E3%81%AE%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB
  console.log("# main()");

  // websocketをインスタンス化
  var websocket = new WebSocket('ws://localhost:8080');


  var vm = new Vue({
    el: '#app',
    data: function () {
      return {
        message: "", // 入力したメッセージを格納する
        messages: [] // 送受信したメッセージを格納する
      }
    },
    methods: {
      /**
       * テキストフィールドでエンターキーが押された時に発生
       */
      keypress: function () {
        console.log("## keypress()");

        // 未入力だった場合は終了
        if (this.message == "") {
          return;
        }

        // メッセージを送信
        websocket.send(this.message);

        // 送信したメッセージを自分の投稿として表示
        this.pushMessage(this.message, "self");

        // メッセージの初期化
        this.message = "";
      },

      /**
       * メッセージを表示する
       * @param {String} message - 表示するメッセージ
       * @param {String} owner - 発言者
       */
      pushMessage: function (message, owner) {
        console.log("## pushMessage()");
        console.log(`message = ${message}, owner = ${owner}`);

        // メッセージを追加
        this.messages.push({
          "message": message,
          "owner": owner
        });
      }
    },
    mounted: function () {
      var self = this;
      console.log("## mounted()");

      // websocketをオープンした時
      websocket.onopen = function (event) {
        console.log("### websocket.onopen()");
      };

      // websocketでメッセージを受信した時
      websocket.onmessage = function (event) {
        console.log("### websocket.onmessage()");

        // 戻り値チェック
        if (event && event.data) {
          // 受信したメッセージを表示する
          self.pushMessage(event.data, 'opposite');
        }
      };

      // websocketでエラーが発生した時
      websocket.onerror = function (event) {
        console.log("### websocket.onerror()");
        console.log(event);
      };

      // websocketをクローズした時
      websocket.onclose = function (event) {
        console.log("### websocket.onclose()");
        console.log(event);
      };
    }
  });
};

window.onload = function () {
  // HTMLの読み込み完了後に実行
  main();
};
