"use strict";

sap.ui.controller("airbus.mes.stationHandover.controller.stationHandover", {

	onAfterRendering : function() {
		var aColumns = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns();

		aColumns.forEach(function(el, indice) {
			// Don't do auto resize blocked line it bug
			if ( indice != 1 ) {
			airbus.mes.stationHandover.oView.byId("TreeTableBasic").autoResizeColumn(indice);
			}

		});

	},

	onBackPress : function() {
		nav.back();
	},

	/***************************************************************************
	 * Display the stationHandover in view mode "Shift" only on shift is
	 * represented and the step of stationHandover is set to 30min
	 * 
	 **************************************************************************/
	onShiftPress : function() {

		airbus.mes.stationHandover.util.ShiftManager.shiftDisplay = true;
		airbus.mes.stationHandover.util.ShiftManager.dayDisplay = false;

		stationHandover.matrix['timeline'].x_unit = 'minute';
		stationHandover.matrix['timeline'].x_step = 30;
		stationHandover.matrix['timeline'].x_date = '%H:%i';
		stationHandover.templates.timeline_scale_date = function(date) {
			var func = stationHandover.date.date_to_str(stationHandover.matrix['timeline'].x_date);
			return func(date);
		};
		stationHandover.config.preserve_length = true;
		for (var i = 0; i < $("select[class='selectBoxStation']").length; i++) {
			$("select[class='selectBoxStation']").eq(i).remove();
		}

		stationHandover.updateView();

	},
	/***************************************************************************
	 * trigger when the user write in the search it filter the treetable on
	 * workorder
	 * 
	 **************************************************************************/
	filterWo : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.value;
		if (sValue != "") {

			airbus.mes.stationHandover.util.ModelManager.filter.search = new sap.ui.model.Filter("WOID", "EQ", sValue);

		} else {
			// Reset filter
			airbus.mes.stationHandover.util.ModelManager.filter.search = undefined;

		}

		this.applyMyFilter();

		airbus.mes.stationHandover.oView.byId("TreeTableBasic").expandToLevel(99);

	},
	/***************************************************************************
	 * Apply filters on the stationHandoverTracker it can user several filter at
	 * the same time
	 * 
	 **************************************************************************/
	applyMyFilter : function() {

		var oMyfilter = airbus.mes.stationHandover.util.ModelManager.filter;
		var oTreeTable = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getBinding("rows");
		var aFilter = [];

		for ( var i in oMyfilter) {

			if (oMyfilter[i] != undefined) {
				
				if (!Array.isArray(oMyfilter[i])) {
				
					aFilter.push(oMyfilter[i]);
				} 
			}
		}

		if (aFilter.length === 0) {

			oTreeTable.filter();

		} else {

			oTreeTable.filter(new sap.ui.model.Filter(aFilter, true));
		}

		airbus.mes.stationHandover.oView.byId("TreeTableBasic").expandToLevel(99);
		// ReBind to apply colors
		setTimeout(function() {
			airbus.mes.stationHandover.oView.byId("TreeTableBasic").getModel("oswModel").refresh(true);
		}, 1);

	},
	/***************************************************************************
	 * trigger when the user select a group and sort parent ascending by the
	 * value selected
	 * 
	 **************************************************************************/
	sorterMode : function(oEvt) {

		var oBinding = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getBinding("rows");
		var sValue = oEvt.getSource().mProperties.selectedKey;
		if (sValue != "") {

			airbus.mes.stationHandover.oView.byId("TreeTableBasic").bindAggregation('rows', {
				path : "oswModel>/",
				parameters : "{arrayNames:['row']}",

				sorter : new sap.ui.model.Sorter({
					// Change this value dynamic
					path : sValue,
					descending : false,
				})
			});

			airbus.mes.stationHandover.oView.getModel("oswModel").refresh();
		} else {
			// Reset filter
			oBinding.sorter();

		}

		airbus.mes.stationHandover.oView.byId("TreeTableBasic").expandToLevel(99);
		this.applyMyFilter();

	},
	/***************************************************************************
	 * trigger when cick on the type open list selection
	 * 
	 **************************************************************************/
	openFilterType : function(oEvt) {

        var oView = airbus.mes.stationHandover.oView;
        
		if (airbus.mes.stationHandover.typeFilter === undefined) {
            
            airbus.mes.stationHandover.typeFilter  = sap.ui.xmlfragment("typeFilter", "airbus.mes.stationHandover.fragments.typeFilter", airbus.mes.stationHandover.oView.getController());
            airbus.mes.stationHandover.typeFilter.addStyleClass("alignTextLeft");
            oView.addDependent(airbus.mes.stationHandover.typeFilter);
        
			}
		
        airbus.mes.stationHandover.typeFilter.openBy(oView.byId("typeHandOver"));

	},
	/***************************************************************************
	 * trigger when click on filter on origin station
	 * 
	 **************************************************************************/
	openFilterStation : function(oEvt) {
		
		 var oView = airbus.mes.stationHandover.oView;
	        
			if (airbus.mes.stationHandover.stationFilter === undefined) {
	            
	            airbus.mes.stationHandover.stationFilter  = sap.ui.xmlfragment("stationFilter", "airbus.mes.stationHandover.fragments.stationFilter", airbus.mes.stationHandover.oView.getController());
	            airbus.mes.stationHandover.stationFilter.addStyleClass("alignTextLeft");
	            oView.addDependent(airbus.mes.stationHandover.stationFilter);
	        
				}
			
	        airbus.mes.stationHandover.stationFilter.openBy(oView.byId("originHandOver"));
		
	},
	/***************************************************************************
	 * trigger when the user Select the ph station and filter the tree table on
	 * station
	 * 
	 **************************************************************************/
	filterStation : function(oEvt) {
		
		var aPath = oEvt.getSource().getContent()[0].getSelectedContextPaths()
		var oModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		
		airbus.mes.stationHandover.util.ModelManager.filter.station = undefined;
		airbus.mes.stationHandover.util.ModelManager.filter.aStation = [];
		
		aPath.forEach(function(el){
			
			var sKey = oModel.getProperty(el).ORIGIN_STATION;
			airbus.mes.stationHandover.util.ModelManager.filter.aStation.push(sKey.toUpperCase());
			
		});
		
		airbus.mes.stationHandover.util.ModelManager.filter.station = new sap.ui.model.Filter({ 
			path :  "ORIGIN_STATION",
			test : function(oValue){
				
				if ( airbus.mes.stationHandover.util.ModelManager.filter.aStation.indexOf(oValue) != -1 ){
					
					return true;
			} else {
				
				return false;
			}
		}});
			
		this.applyMyFilter();
		
	},
	/***************************************************************************
	 * Trigger when the use leave the typeSelection popOver it filter the osw
	 * list on TYPE
	 * 
	 **************************************************************************/
	filterType : function(oEvt) {

		var aPath = oEvt.getSource().getContent()[0].getSelectedContextPaths()
		var oModel = airbus.mes.stationHandover.oView.getModel("typeModel");
		
		airbus.mes.stationHandover.util.ModelManager.filter.type = undefined;
		airbus.mes.stationHandover.util.ModelManager.filter.aType = [];
		
		aPath.forEach(function(el){
			
			var sKey = oModel.getProperty(el).key;
			airbus.mes.stationHandover.util.ModelManager.filter.aType.push(sKey.toUpperCase());
			
		});
		
		airbus.mes.stationHandover.util.ModelManager.filter.type = new sap.ui.model.Filter({ 
			path :  "TYPE",
			test : function(oValue){
				
				if ( airbus.mes.stationHandover.util.ModelManager.filter.aType.indexOf(oValue) != -1 ){
					
					return true;
			} else {
				
				return false;
			}
		}});
		
		
		this.applyMyFilter();
		
	},
	/***************************************************************************
	 * trigger when the user check/unechek the NO time checkbox it filter the
	 * tree table regading the NoTime value
	 * 
	 **************************************************************************/
	filterNoTime : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selected;
		if (sValue) {

			airbus.mes.stationHandover.util.ModelManager.filter.noTime = new sap.ui.model.Filter("NO_TIME", "EQ", "true");

		} else {

			airbus.mes.stationHandover.util.ModelManager.filter.noTime = new sap.ui.model.Filter("NO_TIME", "EQ", "false");

		}

		this.applyMyFilter();

	},
	/***************************************************************************
	 * trigger when the user check/unechek the INsertedLine checkbox it filter
	 * the tree table regading the INsertedLine value
	 * 
	 **************************************************************************/
	filterInsertedLines : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selected;
		if (sValue) {

			airbus.mes.stationHandover.util.ModelManager.filter.inserted = undefined;

		} else {

			airbus.mes.stationHandover.util.ModelManager.filter.inserted = new sap.ui.model.Filter("INSERTED", "EQ", "false");

		}

		this.applyMyFilter();

	},
	/***************************************************************************
	 * trigger when the user Click on a Row and open operationd detail
	 * 
	 **************************************************************************/
	onRowClick : function(oEvt) {

		var sPath = oEvt.mParameters.rowBindingContext.sPath;
		var oRow = airbus.mes.stationHandover.oView.getModel("oswModel").getProperty(sPath);

		if (oEvt.mParameters.columnIndex != "0") {

			console.log(oEvt);

		}

	},
	/***************************************************************************
	 * trigger when the user Click on select all checkBox
	 * 
	 **************************************************************************/
	selectAll : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selected;
		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;

		Object.keys(aValueSelected).forEach(function(el, indice) {

			if (el != "open") {

				aValueSelected[el].open = sValue;

				Object.keys(aValueSelected[el]).forEach(function(al, indice1) {

					if (al != "open") {

						aValueSelected[el][al].open = sValue;

					}
				})
			}
		})

		airbus.mes.stationHandover.oView.getModel("oswModel").refresh(true);
	},
	/***************************************************************************
	 * trigger when the user Click on combobox of a row
	 * 
	 **************************************************************************/
	onSelectRow : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selected;
		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var sPath = oEvt.getSource().oPropagatedProperties.oBindingContexts.oswModel.sPath;
		var oModel = airbus.mes.stationHandover.oView.getModel("oswModel").getProperty(sPath);

		// Check if we selected a chill or not
		if (oModel.MATERIAL_DESCRIPTION != undefined) {

			aValueSelected[oModel.WOID].open = sValue;

			Object.keys(aValueSelected[oModel.WOID]).forEach(function(el, indice) {

				if (el != "open") {

					aValueSelected[oModel.WOID][el].open = sValue;

				}

			})
		} else {
			// store in array the WOID + OPERATION TO select
			var sID = oModel.WOID + "##||##" + oModel.REFERENCE

			aValueSelected[oModel.WOID][sID].open = sValue;

		}

		// Update model to fire formatter
		airbus.mes.stationHandover.oView.getModel("oswModel").refresh(true);
		airbus.mes.stationHandover.util.ModelManager.applyAll = undefined;

	}

});
