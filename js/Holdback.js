/**
 * 整个屏幕宽度分为9份，鸟一份，管子2份
 * xx@$$xxx$$
 * $$@xxx$$xx
 * xx@x$$xxx$
 */
window.Holdback=(function(window,document){
    var Constructor=function(game){
            this.game=game;
            //上下水管空间(3个高度单元)
            this.hoseSpace=game.unitHeight*4;
            //两个水管间距离(3个宽度单元) 
            this.hoseBetween=game.unitWidth*5;
            //水管宽度
            this.hoseWidth=game.unitWidth*2;
            //水管高度
            this.hoseHeight=game.unitHeight*10;
            //最大宽度
            this.maxWidth=game.canvas.width;
            //前水管
            this.frontHose=new Hose(this);
            //后水管
            this.behindHose=new Hose(this);
            //是否停止移动
            this.move=true;
            this.reset();
    }
    Constructor.prototype.reset=function(g){
        this.frontHose.reset();
        this.frontHose.x=this.maxWidth;
        this.behindHose.reset();
        this.behindHose.x=this.frontHose.x+this.hoseWidth+this.hoseBetween;
        this.move=true;
    };
    //返回x位置前的管道中间的空隙大小
    Constructor.prototype.spaceRect=function(x){
        //已超过前面的水管
        var hose=null;
        if(x>=this.frontHose.x+this.frontHose.width){
            hose=this.behindHose;
        }else{
            hose=this.frontHose;
        }
        return {
          x:hose.x,
          y:hose.yDown-this.hoseSpace,
          width:this.hoseWidth,
          height:this.hoseSpace
        };
    }
    Constructor.prototype.paint=function(g){
        var a=this.frontHose;
        var b=this.behindHose;
        a.paint(g,this.move);
        b.paint(g,this.move);
        if(this.move&&a.x<-a.width){
            a.reset();
            a.x=b.x+b.width+this.hoseBetween;
            this.behindHose=a;
            this.frontHose=b;
        }
    }
    
    
    
    var Hose=function(holdback){
        this.image=R("holdback");
        //图片宽度
        this.hoseImageWidth=this.image.width/2;
        //图片高度
        this.hoseImageHeight=this.image.height;
        //中间间隙
        this.space=holdback.hoseSpace;
        //绘制宽度
        this.width=holdback.hoseWidth;
        //绘制高度
        this.height=holdback.hoseHeight;
        this.x=0;
        this.yUp=0;
        this.yDown=0;
        
    }
    Hose.prototype.reset=function(g){
        var maxY=this.height+this.space;
        var minY=maxY-this.height;
        this.yDown=Math.floor(Math.random()*(maxY-minY)+minY);
        this.yUp=this.yDown-this.space-this.height;
        
    }
    Hose.prototype.paint=function(g,move){
        var sw=this.hoseImageWidth;
        var sh=this.hoseImageHeight;
        g.drawImage(this.image,0,0,sw,sh
            ,this.x,this.yDown,this.width,this.height);
        g.drawImage(this.image,sw,0,sw,sh
            ,this.x,this.yUp,this.width,this.height);
        if(move){    
            this.x--;
        }
    }
    
    
    
    
    
    
    return Constructor;
})(window,document);
