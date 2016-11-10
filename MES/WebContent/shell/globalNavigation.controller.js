sap.ui.controller("airbus.mes.shell.globalNavigation", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */

	onInit : function() {

	},
	onPress : function(oEvt) {

	},


	goToHome : function() {

		// Active settings button during leaving settings screen
		if (airbus.mes.shell != undefined) {
			airbus.mes.shell.oView.byId("settingsButton").setEnabled(true);
			this.setInformationVisibility(false);
		};

		if (airbus.mes.homepage != undefined) {
			nav.to(airbus.mes.homepage.oView.getId());
		} else {
			sap.ui.getCore().createComponent({
				name : "airbus.mes.homepage", // root component folder is resources
			});

			nav.addPage(airbus.mes.homepage.oView);
			nav.to(airbus.mes.homepage.oView.getId());
		}
	},
//	Change language, reload the URL with the new language
	onChangeLanguage : function(oEvent) {
//		Retrieve language 		
		var sText = oEvent.getSource().getSelectedKey();	
		airbus.mes.settings.ModelManager.saveUserSetting(sText);
		this.updateUrlForLanguage(sText);
	},
	updateUrlForLanguage : function(sText){
		switch (sText) {
		case "en":
			sap.ui.getCore().getConfiguration().setLanguage("en");
			break;
		case "de":
			sap.ui.getCore().getConfiguration().setLanguage("de");
			break;
		case "fr":
			sap.ui.getCore().getConfiguration().setLanguage("fr");
			break;
		case "sp":
			sap.ui.getCore().getConfiguration().setLanguage("sp");
			break;
		default:
			sap.ui.getCore().getConfiguration().setLanguage(sap.ui.getCore().getConfiguration().getLanguage().slice(0,2))
			break;
		};		
	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */

//	onAfterRendering : function() {
//		
//	},


	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf components.globalnav.globalNavigation
	 */
	// onExit: function() {
	//
	// }
	navigate : function() {

		this.setInformationVisibility(false);
		// Deactivate button on settings screen
		airbus.mes.shell.oView.byId("settingsButton").setEnabled(false);
		
		var textButtonTo = undefined;
		
		switch(nav.getCurrentPage().getId()){
		case "stationTrackerView":
			textButtonTo = "Go to Station Tracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");			
			break;

		case "homePageView":
			textButtonTo = "Go to Home Page";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");			
			break;
			
		case "resourcePool":
			textButtonTo = "Go to Team Assignment";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");			
			break;
			
		case "disruptiontrackerView":
			textButtonTo = "Go to Disruption Tracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");			
			break;
			
		case "polypolyPage":
			textButtonTo = "Go to Polypoly";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "polypoly");
			break;
			
			
		}


	},

	renderViews : function() {

        if ( nav.getCurrentPage().getId() != "homePageView" ) {
            
            airbus.mes.shell.oView.byId("homeButton").setVisible(true);
            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
	           
	     } else  {
	           
	            airbus.mes.shell.oView.byId("homeButton").setVisible(false);
	            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(true);
	    }

		switch(nav.getCurrentPage().getId()){
		
		case "stationTrackerView":
			this.renderStationTracker();
			break;
			
		case "disruptiontrackerView":
			if(nav.getPreviousPage().sId == "stationTrackerView"){
				airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel({
					'station': airbus.mes.settings.ModelManager.station
				});
			}
			else{
				airbus.mes.disruptiontracker.ModelManager.loadDisruptionTrackerModel({});
			}
			this.renderDisruptionTracker();
			break;
			
		case "resourcePool":
			airbus.mes.resourcepool.util.ModelManager.askResourcePool();
			break;

		}
	},
	
	/**
	 * RenderStation Tracker and reload all model/ shift are not reaload
	 */
	renderStationTracker: function(){
		
		var oModule = airbus.mes.stationtracker.ModelManager;
		this.setInformationVisibility(true);
    
		airbus.mes.stationtracker.oView.byId("stationtracker").setBusy(true);

		oModule.loadAffectation();
   		oModule.loadStationTracker("U");
   		oModule.loadStationTracker("O");
   		oModule.loadStationTracker("R");
    	oModule.loadProductionGroup();
    	oModule.loadKPI();
   	
	},
	
	
	setInformationVisibility : function(bSet) {
		this.getView().byId("informationButton").setVisible(bSet);
		this.getView().byId("homeButton").setVisible(bSet);
		this.getView().byId("SelectLanguage").setVisible(!bSet);
	},
	onInformation : function(oEvent){
		airbus.mes.shell.oView.addStyleClass("viewOpacity");
		
		if ( airbus.mes.stationtracker.informationPopover === undefined ) {
			var oView = airbus.mes.stationtracker.oView;
			airbus.mes.stationtracker.informationPopover = sap.ui.xmlfragment("informationPopover","airbus.mes.shell.informationPopover", airbus.mes.shell.oView.getController());
			airbus.mes.stationtracker.informationPopover.addStyleClass("alignTextLeft");
			oView.addDependent(airbus.mes.stationtracker.informationPopover);
		}

		// delay because addDependent will do a async rerendering and the popover will immediately close without it
		var oButton = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			airbus.mes.stationtracker.informationPopover.openBy(oButton);	
		});			
	},
	onCloseInformation : function(){
		airbus.mes.shell.oView.removeStyleClass("viewOpacity");		
	},
	/*******************************************
	 * Render disruption Tracker
	 */
	renderDisruptionTracker:function(){
		var aFilters = [];
		var aTemp = [];
		var duplicatesFilter = new sap.ui.model.Filter({
			path : "station",
			test : function(value) {
				if (aTemp.indexOf(value) == -1) {
					aTemp.push(value)
					return true;
				} else {
					return false;
				}
			}
		});
		aFilters.push(duplicatesFilter);
		sap.ui
				.getCore()
				.byId("disruptiontrackerView--stationComboBox")
				.getBinding("items")
				.filter(new sap.ui.model.Filter(aFilters, true));
		
	},
	/*******************************************
	 * My Profile PopUp
	 */
	goToMyProfile:function(){
		if(!this._myProfileDailog){
			this._myProfileDailog = sap.ui.xmlfragment("airbus.mes.shell.myProfile", this);
			this.getView().addDependent(this._myProfileDialog);			
		}
		this._myProfileDailog.open();
	},
	onCancelMyProfile:function(){
		this._myProfileDailog.close();
	},
	
	onScanMyProfile:function(){

		 // Open a web socket connection
          var ws = new WebSocket("ws://localhost:754/TouchNTag");
          
          ws.onopen = function(){	
       	   sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(true);
       	   sap.ui.getCore().byId("msgstrpMyProfile").setType("Information");
       	   sap.ui.getCore().byId("msgstrpMyProfile").setText(getModel("Shelli18n").getProperty("scanBadge"));
       	   var msgData = {
       			   BadgeOrRFID:"BADGE",
       			   Message:"UID:263808008C0F3D"
       			  };

             // Web Socket is connected
             ws.send(JSON.stringify(msgData));
//             ws.send(JSON.stringify(
//           		  {"BadgeOrRFID":"BADGE","Message":"UID:263808008C0F31"}
//             ));

//             alert("Message is sent...");
          // For Simulation purpose (comment below line when you scan through reader)	
             onSimulation(msgData);
          };
          
          ws.onmessage = function (evt){ 
             var scanData = JSON.parse(evt.data);	
             var uID  = scanData.Message;			//UID
             var badgeID = scanData.BadgeOrRFID;     //BID
             
//             if(uID != undefined && uID != "")
//           	  uID = uID.split(":")[1];
             sap.ui.getCore().getElementById("uIdMyProfile").setValue(uID);
             sap.ui.getCore().getElementById("badgeIdMyProfile").setValue(badgeID);
             ws.close();
             sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
          };
          // Error Handling while connection failed to WebSocket
          ws.onerror = function(evnt){
       	   //alert("Error has occured");
       	   var badgeScanError = oView.getModel("i18n")
				.getProperty("webSocketConnectionFailed");
       	   airbus.mes.operationdetail.ModelManager
				.messageShow(badgeScanError);
          }
          
          ws.onclose = function(){ 
             // websocket is closed.			            	  			            	   
             alert("Connection is closed..."); 
          }		               
          
       // For Simulation purpose (Local Server Testing)				
			function onSimulation(data){
//				 var data = JSON.parse(evt.data);	
                 var uID  = data.Message;			//UID
                 var badgeID = data.BadgeOrRFID;     //BID
                 
//                 if(uID != undefined && uID != "")
//               	  uID = uID.split(":")[1];
                 sap.ui.getCore().getElementById("uIdMyProfile").setValue(uID);
                 sap.ui.getCore().getElementById("badgeIdMyProfile").setValue(badgeID);
                 ws.close();
			}		
	
	},
	
	onSaveMyProfile:function(oEvent){
		var badgeID = sap.ui.getCore().getElementById("badgeIdMyProfile").getValue();
		var uID = sap.ui.getCore().getElementById("uIdMyProfile").getValue();
		var user = sap.ui.getCore().getElementById("userNameMyProfile").getValue();
		var pass = sap.ui.getCore().getElementById("passwordMyProfile").getValue();
		var pinCode = sap.ui.getCore().getElementById("pinCodeMyProfile").getValue();
		
		if(badgeID == "" || uID == "" || user == "" || pass == ""){
			sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
			sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
			sap.ui.getCore().byId("msgstrpMyProfile").setText(getModel("Shelli18n")
							.getProperty("CompulsaryCredentials"));
		}
		else{
			sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
			
			// Call service for Operation Confirmation
			jQuery
					.ajax({
						url : airbus.mes.shell.ModelManager
								.getMyProfileUrl(
										badgeID,
										user,
										pass,
										pinCode,
										uID),
						async : false,
						error : function(xhr, status, error) {
							airbus.mes.shell.ModelManager
									.messageShow(sMessageError);
							flag_success = false

						},
						success : function(result, status, xhr) {
							if (result.Rowsets.Rowset[0].Row[0].Message_Type === undefined) {
								airbus.mes.shell.ModelManager
										.messageShow(sMessageSuccess);
								flag_success = true;
							} else if (result.Rowsets.Rowset[0].Row[0].Message_Type == "E") {
								airbus.mes.shell.ModelManager
										.messageShow(result.Rowsets.Rowset[0].Row[0].Message)
								flag_success = false;
							} else {
								airbus.mes.shell.ModelManager
										.messageShow(result.Rowsets.Rowset[0].Row[0].Message);
								flag_success = true;
							}

						}
					});
		}
		
	}
			
});
