"use strict";

sap.ui.controller("airbus.mes.stationHandover.controller.stationHandover", {

	onAfterRendering : function() {
		var aColumns = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns();
    	
    	aColumns.forEach(function(el,indice){
    		
    		airbus.mes.stationHandover.oView.byId("TreeTableBasic").autoResizeColumn(indice);
    	
    	});

	},

	onBackPress : function() {
		nav.back();
	},

	/***********************************************************************
	 * Display the stationHandover in view mode "Shift" only on shift is
	 * represented and the step of stationHandover is set to 30min
	 * 
	 **********************************************************************/
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
	 *Apply filters on the stationHandoverTracker it can user several filter at
	 *the same time
	 * 
	 **************************************************************************/
	applyMyFilter : function() {

		var oMyfilter = airbus.mes.stationHandover.util.ModelManager.filter;
		var oTreeTable = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getBinding("rows");
		var aFilter = [];
		
		for (var i in oMyfilter) {
			
			if ( oMyfilter[i] != undefined ) {
			
			aFilter.push(oMyfilter[i]);
			
			}
		}
		
		if ( aFilter.length === 0  ){

			oTreeTable.filter();

		} else  {
			
			oTreeTable.filter(new sap.ui.model.Filter(aFilter,true)); 
		}
		
		airbus.mes.stationHandover.oView.byId("TreeTableBasic").expandToLevel(99);
		//ReBind to apply colors
		 setTimeout(function() {
			 airbus.mes.stationHandover.oView.byId("TreeTableBasic").getModel("oswModel").refresh(true);
	       }, 1);

		
	},
	/***************************************************************************
	 * trigger when the user select a group and sort parent ascending  by the value selected
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
	 * trigger when the user select the type of OSW and filter the tree table by type
	 * 
	 **************************************************************************/
	filterOSW : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selectedKey;
		if (sValue != "ALL") {

			airbus.mes.stationHandover.util.ModelManager.filter.type = new sap.ui.model.Filter("TYPE", "EQ", sValue);

		} else {
			// Reset filter
			airbus.mes.stationHandover.util.ModelManager.filter.type = undefined;
		}

		this.applyMyFilter();

	},
	/***************************************************************************
	 * trigger when the user check/unechek the NO time checkbox it filter
	 * the tree table regading the NoTime value  
	 *  
	 **************************************************************************/
	filterNoTime : function(oEvt) {
		
		var sValue = oEvt.getSource().mProperties.selected;
		if (sValue) {

			airbus.mes.stationHandover.util.ModelManager.filter.noTime = new sap.ui.model.Filter("NO_TIME", "EQ", "true");

		} else {
			
			airbus.mes.stationHandover.util.ModelManager.filter.noTime =  new sap.ui.model.Filter("NO_TIME", "EQ", "false");

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
	 * trigger when the user Select the ph station and filter the tree table on station
	 *  
	 **************************************************************************/
	filterStation : function(oEvt) {
		
		var sValue = oEvt.getSource().mProperties.selectedKey;
		console.log(sValue);
		if (sValue === "ALL" ) {

			airbus.mes.stationHandover.util.ModelManager.filter.station = undefined;

		} else {
			
			airbus.mes.stationHandover.util.ModelManager.filter.station = new sap.ui.model.Filter("ORIGIN_STATION", "EQ", sValue);

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
		
		if (oEvt.mParameters.columnIndex != "0" ) {
			
			console.log(oEvt);

		}
		
		
	},
	/***************************************************************************
	 * trigger when the user Click on select all checkBox
	 *  
	 **************************************************************************/	
	selectAll : function(oEvt) {

		var sValue = oEvt.getSource().mProperties.selected;
		
		if ( sValue ) {
			
			airbus.mes.stationHandover.util.ModelManager.selectAll = true;

			
		} else {
			
			airbus.mes.stationHandover.util.ModelManager.selectAll = false;

			
		}

		airbus.mes.stationHandover.oView.getModel("oswModel").refresh(true)		

	},
	/***************************************************************************
	 * trigger when the user Click on combobox of a row
	 *  
	 **************************************************************************/	
	onSelectRow : function(oEvt) {
		
		var sValue = oEvt.getSource().mProperties.selected;
		
				
	}

});
