jQuery.sap.require("sap.ui.vbm.AnalyticMap");
sap.ui.vbm.AnalyticMap.GeoJSONURL = "model/europe.json";

sap.ui.controller("airbus.mes.settings.view.Master", {

    onAfterRendering : function() {
	this.byId("vbi").zoomToRegions([ "FR", "GB", "ES", "DE" ]);
    },

    onInit : function() {

    },

    // User select a site on the table and the map is zoomed
    onPressSite : function(e) {

	site = e.getSource().getTitle();

	oData = this.getView().getModel("region").oData;

	for (var i = 0; i < oData.Spots.length; i++) {
	    var spot = oData.Spots[i].tooltip;
	    if (spot == site) {
		var splitter = oData.Spots[i].pos.split(";");
		sap.m.MessageToast.show(e.getSource().getTitle());
		this.byId("vbi").zoomToGeoPosition(splitter[0], splitter[1], 6);
	    }
	}

    },

    // User clicks on a site map
    onClickSpot : function(e) {
	sap.m.MessageToast.show("onClickSpot " + e.getParameter("text"));
    },

    // User clicks on any position on the map
    onRegionClick : function(e) {
	sap.m.MessageToast.show("onRegionClick " + e.getParameter("code"));
    },

    // User clicks on a button 
//    onPress : function(evt) {
//	var context = evt.getSource().getBindingContext();
//	this.nav.to("Detail", context);
//    }
});