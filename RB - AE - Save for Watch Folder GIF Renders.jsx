/*  
This is a workaround to the Adobe Media Encoder "watch folder" issue of not
picking up new compositions in the project file.
Reference: https://forums.adobe.com/thread/2301289
*/

{
var origFile = app.project.file;    
    
var projectContext;
var rootFolder;

var time = new Date().getMinutes() + new Date().getSeconds();
var tempProjectName = "Anims_" + time + ".aep";
var collectedFilesFolder = "Anims_" + time + " folder";    //This is the folder that AE will create when 'Collect Files'

var temporaryAep;

$.writeln("------ GO ------");

prepare(origFile);
clearOutputFolders();
collectFiles();

 //Is Script running for STP or PTP?
 function prepare(origFile){

     if(origFile.toString().indexOf("STP") != -1){
         projectContext = "STP";
     }else if(origFile.toString().indexOf("PTP") != -1){
        projectContext = "PTP";
    }else{
        $.writeln("Error: Original file is neither STP or PTP Prototype");
        return 0;
    }
    $.writeln("Project is: " + projectContext);
    rootfolder = "T:\\Product Development\\Projects\\Go-2\\L2."+projectContext+"\\GUI Prototyping";
    return 1;
}

function clearOutputFolders(){
        //Create references to folders of interest
        var folderToRemove= new Folder(rootFolder+"\\1 - Media Encoder Input");
        var foldersToClear = [new Folder(rootFolder+"\\2 - Photoshop Input"), new Folder(rootFolder+"\\3 - GIFs")];

         //First, save original project file (just in case of changes) 
        app.project.save();
         
        //Save project  under temporary filename. Note: why was this needed?
        temporaryAep = new File("~/Desktop/"+tempProjectName);
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
}

function collectFiles(){
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

} //End of scope

function removeAllFilesInAfolder(targetFolder, removeSubFolders)
{
    if(targetFolder instanceof Folder){
        var fileList = targetFolder.getFiles();
        
        for (var j = 0; j < fileList.length; j++) {
            //If another subfolder is encountered, do a recursive call of this method
            if(fileList[j] instanceof Folder){
                var subfolder = fileList[j];
                removeAllFilesInAfolder(subfolder, removeSubFolders);
                //Subfolder is now empty, delete it. Note: A folder can only be deleted by this script, if it is empty
                if(removeSubFolders){
                    subfolder.remove();
                }
            }else if(fileList[j].name.indexOf("exe") == -1){
                //We found a file
                fileList[j].remove();
            }
         }
      }else{
          $.writeln("Object passed for removal of all files in a folder is not of type Folder: " + targetFolder.toString());
      }
}