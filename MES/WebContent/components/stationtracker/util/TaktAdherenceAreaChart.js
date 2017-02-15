"use strict";

sap.ui.core.Control.extend("airbus.mes.stationtracker.util.TaktAdherenceAreaChart", {
	metadata: {
		aggregations: {
			"data": {
				type: "airbus.mes.stationtracker.util.Coordinates",
				singularName: "data"
			},
			"realData": {
				type: "airbus.mes.stationtracker.util.Coordinates",
				singularName: "realData"
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

		if (airbus.mes.stationtracker.oView.byId("stationTrackerView--takt_adherence_area_chart").getData().length !==0) {
			airbus.mes.stationtracker.util.GraphManager.loadGraph();
		}

	}
});
