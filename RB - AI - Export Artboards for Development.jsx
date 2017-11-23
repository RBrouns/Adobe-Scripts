var doc = app.activeDocument;
var docPath = decodeURI(app.activeDocument.path);
var exportRootPath = "T:/Product Development/Projects/Go-2/L2.STP/L3.STP.App/UI Screens";

var artboardFirstChars = [];
var artboardOccurences = [];

identifyFreqPrefixes();
createFolders();
exportPngArtboards();

$.writeln(" ---- DONE ---- ");

function identifyFreqPrefixes(){
    var matched;
    
    for(var i=0;i<doc.artboards.length;i++){
        
        //1: Check if artboard prefix is already known
        matched = false;
        var ab = doc.artboards[i];
        for(var j=0;j<artboardFirstChars.length;j++){
            if(ab.name.charAt(0) == artboardFirstChars[j]){
                artboardOccurences[j]++;
                matched = true;
             }
         }
     
        //2: Add the artboard prefix to array
        if(!matched){
          artboardFirstChars.push(ab.name.charAt(0));
          artboardOccurences.push(1);
        }
    }

    $.writeln("All first chars:" + artboardFirstChars.length);
    $.writeln("Occurrences:" + artboardOccurences);
}

function createFolders(){
    for(var i=0;i<artboardFirstChars.length;i++){
        if(artboardOccurences[i] > 2){
            var newFolder = new Folder(exportRootPath + "/" + artboardFirstChars[i]);
            if(!newFolder.exists){
                newFolder.create();
            }
        }
    }
}


// ------------------------------
// SAVING ARTBOARDS
// ------------------------------

function exportPngArtboards(){
    for(var ab=0;ab<doc.artboards.length;ab++){
        $.writeln("Saving artboard:" + ab);
        doc.artboards.setActiveArtboardIndex(ab);
        var abName = doc.artboards[ab].name;
        saveAPng(abName);
   }
}


function saveAPng(abName){
    var checkFolder = new Folder(exportRootPath + "/" + abName.charAt(0));
    
    if(checkFolder.exists){
        var file = new File(exportRootPath + "/" + abName.charAt(0) +"/" + abName + ".jpg");
    }else{
        var file = new File(exportRootPath +"/" + abName + ".jpg");
    }
            
    var exportOptions = new ExportOptionsPNG24();
    exportOptions.artBoardClipping = true;
    exportOptions.antiAliasing = false;
    exportOptions.transparency = false;
    exportOptions.horizontalScale = exportOptions.verticalScale = 417;

    doc.exportFile(file, ExportType.PNG24, exportOptions);
}