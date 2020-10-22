var Map=function(){
    this.mapwidth=30
    this.mapheight=30

    //Map Datas
    this.RowWalls=Array(mapwidth)
    this.ColWalls=Array(mapwidth+1)
    this.PlacedFloor=Array(mapwidth)
    this.PlacedIcon=Array(mapwidth)
    this.PlacedMemo=Array(mapwidth)

    this.IconUsing=0;
    this.IconClassNames=["","UpStair","DownStair","Door"]
    
    for(i=0;i<mapwidth;i++){
	RowWalls[i]=Array(mapheight+1).fill(0)
	ColWalls[i]=Array(mapheight).fill(0)
	PlacedFloor[i]=Array(mapheight).fill(0)
	PlacedIcon[i]=Array(mapheight).fill(0)
	PlacedMemo[i]=Array(mapheight).fill(0)
    }
    ColWalls[mapwidth]=Array(mapheight).fill(0)

    this.ChangeCellSize=function(){
	//set css
	console.log("Changing Cell Size")
	width=$("#map_main").width()
	$(".cell").css({"width":width/mapwidth+"px","height":width/mapwidth+"px"})
    }
    
    this.CreateCells=function(){
	//create map elements
	for(i=0;i<mapheight*mapwidth;i++){
	    $("<div></div>").addClass("cell").attr("id",i+"_cell").appendTo($("#map_main"))
	}
	ChangeCellSize()
	$(window).resize(ChangeCellSize)
    }

    
    this.UnbindPreviousTool=function(){
	//Hay, just unbind everything.
	UnbindPencil()
	UnbindBrush()
	UnbindEraser()
	UnbindWiper()
	UnbindIcon()
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
    
    // Wiper functions
    this.UseWiper=function(Cell){
	Cell.removeClass("Painted")
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedFloor[x][y]=0
    }
    this.BindWiper=function(){
	$(".cell").each(function(){
	    $(this).click(function(){
		UseWiper($(this))
	    })
	})
    }
    this.UnbindWiper=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
    }
    
    // Pencil function
    this.UsePencil=function(MapMain){
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
	    UsePencil($(this))
	})
    }
    this.UnbindPencil=function(){
	$("#map_main").unbind("click")
    }

    // Eraser function
    this.UseEraser=function(MapMain){
	x=event.pageX-MapMain.offset().left
	y=event.pageY-MapMain.offset().top
	cellsize=$(".cell").outerWidth()
	pointX=x/cellsize
	pointY=y/cellsize
	candidateX=Math.round(pointX)
	candidateY=Math.round(pointY)
	threshold=0.2
	
	if(Math.abs(pointX-candidateX)<threshold){
	    console.log("Erased Column",candidateX,candidateY,pointX,pointY)
	    ColWalls[candidateX][Math.floor(pointY)]=0
	    UpdateColumnWall(candidateX,Math.floor(pointY))
	}
	else if(Math.abs(pointY-candidateY)<threshold){
	    console.log("Erased Row",candidateX,candidateY,pointX,pointY)
	    RowWalls[Math.floor(pointX)][candidateY]=0
	    UpdateRowWall(Math.floor(pointX),candidateY)
	}
    }
    this.BindEraser=function(){
	$("#map_main").click(function(event){
	    UseEraser($(this))
	})
    }
    this.UnbindEraser=function(){
	$("#map_main").unbind("click")
    }

    //Updates column wall
    function UpdateColumnWall(i,j){
	var colx=ColWalls.length
	var coly=ColWalls[0].length
	var Cells=$(".Cell")	
	if(i==0){
	    if(ColWalls[i][j]==1){
		$(Cells[j*(colx-1)+i]).addClass("Left")
	    }
	    else if(ColWalls[i][j]==0){
		$(Cells[j*(colx-1)+i]).removeClass("Left")
	    }
	}
	else{
	    if(ColWalls[i][j]==1){
		$(Cells[j*(colx-1)+i-1]).addClass("Right")
	    }
	    else if(ColWalls[i][j]==0){
		$(Cells[j*(colx-1)+i-1]).removeClass("Right")
	    }
	}
    }
    
    function UpdateRowWall(i,j){
	var rowx=RowWalls.length
	var rowy=RowWalls[0].length
	var Cells=$(".Cell")	
	if(j==0){
	    if(RowWalls[i][j]==1){
		$(Cells[j*rowx+i]).addClass("Top")
	    }
	    else if(RowWalls[i][j]==0){
		$(Cells[j*rowx+i]).removeClass("Top")
	    } 
	}
	else{
	    if(RowWalls[i][j]==1){
		$(Cells[(j-1)*rowx+i]).addClass("Bottom")		    
	    }
	    else if(RowWalls[i][j]==0){
		$(Cells[(j-1)*rowx+i]).removeClass("Bottom")		    
	    }
	}
    }
    
    //Icon Functions
    this.UseIcon=function(Cell){
	var index=parseInt(Cell.attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedIcon[x][y]=IconUsing
	if(IconUsing==0){
	    for(i=1;i<IconClassNames.length;i++){
		Cell.removeClass(IconClassNames[i])
	    }
	}
	else{
	    console.log(IconClassNames[IconUsing])
	    Cell.addClass(IconClassNames[IconUsing])
	}
    }
    this.BindIcon=function(icon){
	IconUsing=icon
	$(".cell").each(function(){
	    $(this).click(function(){
		UseIcon($(this))
	    })
	})
    }
    this.UnbindIcon=function(Cell){
	$(".cell").each(function(){
	    $(this).unbind("click")
	})
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
	$("#wiper").click(function(){
	    UnbindPreviousTool()
	    BindWiper()
	})
	$("#eraser").click(function(){
	    UnbindPreviousTool()
	    BindEraser()
	})
	$(".icon").each(function(index){
	    $(this).click(function(){
		UnbindPreviousTool()
		BindIcon(index)
	    })
	})
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
    return this
}

Map().Init()
