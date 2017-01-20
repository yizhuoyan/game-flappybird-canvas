window.ScoreIndicator=function(window){
    var Constructor=function(game){
        this.image=R("number");
        this.numbersRect=[];
        var frameW=this.image.width/10;
        var frameH=this.image.height;
        for(var i=0;i<10;i++){
            this.numbersRect.push({
                x:i*frameW,
                y:0,
                width:frameW,
                height:frameH
            });
        }
        this.charWidth=game.unitWidth;
        this.height=game.unitHeight*2;
        this.maxWidth=game.canvas.width;
        this.y=game.unitHeight*2;
        this.score=0;
        this.scoreAudio=R("@score");
    };
    Constructor.prototype.reset=function(g){
        this.score=0;
    };
    Constructor.prototype.gotScore=function(g){
        this.score++;
        this.scoreAudio.replay();
    };
    Constructor.prototype.paint=function(g){
       //分数转换为几个数字
       var str=String(this.score);
       var frame=null;
       var w=str.length*this.charWidth;
       var x=(this.maxWidth-w)/2;
       for(var i=0;i<str.length;i++){
          frame=this.numbersRect[parseInt(str[i])]; 
          g.drawImage(this.image,frame.x,frame.y,frame.width,frame.height
                      ,x+w*i,this.y,this.charWidth,this.height);
       }
    }
    return Constructor;
}(window);
