"use strict";

jQuery.sap.declare("airbus.mes.shell.AutoRefreshManager");

airbus.mes.shell.AutoRefreshManager =  {
       
       autoRefresh: undefined,
       
       autoRefreshAPI: function(){},

       viewName: undefined,       
       pauseTime: undefined,
       remainingTimeRefresher: undefined,
       refreshInterval: undefined,
       lastRefreshTime: undefined,
       lastRefreshTime2: undefined,
       pauseRefreshTime: undefined,
       globalRefreshTime : undefined,
       customRefreshTime : undefined,
       initDate : undefined,
       nowDate : undefined,
       addtime : 0,
       timer : 0,
       defaultKey : "MES_REFRESH_DEF_VAL",
       
       /**
       *  Set Refresh Interval based on configuration
       */
       
       setInterval: function(viewName){
             
             //shortcut
             var config = airbus.mes.shell.AutoRefreshConfig;
             var sVal = airbus.mes.shell.AutoRefreshManager;
             
             //if autorefresh disable
             if(config.mesRefreshActive.value = false){
                    airbus.mes.shell.AutoRefreshManager.clearInterval();
                    return
             }
             
             //get view name
             if(!viewName){
                    viewName = nav.getCurrentPage().getId();
             }
             sVal.viewName = viewName;
             
             //get refresh time config for this.viewname else default time
             if(config[sVal.viewName].timer){
                 sVal.refreshInterval = config[sVal.viewName].timer; 
             } else {
                 sVal.refreshInterval = config.base.timer ;
             }
             
             // init function
             airbus.mes.shell.AutoRefreshManager.lastRefreshTimefct();
             airbus.mes.shell.AutoRefreshManager.dateNow();
             airbus.mes.shell.AutoRefreshManager.setupCtrl(); // mousse & keyboard event
             
             // Button refresh
             sVal.autoRefresh = window.setInterval(function refreshTime(){
                    
                    //Difference in second between the two dates
                    sVal.timer=Math.floor((sVal.dateNow()-sVal.lastRefreshTime2)/1000);
                    
                    //console.log("timer :" + sVal.timer);

                    // writte "s" or "min" in the button 
                    if(sVal.timer < 60 ){
                           airbus.mes.shell.oView.byId('refreshTime').setText(" Last Refresh " + sVal.timer + "s");
                    } else {
                           airbus.mes.shell.oView.byId('refreshTime').setText(" Last Refresh >" + Math.trunc(sVal.timer/60) + "min");
                    }
                    
                    //Add 60sec if time is <60sec
                    if(sVal.addtime != 0){
                           sVal.refreshInterval += sVal.addtime ;
                           sVal.addtime = 0;
                    }
                    //console.log("refreshInterval :" + sVal.refreshInterval);
                    
                    //refresh when times are equal
                    if(sVal.timer%sVal.refreshInterval == 0 && sVal.timer !=0) {
                           //change last Refresh Time 
                           sVal.lastRefreshTimefct();
                                  //refresh zone if existe
                                  if(config[sVal.viewName].area){
                                        config[sVal.viewName].area();
                                  }
                   }
                    sVal.timer++;
           }, 1000);              
             sVal.lastRefreshTime = 0;
       },
       
       ////////////////////////////////   time operation   ////////////////////////////////
       
       //Stops processing at regular intervals
       clearInterval: function(){
             clearInterval(airbus.mes.shell.AutoRefreshManager.autoRefresh);
       },
       
       // Date of last refresh time
       lastRefreshTimefct: function(){
             var sd = new Date();
             this.lastRefreshTime2 = sd.getTime();
             //console.log(" last Refresh Time : " + this.lastRefreshTime2);
             return this.lastRefreshTime2;
       },
       
       // Instant Date 
       dateNow: function(){
             var now = new Date();
             this.nowDate = now.getTime();
             //console.log(" Now Time : " + this.nowDate);
             return this.nowDate;
       },
       
       // if user action add 60s at the refresh time before refresh
       customTime: function()     {
             airbus.mes.shell.AutoRefreshManager.addtime =  Math.round((airbus.mes.shell.AutoRefreshManager.refreshInterval-airbus.mes.shell.AutoRefreshManager.timer)<airbus.mes.shell.AutoRefreshConfig.addtime.addtime) ? airbus.mes.shell.AutoRefreshConfig.addtime.addtime : 0 ;
             //result of operation
             //console.log("calcule : " +  (airbus.mes.shell.AutoRefreshManager.refreshInterval-airbus.mes.shell.AutoRefreshManager.timer));
             //add time
             //console.log("addtime : " + airbus.mes.shell.AutoRefreshManager.addtime)
             return airbus.mes.shell.AutoRefreshManager.addtime;
       },
       
       //////////////////////////////  event mousse   ///////////////////////////////////

       setupCtrl: function() {
                           /*document.addEventListener("click", function(){
                                  console.log("Click");
                                  airbus.mes.shell.AutoRefreshManager.customTime();
                           });
                           document.addEventListener("mousemove", function(){ 
                                  console.log("mousemove");
                                  airbus.mes.shell.AutoRefreshManager.customTime();
                           });*/
                        document.addEventListener("mousedown", function(){ 
                                  console.log("mousedown");
                                  airbus.mes.shell.AutoRefreshManager.customTime();
                        });
                        document.addEventListener("keypress", function(){ 
                                  console.log("keypress");
                                  airbus.mes.shell.AutoRefreshManager.customTime();
                        });
                      /*  document.addEventListener("DOMMouseScroll", function(){ 
                           console.log("DOMMouseScroll");
                           airbus.mes.shell.AutoRefreshManager.customTime();
                        });
                        document.addEventListener("mousewheel",function(){ 
                           console.log("mousewheel");
                           airbus.mes.shell.AutoRefreshManager.customTime();
                        });
                        document.addEventListener("touchmove", function(){ 
                           console.log("touchmove");
                           airbus.mes.shell.AutoRefreshManager.customTime();
                        });
                        document.addEventListener("MSPointerMove", function(){ 
                           console.log("MSPointerMove");
                           airbus.mes.shell.AutoRefreshManager.customTime();
                        });*/
       },
       
       /////////////////////////////////   old functions ///////////////////////////////////

       pauseRefresh:function(){
             var d = new Date();
             this.pauseTime = d.getTime();     
             //console.log(" pause date : " + this.pauseTime);
             this.clearInterval();
       },
       
       resumeRefresh:function(){
             // global time - time before pause
             var remainingTime = this.refreshInterval - ( this.pauseTime - this.lastRefreshTime );
             // If the remaining time is very small
             remainingTime = remainingTime < 60000 ? 60000 : remainingTime;
             
              this.remainingTimeRefresher = setInterval(
                           function () {
                                  airbus.mes.shell.AutoRefreshManager.autoRefreshAPI();
                                  clearInterval(airbus.mes.shell.AutoRefreshManager.remainingTimeRefresher);
                                  airbus.mes.shell.AutoRefreshManager.setInterval(airbus.mes.shell.AutoRefreshManager.viewName);                    
                           },
                           remainingTime
             );
       },
       
       autoRefreshFunc: function(){
             // Store last refresh time
             var d = new Date();
             this.lastRefreshTime = d.getTime();
             // Call Auto Refresh API
             airbus.mes.shell.AutoRefreshManager.autoRefreshAPI()
       }
}

