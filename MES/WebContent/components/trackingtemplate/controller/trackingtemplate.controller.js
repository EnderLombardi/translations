"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {
    /**
    * Apply a filter on the confirmation Notes List depending 
    * on the state of the checkbox 
    * (only not confirmed operation)
    * @param {Object} oEvent wich represent the event on press from the CheckBox last note
    */
    showOnlyLastConfirmationNote: function (oEvent) {
        var flag = oEvent.getSource().getSelected();
        var listConfirmationNotes = this.getView().byId("trackingtemplateView--confirmationNotes");
        var aFilters = [];

        //we had the filter only if the checkbox state is true.
        if (flag) {
            aFilters.push(new sap.ui.model.Filter({
                path: "STATE",
                test: function (oValue) {
                    if (oValue === "CONFIRMED") {
                        return true;
                    }
                    return false;
                }
            }));
        }
        //we apply the filter here
        listConfirmationNotes.getBinding("items").filter(aFilters);
    },

    /**
    * Show Comment Box to Add Comments
    */
    showCommentBox: function () {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(true);
    },

    /**
     * Hide Comment Box to Add Comments
     */
    hideCommentBox: function () {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(false);
        console.log(commentBox);
    },

    /**
     * Submit Disruption Comment
     * @param {Object} oEvent wich represent the event on press from the CheckBox last note
     */
    showOnlyLastWONote: function (oEvent) {
        var oViewModel = airbus.mes.trackingtemplate.oView.getModel("TrackingTemplate");
        oEvent.getSource().getSelected() ? oViewModel.setSizeLimit(1) : oViewModel.setSizeLimit(100);
        oViewModel.refresh(true);
    },

    /**
     * Hide Comment Box to Add Comments
     */
    printTrackingTemplate: function () {
        var ctrlString = "width=500px, height= 600px";
        var wind = window.open('', 'PrintWindow', ctrlString);
        var chart = document.getElementById('trackingtemplateView--listNotes').outerHTML;
        // wind.document.write('<html><head><title>Print it!</title>'
        // +'<link rel="stylesheet" type="text/css" href="../../../Sass/global.css">'
        // +'<link rel="stylesheet" type="text/css" href="../../../lib/dhtmlxscheduler/dhtmlxscheduler.css">'
        // +'<link rel="stylesheet" type="text/css" href="../../../lib/dhtmlxscheduler/dhtmlxscheduler_flat.css">'
        // +'</head><body>');
        wind.document.write(chart);
        // wind.document.write('</body></html>');
        wind.print();
        wind.close();
    },

    /**
     * Submit a comment 
     */
    submitComment: function () {
        var textArea = this.getView().byId('commentArea');
        console.log(textArea.getValue());
        textArea.setValue('');
        var attachmentFilesCollection = this.getView().byId('UploadCollection');
        var collection = attachmentFilesCollection.getItems();
        var size = collection.length;
        console.log(size);
        var i = 0;
        for (; i < size; i += 1) {
            console.log(collection[i].getAttributes());
            console.log(collection[i].getFileName());
        }

        if (!this._oUserConfirmationDialog) {

            this._oUserConfirmationDialog = sap.ui
                .xmlfragment(
                "airbus.mes.trackingtemplate.fragments.userConfirmation",
                this);

            this.getView().addDependent(
                this._oUserConfirmationDialog);
        }
        this._oUserConfirmationDialog.open();
    },

    onCancelConfirmation: function () {
        this._oUserConfirmationDialog.close();
    },

    onOKConfirmation: function () {
        this.onOKConfirmation.close();
    }

});