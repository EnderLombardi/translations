"use strict";

jQuery.sap.declare("airbus.mes.components.util.Formatter");

airbus.mes.components.util.Formatter = {

    translateFilter : function(sName) {
        return  airbus.mes.components.oView.getModel("i18nComponentsModel").getProperty(sName);
    },

    convertJsontoXmlPapi: function(json){
        var sXmlStart = '<?xml version="1.0" encoding="UTF-8"?><Rowsets><Rowset>'
                      + '<Columns>'
                      + '<Column SourceColumn="BOMComponentBO" SQLDataType="12" Name="BOMComponentBO" MinRange="0" MaxRange="100" Description="BOMComponentBO"/>'
                      + '<Column SourceColumn="Site" SQLDataType="12" Name="Site" MinRange="0" MaxRange="100" Description="Site"/>'
                      + '<Column SourceColumn="Checked_Components" SQLDataType="12" Name="Checked_Components" MinRange="0" MaxRange="100" Description="Checked_Components"/>'
                      + '<Column SourceColumn="Fitted_Components" SQLDataType="12" Name="Fitted_Components" MinRange="0" MaxRange="100" Description="Fitted_Components"/>'
                      + '</Columns>';
        var sXmlEnd =     '</Rowset></Rowsets>';
        var sXmlByRow = "";
        json.forEach(function(el){
            sXmlByRow += airbus.mes.stationtracker.util.Formatter.json2xml({Row : {
            	BOMComponentBO : [el.BOMComponentBO],
            	Site : [airbus.mes.settings.site],
            	Checked_Components : [el.Checked_Components],
            	Fitted_Components : [el.Fitted_Components],
            },})
        });
        var sXml = sXmlStart + sXmlByRow + sXmlEnd;
        airbus.mes.components.util.ModelManager.jsonConvertedToXmlPapi = sXml;
    },
                            
    convertJsontoXmlJCO: function(json, sUser, sPassword){
        var sXmlStart = '<?xml version="1.0" encoding="UTF-8"?>'
                      + '<Z_MES_SAVE_COMPONENT_>'
                      + '<INPUT>'
                      + '<IT_COMPONENTS>';
        var sXmlEnd = '</IT_COMPONENTS>'
			        + '<IV_APPLICATION_ID>MES</IV_APPLICATION_ID>'
			        + '<IV_BADGE_ID/>'
			        + "<IV_LANGUAGE>'E'</IV_LANGUAGE>"
			        + '<IV_PASSWORD>'
			        + sPassword
			        + '</IV_PASSWORD>'
			        + '<IV_UNAME>'
			        + sUser
			        + '</IV_UNAME>'
			        + '</INPUT>'
			        + '</Z_MES_SAVE_COMPONENT_>';

        var sXmlByRow = "";
        json.forEach(function(el){
            sXmlByRow += airbus.mes.stationtracker.util.Formatter.json2xml({Row : {
            	BOMComponentBO : [el.BOMComponentBO],
            	Site : [airbus.mes.settings.site],
            	Checked_Components : [el.Checked_Components],
            	Fitted_Components : [el.Fitted_Components],
            },})
        });
        var sXml = sXmlStart + sXmlByRow + sXmlEnd;
        airbus.mes.components.util.ModelManager.jsonConvertedToXmlJCO = sXml;
    },

};
