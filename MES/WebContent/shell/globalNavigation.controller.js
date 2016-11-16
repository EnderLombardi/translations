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
		case "idMainView":
			textButtonTo = "Go to LineTracker";
			airbus.mes.settings.GlobalFunction.navigateTo(textButtonTo, "back");
			break;
			
			
		}


	},
	onPressConnection : function() {
		
	},
	renderViews : function() {
		var autoRefresh = undefined;

        if ( nav.getCurrentPage().getId() != "homePageView" ) {
            
            airbus.mes.shell.oView.byId("homeButton").setVisible(true);
            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(false);
	           
	     } else  {
	           
	            airbus.mes.shell.oView.byId("homeButton").setVisible(false);
	            airbus.mes.shell.oView.byId("SelectLanguage").setVisible(true);
	    }

		switch(nav.getCurrentPage().getId()){
		
		case "stationTrackerView":
			//autoRefresh = window.setInterval(this.renderStationTracker, 1000);

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
		
		console.log("Hello");
		
		var oModule = airbus.mes.stationtracker.ModelManager;
		airbus.mes.shell.oView.getController().setInformationVisibility(true);
    
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
		sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
		sap.ui.getCore().byId("uIdMyProfile")
				.setValue("");
		sap.ui.getCore().byId("badgeIdMyProfile")
				.setValue("");
		sap.ui.getCore().byId("userNameMyProfile")
				.setValue("");
		sap.ui.getCore().byId("passwordMyProfile")
				.setValue("");
		sap.ui.getCore().byId("pinCodeMyProfile")
		.setValue("");
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
       	   sap.ui.getCore().byId("msgstrpMyProfile").setText(
       			   			sap.ui.getCore().getModel("ShellI18n").getProperty("scanBadge"));
           console.log("Connection Established");
          };
          
          ws.onmessage = function (evt){ 
             var scanData = JSON.parse(evt.data);	
             var uID  = scanData.Message;			//UID
             var badgeID = scanData.BadgeOrRFID;     //BID
             sap.ui.getCore().getElementById("uIdMyProfile").setValue(uID);
             sap.ui.getCore().getElementById("badgeIdMyProfile").setValue(badgeID);
             sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
             console.log("message recieved from server");
             ws.close();
          };
          // Error Handling while connection failed to WebSocket
          ws.onerror = function(evnt){
       	   var connectionError = sap.ui.getCore().getModel("ShellI18n")
				.getProperty("webSocketConnectionFailed");
       	   airbus.mes.operationdetail.ModelManager
				.messageShow(connectionError);
       	   console.log("Error Occurred while Connecting");
          }
          
          ws.onclose = function(){ 
             // websocket is closed.			            	  			            	   
        	  console.log("Connection closed");
          }		               
	
	},
	
	onSaveMyProfile:function(oEvent){
		sap.ui.getCore().getElementById("msgstrpMyProfile").setVisible(false);
		var badgeID = sap.ui.getCore().getElementById("badgeIdMyProfile").getValue();
		var uID = sap.ui.getCore().getElementById("uIdMyProfile").getValue();
		var user = sap.ui.getCore().getElementById("userNameMyProfile").getValue();
		var pass = sap.ui.getCore().getElementById("passwordMyProfile").getValue();
		var pinCode = sap.ui.getCore().getElementById("pinCodeMyProfile").getValue();
		
		if(badgeID == "" || uID == "" || user == "" || pass == ""){
			sap.ui.getCore().byId("msgstrpMyProfile").setVisible(true);
			sap.ui.getCore().byId("msgstrpMyProfile").setType("Error");
			sap.ui.getCore().byId("msgstrpMyProfile").setText(sap.ui.getCore().getModel("ShellI18n")
							.getProperty("CompulsaryCredentials"));
			if(user === ""){
			sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.Error);
			}else{
				sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			if(pass === ""){
				sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.Error);
			}else{
				sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			if(uID === ""){
				sap.ui.getCore().getElementById("uIdMyProfile").setValueState(sap.ui.core.ValueState.Error);
			}else{
				sap.ui.getCore().getElementById("uIdMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			if(badgeID === ""){
				sap.ui.getCore().getElementById("badgeIdMyProfile").setValueState(sap.ui.core.ValueState.Error);
			}else{
				sap.ui.getCore().getElementById("badgeIdMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
		}
		else{
			if(user != "" || user != undefined){
				sap.ui.getCore().getElementById("userNameMyProfile").setValueState(sap.ui.core.ValueState.None);	
				};
			if(pass != "" || pass != undefined){
				sap.ui.getCore().getElementById("passwordMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			if(uID != "" || uID != undefined){
				sap.ui.getCore().getElementById("uIdMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			if(badgeID != "" || badgeID != undefined){
				sap.ui.getCore().getElementById("badgeIdMyProfile").setValueState(sap.ui.core.ValueState.None);	
			};
			var sMessageError = sap.ui.getCore().getModel("ShellI18n").getProperty("errorMsgwhileSavingProfile");
			var sMessageSuccess = sap.ui.getCore().getModel("ShellI18n").getProperty("successMsgwhileSavingProfile");
			// Call service for Save My Profile
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
			if(flag_success === true){
				this._myProfileDailog.close();
			}else{
				airbus.mes.shell.ModelManager
				.messageShow(sMessageSuccess);
			}
		}
		
	},
	
	logOut : function() {
		
		Cookies.remove("login");
		window.location = window.location.origin + window.location.pathname;
		
	}
			
});
