var doc = app.activeDocument;
var docPath = decodeURI(app.activeDocument.path);

$.writeln("------ GO ------");

var AeArtboardNums = [];

createListOfAeArtboards();
saveAeArtboards();

function createListOfAeArtboards(){
    //A double method is applied to identify artboards as being input for AE. This makes it more fool-proof
   
    //Method 1: Check if "AE" is in the title of an artboard
    for(var i=0;i<doc.artboards.length;i++){
        var ab = doc.artboards[i];
        if(ab.name.toString().indexOf("AE") != -1){
            AeArtboardNums.push(i+1);
        }
    }

    //Method 2: Check if the artboard has content on the 'Animated' layer
    for(var a=0;a<doc.artboards.length;a++){
        doc.artboards.setActiveArtboardIndex(a);
        doc.selectObjectsOnActiveArtboard( );
    
        //Check if any of the artboard's content (now selected) is on a layer with name "anim"
        for(var i=0;i < app.selection.length ; i++){  
            var layerOfObj = app.selection[i].layer.toString();
            if(layerOfObj.indexOf("Anim") != -1){
                AeArtboardNums.push(a+1);
                $.writeln("Content in artboard: " + a +" is on Anim layer");
            }
        }
   }
}

function saveAeArtboards(){
    //Translate the number range to a string like "1,3,4,5"
    var rangeExportString = new String();
    for(var i=0;i < AeArtboardNums.length;i++){
        //Add comma to seperate artboards, but don't add comma for first    
        if(rangeExportString.length != 0){
            rangeExportString += ",";
        }
        rangeExportString += AeArtboardNums[i].toString();
    }

    $.writeln("Export Range for AE:" + rangeExportString);
    $.writeln("Target folder:"+ docPath);

    //Saving process
    var file = new File(docPath +"/AE Assets/STP.ai");
    var saveOptions = new IllustratorSaveOptions();
    saveOptions.artboardRange = rangeExportString;
    saveOptions.saveMultipleArtboards = true;
    saveOptions.pdfCompatible = true;
    doc.saveAs(file, saveOptions);
    
    return 1;
}

function exportJpgArtboards(dest){
    var exportOptions = new ExportOptionsJPEG();
    var type = ExportType.JPEG
    var fileSpec = new File(destination);
    exportOptions.qualitySetting = 80;
}
    