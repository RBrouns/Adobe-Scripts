var doc = app.activeDocument;
var selectedObj = doc.selection;

fitTextframeToText ();

function fitTextframeToText(){
    var tf = selectedObj[0];
    if(!(tf instanceof TextFrame)){
        alert("You have not selected a textframe","Error");
        return 0;
    }

    tfCopy = tf.duplicate(tf, ElementPlacement.PLACEBEFORE);
    var outlinedFrame = tfCopy.duplicate().createOutline();
    
    $.writeln("Target height: " + outlinedFrame.height);

    rect = tf.parent.pathItems.rectangle(tfCopy.textPath.top, tfCopy.textPath.left, tf.width, outlinedFrame.height);
    textFrameCopy2 = tf.parent.textFrames.areaText(rect);
    tf.textRange.duplicate(textFrameCopy2);	
    
    tf.remove();
    tfCopy.remove();
    outlinedFrame.remove();
    
    textFrameCopy2.selected = true;
    rect.selected = true;
}