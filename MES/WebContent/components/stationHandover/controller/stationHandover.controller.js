"use strict";

sap.ui.controller("airbus.mes.stationHandover.controller.stationHandover", {

	/************************************************************************/
    /************************************************************************/
    /**                                                                    **/
    /**						Controller for the view	 stationHandover 	   **/
    /**                                                                    **/
    /************************************************************************/
    /************************************************************************/
	onAfterRendering : function() {
		var aColumns = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getColumns();

		aColumns.forEach(function(el, indice) {
			// Don't do auto resize blocked line it bug
			if (indice != 1) {
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
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
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
	 **************************************************************************/
	sorterMode : function() {

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
	 **************************************************************************/
	openFilterType : function() {

		var oView = airbus.mes.stationHandover.oView;

		if (airbus.mes.stationHandover.typeFilter === undefined) {

			airbus.mes.stationHandover.typeFilter = sap.ui.xmlfragment("typeFilter", "airbus.mes.stationHandover.fragments.typeFilter",
				airbus.mes.stationHandover.oView.getController());
			airbus.mes.stationHandover.typeFilter.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationHandover.typeFilter);
			//As a default, option 1 ‘OW still assigned to previous stations’ should be selected.
			airbus.mes.stationHandover.typeFilter.getContent()[0].getItems()[0].setSelected(true);

		}

		airbus.mes.stationHandover.typeFilter.openBy(oView.byId("typeHandOver"));

	},
	/***************************************************************************
	 * trigger when click on filter on origin station
	 **************************************************************************/
	openFilterStation : function() {

		var oView = airbus.mes.stationHandover.oView;

		if (airbus.mes.stationHandover.stationFilter === undefined) {

			airbus.mes.stationHandover.stationFilter = sap.ui.xmlfragment("stationFilter", "airbus.mes.stationHandover.fragments.stationFilter",
				airbus.mes.stationHandover.oView.getController());
			airbus.mes.stationHandover.stationFilter.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationHandover.stationFilter);
			//As a default, the physical station with the biggest planned start date/time should be selected.
			var fNumberItems = airbus.mes.stationHandover.stationFilter.getContent()[0].getItems().length;
			airbus.mes.stationHandover.stationFilter.getContent()[0].getItems()[fNumberItems - 1].setSelected(true);

		}

		airbus.mes.stationHandover.stationFilter.openBy(oView.byId("originHandOver"));

	},
	/***************************************************************************
	 * trigger when the user Select the ph station and filter the tree table on
	 * station
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	filterStation : function(oEvt) {

		var aPath = oEvt.getSource().getContent()[0].getSelectedContextPaths()
		var oModel = airbus.mes.stationHandover.oView.getModel("phStation");

		airbus.mes.stationHandover.util.ModelManager.filter.aStation = [];

		aPath.forEach(function(el) {

			var sKey = oModel.getProperty(el).station;
			airbus.mes.stationHandover.util.ModelManager.filter.aStation.push(sKey.toUpperCase());

		});

		this.applyMyFilter();

	},
	/***************************************************************************
	 * Trigger when the use leave the typeSelection popOver it filter the osw
	 * list on TYPE
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	filterType : function(oEvt) {

		var aPath = oEvt.getSource().getContent()[0].getSelectedContextPaths()
		var oModel = airbus.mes.stationHandover.oView.getModel("typeModel");

		airbus.mes.stationHandover.util.ModelManager.filter.aType = [];

		aPath.forEach(function(el) {

			var sKey = oModel.getProperty(el).key;
			airbus.mes.stationHandover.util.ModelManager.filter.aType.push(sKey.toUpperCase());

		});

		this.applyMyFilter();

	},
	/***************************************************************************
	 * trigger when the user check/unechek the NO time checkbox it filter the
	 * tree table regading the NoTime value
	 * 
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
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
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	onRowClick : function() {

		var sPath = oEvt.mParameters.rowBindingContext.sPath;

		if (oEvt.mParameters.columnIndex != "0") {

		}

	},
	/***************************************************************************
	 * trigger when the user Click on select all checkBox
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	selectAll : function(oEvt) {
		var that = this;
		var bValue = oEvt.getSource().mProperties.selected;
		var oModel = airbus.mes.stationHandover.oView.getModel("oswModel");
		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var aRows = airbus.mes.stationHandover.oView.byId("TreeTableBasic").getRows();
				
		aRows.forEach(function(el){
			// Parse only Row of table displayed
			if ( el._oNodeState != undefined ) {
				
				var sPath = el.getCells()[0].oPropagatedProperties.oBindingContexts.oswModel.sPath;
				var oModelOsw = oModel.getProperty(sPath);			
				
				that.isSelected(/*aValueSelected[oModelOsw.WOID],*/bValue,oModelOsw);			
								
//				if (oModelOsw.MATERIAL_DESCRIPTION != undefined) {
//					
//					aValueSelected[oModelOsw.WOID].open = bValue;
//					//Store the stat of the selected row in the object to know if it is in modification or not
//					that.isSelected(aValueSelected[oModelOsw.WOID],bValue);
//					
//				} else {
//					
//					// store in object the WOID + OPERATION TO select
//					var sID = oModelOsw.WOID + "##||##" + oModelOsw.REFERENCE
//
//					aValueSelected[oModelOsw.WOID][sID].open = bValue;
//					
//					//Store the stat of the selected row in the object to know if it is in modification or not
//					that.isSelected(aValueSelected[oModelOsw.WOID][sID],bValue);
//		
//				}
								
			}
		})

		airbus.mes.stationHandover.oView.getModel("oswModel").refresh(true);
	},
	/***************************************************************************
	 * trigger when the user Click on combobox of a row
	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	onSelectRow : function(oEvt) {

		var bValue = oEvt.getSource().mProperties.selected;
		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var sPath = oEvt.getSource().oPropagatedProperties.oBindingContexts.oswModel.sPath;
		var oModel = airbus.mes.stationHandover.oView.getModel("oswModel").getProperty(sPath);
		var that = this;

		// Check if we selected a chill or not
		if (oModel.MATERIAL_DESCRIPTION != undefined) {
				
			//aValueSelected[oModel.WOID].open = bValue;
			//Store the stat of the selected row in the object to know if it is in modification or not
			that.isSelected(/*aValueSelected[oModel.WOID],*/bValue,oModel);

			oModel.row.forEach(function(el,indice){
				
				that.isSelected(/*aValueSelected[oModel.WOID],*/bValue,el);
				
			})
			
			
//			Object.keys(aValueSelected[oModel.WOID]).forEach(function(el, indice) {
//
//				if (el != "open" && el != "oswItems" && el != "initial" && el !="changed") {
//
//					aValueSelected[oModel.WOID][el].open = bValue;
//								
//					//Store the stat of the selected row in the object to know if it is in modification or not
//					that.isSelected(aValueSelected[oModel.WOID][el],bValue);
//
//
//				}
//
//			})
			
		} else {
//			// store in object the WOID + OPERATION TO select
//			var sID = oModel.WOID + "##||##" + oModel.REFERENCE
//
//			aValueSelected[oModel.WOID][sID].open = bValue;
//			
			//Store the stat of the selected row in the object to know if it is in modification or not
			that.isSelected(/*aValueSelected[oModel.WOID][sID],*/bValue,oModel);

		}

		// Update model to fire formatter
		airbus.mes.stationHandover.oView.getModel("oswModel").refresh(true);
		airbus.mes.stationHandover.util.ModelManager.applyAll = undefined;

	},
	/***************************************************************************
	 * 	permit to know if the  row in the object is in modification or not
	 **************************************************************************/
	isSelected : function(/*oToTest,*/bValue,oToTest2) {
		
//		var oModelCopy = airbus.mes.stationHandover.util.ModelManager.copyOfModel;
//		
//		if (sPath != undefined) {
//			
//			var oIsWorkOrder = oModelCopy.getProperty(sPath);
//			
//			if ( oIsWorkOrder.row != undefined ) {
//							
//				oIsWorkOrder.row.forEach(function(el) {
//
//						el.SELECTED = bValue;
//								
//				})
//				
//			} else {
//				
//				oIsWorkOrder
//			}
//			
//		} else {
//			
//			oModelCopy.forEach(function(el)) {
//				
//				el.SELECTED = bValue;
//				
//				el.forEach(function(al){
//				
//					al.SELECTED = bValue;
//				
//				}))
//				
//			}
//			
//		}
		
		if ( bValue ) {
			
			bValue = "true";
			
		} else {
			
			bValue = "false";

		}
		
	
			oToTest2.SELECTED = bValue;
		
		
//		if (oToTest.initial != bValue) {
//	
//			// Store also the modification on the object itself to send back whens saved the modification during the import of osw
//			oToTest.changed = true;
//			
//		} else {
//			
//			oToTest.changed = false;
//		}
//		
	},	
	
	/************************************************************************/
    /************************************************************************/
    /**                                                                    **/
    /**						InsertOsw Fragment						 	   **/
    /**                                                                    **/
    /************************************************************************/
    /************************************************************************/
	
	/***************************************************************************
	 * trigger when the user click on the close button of the dialog
 	 * @param {Object} oEvt wich represent the sapui5 event obejct"
	 **************************************************************************/
	onClose : function(oEvt) {

		oEvt.getSource().getParent().close();

	},
	/***************************************************************************
	 * trigger when the user select an option of insertion of in the insertOsw fragment 
	 **************************************************************************/
	selectMode : function() {
		
	var sSelected = sap.ui.getCore().byId("insertOsw--selectMode").getSelectedKey();
		
		if (sSelected === "insertNextToParentOperation") {
			sap.ui.getCore().byId("insertOsw--calendar").addDisabledDate(new sap.ui.unified.DateRange({startDate : new Date(0), endDate: new Date(86400000000000)})) 
			sap.ui.getCore().byId("insertOsw--calendar").destroySelectedDates();
			sap.ui.getCore().byId("insertOsw--TimePicker").setEnabled(false);
			sap.ui.getCore().byId("insertOsw--jumpToEnd-button").setEnabled(false);
			sap.ui.getCore().byId("insertOsw--jumpToStart-button").setEnabled(false);

		} else {
			

			sap.ui.getCore().byId("insertOsw--calendar").destroyDisabledDates();
			sap.ui.getCore().byId("insertOsw--calendar").destroySelectedDates();
			sap.ui.getCore().byId("insertOsw--TimePicker").setEnabled(true);
			sap.ui.getCore().byId("insertOsw--calendar").insertSelectedDate(new sap.ui.unified.DateRange({
			startDate : new Date()
			}));
			sap.ui.getCore().byId("insertOsw--jumpToEnd-button").setEnabled(true);
			sap.ui.getCore().byId("insertOsw--jumpToStart-button").setEnabled(true);
			
		}		
	},
	/***************************************************************************
	 * trigger when the user click button of jump to Acpng start/End date Select
	 * in the Date picker the date of acpng Date of the osw selected
	 **************************************************************************/
	onPressJumpDate : function() {
		
				
	},
	/***************************************************************************
	 * trigger when the user Click on insert button check if one or more line are selected
	 * and display the insert osw pop up
	 * 
	 **************************************************************************/
	onPressInsert : function() {

		var aValueSelected = airbus.mes.stationHandover.util.ModelManager.aSelected;
		var aSelectionPath = [];

		// Parse all Selected line in Table and store osw in modification in order to send it in the saved popup
		Object.keys(aValueSelected).forEach(function(el, indice) {

//			if (el != "open" && el != "oswItems" && el != "initial" && el !="changed") {
//
//				if ( aValueSelected[el].changed  === true ) {
//					
//					aSelectionPath.push(aValueSelected[el].oswItems);
//					
//				}
//			
//				Object.keys(aValueSelected[el]).forEach(function(al, indice1) {
//
//					if (al != "open" && al != "oswItems" && al != "initial" && al !="changed") {
//
//
//						if ( aValueSelected[el][al].changed  === true ) {
//							
//							aSelectionPath.push(aValueSelected[el][al].oswItems);
//							
//						}
//						
//					}
//
//				})
//			}
		})
		// Display a dialog to inform if at least one osw is selected or not
		if (aSelectionPath.length === 0) {
			jQuery.sap.require("sap.m.MessageBox");

			sap.m.MessageBox.warning(airbus.mes.stationHandover.oView.getModel("stationHandoverI18n").getProperty("errorSelection"), {

			});
			return;
		}

		if (airbus.mes.stationHandover.insertOsw === undefined) {

			airbus.mes.stationHandover.insertOsw = sap.ui.xmlfragment("insertOsw", "airbus.mes.stationHandover.fragments.insertOsw",
			airbus.mes.stationHandover.oView.getController());
			airbus.mes.stationHandover.oView.addDependent(airbus.mes.stationHandover.insertOsw);

		}
		
		console.log(aSelectionPath);
		airbus.mes.stationHandover.insertOsw.open();
		// Apply default selection of dialog
		this.selectMode();
	},
});
