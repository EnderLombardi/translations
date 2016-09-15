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

		airbus.mes.stationtracker.ModelManager.loadStationTracker();
		
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
  	  scheduler.matrix['timeline'].x_date = '%H %i';
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
       	  scheduler.matrix['timeline'].x_date = '%H %i';
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

	if (airbus.mes.stationtracker.AssignmentManager.bInitial) {
		
			airbus.mes.stationtracker.AssignmentManager.bInitial = false;
			 elements = [ // original hierarhical array to display
	                        {key:10, label:"FUEL ACTIVITIES", open: true, children: [
	                                                                                 
	                        {key:"F1" , name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                        {key:"F2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                        {key:"F3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                        ]},
	                         {key:105, label:"ELEC ACTIVITIES", open:true, children: [
	                      
	                         {key:"E2", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"E2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"E3", name:"Steve S.", subname:"SS", hours:'3.0hs'},                                                    
	                         ]},
	                         {key:115, label:"MEC ACTIVITIES", open:true, children: [
	                                                                                                     
	                         {key:"M1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"M2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"M3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	                         {key:120, label:"FLY ACTIVITIES", open:true, children: [
	                     
	                         {key:"A1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"A2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"A3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	           ];


		 scheduler.matrix['timeline'].y_unit_original = elements;
		 scheduler.callEvent("onOptionsLoad", []);
			scheduler.updateView();
			
		} else {
			
			airbus.mes.stationtracker.AssignmentManager.bInitial = true;
			 elements = [ // original hierarhical array to display
	                        {key:10, label:"FUEL ACTIVITIES", open: true, children: [
	                        {"key":"I1", "initial":"Initial plan", },
	                        {key:"F1" , name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                        {key:"F2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                        {key:"F3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                        ]},
	                         {key:105, label:"ELEC ACTIVITIES", open:true, children: [
	                         {"key":"I2", "initial":"Initial plan", },
	                         {key:"E2", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"E2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"E3", name:"Steve S.", subname:"SS", hours:'3.0hs'},                                                    
	                         ]},
	                         {key:115, label:"MEC ACTIVITIES", open:true, children: [
	                         {"key":"I3", "initial":"Initial plan",},	                                                                                 
	                         {key:"M1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"M2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"M3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	                         {key:120, label:"FLY ACTIVITIES", open:true, children: [
	                         {"key":"I3", "initial":"Initial plan", },
	                         {key:"A1", name:"Jae J.", subname:"JJ", hours:'6.0hs'},
	                         {key:"A2", name:"Mark K.", subname:"MK", hours:'4.0hs'},
	                         {key:"A3", name:"Steve S.", subname:"SS", hours:'3.0hs'},
	                         ]},
	           ];


		 scheduler.matrix['timeline'].y_unit_original = elements;
		 scheduler.callEvent("onOptionsLoad", []);
			
			scheduler.updateView();
			
		}
	},
	

		onCPPress : function() {

		if (airbus.mes.stationtracker.AssignmentManager.CpPress === false) {
			
			scheduler.templates.event_class = function(start, end, ev) {
				
				if (ev.cp != undefined) {
					
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
