window.Bird=(function(window,document){
    var Constructor=function(game){
        this.game=game;
        this.maxWidth=game.canvas.width;
        this.maxHeight=game.background.skyHeight;
        this.image=R("bird");
        this.width=game.unitWidth;
        this.height=game.unitHeight;
        this.halfWidth=this.width/2;
        this.halfHeight=this.height/2;
        var frameWidth=this.image.width;
        var frameHight=this.image.height/3;
        this.frames=[{x:0,y:0,w:frameWidth,h:frameHight}
                    ,{x:0,y:frameHight,w:frameWidth,h:frameHight}
                    ,{x:0,y:frameHight*2,w:frameWidth,h:frameHight}];
        this.x=0;
        this.y=0;
        this.currentFrameIndex=0;
        this.lastChageFrameTime=0;
        this.playFrameInteval=150;
        //每帧Y轴移动距离
        this.moveY=0;
        //加速度
        this.a=0.3;
        //鸟的状态
        this.state=null;
        //是否进入障碍物
        this.enterHoldback=false;
        //飞的声音
        this.flyAudio=R("@fly");
        //撞晕的声音
        this.buzzyAudio=R("@buzzy");
        //撞死的声音
        this.dieAudio=R("@die");
        this.reset();
    }
    Constructor.prototype.reset=function(){
        this.state="ready";
        this.x=this.game.unitWidth*2;
        this.y=(this.maxHeight-this.height)/2;
        this.enterHoldback=false;
        this.moveY=0;
        this.currentFrameIndex=0;
        this.lastChageFrameTime=0;
    };
    Constructor.prototype.fly=function(){
        if(this.state==="flying"){
            this.moveY=-6;
            this.flyAudio.replay();
        }
    };
    /**
     * 判断鸟的状态
     * 返回true表示游戏结束
     */
    Constructor.prototype.judgeState=function(){
      //是否撞击地面  
      if(this.y+this.height>=this.maxHeight){
         this.state="die";
         this.dieAudio.replay();
         return true; 
      }
      //获取障碍物
      var holdback=this.game.holdback;
      //获取障碍物空隙区域
      var spaceRect=holdback.spaceRect();
      //x方向，判断是否进入区域
      if(spaceRect.x-this.width<this.x
          &&this.x<=spaceRect.x+spaceRect.width){
            //y方向
              //是否撞到柱子
            if(this.y<=spaceRect.y
                ||this.y+this.height>=spaceRect.y+spaceRect.height){
                //装到柱子    
                this.state="dizzy";     
                this.buzzyAudio.replay();
                return true; 
            }else{
                if(this.enterHoldback===false){
                    this.enterHoldback=true;
                }
            }
      }
     //在空隙中
     if(this.enterHoldback){
        //是否刚通过
         if(this.x>spaceRect.x+spaceRect.width){
            this.game.throughOneHose();     
            this.enterHoldback=false;
         }
     }
          
      return false;
    };
    
    Constructor.prototype.paint=function(g){
        switch(this.state){
            case "ready":
                this.paintReady(g);
                break;
            case "flying":
                this.paintFlying(g);
                break;
            case "dizzy":
                this.paintDizzy(g);
                break;
            case "die":
                this.paintDie(g);
                break;
        }
    };
    Constructor.prototype.getNextFrame=function(){
        if(Date.now()-this.lastChageFrameTime>this.playFrameInteval){
            if(++this.currentFrameIndex>=this.frames.length){
                this.currentFrameIndex=0;
            }
            this.lastChageFrameTime=Date.now();
        }
        var frame=this.frames[this.currentFrameIndex];
        return frame;
    };
    Constructor.prototype.paintReady=function(g){
        var y=this.y;
        var frame=this.getNextFrame();
        g.drawImage(this.image,frame.x,frame.y,frame.w,frame.h
            ,this.x,y,this.width,this.height);
        this.y=y;
    }
    Constructor.prototype.paintFlying=function(g){
        //状态判断
        if(this.judgeState()){
            //游戏结束
            this.game.gameOver();
            return;
        }
        var y=this.y;
        var frame=this.getNextFrame();
        g.save();
        //计算旋转角度
        g.translate(this.x+this.halfWidth,this.y+this.halfHeight);
        var angle=Math.atan(this.moveY/10);
        g.rotate(angle);
        g.translate(-this.x-this.halfWidth,-this.y-this.halfHeight);
        //绘制小鸟
        g.drawImage(this.image,frame.x,frame.y,frame.w,frame.h
            ,this.x,y,this.width,this.height);
        //计算下降距离    
        this.moveY+=this.a;
        y+=this.moveY;
        g.restore();
        this.y=y;
        
        
    }
    Constructor.prototype.paintDizzy=function(g){
        var y=this.y;
        var frame=this.frames[this.currentFrameIndex];;
        g.save();
        //计算旋转角度
        g.translate(this.x+this.halfWidth,this.y+this.halfHeight);
        var angle=Math.atan(this.moveY/10);
        g.rotate(angle);
        g.translate(-this.x-this.halfWidth,-this.y-this.halfHeight);
        //绘制小鸟
        g.drawImage(this.image,frame.x,frame.y,frame.w,frame.h
            ,this.x,y,this.width,this.height);
        //计算下降距离    
        this.moveY+=this.a;
        y+=this.moveY;
        g.restore();
        this.y=y;
        //die
        if(this.y+this.height>=this.maxHeight){
            this.state="die";
            this.dieAudio.replay();
        }
    };
    Constructor.prototype.paintDie=function(g){
        var frame=this.frames[this.currentFrameIndex];
        this.y=this.maxHeight-this.height+10;
        g.save();
        g.translate(this.x+this.halfWidth,this.y+this.halfHeight);
        g.rotate(Math.PI/2);
        g.translate(-this.x-this.halfWidth,-this.y-this.halfHeight);
        g.drawImage(this.image,frame.x,frame.y,frame.w,frame.h
            ,this.x,this.y,this.width,this.height);
        g.restore();    
    }
    return Constructor;
})(window,document);
