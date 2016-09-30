sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment',
    "sap/m/MessageToast"
], function(Controller, JSONModel, Fragment, MessageToast) {
    "use strict";
    

    return Controller.extend("airbus.mes.polypoly.App", {
        onInit: function() {
            var sourceData = {
                localFile: undefined,
                remoteUrl: undefined, 
            };
            var model = new JSONModel();
            model.setData(sourceData);
            this.getView().setModel(model, "source");
            this.byId("RessourcePool").attachBrowserEvent("tab keyup", function(oEvent){
				this._bKeyboard = oEvent.type == "keyup";
			}, this);
        },
        
        onInit: function(){
			
		},
        
        onRessourcePool: function(oEvent) {
			var oButton = oEvent.getSource();
 
			// create menu only once
			if (!this._menu) {
				this._menu = sap.ui.xmlfragment(
					"polypoly.RessourcePool",
					this
				);
				this.getView().addDependent(this._menu);
			}
 
			var eDock = sap.ui.core.Popup.Dock;
			this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
		},
 
		handleMenuItemPress: function(oEvent) {
			var msg = "'" + oEvent.getParameter("item").getText() + "' pressed";
			MessageToast.show(msg);
		},
 
		handleTextFieldItemPress: function(oEvent) {
			var msg = "'" + oEvent.getParameter("item").getValue() + "' entered";
			MessageToast.show(msg);
		},

		onProgram: function() {
			MessageToast.show("Program");
		},
		onPlant: function() {
			MessageToast.show("Plant");
		},
		onLine: function() {
			MessageToast.show("Line");
		},
		onStation: function() {
			MessageToast.show("Station");
		},
		handleSettingsPress: function(evt) {
			MessageToast.show("Settings");
		},
		handleHomePress: function(evt) {
			MessageToast.show("Home");
		},
		handleLeftPress: function(evt) {
			MessageToast.show("Left");
		},
		handleRightPress: function(evt) {
			MessageToast.show("Right");
		}
    });
});