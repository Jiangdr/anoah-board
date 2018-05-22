<template>
  <audio style="display: none;" src="" v-on:error="playererror" v-on:ended="playerended" v-on:loadeddata="playerready"></audio>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      audioele: null,
      mp3divele: null,
      playerstatus: 0,
      stopclass: "audio-preview",
      pauseclass: "audio-preview pause",
      playclass: "audio-preview play"
    };
  },
  methods: {
    //播放器准备好
    playerready: function() {
      console.log(3333);
      this.mp3divele.className = this.playclass;
      this.playerstatus = 2;
    },
    //播放结束
    playerended: function() {
      console.log(4444);
      this.mp3divele.className = this.stopclass;
      this.playerstatus = 0;
    },
    //播放error
    playererror: function() {
      //console.log(55555);
      if (this.mp3divele) this.mp3divele.className = this.stopclass;
      this.playerstatus = 0;
      this.audioele = null;
      //console.log("error");
    },
    playclick: function(url,target) {
      //console.log('1111','mp3player')
      if (window.device) {
        if (this.playerstatus == 1) {
          this.$toast("播放准备中请稍后");
          return;
        }
        if (this.mp3divele == target) {
          //相等,暂停
          if (this.playerstatus == 2) {
            this.audioele.pause();
            this.playerstatus = 3;
            this.mp3divele.className = this.pauseclass;
          } else {
            this.audioele.play();
            this.mp3divele.className = this.playclass;
            playerstatus = 2;
          }
        } else {
          if (this.mp3divele != null) {
            this.mp3divele.className = this.stopclass;
            this.audioele.stop();
            this.audioele.release();
            this.audioele = null;
          }
          this.mp3divele = target;
          let that = this;
          this.audioele = new Media(
            url,
            function() {
              //console.log("playAudio():Audio Success");
            },
            function(err) {
              //console.log("playAudio():Audio Error: "+err);
              that.playererror();
            },
            function(event) {
              if (event == 2) {
                that.playerready();
              } else if (event == 1) {
                that.mp3divele.className = that.pauseclass;
                that.playerstatus = 1;
              } else if (event == 4) {
                that.playerended();
              }
            }
          );
          this.audioele.play();
          this.playerstatus = 1;
          this.mp3divele.className = this.pauseclass;
        }
      } else {
        this.audioele = this.$el;
        if (this.mp3divele == target) {
          //相等,暂停
          if (this.playerstatus == 2) {
            this.audioele.pause();
            this.playerstatus = 3;
            this.mp3divele.className = this.pauseclass;
          } else {
            this.audioele.play();
            this.mp3divele.className = this.playclass;
            this.playerstatus = 2;
          }
        } else {
          if (this.mp3divele != null) {
            this.mp3divele.className = this.stopclass;
          }
          this.mp3divele = target;
          this.audioele.src = url;
          this.audioele.play();
          this.playerstatus = 1;
          this.mp3divele.className = this.pauseclass;
        }
      }
    }
  }
};
</script>