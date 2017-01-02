"use strict";

sap.ui.controller("airbus.mes.linetracker.Linetracker", {
	


/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf classLineTrackerTable.Linetracker
*/
	onInit: function() {
		
//	var date = new Date();
	
//	this.addParent(this.selectTree, undefined);

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf classLineTrackerTable.Linetracker
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf classLineTrackerTable.Linetracker
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf classLineTrackerTable.Linetracker
*/
//	onExit: function() {
//
//	}
/**
 * Called when +Station button clicked in line tracker 
 * To Add Station in Line Tracker Station List
 * 
 */
	onAddStation : function() {
		var stationRow = {
				"station" : "Station 10",
				"planned" : 20,
				"confirmed" : 30,
				"trend" : "down",
				"trendColor" : "Red",
				"date"	: "02 JUL 2016 16:00",
				"cycleTime" : "3.5",
				"workContent" : "5"
			};
		
		this.getView().getModel("stationDataModel").getProperty("/list").push(stationRow);
		
		this.getView().getModel("stationDataModel").refresh();
	},
	
/**
 * Called when save button is clicked to save(Global) the modified variant line
*/
	onSaveVariant : function() {

		if (!this.oSaveDialog) {
			// create dialog via fragment factory
			this.oSaveDialog = sap.ui.xmlfragment("airbus.mes.linetracker.fragment_save", this);
			
			this.getView().addDependent(
					this.oSaveDialog);
			
		}
	
		this.oSaveDialog.open();

	},
	
/**
* To create new line or to modify name or description of existing(selected) line
* 
*/	
	onCreateModifyLine : function() {

		if (!this.oAddLineDialog) {
			// create dialog via fragment factory
			this.oAddLineDialog = sap.ui.xmlfragment("airbus.mes.linetracker.edit_line", this);
			
			this.getView().addDependent(
					this.oAddLineDialog);		
			
		}
	
		this.oAddLineDialog.open();
		var lineVariantName = this.getView().byId("selectLine").getValue();
//		var variantDes = this.getView().byId("selectLine").getValue();
		sap.ui.getCore().byId("variantName").setValue(lineVariantName);
//		sap.ui.getCore().byId("variantDescription").setValue(variantDes);
	},
	
	/**
	 * Called when detailed button clicked
	 * 
	 * @param oEvent
	 */
	
	openStationPopover : function(oEvent) {
		
		if (!this.oStationPopover) {
			// create dialog via fragment factory
			this.oStationPopover = sap.ui.xmlfragment("airbus.mes.linetracker.StationPopover", this);
			
			this.getView().addDependent(
					this.oStationPopover);
			
		}
	
		this.oStationPopover.openBy(oEvent.getSource());
	},
	
	/**	
	 * BR NO: SD-PPC-LT-090
	 * Add New Station/Edit Station in Line Tracker table display
	 * @param oEvent
	 */
	onEditStation : function(oEvent) {
		

		if (!this.oEditStation) {
			// create dialog via fragment factory  
		
			this.oEditStation = sap.ui.xmlfragment("airbus.mes.linetracker.Edit_station", this);
			
			this.getView().addDependent(
					this.oEditStation);
			
		}
		
		this.oEditStation.open();	
		
		var pressedBtnId = oEvent.getSource().sId;
		if(pressedBtnId == "idLinetracker1--linetrackerAddStation"){
			sap.ui.getCore().byId("editStation").setTitle(this.oView.getModel("i18n").getProperty("addStation"));
			sap.ui.getCore().byId("editStation").setIcon("sap-icon://add");
		}else{
			sap.ui.getCore().byId("editStation").setTitle(this.oView.getModel("i18n").getProperty('editStation'));
			sap.ui.getCore().byId("editStation").setIcon("sap-icon://edit");
		}
		
	},
	
	/**
	 * Called when cancel button clicked on Edit_station/edit_line fragments
	 * @param evt
	 */
	
	onCancel : function(evt) {
		
		var fragmentId = evt.getSource().getParent().getId();
		
		switch(fragmentId) {
			
			case "createModifyLine" : this.oAddLineDialog.close();
										break;
										
			case "saveVariant" : this.oSaveDialog.close();
									break;
									
			case "editStation" : this.oEditStation.close();
			break;
			
			case "deleteStation" : this.oDeleteDialog.close();
			break;
									
			default : return;
		}
		
	},
	
	/**
	 * Called when variant value help request
	 * @param oEvent
	 */
	handleValueHelp : function (oEvent) {
		this.inputId = oEvent.getSource().getId();
		
		// create value help dialog
		if (!this._valueHelpDialog) {
			this._valueHelpDialog = sap.ui.xmlfragment(
				"airbus.mes.linetracker.LineVariantDialog", this);
			this.getView().addDependent(this._valueHelpDialog);
		}

		// open value help dialog filtered by the input value
		this._valueHelpDialog.open();
	},

	/**
	 * Called when search on variant name in value help popup 
	 * @param evt used to get search field value to the search filter
	 * @returns matched variant name
	 */
	_handleValueHelpSearch : function (evt) {
		var sValue = evt.getParameter("value");
		var oFilter = new sap.ui.model.Filter("variantName",
			sap.ui.model.FilterOperator.Contains, 
			sValue);
		evt.getSource().getBinding("items").filter([oFilter]);
	},
	
	/**
	 * fill select line field with selected value help variant name 
	 * @param oEvt used to get selected 
	 * @returns Selected Line Variant name for the Select Line field
	 */
	handleSelectedLineValueHelp:function(oEvt){
		var oSelectedItem = oEvt.getParameter("selectedItem");
		if (oSelectedItem) {
			var selectLine = this.getView().byId("selectLine");
			selectLine.setValue(oSelectedItem.getTitle());
		}
	},
	
	
	/*_handleValueHelpClose : function (evt) {
		var oSelectedItem = evt.getParameter("selectedItem");
		if (oSelectedItem) {
			var productInput = this.getView().byId(this.inputId);
			productInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},*/

	/**
	 * To display Station KPI Header slide
	 * @param: evt
	 */
	displayStationKPIHeader : function(evt) {
		var state = sap.ui.getCore().byId("idLinetracker1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").closeNavigation();
			
		} else
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").openNavigation();
		
		 this.oPopover.close();

	},
	
	
	hideKPISlide : function(evt) {
		var state = sap.ui.getCore().byId("idLinetracker1--idSlideControl").getState();
		if (state == true) {
			sap.ui.getCore().byId("idLinetracker1--idSlideControl").closeNavigation();
			
		}
	},
	
	/**
	 * To Display Popup of Station KPI header, Station Tracker, Disruption ANDON
	 *  @param oEvent
	 */

	handlePopoverPress: function (oEvent) {
	       if (!this.oPopover) {
	              this.oPopover = sap.ui.xmlfragment("airbus.mes.linetracker.PhStationPopover", this);
	              this.getView().addDependent(this.oPopover);
	              
	       }

	       // delay because addDependent will do a async rerendering and the
	       // actionSheet will immediately close without it.
	       var oButton = oEvent.getSource();
	       jQuery.sap.delayedCall(0, this, function () {
	              this.oPopover.openBy(oButton);
	       });
     },
     
     /**
      * To Delete the Station from Line
      * @param oEvent
      */
     
     onDeleteStation: function (oEvent) {
    	if (!this.oDeleteDialog) {
    	 this.oDeleteDialog = sap.ui.xmlfragment("airbus.mes.linetracker.deleteStation", this);
 		 this.getView().addDependent(
 		 this.oDeleteDialog);
 		}
 		this.oDeleteDialog.open();
   },
  
   /**
    * To navigate to Station Tracker from Line Trakcer
    */
  gotoStationTracker:function(){
	  airbus.mes.shell.util.navFunctions.stationTracker();
  },
  
  /**
   * To navigate to Disruption & Andon Tracker from Line Tracker
   */
  gotoDisruption_AndonTracker:function(){
	  airbus.mes.shell.util.navFunctions.disruptionTracker();
  },
  
  
//Tree to define the hierarchy between select box Line, Station and MSN
  selectTree : {
      id : "headTextProgram",
      type : "select",
      path : "program",
      attr : "program",
      childs : [ {
          id : "selectLine",
          type : "select",
          path : "line",
          attr : "line",
          childs : [ {
              id : "selectStation",
              type : "select",
              path : "station",
              attr : "station",
             /* childs : [ {
                  id : "selectMSN",
                  type : "select",
                  path : "msn",
                  currentmsn : "Current_MSN",

                  childs : []
              },
              {
                  id : "Return",
                  type : "Return",
                  childs : []
              }]*/
          }
              ]
      } ]
  },
  
/*  
//For hierachy of combobox
  addParent : function(oTree, oParent) {
      var that = this;
      oTree.parent = oParent;
      oTree.childs.forEach(function(oElement) {
          that.addParent(oElement, oTree);
      });
  },
  
  findElement : function(oTree, sId) {
      if (oTree.id == sId) {
          return oTree;
      } else {
          var oElement;
          for (var i = 0; i < oTree.childs.length; i++) {
              oElement = this.findElement(oTree.childs[i],
                      sId);
              if (oElement) {
                  return oElement;
              }
          }
      }
  },
*/
  /**
   * Called when selecting from combobox in Add Station Popup
   */
  
 /* onSelectionChange : function(){
	  var that = this;

      if (oEvt.getSource != undefined ) {

          var id = oEvt.getSource().getId().split("--")[1];

      } else {
          // Used when this function is call to set usersetting data.
          var id = oEvt;
      }

      this.findElement(this.selectTree, id).childs
              .forEach(function(oElement) {
                  that.clearField(oElement);
                  that.filterField(oElement);
              });

      switch(id) {
      case "selectLine":
          this.setEnabledCombobox(true, true, true, false);
          break;
      case "selectStation":
//    	  if ( airbus.mes.lintracker.ModelManager.currentMsnSelected ) {
          if ( airbus.mes.lintracker.ModelManager.currentMsnSelected ) {
         
//              var sCurrentMsn = "";
              if ( sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row") != undefined ) {
              var oModel = sap.ui.getCore().getModel("plantModel").getProperty("/Rowsets/Rowset/0/Row");
              // Find automatically the msn with the flag Current MSN different of "---"
              oModel = oModel.filter(function (el) {
                    return el.program ===  airbus.mes.lintracker.ModelManager.program &&
                              el.line === airbus.mes.lintracker.oView.byId("selectLine").getSelectedKey() &&
                           el.station === airbus.mes.lintracker.oView.byId("selectStation").getSelectedKey() 
//                           && el.Current_MSN === "true"
                  });
              if ( oModel.length > 0 ) {

                  // This is need to reset the previous current msn value when we reload the applicatoin
//                  airbus.mes.settings.ModelManager.currentMsnValue = oModel[0].msn;
//                  airbus.mes.settings.oView.byId("selectMSN").setValue( oModel[0].msn );

              }
              }
          }
          this.setEnabledCombobox(true, true, true, true);
          break;
      default:
          this.setEnabledCombobox(true, true, true, true);

  }
  },
*/



});