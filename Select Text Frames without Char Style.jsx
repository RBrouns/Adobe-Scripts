var doc = app.activeDocument;

$.writeln("Number of text frames: " + doc.textFrames.length);
$.writeln("Existing styles:" + doc.characterStyles.length);
$.writeln("Existing paragraph styles:" + doc.paragraphStyles.length);

var lastProgressReport = 0;

checkForUnusedCharStyles();
//selectTextFieldsWithoutStyle();

function checkForUnusedCharStyles(){
    var docStyles = doc.characterStyles;
    var styleUsage = [];
    
    for(var i=0;i<docStyles.length;i++){
        styleUsage.push(0);
    }

    //Scan all textframes in the doc
    for(var i=0;i<doc.textFrames.length;i++){
        var tf = doc.textFrames[i];
        var charStyle = getCharStyleForTextFrame(tf);
        
        for(var j=0;j<docStyles.length;j++){
            if(charStyle.name == docStyles[j].name){
                styleUsage[j]++;
            }
        }
    
    updateProgress(i, doc.textFrames.length);

    }

    //Create alert message
    var printString = "Completed. Styles:\n";
    for(var k=0;k<docStyles.length;k++){
        printString += docStyles[k] + ":" + styleUsage[k] +"\n";
     }
  
    alert(printString);
}

function selectTextFieldsWithoutStyle(){
    var unstyledTextfields = 0;
    var unstyledTfOnLockedLayer = 0;

    for(var i=0;i<doc.textFrames.length;i++){
        var textRange = doc.textFrames[i].textRange; 
        if(!hasCharacterStyle(textRange)){
            if(!doc.textFrames[i].layer.locked){
                doc.textFrames[i].selected = true;
            }else{
                unstyledTfOnLockedLayer++;
            }
            unstyledTextfields++;
        }
    
        updateProgress(i, doc.textFrames.length);
    }

    alert("Unstyled textfields: " + unstyledTextfields + ", out of total: " + doc.textFrames.length + ". " + (unstyledTfOnLockedLayer!=0? "\nWARNING! " + unstyledTfOnLockedLayer + " unstyled textfields were on locked layers" : "All fields selected"));

}

// ------- Helper methods

function hasCharacterStyle(textRange){
    var hasStyle = textRange.characterStyles != undefined && textRange.characterStyles[0].toString().indexOf("Normal Character Style") == -1
    return hasStyle;
 }

function updateProgress(progress, total){
    var progressPerc = Math.round((progress / total)* 10) ;
    if(progressPerc != lastProgressReport){
        $.writeln("Progress: " + Math.round((progress / total) * 100) + "%");
        lastProgressReport = progressPerc;
    }
}


function getCharStyleForTextFrame(tf){
    try{
        return tf.textRange.characterStyles[0];
    }catch(err){
        $.writeln("Error with a textframe: " + tf);
    }
}

