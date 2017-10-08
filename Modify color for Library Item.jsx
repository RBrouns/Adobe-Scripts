var origDoc = app.activeDocument;

var libItems = [];
targetSwatch = doc.swatches.getSelected();
targetSwatchName = targetSwatch.toString();
$.writeln("---- GO ----");
$.writeln("Target fill: " + targetSwatch)

//Fetch only the Placeditems from selection
for(var i=0;i<app.selection.length;i++){
    if(app.selection[i] instanceof PlacedItem){
        libItems.push(app.selection[i]);
    }
}

var origNumbOfItems = libItems.length;

while(libItems.length > 0){
    $.writeln("Remaining items: " + libItems.length);
    run(libItems[0]);
    libItems.shift();
}

if(origNumbOfItems > 1){
    alert("Completed. " + origNumbOfItems +" library items on your artboard were modified to your selected swatch");
}else if(origNumbOfItems == 0){
    alert("Please select at least one library item on your artboard.");
}

//Done

function run(origLibItem){
    
    //Open a document for the selected libraryitem;
    app.open(origLibItem.file);
    var tempDoc = app.activeDocument;
    tempDoc.selectObjectsOnActiveArtboard( );
    
    //Copy, return to original doc, and paste
    app.executeMenuCommand('copy');
    origDoc.activate();
    app.executeMenuCommand('pasteFront');
    app.selection[0].position = origLibItem.position;
    
    tempDoc.close();
    tempDoc = null;
    origLibItem.remove();
    
    //Start modifying the item
    var editableLibItem = app.selection[0];
        
    //Check if the artwork in the opened file contains unsupported objects    
    if(!(editableLibItem instanceof GroupItem) && !(editableLibItem instanceof CompoundPathItem) && !(editableLibItem instanceof PathItem)){
        alert(" Your library item is an unsupported type:" + editableLibItem.toString() + ". This script only supports libraryitems that are Grouped artwork or Compound Paths.");
        return 0;
    }

   //Scenario 1: The opened library item consists of a group. All compoundpaths and regular paths will be changed color
    if(editableLibItem instanceof GroupItem){
        $.writeln("Library item is grouped artwork");
        for(var i=0;i<editableLibItem.compoundPathItems.length;i++){
            modifyPathColors(editableLibItem.compoundPathItems[i].pathItems);
        }
    
        modifyPathColors(editableLibItem.pathItems);
    }

    //Scenario 2: The opened library item is an (ungrouped) compound path
    if(editableLibItem instanceof CompoundPathItem){
        $.writeln("Library item is a single, ungrouped, compoundpath");
        modifyPathColors(editableLibItem.pathItems);
    }

    //Scenario 3: The opened library item has only regular paths
    if(editableLibItem instanceof PathItem){
        $.writeln("Library item is a single, ungrouped, normal path");
        modifySinglePathItemColors(editableLibItem);
    }    
   
    return 1;
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
}

function getSwatchByName(name){
    //First attempt find by name
    for(var i=0;i<doc.swatches.length;i++){
        if(doc.swatches[i].toString() == targetSwatchName){
            return doc.swatches[i];
        }
    }

    alert("Warning, swatch was not found: " + name);
    return 0;
}
