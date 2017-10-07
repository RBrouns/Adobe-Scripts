var doc = app.activeDocument;

$.writeln("Number of text frames: " + doc.textFrames.length);
$.writeln("Existing styles:" + doc.characterStyles.length);
$.writeln("Existing paragraph styles:" + doc.paragraphStyles.length);

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
}

function hasCharacterStyle(textRange){
    var hasStyle = textRange.characterStyles != undefined && textRange.characterStyles[0].toString().indexOf("Normal Character Style") == -1
    return hasStyle;
 }

alert("Unstyled textfields: " + unstyledTextfields + ", out of total: " + doc.textFrames.length + ". " + (unstyledTfOnLockedLayer!=0? "\nWARNING! " + unstyledTfOnLockedLayer + " unstyled textfields were on locked layers" : "All fields selected"));
