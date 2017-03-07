"use strict";
jQuery.sap.declare("airbus.mes.ncdisplay.util.ModelManager")

airbus.mes.ncdisplay.util.ModelManager = {

    urlModel : undefined,
    brOnMessageCallBack:function (data) {},

    // variable for filter
    workOrder : "P",
    operation : "O",
    operationData: undefined,

    init : function(core) {

        this.core = core;

	    // Handle URL Model
		this.urlModel = airbus.mes.shell.ModelManager.urlHandler("airbus.mes.ncdisplay.config.url_config");

        airbus.mes.shell.ModelManager.createJsonModel(core,["ncdisplaydata", "getExternalUrlTemplate"]);
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
				"phStation" : airbus.mes.settings.ModelManager.station, 
				"shopOrderBO" : airbus.mes.stationtracker.operationDetailPopup.getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0].shopOrderBo,
			}),

			success : function(data) {

				try {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
        				console.log(data);
	                 }
	                 if (typeof data != "object" || data === null) {
//						In case the tool list is empty, we receive "null"
   	                 	data = { ncDetailList : [] };
	               	 }         
	                 data.ncDetailList = data.ncDetailList || [];	                 
	                 if (!Array.isArray(data.ncDetailList)) {
//		 				 In case the tool list contain one element, we receive an object
	                	 data.ncDetailList = [ data.ncDetailList ];
		             }
	                 oViewModel.setData(data);
	                 oViewModel.getData().ncDetailList.count = oViewModel.getData().ncDetailList.length;
	                 oViewModel.refresh(true);

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
    },
    
    /******************************************************
     * Get URL for URL Template for external tool
     */
    getExternalUrlTemplate : function(erp_id, functionName) {
    	
//    	First step, retrieve correct url depending site and target erp
    	var sGetExternalUrl = this.urlModel.getProperty('getExternalUrlTemplate');
    	sGetExternalUrl = sGetExternalUrl.replace("$Site", airbus.mes.settings.ModelManager.site);
    	sGetExternalUrl = sGetExternalUrl.replace("$ErpId", erp_id);
    	sGetExternalUrl = sGetExternalUrl.replace("$Function", functionName);
    	return sGetExternalUrl;
    },
    getCreateNcUrl: function(functionName){
    	var oOperationData = sap.ui.getCore().getModel("operationDetailModel").getData().Rowsets.Rowset[0].Row[0];
    	var sUrl = this.getExternalUrlTemplate(
    		oOperationData.erp_system,
    		functionName
    	)
    	var workOrder = oOperationData.wo_no;
    	var operation = oOperationData.operation_no;
    	
    	jQuery.ajax({
			type : 'GET',
			url : sUrl,
			success : function(data) {
				var sGetExternalUrl = data.Rowsets.Rowset[0].Row[0].str_output;
		    	sGetExternalUrl = sGetExternalUrl.replace("p_workorder", workOrder);
		    	sGetExternalUrl = sGetExternalUrl.replace("p_operation", operation);
		    	window.location.href = sUrl;
		    	
			},
			error : function(error, jQXHR) {
				console.log("error in getting Url");
			}
		});	
    }

}
