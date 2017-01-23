"use strict";
sap.ui.controller("airbus.mes.disruptiontracker.disruptions", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf table.table
	 */
	disruptionTrackerRefresh : false,
	disruptionsCustomDataFlag : undefined,
	mFilterParams : undefined,
	onInit : function() { 
		//if the page is not busy
        if (airbus.mes.shell.oView.byId('refreshTime').setBusyIndicatorDelay(0)){
            airbus.mes.shell.oView.byId('refreshTime').setEnabled(true);
        }
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf table.table
	 */
	onAfterRendering : function() {
		var oSorter = new sap.ui.model.Sorter("OpeningTime", true);

		// sorting based on opening time
		this.getView().byId("disruptiontrackerView--disruptionsTable").getBinding("items").sort(oSorter);

		if (bBatch1) {

			airbus.mes.disruptiontracker.oView.byId("gotoDisruptionKpi").setVisible(false);

		} else {

			airbus.mes.disruptiontracker.oView.byId("gotoDisruptionKpi").setVisible(true);

		}
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf table.table
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf table.table
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf table.table
	 */
	// onExit: function() {
	//
	// },
	/***************************************************************************
	 * Filter disruptions
	 */
	filterByStation : function(oEvent) {
		airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station = this.getView().byId("stationComboBox").getSelectedKey();

		if (airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station != "") {
			// When Station is selected on Model Loading
			sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items").filter(
				new sap.ui.model.Filter("station", "EQ", airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.station));
		} else {
			sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items").filter(new sap.ui.model.Filter("station", "EQ", "DISPLAY_NO_MSN"));

		}

		// Clear MSN ComboBox when Station is changed
		var msnBox = sap.ui.getCore().byId("disruptiontrackerView--msnComboBox");
		if (oEvent.getSource().getId() == "disruptiontrackerView--stationComboBox")
			msnBox.setSelectedKey("");

		airbus.mes.disruptiontracker.ModelManager.oDisruptionFilter.msn = this.getView().byId("msnComboBox").getSelectedKey();

		airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();

		if (this.getView().byId("stationComboBox").getSelectedKey() == " " || this.getView().byId("stationComboBox").getSelectedKey() == "") {
			sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items").filter(new sap.ui.model.Filter());
		} else {
			sap.ui.getCore().byId("disruptiontrackerView--msnComboBox").getBinding("items").filter(
				new sap.ui.model.Filter("station", "EQ", airbus.mes.disruptiontracker.oView.byId("stationComboBox").getSelectedKey()));
		}

		// Add item All into MSN ComboBox
		var msnItemAll = new sap.ui.core.Item();
		msnItemAll.setKey = "";
		msnItemAll.setText(this.getView().getModel("disruptiontrackerI18n").getProperty("All"));
		msnBox.insertItem(msnItemAll, 0);

		/*
		 * filterByResolutionGroup:function(oEvent){ sValue =
		 * oEvent.getSource().getSelectedKey(); if (sValue != "") {
		 * this.getView().byId("disruptionsTable").getBinding("items").filter(
		 * new sap.ui.model.Filter("ResponsibleGroup", "EQ", sValue)); } },
		 */
	},
	/***************************************************************************
	 * Table Settings Sorter And Filter
	 * 
	 * @param oEvent
	 */

	/*
	 * onFilterDetailPageOpened : function(oEvent) { var a =
	 * oEvent.getSource().getId(); console.log(a); }, onResetFilters :
	 * function(oEvent) { var a = oEvent.getSource().getId(); console.log(a); },
	 */
	onTableSettingsConfirm : function(oEvent) {

		this.mFilterParams = oEvent.getParameters();

		airbus.mes.disruptiontracker.oView.oController.filterDisruptions({});
	},

	filterDisruptions : function(oEvent) {
		var sStatus = this.getView().byId("statusComboBox").getSelectedKey().toUpperCase();
		var sResoGroup = this.getView().byId("resolutionGroupBox").getSelectedKey();

		/*
		 * var sMSN = this.getView().byId( "msnComboBox").getSelectedKey();
		 */

		var aFilters = [];
		var oBinding = this.byId("disruptionsTable").getBinding("items");

		if (sStatus != "")
			aFilters.push(new sap.ui.model.Filter("Status", "EQ", sStatus));
		if (sResoGroup != "")
			aFilters.push(new sap.ui.model.Filter("ResponsibleGroup", "EQ", sResoGroup));

		/*
		 * if (sMSN != "") aFilters.push(new sap.ui.model.Filter( "MSN", "EQ",
		 * sMSN));
		 */

		if (this.mFilterParams) {
			jQuery.each(this.mFilterParams.filterItems, function(i, oItem) {
				var sFilterPath;
				if (oItem.getParent().getId() == "categoryFilter")
					sFilterPath = "Category";
				else if (oItem.getParent().getId() == "reasonFilter")
					sFilterPath = "Reason";
				else if (oItem.getParent().getId() == "escalationFilter")
					sFilterPath = "EscalationLevel";
				else if (oItem.getParent().getId() == "gravityFilter")
					sFilterPath = "Gravity";

				var sOperator = "EQ";
				var sValue1 = oItem.getKey();
				if (sValue1 != " ") {
					var oFilter = new sap.ui.model.Filter(sFilterPath, sOperator, sValue1);
					aFilters.push(oFilter);
				}
			});
		}

		oBinding.filter(aFilters);
		airbus.mes.disruptiontracker.ModelManager.fixNoDataRow();// Remove
		// last
		// column

	},

	/***************************************************************************
	 * Open fragment for table setting options
	 */
	onDisruptionTableSettings : function(oEvent) {
		if (!this.tableSettingsDialogue) {
			this.tableSettingsDialogue = sap.ui.xmlfragment("airbus.mes.disruptiontracker.tableSettings", this);
			this.getView().addDependent(this.tableSettingsDialogue);
		}
		this.tableSettingsDialogue.open();

		// Remove duplicates from Category filter list
		var aTemp = [];
		sap.ui.getCore().byId("categoryFilter").getBinding("items").filter(new sap.ui.model.Filter({
			path : "Category",
			test : function(oValue) {
				if (aTemp.indexOf(oValue) == -1) {
					aTemp.push(oValue);
					return true;
				} else {
					return false;
				}
			}
		}));

		// Remove duplicates from Reason filter list
		aTemp = [];
		sap.ui.getCore().byId("reasonFilter").getBinding("items").filter(new sap.ui.model.Filter({
			path : "Reason",
			test : function(oValue) {
				if (aTemp.indexOf(oValue) == -1) {
					aTemp.push(oValue);
					return true;
				} else {
					return false;
				}
			}
		}));

		// Add filter item All in Category filter list
		var categoryItemAll = new sap.m.ViewSettingsItem();
		categoryItemAll.setKey(" ");
		categoryItemAll.setText(this.getView().getModel("disruptiontrackerI18n").getProperty("All"));

		sap.ui.getCore().byId("categoryFilter").addItem(categoryItemAll);

		// Add filter item All in Reason filter list
		var reasonItemAll = new sap.m.ViewSettingsItem();
		reasonItemAll.setKey(" ");
		reasonItemAll.setText(this.getView().getModel("disruptiontrackerI18n").getProperty("All"));

		sap.ui.getCore().byId("reasonFilter").addItem(reasonItemAll);

	},

	/***************************************************************************
	 * Call Disruption KPI charts
	 */
	onPressDisruptionKPI : function(oEvent) {
		airbus.mes.shell.util.navFunctions.disruptionKPI();
		/*
		 * var sStation = this.getView().byId("stationComboBox")
		 * .getSelectedKey(); // sap.ui.core.BusyIndicator.show(0);
		 * airbus.mes.shell.util.navFunctions .disruptionKPI(sStation);
		 */
		// airbus.mes.disruptiontracker.kpi.ModelManager.loadDisruptionKPIModel(sStation);
	},

	onNavBack : function(oEvent) {
		nav.back();
	},

	/***************************************************************************
	 * Open Operation Detail PopUp on table item click
	 * 
	 * @param {object}
	 *            oEvt control as an argument to this event
	 */
	onTableClick : function(oEvt) {

		// set data of the selected row to Data Model

		var disruptionData = {
			"Rowsets" : {
				"Rowset" : [ {
					"Row" : [ oEvt.getSource().getBindingContext("disruptionsTrackerModel").getObject() ]
				}, {
					"Row" : []
				} ]
			}
		};

		var aComments = sap.ui.getCore().getModel("disruptionsTrackerModel").getData().Rowsets.Rowset[1].Row;
		var sCurrMessageRef = oEvt.getSource().getBindingContext("disruptionsTrackerModel").getObject().MessageRef;

		aComments.find(function(el) {
			if (el.MessageRef == sCurrMessageRef)
				disruptionData.Rowsets.Rowset[1].Row.push(el);
		});

		/**
		 * MES V1.5 Navigate to disruption Detail Page [Begin]
		 */

		if (sap.ui.Device.system.desktop) {
			airbus.mes.shell.util.navFunctions.disruptionsDetail(sap.ui.getCore().byId("globalNavView--navCont"), 0, 0, 0, 0);

			sap.ui.getCore().getModel("operationDisruptionsModel").setData(disruptionData);
			this.disruptionsCustomDataFlag = false;
			var oModel = sap.ui.getCore().getModel("DisruptionDetailModel");
			// set the data in disruption Detail Model
			oModel.setData(sap.ui.getCore().getModel("operationDisruptionsModel").oData.Rowsets.Rowset[0].Row[0]);
			sap.ui.getCore().byId("globalNavView--navCont").to(airbus.mes.disruptions.oView.disruptionDetail.getId())

			// Pause the Refresh timer till the Pop-Up is opened
			// airbus.mes.shell.AutoRefreshManager.pauseRefresh();
			// this.getView().byId('refreshTime').setVisible(false);
			// --commented by MJ
			airbus.mes.shell.oView.byId('refreshTime').setVisible(false); // ++
			// MJ
			this.setDataForViewDisruptionDetail();
			/** *********************MES V1.5 [End]******************** */

		} else {

			// create Pop-Up as a fragment
			if (airbus.mes.disruptiontracker.detailPopUp === undefined) {

				airbus.mes.disruptiontracker.detailPopUp = sap.ui.xmlfragment("disruptionDetailPopup", "airbus.mes.disruptiontracker.disruptionDetailPopup",
					airbus.mes.disruptiontracker.oView.getController());

				airbus.mes.disruptiontracker.oView.addDependent(airbus.mes.disruptiontracker.detailPopUp);
			}

			// Add View Disruptions view to pop-up navigation
			// container
			this.nav = sap.ui.getCore().byId("disruptionDetailPopup--disruptDetailNavContainer");

			airbus.mes.shell.util.navFunctions.disruptionsDetail(this.nav, 0, // Report
			// Disruption
			// Button
			0, // Create Button
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption"), // Update
			// Button
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption") // Cancel
			// Button
			);
			sap.ui.getCore().getModel("operationDisruptionsModel").setData(disruptionData);
			this.disruptionsCustomDataFlag = false;

			airbus.mes.disruptiontracker.detailPopUp.open();

			// Set Expanded by Default
			sap.ui.getCore().byId("ViewDisruptionView").getContent()[0].getContent()[1].getItems()[0].getContent()[0].setExpandable(false);

			this.nav.to(airbus.mes.disruptions.oView.viewDisruption.getId());

			// Pause the Refresh timer till the Pop-Up is opened
			// airbus.mes.shell.AutoRefreshManager.pauseRefresh();
			// this.getView().byId('refreshTime').setVisible(false);
			// --commented by MJ
			//airbus.mes.shell.oView.byId('refreshTime').setVisible(false); // ++
			// MJ
			// this.getView().byId('refreshTime').setVisible(false);

		}

	},

	/***************************************************************************
	 * Disruption Close Pop-Up Functions
	 */
	onCloseDisruptnDetailPopUp : function(oEvt) {
		airbus.mes.disruptiontracker.detailPopUp.close();
	},

	afterCloseDisruptnDetailPopUp : function() {

		// Reset Expandable
		sap.ui.getCore().byId("ViewDisruptionView").getContent()[0].getContent()[1].getItems()[0].getContent()[0].setExpandable(true);

		// Empty Model
		airbus.mes.disruptions.oView.viewDisruption.getModel("operationDisruptionsModel").setData();

		if (airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh == true) {
			airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel();
			airbus.mes.disruptiontracker.oView.getController().disruptionTrackerRefresh = false;
		}
		// Resume the Refresh timer when the Pop-Up is opened
		airbus.mes.shell.AutoRefreshManager.resumeRefresh();
	},

	onNavigate : function() {

		if (this.nav.getCurrentPage().sId == "createDisruptionView") {
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption").setVisible(false);
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption").setVisible(false);
		}
	},

	afterNavigate : function() {

		if (this.nav.getCurrentPage().sId == "createDisruptionView") {
			sap.ui.getCore().byId("disruptionDetailPopup--btnUpdateDisruption").setVisible(true);
			sap.ui.getCore().byId("disruptionDetailPopup--btnCancelDisruption").setVisible(true);

			/*******************************************************************
			 * Load Disruption Custom Data
			 ******************************************************************/
			if (!this.disruptionsCustomDataFlag) {
				airbus.mes.disruptions.ModelManager.loadData();
				this.disruptionsCustomDataFlag = true;
			} else {
				airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
			}
		}
	},
	/***************************************************************************
	 * set the data in disruption detail page call set data for edit disruption
	 * function MESV 1.5
	 */
	setDataForViewDisruptionDetail : function() {

		if (!this.disruptionsCustomDataFlag) {
			airbus.mes.disruptions.ModelManager.loadData();
			this.disruptionsCustomDataFlag = true;
		} else {
			airbus.mes.disruptions.oView.createDisruption.oController.setDataForEditDisruption();
		}
	},
	/**
	 * [MES V1.5] [Beg]SD-SP1604983-DT-040 search disruption on basis of work
	 * order/operation
	 * 
	 * @param {object}
	 *            oEvt take control as an object
	 */
	onSearchDisruption : function(oEvt) {
		var sQuery = oEvt.getSource().getValue();
		var oBinding = this.getView().byId("disruptionsTable").getBinding("items");
		var aFilters = [];
		var filter1 = new sap.ui.model.Filter("Operation", sap.ui.model.FilterOperator.Contains, sQuery)
		aFilters.push(filter1);
		var filter2 = new sap.ui.model.Filter("WorkOrder", sap.ui.model.FilterOperator.Contains, sQuery)
		aFilters.push(filter2);
		oBinding.filter(new sap.ui.model.Filter(aFilters, false), "Control");

	},
	/**
	 * Export Disruption Data to excel
	 * [MES V1.5]
	 * [SD-SP1604983-EXT-005]
	 */
	handleSelectedRowExcelExport:function(){
		var oTable = this.getView().byId("disruptionsTable");
		var aContexts = oTable.getSelectedContexts();
		var aItems = aContexts.map(function(oEvent){
		        return oEvent.getObject();
		    });
		this.jsonToCSVConvertor(aItems, "Disruption Data", true);
		
	},
	jsonToCSVConvertor: function(JSONData, ReportTitle, ShowLabel){

        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';    
        //This condition will generate the Label/Header
        if (ShowLabel) {
            var row = "";

            //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                //Now convert each value to string and comma-seprated
                row += index + ',';
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }

        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   

        //this trick will generate a temp "a" tag
        var link = document.createElement("a");    
        link.id="lnkDwnldLnk";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);

        var csv = CSV;  
        var blob = new Blob([csv], { type: 'text/csv' }); 
        var csvUrl = window.URL.createObjectURL(blob);
        var filename = 'UserExport.csv';
        $("#lnkDwnldLnk")
        .attr({
            'download': filename,
            'href': csvUrl
        }); 

        $('#lnkDwnldLnk')[0].click();    
        document.body.removeChild(link);

    }

	/**
	 * search disruption on basis of work order/operation
	 * 
	 * @param {object}
	 *            oEvt take control as an object
	 */
	/*onDisruptionSuggestions : function(oEvt) {
		var oSF = this.getView().byId("disruptionSearchField");
		var value = oEvt.getParameter("suggestValue");
		var aTemp = [];
		if (value) {
			oSF.getBinding("suggestionItems").filter(new sap.ui.model.Filter({
				path : "Operation",
				test : function(sText) {
					if (((sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1) && (aTemp.indexOf(sText) == -1) ) {
							aTemp.push(sText);
							return true;
						} else {
							return false;
						}
				
				}
			}));
		}
		if (!value) {
			oSF.getBinding("suggestionItems").filter(new sap.ui.model.Filter({
				path : "Operation",
				test : function(sText) {
					if (aTemp.indexOf(sText) == -1) {
						aTemp.push(sText);
						return true;
					} else {
						return false;
					}
				}
			}));
		}
		oSF.suggest();
		this.onSearchDisruption(oEvt);

	}*/
});
