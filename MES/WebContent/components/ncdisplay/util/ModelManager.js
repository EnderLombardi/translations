"use strict";
jQuery.sap.declare("airbus.mes.ncdisplay.util.ModelManager")

airbus.mes.ncdisplay.util.ModelManager = {

    urlModel : undefined,
    brOnMessageCallBack:function (data) {},
    queryParams : jQuery.sap.getUriParameters(),

    // variable for filter
    productionOrder : "P",
    operation : "O",
    operationData: undefined,

    init : function(core) {

        this.core = core;

        var dest;

        switch (window.location.hostname) {
            case "localhost":
                dest = "local";
                break;
            case "wsapbpc01.ptx.fr.sopra":
                dest = "sopra";
                break;
            default:
                dest = "airbus";
                break;
        }

        if (this.queryParams.get("url_config")) {
            dest = this.queryParams.get("url_config");
        }

        this.urlModel = new sap.ui.model.resource.ResourceModel({
            bundleName : "airbus.mes.ncdisplay.config.url_config",
            bundleLocale : dest
        });

        if (  dest === "sopra" ) {

            var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

            for (var prop in oModel) {
                if (oModel[prop].slice(-5) != ".json" ) {
                    oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password="  + Cookies.getJSON("login").mdp;
                }
            }
        }

        airbus.mes.shell.ModelManager.createJsonModel(core,["ncdisplaydata"]);
        this.loadNcDisplayData();
        airbus.mes.ncdisplay.util.ModelManager.operationData = this.getOperationData();

    },
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
    }

}
