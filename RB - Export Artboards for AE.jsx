var doc = app.activeDocument;
var docPath = decodeURI(app.activeDocument.path);
var aeOutputFolder = new Folder(docPath + "/AE Assets");
var pngOutputFolder = new Folder(docPath + "/PNG");

$.writeln("------ Go: AI Script ------");

var AeArtboardNums = [];

checkIfFoldersExist();
//deleteExistingFiles(aeOutputFolder.getFiles());
//deleteExistingFiles(pngOutputFolder.getFiles());
createListOfAeArtboards();
saveAeArtboards();
exportPngArtboards();

function checkIfFoldersExist(){
    if(!aeOutputFolder.exists){
        aeOutputFolder.create();
    }
    
    if(!pngOutputFolder.exists){
        pngOutputFolder.create();
    }
}

function deleteExistingFiles(fileList){
    for(var i=0;i<fileList.length;i++){
        fileList[i].remove();
    }
}

function createListOfAeArtboards(){
    //A double method is applied to identify artboards as being input for AE. This makes it more fool-proof
   
    //Method 1: Check if "AE" or "Elem" is in the title of an artboard
    for(var i=0;i<doc.artboards.length;i++){
        var ab = doc.artboards[i];
        if(ab.name.toString().indexOf("AE") != -1 || ab.name.toString().indexOf("Elem ") != -1){
            AeArtboardNums.push(i+1);
        }
    }

    //Method 2: Check if the artboard has content on the 'Animated' layer
    for(var a=0;a<doc.artboards.length;a++){
        doc.artboards.setActiveArtboardIndex(a);
        doc.selectObjectsOnActiveArtboard();
    
        //Check if any of the artboard's content (now selected) is on a layer with name "anim"
        for(var i=0;i < app.selection.length ; i++){
            try{
                var layerOfObj = app.selection[i].layer.toString();
            }catch(err){
                $.writeln(err.toString() + "ERROR. Item on artboard: [" + doc.artboards[a].name + "] on index: "+ i + "/" + app.selection.length + " of type: " + app.selection[i]);
                var optionalbreakpoint = 0;
            }finally{
            }
            if(layerOfObj.indexOf("Anim") != -1){
                AeArtboardNums.push(a+1);
                break;
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
    var file = new File(docPath +"/AE Assets/STP");
    var saveOptions = new IllustratorSaveOptions();
    saveOptions.artboardRange = rangeExportString;
    saveOptions.saveMultipleArtboards = true;
    saveOptions.pdfCompatible = true;
    try{
        doc.saveAs(file, saveOptions);
        //alert("The following artboards were saved as seperate files: " + rangeExportString);
    }catch(e){
        alert("Saving was cancelled manually!");
    }
       
    return 1;
}

function exportPngArtboards(){
    var artboardNums = [];
    
    var skipArtboard;
    for(var ab=0;ab<doc.artboards.length;ab++){
        skipArtboard = false;
        
        //Check if an artboard is already exported as an AE artboard
        for(var i=0;i<AeArtboardNums.length;i++){
            if(AeArtboardNums[i] == (ab+1)){
                skipArtboard = true;
                break;
            }
        }
    
        if(doc.artboards[ab].name.indexOf("OLD") != -1 || doc.artboards[ab].name.indexOf("ignore") != -1){
            skipArtboard = true;
        }
    
        if(!skipArtboard){
            $.writeln("PNG exported artboard: " + (ab+1));
            artboardNums.push(ab+1);
            doc.artboards.setActiveArtboardIndex(ab);
            var abName = doc.artboards[ab].name;
            saveAPng(abName);
        }
     }
 
    $.writeln("PNG export complete, num of artboards: " + artboardNums.length);
}


function saveAPng(abName){
    var file = new File(docPath +"/PNG/" + abName + ".jpg");
    
    var exportOptions = new ExportOptionsPNG24();
    exportOptions.artBoardClipping = true;
    exportOptions.antiAliasing = false;
    exportOptions.transparency = false;
    exportOptions.horizontalScale = exportOptions.verticalScale = 417;

    doc.exportFile(file, ExportType.PNG24, exportOptions);
}
    