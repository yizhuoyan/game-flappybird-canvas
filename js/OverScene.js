window.OverScene=function(window){
    var Constructor=function(game){
        this.image=R("over");
        this.width=game.unitWidth*7;
        this.height=game.unitHeight*9;
        this.x=(game.canvas.width-this.width)/2;
        this.y=(game.canvas.height-this.height)/2;
        
    };
    
    Constructor.prototype.paint=function(g){
        g.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
    
    return Constructor;
}(window);
