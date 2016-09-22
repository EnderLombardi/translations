sap.ui.controller("airbus.mes.stationtracker.stationtracker", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf components.stationtracker.stationtracker
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf components.stationtracker.stationtracker
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf components.stationtracker.stationtracker
*/
	onAfterRendering: function() {
			
	},
	
	onTeamPress :function(oEvent){
		
		 var bindingContext = oEvent.getSource().getBindingContext();			 
		 // open team popover fragment		 
		if (! this._oPopover) {
			this._oPopover = sap.ui.xmlfragment("airbus.mes.stationtracker.teamPopover", this);
			this._oPopover.addStyleClass("alignTextLeft");
			this.getView().addDependent(this._oPopover);
		}
		this._oPopover.openBy(oEvent.getSource());							

	},

	 onShiftPress : function(){
		
  	  scheduler.matrix['timeline'].x_unit = 'minute';
  	  scheduler.matrix['timeline'].x_step = 120;
  	  scheduler.matrix['timeline'].x_size = 6;
  	  scheduler.matrix['timeline'].x_length = 12;
  	  scheduler.matrix['timeline'].x_start= 3,
  	  scheduler.matrix['timeline'].x_date = '%H:%i';
  	  scheduler.templates.timeline_scale_date = function(date){
         var func=scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date );
         return func(date);
      };
      scheduler.updateView();
  	  
	 },
	 
	 onDayPress : function(){
			
		  scheduler.matrix['timeline'].x_unit = 'minute';
       	  scheduler.matrix['timeline'].x_step = 120;
       	  scheduler.matrix['timeline'].x_start= 3,
       	  scheduler.matrix['timeline'].x_size = 8.5;
       	  scheduler.matrix['timeline'].x_length = 12;
       	  scheduler.matrix['timeline'].x_date = '%H:%i';
       	  scheduler.templates.timeline_scale_date = function(date){
             var func=scheduler.date.date_to_str(scheduler.matrix['timeline'].x_date );
             return func(date);
          };
          scheduler.updateView();
	  	  
		 },
	
	 spaceInsecable : function(sText){
		 
	    var sTextF="";
	    var aText=sText.split(new RegExp("[ ]+", "g"));    // Récupère tous les mots dans un tableau : texte_decoup
	 
	    for (var i=0; i<aText.length; i++)
	    {
	        sTextF += aText[i] + "&nbsp;";  // le + " " NE FONCTIONNE PAS. IDEM AVEC String.fromCharCode(32) 
	      
	    }
	    
	    return sTextF;
	},
	
	onInitialPlanPress : function() {
	
		// XX TO REDEFINE

	if (airbus.mes.stationtracker.GroupingBoxingManager.showInitial) {
		
		airbus.mes.stationtracker.GroupingBoxingManager.showInitial = false;
		airbus.mes.stationtracker.ModelManager.onStationTrackerLoad();
		
							
		} else {
			
			airbus.mes.stationtracker.GroupingBoxingManager.showInitial = true;
			airbus.mes.stationtracker.ModelManager.onStationTrackerLoad();
		
		}
	},
	

		onCPPress : function() {

		if (airbus.mes.stationtracker.AssignmentManager.CpPress === false) {
			
			scheduler.templates.event_class = function(start, end, ev) {
				
				if (ev.criticalPath != undefined) {
					
					return "operationCP";
					
				} else {
					
					return "grey";
				}

			};
			
			airbus.mes.stationtracker.AssignmentManager.CpPress = true;
			scheduler.updateView();
			
		} else {
			
			scheduler.templates.event_class = function(start, end, ev) {

				return "grey";

			};
			
			airbus.mes.stationtracker.AssignmentManager.CpPress = false;
			scheduler.updateView();
			
		}
	},
	
});
