var Map=function(){
    this.mapwidth=30
    this.mapheight=30

    //Map Datas
    this.RowWalls=Array(mapwidth)
    this.ColWalls=Array(mapwidth+1)
    this.PlacedFloor=Array(mapwidth)
    this.PlacedIcon=Array(mapwidth)
    this.PlacedMemo=Array(mapwidth)
    //Tool Settings
    this.Brush=0
    this.Wiper=1
    this.Pencil=2
    this.Eraser=3
    //Set Default to Brush
    this.ToolUsing=Brush
    
    for(i=0;i<mapwidth;i++){
	RowWalls[i]=Array(mapheight+1).fill(0)
	ColWalls[i]=Array(mapheight).fill(0)
	PlacedFloor[i]=Array(mapheight).fill(0)
	PlacedIcon[i]=Array(mapheight).fill(0)
	PlacedMemo[i]=Array(mapheight).fill(0)
    }
    ColWalls[mapwidth]=Array(mapheight).fill(0)

    this.CreateCells=function(){
	//create map elements
	for(i=0;i<mapheight*mapwidth;i++){
	    $("<div></div>").addClass("cell").attr("id",i+"_cell").appendTo($("#map_main"))
	}
	//set css
	width=$("#map_main").width()
	$(".cell").css({"width":width/mapwidth+"px","height":width/mapwidth+"px"})
    }

    this.UnbindPreviousTool=function(){
	//Hay, just unbind everything.
	UnbindPencil()
	UnbindBrush()
    }
    
    // Brush functions
    this.UseBrush=function(Cell){
	Cell.addClass("Painted")
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedFloor[x][y]=1
    }
    this.BindBrush=function(){
	$(".cell").each(function(){
	    $(this).click(function(){
		UseBrush($(this))
	    })
	})
    }
    this.UnbindBrush=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
    }
    
    // Pencil function
    this.DrawWall=function(MapMain){
	x=event.pageX-MapMain.offset().left
	y=event.pageY-MapMain.offset().top
	cellsize=$(".cell").outerWidth()
	pointX=x/cellsize
	pointY=y/cellsize
	candidateX=Math.round(pointX)
	candidateY=Math.round(pointY)
	threshold=0.2
	
	if(Math.abs(pointX-candidateX)<threshold){
	    console.log("Drawn Column",candidateX,candidateY,pointX,pointY)
	    ColWalls[candidateX][Math.floor(pointY)]=1
	    UpdateColumnWall(candidateX,Math.floor(pointY))
	}
	else if(Math.abs(pointY-candidateY)<threshold){
	    console.log("Drawn Row",candidateX,candidateY,pointX,pointY)
	    RowWalls[Math.floor(pointX)][candidateY]=1
	    UpdateRowWall(Math.floor(pointX),candidateY)
	}
    }
    this.BindPencil=function(){
	$("#map_main").click(function(event){
	    DrawWall($(this))
	})
    }
    this.UnbindPencil=function(){
	$("#map_main").unbind("click")
    }


    this.Init=function(){
	console.log("Map:Init")
	CreateCells()
	BindBrush()
	$("#pencil").click(function(){
	    UnbindPreviousTool()
	    BindPencil()
	})
	$("#brush").click(function(){
	    UnbindPreviousTool()
	    BindBrush()
	})
    }

    //Updates column wall
    function UpdateColumnWall(i,j){
	if(ColWalls[i][j]==0)
	    return
	var colx=ColWalls.length
	var coly=ColWalls[0].length
	var Cells=$(".Cell")	
	if(i==0){
	    $(Cells[j*(colx-1)+i]).addClass("Left")
	}
	else{
	    $(Cells[j*(colx-1)+i-1]).addClass("Right")		    
	}
    }
    
    function UpdateRowWall(i,j){
	if(RowWalls[i][j]==0)
	    return
	var rowx=RowWalls.length
	var rowy=RowWalls[0].length
	var Cells=$(".Cell")	
	if(j==0){
	    $(Cells[j*rowx+i]).addClass("Top")
	}
	else{
	    $(Cells[(j-1)*rowx+i]).addClass("Bottom")		    
	}
    }
    
    //Updates whole map
    function UpdateWholeMap(){
	var rowx=RowWalls.length
	var rowy=RowWalls[0].length
	var colx=ColWalls.length
	var coly=ColWalls[0].length
	for(i=0;i<rowx;i++){
	    for(j=0;j<rowy;j++){
		UpdateRowWall(i,j)
	    }
	}
	
	for(i=0;i<colx;i++){
	    for(j=0;j<coly;j++){
		UpdateColumnWall(i,j)
	    }
	}
    }

    UpdateWholeMap()
    Init()
}


Map()
