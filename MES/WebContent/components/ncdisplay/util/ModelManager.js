"use strict";
jQuery.sap.declare("airbus.mes.ncdisplay.util.ModelManager")

airbus.mes.ncdisplay.util.ModelManager = {

    urlModel : undefined,
    brOnMessageCallBack:function (data) {},

    // variable for filter
    productionOrder : "P",
    operation : "O",
    operationData: undefined,

    init : function(core) {

        this.core = core;

	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.ncdisplay.config.url_config");

        airbus.mes.shell.ModelManager.createJsonModel(cre,["ncdisplaydata", "getExternalUrlTemplate"]);
        this.loadNcDisplayData();
        airbus.mes.ncdisplay.util.ModelManager.operationData = this.getOperationData();

    },
    //load
    loadNcDisplayData : function() {

//    	Because andre
		var oViewModel = sap.ui.getCore().getModel("ncdisplaydata");
		var getncdisplaydata = this.urlModel.getProperty('ncdisplaydata');

		jQuery.ajax({
			type : 'post',
			url : getncdisplaydata,
			contentType : 'application/json',
			async : 'true',
			data : JSON.stringify({
				"site" : airbus.mes.settings.ModelManager.site,
				"sfcStepBO" : airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].sfc_step_ref,
				"lang" : sap.ui.getCore().getConfiguration().getLanguage(),
				"ShopOrder" : airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].wo_no,
				"erpSystem" : airbus.mes.operationstatus.oView.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].erp_system,				
			}),

			success : function(data) {
				try {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                 }
                 if(!data.ncDetailList[0]){
                        data.ncDetailList = [data.ncDetailList];
                 }
                 oViewModel.setData(data);

				} catch (e) {
					console.log("NO NC Display data load");
					
				}

			},

			error : function(error, jQXHR) {
				console.log("NO NC Display data load");

			}
		});	    	
    	
    },

    getOperationData: function(){
        var oModel = [sap.ui.getCore().getModel("operationDetailModel").oData.Rowsets.Rowset[0].Row[0]];
        return oModel;
    },

    getItemsTable : function(){
        var oTable = sap.ui.getCore().byId("ncdisplayView--ncDisplay");
        var itemsArray = oTable.getItems();
        $.each(itemsArray, function(i){
            var items = itemsArray[i].findElements('cells')[1];
            if(items.getProperty("text") === "NC"){
                items.getParent().setProperty('type', 'Active');
                console.log(items.getParent());
//                items.getParent().attachEvent(items.getParent().getId(), function(oEvnt){
//                    oEvnt.getSource();
//                    console.log("work ?");
//                })
            }
        });
    },

    openNcDisplayPopUp : function(){
        if (airbus.mes.ncdisplay.ncdisplayPopUp === undefined) {
            airbus.mes.ncdisplay.ncdisplayPopUp = sap.ui.xmlfragment("ncdisplayPopUp", "airbus.mes.ncdisplay.fragments.ncdisplayPopUp", airbus.mes.ncdisplay.oView.getController());
            airbus.mes.ncdisplay.oView.addDependent(airbus.mes.ncdisplay.ncdisplayPopUp);
        }
        airbus.mes.ncdisplay.ncdisplayPopUp.open();
    },
    
    loadExternalUrl : function() {
    	
//    	First step, retrieve correct url depending site and target erp
    	var sGetExternalUrl = this.urlModel.getProperty('getExternalUrlTemplate');
    	sGetExternalUrl = sGetExternalUrl.replace("$Site", airbus.mes.settings.ModelManager.site);
    	sGetExternalUrl = sGetExternalUrl.replace("$ErpId", airbus.mes.stationtracker.util.ModelManager.stationInProgress.ERP_SYSTEM);
    	sGetExternalUrl = sGetExternalUrl.replace("$Function", "OPEN_NC");
    
    	var oModel = sap.ui.getCore().getModel("getExternalUrlTemplate");
    	oModel.loadData(sGetExternalUrl, null, false);
    	
//    	Second step, retrieve the url on the model
    	return oModel.getData().Rowsets.Rowset[0].Row[0].str_output;
    }

}
