"use strict";
sap.ui.controller("airbus.mes.trackingtemplate.controller.trackingtemplate", {
    
    onInit: function () {
		/*
		//this.nav = this.getView().byId("operDetailNavContainer");
		if (airbus.mes.trackingtemplate.status === undefined || airbus.mes.trackingtemplate.status.oView === undefined) {
			sap.ui.getCore().createComponent({
				name: "airbus.mes.trackingtemplate.status",
			});
			this.nav.addPage(airbus.mes.trackingtemplate.status.oView);
		}
		*/
    },

    // Get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0://operation button
                this.filterTckTemplate(airbus.mes.trackingtemplate.util.ModelManager.operation);
                break;
            case 1://work order button
                this.filterTckTemplate(airbus.mes.trackingtemplate.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },

    // List filter
    filterTckTemplate: function (sScope) {
        //var idOpe = airbus.mes.trackingtemplate.util.ModelManager.operationData;
        switch (sScope) {
            case airbus.mes.trackingtemplate.util.ModelManager.operation:
                //sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter(new sap.ui.model.Filter("idOpe", "EQ", idOpe[0].operation_id));
                break;
            case airbus.mes.trackingtemplate.util.ModelManager.workOrder:
                //sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("items").filter();
                break;
            default:
                break;
        }
    },

    /***********************************************************
    * Apply a filter on the confirmation Notes List depending 
    * on the state of the checkbox 
    * (only not confirmed operation)
    */
    showOnlyLastNote: function (oEvent) {
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

    /***********************************************************
    * Show Comment Box to Add Comments
    */
    showCommentBox: function (oEvt) {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(true);
    },

    /***********************************************************
     * Hide Comment Box to Add Comments
     */
    hideCommentBox: function (oEvt) {
        var commentBox = this.getView().byId("trackingtemplateView--commentBox");
        commentBox.setVisible(false);
        console.log(commentBox);
    },

    /***********************************************************
     * Submit Disruption Comment
     */

    chckLastNote: function (oEvent) {
        var oViewModel = airbus.mes.trackingtemplate.oView.getModel("TrackingTemplate");
        oEvent.getSource().getSelected() ? oViewModel.setSizeLimit(1) : oViewModel.setSizeLimit(100);
        oViewModel.refresh(true);
    },

    printTrackingTemplate: function () {
        var ctrlString = "width=500px, height= 600px";
        var wind = window.open('','PrintWindow', ctrlString);
        var chart = document.getElementById('trackingtemplateView--listNotes').outerHTML;
        wind.document.write('<html><head><title>Print it!</title><link rel="stylesheet" type="text/css" href="../../../Sass/global.css"></head><body>');
        wind.document.write(chart);
        wind.document.write('</body></html>');
        wind.print();
        wind.close();
    },

    submitComment: function (oEvt) {
        var textArea = this.getView().byId('commentArea');
        console.log(textArea.getValue());
        textArea.setValue('');
        var attachmentFilesCollection = this.getView().byId('UploadCollection');
        var collection = attachmentFilesCollection.getItems();
        var size = collection.length;
        console.log(size);
        var i=0;
        for( ; i < size ; i+=1) {
            console.log(collection[i].getAttributes());
            console.log(collection[i].getFileName());
        }

    },


});