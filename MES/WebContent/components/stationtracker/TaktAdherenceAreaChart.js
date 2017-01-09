"use strict";

sap.ui.core.Control.extend("airbus.mes.stationtracker.TaktAdherenceAreaChart", {
	metadata: {
		aggregations: {
			"data": {
				type: "airbus.mes.stationtracker.Coordinates",
				//				multiple : false,
				singularName: "data",
				//				bindable: "bindable"
			},
			"realData": {
				type: "airbus.mes.stationtracker.Coordinates",
				//				multiple : false,
				singularName: "realData",
				//				bindable: "bindable"
			}
		}
	},

	renderer: function (oRm, oControl) {
		
			oRm.write("<svg ");
			oRm.writeControlData(oControl);
			oRm.write(" class='takt_adherence_area_chart' viewBox='0 0 " + $('#stationTrackerView--chartId').width() + " 119' perserveAspectRatio='xMinYMid'");
			oRm.write(" />");
	
	},

	onAfterRendering: function onAfterRendering(oEvt) {

		airbus.mes.stationtracker.GraphManager.loadGragph();

	}
});
