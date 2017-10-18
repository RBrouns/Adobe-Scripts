// Script will select all content in the open document.
// It will check the colors for each pageItem and see if that color already matches a swatch in the doc.swatches
// If it does, it will update that pageItem to use the swatch

var doc = app.activeDocument;

process();

function process(){
    //Iterate through all artboards
    for(var i=0;i<doc.artboards.length;i++){
        doc.artboards.setActiveArtboardIndex(i);
        doc.selectObjectsOnActiveArtboard( );
        
            //Iterate through all content on an artboard
            for(var j=0;j<app.selection.length;j++){
                var item = app.selection[j];
                
                item.fillColor = doc.swatches[7].color;
                $.writeln(doc.swatches[7].color.name);
                
                if(item.typename == "PathItem"){
                    var usesSwatch = isUsingExistingSwatch(item.fillColor);
                    $.writeln("Is using swatch: " + usesSwatch);
                }
            }
        }
}

function isUsingExistingSwatch(color){
    
    for(var i=0;i<doc.swatches.length;i++){
        var swatchColor = doc.swatches[i].color;
        if(color == swatchColor){
            return true;
        }
     }

    return false;
}
    
function getSwatchForColor(color){
    for(var i=0;i<doc.swatches.length;i++){
        var swatch = doc.swatches[i];
        if(color == swatch.color){
            return swatch;
        }
    }

    return -1;
}
            
            