"use strict";
jQuery.sap.declare("airbus.mes.trackingtemplate.util.ModelManager")

airbus.mes.trackingtemplate.util.ModelManager = {

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

        airbus.mes.shell.ModelManager.createJsonModel(core,["ncdisplaydata"]);
        this.loadNcDisplayData();
        airbus.mes.ncdisplay.util.ModelManager.operationData = this.getOperationData();

    }/*,
    //load
    loadNcDisplayData : function() {
        var oModel = sap.ui.getCore().getModel("ncdisplaydata");
        oModel.loadData(this.getNcDisplayData(), null, false);
    },

    //get
    getNcDisplayData : function() {
        var url = this.urlModel.getProperty("ncdisplaydata");
        url = airbus.mes.shell.ModelManager.replaceURI(url, "$site", airbus.mes.settings.ModelManager.site);
        return url;
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
    }*/

}
