var origDoc = app.activeDocument;

var libItems = [];
var targetSwatch;
var targetSwatchName;

run();

function run(){
    
        targetSwatch = origDoc.swatches.getSelected();
        targetSwatchName = targetSwatch.toString();
        $.writeln("---- GO ----");
        $.writeln("Target fill: " + targetSwatch);

        if(targetSwatchName == undefined || targetSwatchName == ""){
            alert("Please select a swatch first.");
            return 0;
        }

        //Fetch only the Placeditems from selection
        for(var i=0;i<app.selection.length;i++){
            if(app.selection[i] instanceof PlacedItem){
                libItems.push(app.selection[i]);
            }
        }

        var origNumbOfItems = libItems.length;

        while(libItems.length > 0){
            $.writeln("Remaining items: " + libItems.length);
            process(libItems[0]);
            libItems.shift();
        }

        if(origNumbOfItems > 1){
            alert("Completed. " + origNumbOfItems +" library items on your artboard were modified to your selected swatch");
        }else if(origNumbOfItems == 0){
            alert("Please select at least one library item on your artboard.");
        }
}

//Done

function process(origLibItem){
    
    //Open a document for the selected libraryitem;
    app.open(origLibItem.file);
    var tempDoc = app.activeDocument;
    tempDoc.selectObjectsOnActiveArtboard( );
        
    //Copy, return to original doc, and paste
    app.executeMenuCommand('copy');
    origDoc.activate();
    app.executeMenuCommand('pasteFront');
    app.executeMenuCommand ('group');
    var item = app.selection[0];
    item.position = origLibItem.position;
    app.executeMenuCommand ('ungroup');
    
    tempDoc.close();
    tempDoc = null;
    origLibItem.remove();

    //Modify the item, which may consist of multiple seperate (ungrouped) items
    for(var i=0;i<app.selection.length;i++){
            changeColor(app.selection[i]);
    }
}

function changeColor(pageItem){

    $.writeln("Modifying pageitem of type: " + pageItem.typename);
    
    var isSuccess = false;

   //Scenario 1: The opened library item consists of a group. All compoundpaths and regular paths will be changed color
    if(pageItem.typename == "GroupItem"){
        for(var i=0;i<pageItem.compoundPathItems.length;i++){
            modifyPathColors(pageItem.compoundPathItems[i].pathItems);
        }
    
        modifyPathColors(pageItem.pathItems);
        isSuccess = true;
    }

    //Scenario 2: The opened library item is an (ungrouped) compound path
    if(pageItem.typename == "CompoundPathItem"){
        isSuccess = modifyPathColors(pageItem.pathItems);
    }

    //Scenario 3: The opened library item has only regular paths
    if(pageItem.typename == "PathItem"){
        isSuccess = modifySinglePathItemColors(pageItem);
    } 

    if(!isSuccess){
        alert(" Your library item is an unsupported type:" + pageItem.toString() + ". This script only supports libraryitems that are Grouped artwork or Compound Paths.");
    }

    return isSuccess;
}

//Needs a pathitems (PathItems)
function modifyPathColors(pathItems){      
        for(var i=0;i<pathItems.length;i++){
            var path = pathItems[i];
            var targetSwatch = getSwatchByName(targetSwatchName);
            if(path.fillColor != undefined){
                path.fillColor = targetSwatch.color;
            }
        }
    
    return 1;
}

//Needs a single path (PathItem)
function modifySinglePathItemColors(path){
    var targetSwatch = getSwatchByName(targetSwatchName);
        if(path.fillColor != undefined){
            path.fillColor = targetSwatch.color;
        }
    return 1;
}

function getSwatchByName(name){
    //First attempt find by name
    for(var i=0;i<origDoc.swatches.length;i++){
        if(origDoc.swatches[i].toString() == targetSwatchName){
            return origDoc.swatches[i];
        }
    }

    alert("Warning, swatch was not found: " + name);
    return 0;
}
