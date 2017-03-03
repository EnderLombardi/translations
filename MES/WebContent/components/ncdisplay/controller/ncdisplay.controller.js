"use strict";
sap.ui.controller("airbus.mes.ncdisplay.controller.ncdisplay", {

	sSet : undefined,	
	
    onAfterRendering: function(){
		this.filterNcDisplay(this.sSet);
	},

	checkSettingNCDisplay: function () {
		
		// confirm if we have already check the ME settings
		if (this.sSet === undefined){
			
				//will be the configuration received in AppConfManager
//				Application manager configuration is setting to physical station level, we concatenate the ID VIEW_ATTACHED_TOOL with the physical station
				var sSet = airbus.mes.settings.AppConfManager.getConfiguration("VIEW_ATTACHED_NC_" + airbus.mes.settings.ModelManager.station);
				
				if(sSet === null) {
					this.sSet = airbus.mes.ncdisplay.util.ModelManager.operation;
				} else {
					this.sSet = sSet;
				}
				
		}
		
		switch (this.sSet) {
			case airbus.mes.ncdisplay.util.ModelManager.operation://operation
				sap.ui.getCore().byId("ncdisplayView--ncDisplayOpe").setSelected(true);
				break;
			case airbus.mes.ncdisplay.util.ModelManager.workOrder://work order
				sap.ui.getCore().byId("ncdisplayView--ncDisplayOrder").setSelected(true);
				break;
			default: //if Null operation default mode
				sap.ui.getCore().byId("ncdisplayView--ncDisplayOpe").setSelected(true);
				break;
		}
		
		this.filterNcDisplay(this.sSet);
	},    
    
    
    
    defaultSelectNcDisplay: function () {
        this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.workOrder);
        sap.ui.getCore().byId("ncdisplayView--ncDisplayOrder").setSelected(true);
    },

    //get user action on the checkbox field
    onSelectLevel: function (oEvent) {

        var sId = oEvent.mParameters.selectedIndex;
        switch (sId) {
            case 0://operation button
                this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.operation);
                break;
            case 1://work order button
                this.filterNcDisplay(airbus.mes.ncdisplay.util.ModelManager.workOrder);
                break;
            default:
                break;
        }
    },

    //table filter
    filterNcDisplay: function (sScope) {
    	this.sSet = sScope;
        var idOpe = airbus.mes.ncdisplay.util.ModelManager.operationData;
        switch (sScope) {
            case airbus.mes.ncdisplay.util.ModelManager.operation:
                sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("rows").filter(new sap.ui.model.Filter("operationNumber", "EQ", idOpe[0].operation_id));
                break;
            case airbus.mes.ncdisplay.util.ModelManager.workOrder:
                sap.ui.getCore().byId("ncdisplayView--ncDisplay").getBinding("rows").filter();
                break;
            default:
                break;
        }
    },

    onLineClick: function(oEvent){
    	var sUrl;
    	var sNcReference;
    	
//        var cellText = oEvent.getParameter("listItem").getCells()[1].getProperty("text");
//        if(cellText === "NC" || cellText === "PNC" || cellText === "IR"){
//        	Get url
        	sUrl = airbus.mes.ncdisplay.util.ModelManager.loadExternalUrl();
        	
//        	Replace parameters
        	sNcReference = sap.ui.getCore().getModel("ncdisplaydata").getProperty(oEvent.getSource().getParent().getBindingContext("ncdisplaydata").getPath()).ncReference;
        	sUrl = sUrl.replace("p_notification", sNcReference);

//			Open URL        	
        	window.open(sUrl);
//        }
    },

    closePopUp: function(){
        airbus.mes.ncdisplay.ncdisplayPopUp.close();
    }
});
