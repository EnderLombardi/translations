"use strict";
jQuery.sap.declare("airbus.mes.stationHandover.util.ModelManager");

airbus.mes.stationHandover.util.ModelManager = {
	urlModel : undefined,
	aSelected : {},
	queryParams : jQuery.sap.getUriParameters(),
	i18nModel : undefined,
	selectAll : false,
	copyOfModel : {},
	filter : {
		"search" : undefined,
		"type" : new sap.ui.model.Filter({
			path : "TYPE",
			test : function(oValue) {

				if (airbus.mes.stationHandover.util.ModelManager.filter.aType.indexOf(oValue) != -1) {

					return true;
				} else {

					return false;
				}
			}
		}),
		"noTime" : new sap.ui.model.Filter("NO_TIME", "EQ", "false"),
		"inserted" : new sap.ui.model.Filter("INSERTED", "EQ", "false"),
		"station" : new sap.ui.model.Filter({
			path : "ORIGIN_STATION",
			test : function(oValue) {
				//						
				//						if ( airbus.mes.stationHandover.util.ModelManager.filter.aStation.indexOf(oValue) != -1 ){
				//							
				//							return true;
				//					} else {
				//						
				//						return false;
				//					}
				//}
				return true;
			}
		}),
		"aType" : [ "0" ],
		"aStation" : [],
	},

	init : function(core) {

		var aModel = [ "oswModel", "msnModel", "typeModel", "groupModel", "phStation", "optionInsertOsw" ]
		airbus.mes.shell.ModelManager.createJsonModel(core, aModel);

		core.getModel("oswModel").attachRequestCompleted(airbus.mes.stationHandover.util.ModelManager.onOswLoad);

		var dest;

		switch (window.location.hostname) {
		case "localhost":
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
			bundleName : "airbus.mes.stationHandover.config.url_config",
			bundleLocale : dest
		});

		if (dest === "sopra") {

			var oModel = this.urlModel._oResourceBundle.aPropertyFiles[0].mProperties;

			for ( var prop in oModel) {
				if (oModel[prop].slice(-5) != ".json") {
					oModel[prop] += "&j_user=" + Cookies.getJSON("login").user + "&j_password=" + Cookies.getJSON("login").mdp;
				}
			}
		}

	},

	/* *********************************************************************** *
	 *  Replace URL Parameters                                                 *
	 * *********************************************************************** */
	replaceURI : function(sURI, sFrom, sTo) {
		return sURI.replace(sFrom, encodeURIComponent(sTo));
	},

	loadOptionInsertOsw : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("optionInsertOsw");
		var getUrlShifts = this.urlModel.getProperty("urloptioninsertosw");

		oViewModel.loadData(getUrlShifts, null, false);

	},

	loadOsw : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		var getUrlShifts = this.urlModel.getProperty("urltest");

		oViewModel.loadData(getUrlShifts, null, false);

	},

	loadPhStation : function() {

		try {

			var oModel = airbus.mes.settings.oView.getModel("plantModel").oData.Rowsets.Rowset[0].Row;
			var oModelStation = airbus.mes.stationHandover.oView.getModel("phStation");
			var oContext = airbus.mes.settings.ModelManager;
			var oModelManager = airbus.mes.stationHandover.util.ModelManager;
			var aPhStation = [];
			var aModel = oModel.filter(function(el) {

				return el.msn === oContext.msn

			});
			// select a planned takt start date/time strictly smaller than the planned start date/time by setting
			aModel.forEach(function(el) {

				if (new Date(el.Takt_Start) < new Date(oContext.taktStart)) {

					el.sDate = Date.parse(new Date(el.Takt_Start));
					aPhStation.push(el);

				}

			});
			//			 // Add current station msn site object selected from setting	
			//			  var oCurrent = oModel.filter(function (el) {
			//		             
			//					 return el.msn === oContext.msn && oContext.station === el.station
			//		         
			//				 })[0];

			// oCurrent.sDate = Date.parse(new Date(oCurrent.Takt_Start))
			//aPhStation.push(oCurrent);
			aPhStation.sort(airbus.mes.shell.util.Formatter.fieldComparator([ 'sDate' ]));
			//				//As a default, the physical station with the biggest planned start date/time should be selected.
			oModelManager.filter.aStation.push(aPhStation[aPhStation.length - 1].station);
			oModelStation.setData(aPhStation);
			console.log(aPhStation);

		} catch (e) {

			console.log("No Ph station load bug problem")
		}

	},

	onOswLoad : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("oswModel");
	//	var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		
		try {

			var aModel = oViewModel.oData.row;
			airbus.mes.stationHandover.util.ModelManager.copyOfModel = JSON.parse(JSON.stringify(oViewModel.oData));
			//Create tree of for manage selection of tree
			aModel.forEach(function(el, indice) {

//				aValueSelected[el.WOID] = {
//					"open" : String(el.INSERTED) == "true",
//					"initial" : String(el.INSERTED) == "true",
//					"oswItems" : JSON.parse(JSON.stringify(el))
//				};
				
				el.SELECTED = el.INSERTED;

				aModel[indice].row.forEach(function(al, indice1) {

					var sID = al.WOID + "##||##" + al.REFERENCE;

//					aValueSelected[al.WOID][sID] = {
//						"open" : String(el.INSERTED) == "true",
//						"initial" : String(el.INSERTED) == "true",
//						"oswItems" : JSON.parse(JSON.stringify(al))
//					};

					al.SELECTED = al.INSERTED;
				})
			})

		} catch (e) {

			console.log("Error");

		}
	},

	onShiftsLoad : function() {

		var GroupingBoxingManager = airbus.mes.stationHandover.util.GroupingBoxingManager;
		GroupingBoxingManager.parseShift();
	},

	loadType : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("typeModel");
		var getUrl = this.urlModel.getProperty("urltype");

		oViewModel.loadData(getUrl, null, false);
		oViewModel.refresh();

	},

	loadGroup : function() {

		var oViewModel = airbus.mes.stationHandover.oView.getModel("groupModel");
		var getUrl = this.urlModel.getProperty("urlgroup");

		oViewModel.loadData(getUrl, null, false);
		oViewModel.refresh();

	},

	getMsn : function() {

		var aMsn = airbus.mes.settings.oView.byId("selectMSN").getItems();
		var aModel = [];
		var oViewModel = airbus.mes.stationHandover.oView.getModel("msnModel");

		aMsn.forEach(function(el) {

			aModel.push({
				"msn" : el.mProperties.text,
				"key" : el.mProperties.key,
			})
		})

		oViewModel.setData(aModel);
		oViewModel.refresh();
	}
};
