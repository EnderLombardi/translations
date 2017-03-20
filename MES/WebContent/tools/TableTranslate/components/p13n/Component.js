sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "airbus/mes/poc/p13n/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    var comp = UIComponent.extend("airbus.mes.poc.p13n.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the table, column and row model
            this.setModel(models.createJsonFillComboboxModel(), "myFillCombobox");
            this.setModel(models.createJsonTableModel(), "myTable");
        }
    });

    //	comp.prototype.createContent = function () {
    //		
    //		return sap.ui.xmlview({ viewName: "airbus.mes.poc.p13n.view.TablePerso"}); 
    //		
    //	}

    return comp;
});