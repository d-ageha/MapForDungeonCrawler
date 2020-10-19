var mapwidth=40
var mapheight=40

//initialize map data
var RowEdges=Array(mapwidth)
var ColEdges=Array(mapwidth+1)
var PlacedFloor=Array(mapwidth)
var PlacedIcon=Array(mapwidth)
var PlacedMemo=Array(mapwidth)

for(i=0;i<mapwidth;i++){
    RowEdges[i]=Array(mapheight+1).fill(0)
    ColEdges[i]=Array(mapheight).fill(0)
    PlacedFloor[i]=Array(mapheight).fill(0)
    PlacedIcon[i]=Array(mapheight).fill(0)
    PlacedMemo[i]=Array(mapheight).fill(0)
}
ColEdges[mapwidth]=Array(mapheight).fill(0)

//create map elements
for(i=0;i<mapheight*mapwidth;i++){
    $("<div></div>").addClass("cell").attr("id",i+"_cell").appendTo($("#map_main"))
}
//set css
$(".cell").css({"width":100/mapwidth+"%","padding-bottom":100/mapwidth+"%"})

//set painting function
$(".cell").each(function(){
    $(this).click(function(){
	$(this).addClass("Painted")
	console.log($(this))
	var index=parseInt($(this).attr("id"))
	var y=Math.floor(index/mapwidth)
	var x=index-y*mapwidth
	PlacedFloor[x][y]=1
	console.log(x,y)
    })
})

//Updates whole map
function UpdateWholeMap(){
    var Cells=$(".Cell")
    var rowx=RowEdges.length
    var rowy=RowEdges[0].length
    var colx=ColEdges.length
    var coly=ColEdges[0].length
    for(i=0;i<rowx;i++){
	for(j=0;j<rowy;j++){
	    if(RowEdges[i][j]==1){
		if(j==0){
		    $(Cells[j*rowx+i]).addClass("Top")
		}
		else{
		    $(Cells[(j-1)*rowx+i]).addClass("Bottom")		    
		}
	    }
	}
    }
    
    for(i=0;i<colx;i++){
	for(j=0;j<coly;j++){
	    if(ColEdges[i][j]==1){
		if(i==0){
		    $(Cells[j*(colx-1)+i]).addClass("Left")
		}
		else{
		    $(Cells[j*(colx-1)+i-1]).addClass("Right")		    
		}
	    }
	}
    }

}

UpdateWholeMap()
