window.Background=(function(window,document){
    var Constructor=function(game){
        this.game=game;
        this.sky=R("sky");
        this.ground=R("ground");
        var cvs=this.game.canvas;
        this.maxWidth=cvs.width;
        //天空高度
        this.skyHeight=game.unitHeight*14;
        this.groundHeight=cvs.height-this.skyHeight;
        this.groundY=this.skyHeight;
        this.groundX=0;
        this.skyX=0;
    }
    
    Constructor.prototype.paintSky=function(g){
        g.drawImage(this.sky,this.skyX,0
            ,this.maxWidth,this.skyHeight);
        g.drawImage(this.sky,this.skyX+this.maxWidth,0
            ,this.maxWidth,this.skyHeight);
        this.skyX-=0.4;    
        if(this.skyX<=-this.maxWidth){
            this.skyX=0;
        }
    }
    Constructor.prototype.paintGround=function(g){
        var ground=this.ground;
        var stage=this.stage;
            g.drawImage(ground,this.groundX--,this.groundY
                ,this.maxWidth,this.groundHeight);
            g.drawImage(ground,this.maxWidth+this.groundX,this.groundY
                ,this.maxWidth,this.groundHeight);  
                
        if(this.groundX<=-this.maxWidth){
            this.groundX=0;
        }
    }
    
    return Constructor;
})(window,document);
