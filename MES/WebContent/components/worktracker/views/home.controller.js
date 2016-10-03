sap.ui.controller("airbus.mes.worktracker.views.home", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf worktracker.views.home
*/
	onInit: function() {
		
		// Set i18n Model
	  	var i18nModel = new sap.ui.model.resource.ResourceModel({
	    	bundleUrl : "worktracker/i18n/i18n.properties",
	    	bundleLocale : sap.ui.getCore().getConfiguration().getLanguage()
	  	});
	  	this.getView().setModel(i18nModel, "i18n");
	  	  
	  	//Include CSS file
	  	jQuery.sap.includeStyleSheet("worktracker/css/workTracker.css");
	  	jQuery.sap.includeStyleSheet("worktracker/css/sideNavigation.css");
	  	  	
  	  
  	  	var url="http://"+window.location.host+"/MES/components/worktracker/local/";
		
		// Model for station names
		this.getView().setModel(new sap.ui.model.json.JSONModel(),"stationModel");	 
		this.getView().getModel("stationModel").loadData(url+"stations.json",null,false);
		
		// Model for change operator
		this.getView().setModel(new sap.ui.model.json.JSONModel(),"operatorsModel");	 
		this.getView().getModel("operatorsModel").loadData(url+"operators_S10.json",null,false);
		
		
		// Model for Document List
		sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(),"documentsNameModel");	 
		sap.ui.getCore()
		.getModel("documentsNameModel").loadData(url+"document.json",null,false);
		
		// Model for table in disruptions
		var oModel = new sap.ui.model.json.JSONModel();
		this.getView().setModel(oModel , "tableModel");
		oModel.loadData(url+"tableContent.json",null,false);
		
		// Model for operation View
		var oModel = new sap.ui.model.json.JSONModel();
		sap.ui.getCore().setModel(oModel, "ScheduleModel");
		oModel.loadData(url+"schedule.json", null, false);
		
		// Model for station names
		this.getView().setModel(new sap.ui.model.json.JSONModel(),"activityModel");	 
		this.getView().getModel("activityModel").loadData(url+"activities.json",null,false);
		
		//this.getView().byId("customNav").render()
		
		// Model for station names
		this.getView().setModel(new sap.ui.model.json.JSONModel(),"status");	 
		this.getView().getModel("status").loadData(url+"status.json",null,false);

	},
	
	showGridView: function(oEvent){
		
		oEvent.getSource().setPressed(true);
		this.getView().byId("buttonList").setPressed(false);
		this.getView().byId("operationGridLayout").setDefaultSpan("L3 M6 S12");
		var oOperationListItem = this.getView().byId("operationGridLayout").getContent();
		oOperationListItem.forEach(function(value){
			//value.getContent()[0].setDirection("Column");
			value.getContent()[0].setWidth("100%");
			value.getContent()[3].addStyleClass("floatBottomRight");
			value.getContent()[3].removeStyleClass("bottomRight");
		});
				
	},
	
	showListView: function(oEvent){
		oEvent.getSource().setPressed(true);
		this.getView().byId("buttonGrid").setPressed(false);
		this.getView().byId("operationGridLayout").setDefaultSpan("L12 M12 S12");
		var oOperationListItem = this.getView().byId("operationGridLayout").getContent();
		oOperationListItem.forEach(function(value){
			//value.getContent()[0].setDirection("Row");
			value.getContent()[0].setWidth("35%");
			value.getContent()[3].addStyleClass("bottomRight");
			value.getContent()[3].removeStyleClass("floatBottomRight");
		});			
		
	},
	
	showActivityLog : function(oEvent)
	{
		if(this.getView().byId("customNav").getState() == false)
			this.getView().byId("customNav").openNavigation();
		else
			this.getView().byId("customNav").closeNavigation();
	},
	
	openOperation : function(oEvent)
	{
	var sPath = oEvent.getSource().getBindingContext("ScheduleModel").sPath;
	var aPath = sPath.split("/");
	var path = aPath.pop();
	var sOperation = oEvent.getSource().getBindingContext("ScheduleModel").getModel().getProperty(sPath+"/operation");
	var sSfc =	oEvent.getSource().getBindingContext("ScheduleModel").getModel().getProperty(sPath+"/sfc");
	window.location.href="#operation/"+path;
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf worktracker.views.home
*/
/*	onBeforeRendering: function() {
	
	},
*/
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf worktracker.views.home
*/
	onAfterRendering: function() {
		this.getView().byId("customNav").openNavigation();
		this.getView().byId("customNav").closeNavigation();
		
		// Set colors for Count on Icon Bar
		airbus.mes.worktracker.util.Functions.addCountTextClass("homeNav");
		
		// Set Operation Date Picker current date
		var currentDate = new Date();
		
		var curr_date = currentDate.getDate();
	    var curr_month = currentDate.getMonth() + 1; //Months are zero based
	    var curr_year = currentDate.getFullYear();
	    this.getView().byId("operationDatePicker").setValue(curr_year+"-"+curr_month+"-"+curr_date);
	    

	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf worktracker.views.home
*/
	onExit: function() {
		if (this.oPopover) {
			this.oPopover.destroy();
		}
	},
	
	toggleChangeOptrPopOver: function(oEvent){			
			// create popover
			if (! this.oPopover) {
				this.oPopover = sap.ui.xmlfragment("airbus.mes.worktracker.fragments.ChangeOptrPopOver", this);
				this.oPopover.setModel(this.getView().getModel("operatorsModel"));
				this.getView().addDependent(this.oPopover);
			}
			
			// delay because addDependent will do a async re-rendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this.oPopover.openBy(oButton);
			})
			
		},
		filterOperationList: function(oEvt){
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("date", sap.ui.model.FilterOperator.EQ, sQuery);
				aFilters.push(filter);
			}
			// update list binding
			var list = this.getView().byId("operationGridLayout");
			var binding = list.getBinding("content");
			binding.filter(aFilters, "Application");
			
		},
		
	onSelectionStation : function (oEvt) {
	// LoadOperators  Model Data based on Station selected
			this.getView().getModel("operatorsModel").loadData(url+"operators_" + oEvt.getSource().getSelectedItem().getKey() + ".json",null,false);
		},
	
	onSearch : function (oEvt) {
		 
		// add filter for search
		var aFilters = [];
		var sQuery = oEvt.getSource().getValue();
		if (sQuery && sQuery.length > 0) {
			var filter = new sap.ui.model.Filter([
			  new sap.ui.model.Filter("first_name", sap.ui.model.FilterOperator.Contains, sQuery ),
		      new sap.ui.model.Filter("last_name", sap.ui.model.FilterOperator.Contains, sQuery)]);
			aFilters.push(filter);
		}
		// update list binding
		var list = sap.ui.getCore().byId("operatorsList");
		var binding = list.getBinding("items");
		binding.filter(aFilters, "Application");
	},

	toggleMessagesPopOver : function(oEvt){
		
		airbus.mes.worktracker.util.Functions.handleMessagePopOver(this, oEvt);
	},
	
	onSelectionStatus : function (oEvt) {
		// Data based on status selected
//				oEvt.getSource().getSelectedItem().getKey();
				
				// add filter for search
				var aFilters = [];
//				var sQuery = oEvt.getSource().getValue();
				var sQuery = oEvt.getSource().getSelectedItem().getKey();
				if (sQuery && sQuery.length > 0) {
					var filter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sQuery);
					aFilters.push(filter);
				}
				if(sQuery === "All Status"){
					aFilters.pop();
				}
				// update list binding
				var list = this.getView().byId("operationGridLayout");
				var binding = list.getBinding("content");
				binding.filter(aFilters, "Application");
			},
});