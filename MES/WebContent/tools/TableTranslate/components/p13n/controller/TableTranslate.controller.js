sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "airbus/mes/poc/p13n/model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("airbus.mes.poc.p13n.controller.TableTranslate", {

        formatter: formatter,

        onInit: function () {

        },

        onItemCreated: function (id, context) {

            var alert = this.formatter.alertData(context.getProperty('data'));

            var oTemplate = new sap.ui.core.Item({
                selectedKey: context.getProperty('name'),
                text: context.getProperty('name') + alert
            });

            return oTemplate;

        },

        onSelect: function (oEvent) {
            var sValue = oEvent.mParameters.value;
            if (oEvent.mParameters.value.substr(sValue.length - 4, sValue.length) === ' [X]') {
                sValue = oEvent.mParameters.value.substr(0, sValue.length - 4);
            }
            var oData = this.getView().getModel('myFillCombobox').getData();
            oData = oData.Row.filter(x => x.name === sValue);
            var oModel = this.getView().getModel('myTable');
            oModel.setData(oData[0]);

        }

    });
});