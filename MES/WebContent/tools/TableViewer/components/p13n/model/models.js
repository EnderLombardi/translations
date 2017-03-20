sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {

        // Form Data
        createJsonMyTableModel: function () {
            var oModel = new JSONModel();
            oModel.setData({"name": "","rows": 50});
            return oModel;
        },

        // Fill Combobox with Data
        createJsonAllTableModel: function () {
            var oModel = new JSONModel();
            oModel.loadData("https://dmiswde0.eu.airbus.corp/XMII/Illuminator?service=DynamicQuery&server=SAPMEWIP&mode=TableList&content-type=text/json&j_user=S00DB44&j_password=start102", true);
            oModel.setSizeLimit(2000)
            return oModel;
        },

        // Column Data
        createJsonColumnModel: function () {
            var oModel = new JSONModel();
            oModel.setSizeLimit(2000)
            return oModel;
        },

        // Row Data
        createJsonRowModel: function () {
            var oModel = new JSONModel();
            oModel.setSizeLimit(2000)
            return oModel;
        }

    };
});