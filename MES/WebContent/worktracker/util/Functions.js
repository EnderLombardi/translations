"use strict";

jQuery.sap.declare("airbus.mes.worktracker.util.Functions");

airbus.mes.worktracker.util.Functions = {
		
	getInitials : function(fName, lName) {
		var initals = "";
		if(typeof fName != 'undefined' && fName != "")
			initals = fName[0].toUpperCase()
		if(typeof lName != 'undefined' && lName != "")
			initals = initals + lName[0].toUpperCase();
		return initals;
		
	},
	
	addCountTextClass: function(id){
		$($("[id$='"+id+"'] [id$='-count']")).each(function(){
			if(this.innerHTML != "")  $(this).addClass("countText");
		});
	},
	
	handleMessagePopOver: function(oBject, oEvt){

		// Model for messages
		oBject.getView().setModel(new sap.ui.model.json.JSONModel(),"messagesModel");	 
		oBject.getView().getModel("messagesModel").loadData("local/messages.json",null,false);
		
		// create popover
		if (! oBject.messagePopover) {
			oBject.messagePopover = sap.ui.xmlfragment("airbus.mes.worktracker.fragments.MessagesPopOver", oBject);
			oBject.messagePopover.setModel(oBject.getView().getModel("messagesModel"));
			oBject.getView().addDependent(oBject.messagePopover);
		}
		
		// delay because addDependent will do a async re-rendering and the actionSheet will immediately close without it.
		var oButton = oEvt.getSource();
		jQuery.sap.delayedCall(0, oBject, function () {
			oBject.messagePopover.openBy(oButton);
		})
	}

};
