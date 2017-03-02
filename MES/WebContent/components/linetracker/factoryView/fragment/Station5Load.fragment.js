"use strict";
sap.ui.jsfragment("airbus.mes.factoryView.Station5Load", {  
    createContent: function(oController) { 
    var sIDrow = "";
    var sIDrow1 = "";
       //Obtain data from controller  
    airbus.mes.factoryView.util.ModelManager.getAvailableStations();
	sap.ui.getCore().getModel("lModel").refresh(true);						
	// Local Station 5 global temporary Model
	var tModel = new sap.ui.model.json.JSONModel();
	// Search the MSN
//	var oSearchMSN = new sap.m.SearchField({
//		search : function(oEvent) {
//			var searchValue = this.getValue();
//				}
//	});
	var oAffectation = new sap.m.Text({
		text : "{MSN}",
	});
	var oAffectation2 = new sap.m.Text({
		text : "{hand}",
	});
	var oAffectation3 = new sap.m.Text({
		text : "{Sequence}",
	});
	var oAffectation4 = new sap.m.Text({
		text : "{Line}",
	});
	
	var oAffectation5 = new sap.ui.commons.CheckBox({
		checked: {
	    path: 'Spares_Loaded',
	    formatter: function(s) {
	      return (s === "true");
	    }},
        editable : false
	});
var oAffectation6 = new sap.ui.commons.CheckBox({
	checked: {
	    path: 'Ribs_Loaded',
	    formatter: function(s) {
	      return (s === "true");
	    }},
	editable : false
	});
var oAffectation7 = new sap.ui.commons.CheckBox({
	checked: {
	    path: 'Panels_Loaded',
	    formatter: function(s) {
	      return (s === "true");
	    }},
	editable : false
	});
	
	airbus.mes.factoryView.util.ModelManager.a_UserSave = [ {} ];
	var clicked = undefined;
	var oTemplate = new sap.m.ColumnListItem({
		type : 'Active',
		updateFinished : function(oEvent) {
			// this.getView().byId().setSelectedItem(false);
			// perform further needed code here..like
			// modifiying detail page based upon first item
		},
		press : function(oEvt) {
			if (sIDrow1 != "") {sap.ui.getCore().byId(sIDrow1).removeStyleClass("loading5");}
			clicked = true;
			sIDrow = oEvt.getSource().sId;
			sap.ui.getCore().byId(sIDrow).addStyleClass("loading5");
			tModel.setData(oEvt.getSource()
					.getBindingContext().getProperty());
			sIDrow1=sIDrow;
		},
		cells : [ oAffectation3, oAffectation,
				oAffectation2,oAffectation4,oAffectation5,oAffectation6,oAffectation7 ],
	});
	var oTableAvailable = new sap.m.Table({
		type : 'Active',
		backgroundDesign:sap.m.BackgroundDesign.Solid,
		inset : false
	});
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "Sequence",
		}),

	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "MSN",
		}),

	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "Hand",
		}),
	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "Line",
		}),
	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "S",
		}),
		width : "40px"
	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "R",
		}),
		width : "40px"

	}));
	oTableAvailable.addColumn(new sap.m.Column({
		header : new sap.m.Label({
			text : "P",
		}),
		width : "40px"

	}));
	oTableAvailable.setModel(sap.ui.getCore().getModel(
			"lModel"));
	oTableAvailable.bindAggregation("items", {
		path : "/Rowsets/Rowset/0/Row",
		template : oTemplate,
	});
	var oAButton = new sap.m.Button({
		text : "Confirm",
		press : function(oEvt) {
			/*xcomment temporary*/
			//oController.SelectedStationBtnObj.getParent().getItems()[0].getModel().setData(tModel.oData);
			if (clicked == true) {
				//oController.SelectedStationBtnObj.getParent().getItems()[0].setMsn(tModel.oData.MSN);
				//oController.SelectedStationBtnObj.getParent().getItems()[0].setHand(tModel.oData.hand);
				//oController.SelectedStationBtnObj.setText("Unload");
				//oController.SelectedStationBtnObj.setIcon("sap-icon://down");
				//oController.SelectedStationBtnObj.setTooltip("Unload " + oController.stype);
//				ModelManager.refreshStationModel5(ModelManager.line_number,msn_loaded,hand_loaded);
				airbus.mes.factoryView.util.ModelManager.loadUnloadStation5(tModel.oData.MSN,tModel.oData.hand);
//				ModelManager.loadModelFactoryModel();
				oDialog5.close();
			};
			clicked = false;
			oDialog5.close();
		}
	});
	var oCButton = new sap.m.Button({
		text : "Cancel",
		press : function() {
			oDialog5.close();
			airbus.mes.factoryView.util.ModelManager.a_UserSave = [ {} ];
		}
	});
	var oDialog5 = new sap.m.Dialog({
		showHeader : true,
		content : [ oTableAvailable ],
		buttons : [ oAButton, oCButton ],
	});
	oDialog5.setInitialFocus(oAButton);
	oDialog5
			.setTitle('Choose the MSN to load on Station 5 '
					+ oController.stype);
		return oDialog5;    
    }  
});  