function SaveFileAsManager(app) {
    /* Outlets */
    this.saveAsButton = $("#save-as");

    /* Variables */
    this.app = app;

    /* Events */
    this.saveAsButton.on("click", $.proxy(function () { this.apply(); }, this));
    Mousetrap.bind(["command+shift+s", "ctrl+shift+s"], $.proxy(function(e) { this.apply(); return false; }, this)); // Ctrl+n = new window.
}

SaveFileAsManager.prototype = {
    constructor: SaveFileAsManager,
    apply: function() {
        var t = this;
        chrome.fileSystem.chooseEntry( { type: "saveFile", suggestedName: "document.md" }, function(savedFile) {
            if (savedFile) {
                savedFile.createWriter(function(fileWriter) {
                    var truncated = false;
                    fileWriter.onwriteend = function(e) {
                        if (!truncated) {
                            truncated = true
                            this.truncate(this.position);
                            return;
                        }
                        // newRecentFile(fileEntry); // Update the position of the file saved.
                        t.app.setEditorEntry(savedFile);
                    };
                    fileWriter.write(new Blob([t.app.getEditorText()], {type: 'plain/text'}));
                }, function(error) { console.log(error); });
            }
        });
    }
}
