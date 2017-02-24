"use strict";

jQuery.sap.declare("airbus.mes.components.util.Formatter");

airbus.mes.components.util.Formatter = {

    translateFilter : function(sName) {
        return  airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty(sName);
    },

    convertJsontoXml: function(json){
        var sXmlStart = '<?xml version="1.0" encoding="iso-8859-1"?><Rowsets><Rowset>';
        var sXmlEnd =     '</Rowset></Rowsets>';
        var sXmlByRow = "";
        json.forEach(function(el){
            sXmlByRow += airbus.mes.stationtracker.util.Formatter.json2xml({Row : {
                committed : [el.committed],
                fitted : [el.fitted],
                itemNumber : [el.itemNumber],
                materialDescription : [el.materialDescription],
                materialType : [el.materialType],
                operationNumber : [el.operationNumber],
                reqQty : [el.reqQty],
                serialNumber : [el.serialNumber],
                shortage : [el.shortage],
                storageLocation : [el.storageLocation],
                unit : [el.unit],
                withdrawQty : [el.withdrawQty],
                workOrder : [el.workOrder],
            },})
        });
        var sXml = sXmlStart + sXmlByRow + sXmlEnd;
        airbus.mes.components.util.ModelManager.jsonConvertedToXml = sXml;
    }

};

