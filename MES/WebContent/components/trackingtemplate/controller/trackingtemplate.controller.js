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
* Show Upload Box to Add Comments
*/
    // showUploadBox: function (oEvt) {
    //     var commentBox = this.getView().byId("trackingtemplateView--commentBox");
    //     commentBox.setVisible(true);
    //     var uploadBox = this.getView().byId("trackingtemplateView--UploadCollection");
    //     uploadBox.setVisible(true);
    //     console.log(uploadBox);
    // },

    // /***********************************************************
    //  * Hide Upload Box to Add Comments
    //  */
    // hideUploadBox: function (oEvt) {
    //     var uploadBox = this.getView().byId("trackingtemplateView--UploadCollection");
    //     uploadBox.setVisible(false);
    // },

    /***********************************************************
     * Submit Disruption Comment
     */
    submitComment: function (oEvt) {

    },


});