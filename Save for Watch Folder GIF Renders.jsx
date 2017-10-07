/*  
This is a workaround to the Adobe Media Encoder "watch folder" issue of not
picking up new compositions in the project file.
Reference: https://forums.adobe.com/thread/2301289
*/

{
var origFile = app.project.file;
var date = new Date();
var time = date.getMinutes() + date.getSeconds();
var tempProjectName = "Anims_" + time + ".aep";
var collectedFilesFolder = "Anims_" + time + " folder";    //This is the folder that AE will create when 'Collect Files'

$.writeln("------ GO ------");
 
 //Is Script running for STP or PTP?
 if(origFile.toString().indexOf("STP") != -1){
     var projectContext = "STP";
 }else if(origFile.toString().indexOf("PTP") != -1){
    var projectContext = "PTP";
}else{
    $.writeln("Error: Original file is neither STP or PTP Prototype");
}
$.writeln("Project is: " + projectContext);

//Create references to folders of interest
var rootFolder = "T:\\Product Development\\Projects\\Go-2\\L2."+projectContext+"\\GUI Prototyping";
var folderToRemove= new Folder(rootFolder+"\\1 - Media Encoder Input");
var foldersToClear = [new Folder(rootFolder+"\\2 - Photoshop Input"), new Folder(rootFolder+"\\3 - GIFs")];

 //First, save original project file (just in case of changes) 
app.project.save();
 
//Save project  under temporary filename
var temporaryAep = new File(tempProjectName)
app.project.save(temporaryAep);
 
//Removes existing Media Encoder Input folder, to allow saving new project
if(folderToRemove.exists){
    $.writeln("Removing folder: " + folderToRemove.toString());
     removeAllFilesInAfolder(folderToRemove, true);
     folderToRemove.remove();
}else{
     $.writeln("Dir not found for removal: " + folderToRemove.toString());
}

//Remove all output files (Videos and GIFs) from previous renders
for(var i=0;i<foldersToClear.length;i++){
    $.writeln("Removing files: " + foldersToClear[i].toString());
    removeAllFilesInAfolder(foldersToClear[i], false);
}

// Trigger "Collect Files"
app.executeCommand(app.findMenuCommandId("Collect Files..."));
 
//Rename folder just created so that it is always the same as defined in AME as Watch Folder
var folderToRename = new Folder(rootFolder + "\\" + collectedFilesFolder);
$.writeln("Now renaming: " + folderToRename.toString());

if(folderToRename.exists){
    folderToRename.rename("1 - Media Encoder Input");
}else{
       $.writeln("Failed to rename: " + folderToRename.toString());
 }

 //Delete the temporary file
temporaryAep.remove();  

///Re-open original project
app.open(origFile);
}

function removeAllFilesInAfolder(targetFolder, removeSubFolders)
{
    if(targetFolder instanceof Folder){
        var fileList = targetFolder.getFiles();
        
        for (var j = 0; j < fileList.length; j++) {
            //If another subfolder is encountered, do a recursive call of this method
            if(fileList[j] instanceof Folder){
                var subfolder = fileList[j];
                removeAllFilesInAfolder(subfolder, removeSubFolders);
                //Subfolder is now empty, delete it
                if(removeSubFolders){
                    subfolder.remove();
                }
            }else{
                //We found a file
                fileList[j].remove();
            }
         }
      }else{
          $.writeln("Object passed for removal of all files in a folder is not of type Folder: " + targetFolder.toString());
      }
}