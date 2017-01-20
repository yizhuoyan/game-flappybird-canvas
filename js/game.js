window.R=(function(){
       var data={};
       return function(a,b,c){
            if(b){
                if(c==="audio"){
                    var audio=data[a]=document.createElement("audio");
                    audio.src=b;
                    audio.replay=function(){
                        this.currentTime=0;
                        this.play();
                    }
                    document.body.appendChild(audio);   
                }else{
                 var img=data[a]=document.createElement("img");
                 img.src=b;
                 img.style.display="none";
                 img.onload=function(){
                     this.parentNode.removeChild(this);
                 }.bind(img);
                 document.body.appendChild(img);
               }
            }
            return data[a];
       };
})(); 

;+(function(window,document){
//加载资源
R("sky","asset/sky.png");
R("ground","asset/ground.png");
R("bird","asset/bird.png");
R("holdback","asset/holdback.png");
R("number","asset/number.png");
R("over","asset/over.png");
R("ready","asset/ready.png");
R("@fly","asset/fly.wav","audio");
R("@die","asset/die.wav","audio");
R("@buzzy","asset/buzzy.wav","audio");
R("@score","asset/score.wav","audio");

window.onload = function(){
    game.init();
}

var game={
    fps:1000/30,
    unitWidth:0,
    unitHeight:0,
    gameState:"ready",//ready,playing,pause,over
    canvas:null,
    g:null,
    
    
    background:null,
    bird:null,
    
    
    init:function(){
        //创建舞台
        this.initStage();
        //创建背景
        this.background=new Background(this);
        //创建ready场景
        this.readySence=new ReadyScene(this);
        //创建over场景
        this.overScene=new OverScene(this);
        //创建鸟
        this.bird=new Bird(this);
        //创建障碍物
        this.holdback=new Holdback(this);
        //创建计分器
        this.scoreIndicator=new ScoreIndicator(this);
        //绑定事件
        this.bindListener();
        //开始
        this.run=this.run.bind(this);
        this.run();
    },
    initStage:function(){
        var cvs=this.canvas=document.getElementsByTagName("canvas")[0];
        this.g=cvs.getContext("2d");
        var screenWidth=document.body.offsetWidth;
        var screenHeight=document.body.offsetHeight;
        canvas.width=Math.min(screenWidth,cvs.width);
        canvas.height=Math.min(screenHeight,cvs.height);
        this.unitWidth=canvas.width/9;
        this.unitHeight=canvas.height/16;
    },
    bindListener:function(){
        
        var handler=function(){
            switch(this.gameState){
                case "ready":
                    this.play();
                    break;
                case "playing":
                    this.bird.fly();
                    break;
                case "over":
                    this.replay();
                    break;    
            }
            
        }.bind(this);
        if('ontouchstart' in window){
            this.canvas.addEventListener("touchstart",handler);
        }else{
            this.canvas.addEventListener("mousedown",handler);
        }
    },
    play:function(){
        this.gameState="playing";  
        this.bird.state="flying";
    },
    replay:function(){
        this.gameState="ready";
        this.bird.reset();   
        this.holdback.reset();
        this.scoreIndicator.reset();
    },
    gameOver:function(){
         this.gameState="over";
         this.holdback.move=false;
    },
    throughOneHose:function(){
        this.scoreIndicator.gotScore();
    },
    run:function(){
       var begin=Date.now();
       
       var g= this.g;
       this.background.paintSky(g);
       switch(this.gameState){
           case "ready":
                this.readySence.paint(g);
                break;
           case "playing":
                this.holdback.paint(g);
                 this.scoreIndicator.paint(g);
                break;         
           case "over":
                this.holdback.paint(g);
                this.scoreIndicator.paint(g);
                this.overScene.paint(g);
                break;
       }
       this.bird.paint(g);
      
       this.background.paintGround(g);
       /*
       var left=this.fps-(Date.now()-begin);
       if(left<=0){
         setTimeout(this.run);    
       }else{
         setTimeout(this.run,this.left);   
       }
       */
      window.requestNextAnimationFrame(this.run);
                   
       
    }
}
    
    
})(window,document);
