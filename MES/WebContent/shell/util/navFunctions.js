"use strict";

jQuery.sap.declare("airbus.mes.shell.util.Functions");

airbus.mes.shell.util.navFunctions = {
		
		stationTracker: function(){

			if (airbus.mes.stationtracker === undefined){
				
				jQuery.sap.registerModulePath("airbus.mes.stationtracker", "../components/stationtracker");

				sap.ui.getCore().createComponent({
					name : "airbus.mes.stationtracker",
				});
				nav.addPage(airbus.mes.stationtracker.oView);
			}
			
			nav.to(airbus.mes.stationtracker.oView.getId());
			
		},
		
		polypoly: function(){
			
			if (airbus.mes.stationtracker === undefined){
				
				jQuery.sap.registerModulePath("airbus.mes.stationtracker", "../components/stationtracker");

				sap.ui.getCore().createComponent({
					name : "airbus.mes.stationtracker",
				});
			}

//			if (airbus.mes.polypoly === undefined){
//				
//				jQuery.sap.registerModulePath("airbus.mes.polypoly", "../components/polypoly");
//
//				sap.ui.getCore().createComponent({
//					name : "airbus.mes.polypoly",
//				});
//				nav.addPage(airbus.mes.polypoly.oView);	
//			}
//			
//			nav.to(airbus.mes.polypoly.oView.getId());
			
			jQuery.sap.registerModulePath("airbus.mes.polypoly","../components/polypoly");
			airbus.mes.stationtracker.AssignmentManager.polypolyAffectation = false;
			if(airbus.mes.polypoly == undefined){
				sap.ui.getCore().createComponent({
					name : "airbus.mes.polypoly", // root component folder is resources
	         	});
			}
			
			airbus.mes.polypoly.PolypolyManager.globalContext.bEditable = !airbus.mes.stationtracker.AssignmentManager.polypolyAffectation;
			
			if(!nav.getPage("polypolyPage")){
			var oPolypolyPage = new sap.m.Page({
				content: airbus.mes.polypoly.oView,
				title : "POLYPOLY",
				id:"polypolyPage",
				customHeader : new sap.m.Toolbar({
					content: [
					          new sap.m.Button({
					        	  icon:"sap-icon://arrow-left",
					        	  type:"Transparent",
					        	  press: function(){nav.back()},
					        	  text: "Back",
					          }),
					          new sap.m.ToolbarSpacer({}),
					          new sap.m.Label("polypolytitle", {
					        	  text: "Polyvalence-Polycompetence Matrix"
					          }).addStyleClass("pageWelcome sapUiTinyMarginBeginEnd"),
					          new sap.m.ToolbarSpacer({}),
					          ]
				}).addStyleClass("pageHeader contentNoPad"),
			}).addStyleClass("classPolypolyPage");
			
			nav.addPage(oPolypolyPage);
			}
			else{
				var oPolypolyPage = nav.getPage("polypolyPage");
				if(oPolypolyPage.getContent().length == 0){
					oPolypolyPage.addContent(airbus.mes.polypoly.oView);
				}
			}
			nav.to(oPolypolyPage);						
			airbus.mes.polypoly.ModelManager.getPolyPolyModel("CHES", "1L"); //FIXME When Settings ready
//			airbus.mes.polypoly.ModelManager.getPolyPolyModel(airbus.mes.settings.ModelManager.site, airbus.mes.settings.ModelManager.station);
			airbus.mes.polypoly.oView.getController().initiatePolypoly();	
			
		},
		
		
		resourcePool: function(){
			if (airbus.mes.resourcepool === undefined){
				
				jQuery.sap.registerModulePath("airbus.mes.resourcepool", "../components/resourcepool");
	
				sap.ui.getCore().createComponent({
					name : "airbus.mes.resourcepool",
	         	});
				nav.addPage(airbus.mes.resourcepool.oView);
			}
			
			nav.to(airbus.mes.resourcepool.oView.getId());
			
		},
		
				
		lineTracker: function(){

			if (airbus.mes.linetracker === undefined){
				
				jQuery.sap.registerModulePath("airbus.mes.linetracker", "../components/linetracker");

				sap.ui.getCore().createComponent({
					name : "airbus.mes.linetracker",
				});
				nav.addPage(airbus.mes.linetracker.oView);
			}
			
			nav.to(airbus.mes.linetracker.oView.getId());
		},
		
		disruptionTracker: function(){

			if (airbus.mes.disruptiontracker === undefined || airbus.mes.disruptiontracker.oView === undefined){
				
				jQuery.sap.registerModulePath("airbus.mes.disruptiontracker", "../components/disruptiontracker");

				sap.ui.getCore().createComponent({
					name : "airbus.mes.disruptiontracker",
				});
				nav.addPage(airbus.mes.disruptiontracker.oView);
			}
			
			nav.to(airbus.mes.disruptiontracker.oView.getId());
		},
		
		disruptionKPI: function(){
			if (airbus.mes.disruptiontracker === undefined){				
				jQuery.sap.registerModulePath("airbus.mes.disruptiontracker", "../components/disruptiontracker");
			}
			
			if (airbus.mes.disruptiontracker.kpi === undefined || airbus.mes.disruptiontracker.kpi.oView === undefined){				
				jQuery.sap.registerModulePath("airbus.mes.disruptiontracker.kpi", "../components/disruptiontracker/kpi");	

				sap.ui.getCore().createComponent({
					name : "airbus.mes.disruptiontracker.kpi",
				});
				nav.addPage(airbus.mes.disruptiontracker.kpi.oView);
			}
			nav.to(airbus.mes.disruptiontracker.kpi.oView.getId());	
		},
		
		
		worktracker: function(){
		
			if (airbus.mes.worktracker === undefined) {
				sap.ui.getCore().createComponent({
					name : "airbus.mes.worktracker",
				});
				nav.addPage(airbus.mes.worktracker.oView);
				
			}
			
			// Validate whether User exist in WorkCenter or not
			var userId = sap.ui.getCore().getModel("userDetailModel").getProperty("/Rowsets/Rowset/0/Row/0/user_id");
			airbus.mes.worktracker.util.ModelManager.loadUserListModel();
			
			var oUserListModel = sap.ui.getCore().getModel("UserListModel");
			var aUserList = oUserListModel.getProperty("/Rowsets/Rowset/0/Row");
			if(typeof aUserList != "undefined"){
				var flagUserFound = false;
				for(var i=0;i<aUserList.length;i++){
					 if(aUserList[i].Logon == userId){
						 flagUserFound = true;
						 break;
					 }
				}
				if(!flagUserFound){
					airbus.mes.worktracker.util.ModelManager
							.messageShow(airbus.mes.worktracker.oView.getModel("i18n").getProperty("notAssigned_Workcenter")
									+ airbus.mes.settings.ModelManager.station, 5000)
				 }
					
			}
			else{
				airbus.mes.worktracker.util.ModelManager
				.messageShow(airbus.mes.worktracker.oView.getModel("i18n").getProperty("notAssigned_Workcenter")
						+ airbus.mes.settings.ModelManager.station, 5000)
			}
			
			// Set Current Operator
			if(typeof airbus.mes.worktracker.util.ModelManager.currentOperator.fname == "undefined")
				airbus.mes.worktracker.util.ModelManager.setCurrentOperator();
			
			// Load Operations Data
			airbus.mes.worktracker.util.ModelManager.loadUserOperationsModel();
			
			// Set station name
			airbus.mes.worktracker.oView.byId("stationName").setText(airbus.mes.settings.ModelManager.station);
			
			
			//Navigate
			nav.to(airbus.mes.worktracker.oView.getId());
			
		},
		
		worktrackerOpDetail: function(operationIndex){
			if (airbus.mes.worktracker.detail === undefined) {
				sap.ui.getCore().createComponent({
					name : "airbus.mes.worktracker.detail",
				});
				nav.addPage(airbus.mes.worktracker.detail.oView);
				
			}
			
			var controller = airbus.mes.worktracker.detail.oView.getController();
			
			
			// Set station name
			airbus.mes.worktracker.detail.oView.byId("stationName").setText(
					airbus.mes.settings.ModelManager.station);

			// Get Operation data from operation list
			var operationData = sap.ui.getCore().getModel(
					"userOperationsModel").getProperty(
					"/Rowsets/Rowset/0/Row/"
							+ operationIndex);

			// put operation data in Operation Detail Model
			airbus.mes.worktracker.detail.oView.getModel("operationDetailModel")
					.setProperty("/schedule/", operationData);
			

			// Set Progress Screen according to status of operation
			if (airbus.mes.worktracker.detail.oView.byId("operationStatus").getText() === "Not Started"
					|| airbus.mes.worktracker.detail.oView.byId("operationStatus")
							.getText() === "Paused") {

				controller.setProgressScreenBtn(false, false, true);
				airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(
						false);

			} else if (airbus.mes.worktracker.detail.oView.byId("operationStatus")
					.getText() === "In Progress") {

				controller.setProgressScreenBtn(true, true, false);
				airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(
						true);

			} else if (airbus.mes.worktracker.detail.oView.byId("operationStatus")
					.getText() === "Blocked"
					|| airbus.mes.worktracker.detail.oView.byId("operationStatus")
							.getText() === "Confirmed") {

				controller.setProgressScreenBtn(false, false, false);
				airbus.mes.worktracker.detail.oView.byId("progressSlider").setEnabled(
						false);
				airbus.mes.worktracker.detail.oView.byId("progressSliderfirst")
						.setEnabled(false);

			}
			
			// Model for Reason Code Comments
			airbus.mes.worktracker.util.ModelManager
					.loadReasonCodeModel();
			

			// Set default tab as progress slider
			airbus.mes.worktracker.detail.oView.byId("operationNav").setSelectedKey(0);

			// Hide Create disruption for (If it's already opened)
			//controller.onCancelCreateDisruption();
			

			//Navigate
			nav.to(airbus.mes.worktracker.detail.oView.getId());
		}
};
