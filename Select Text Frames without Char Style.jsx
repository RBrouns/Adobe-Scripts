var doc = app.activeDocument;

$.writeln("Number of text frames: " + doc.textFrames.length);
$.writeln("Existing styles:" + doc.characterStyles.length);
$.writeln("Existing paragraph styles:" + doc.paragraphStyles.length);

var unstyledTextfields = 0;

for(var i=0;i<doc.textFrames.length;i++){
    var tf = doc.textFrames[i];
    if(tf.appliedCharacterStyle == undefined && tf.appliedCharacterStyle == undefined){
        tf.selected = true;
        unstyledTextfields++;
    }else{ 
        $.writeln(doc.textFrames[i].appliedCharacterStyle.toString());
    }
}

alert("Unstyled textfields: " + unstyledTextfields);
