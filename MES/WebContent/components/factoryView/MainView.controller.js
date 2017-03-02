"use strict";
sap.ui.controller("airbus.mes.factoryView.MainView", {

    /**
     * Called when a controller is instantiated and its View controls (if
     * available) are already created. Can be used to modify the View before it
     * is displayed, to bind event handlers and do other one-time
     * initialization.
     *
     * @memberOf airbus.MainView
     */
    onInit : function() {
        sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(sap.ui.getCore().byId("idFactoryView"));
        /*sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(sap.ui.getCore().byId("idProductionView"));
        sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(sap.ui.getCore().byId("idStationView"));*/
        sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idFactoryView");
        var oEventBus = sap.ui.getCore().getEventBus();
        oEventBus.subscribe("MainView", "onClickLine",
                this.lineSelected, this);
        oEventBus.subscribe("MainView", "onClickStation", this.stationSelected, this);
    },
    onNavBack: function(oEvent){
        nav.back();
    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the
     * controller's View is re-rendered (NOT before the first rendering!
     * onInit() is used for that one!).
     *
     * @memberOf airbus.MainView
     */
    // onBeforeRendering: function() {
    //
    // },
    /**
     * Called when the View has been rendered (so its HTML is part of the
     * document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     *
     * @memberOf airbus.MainView
     */
     onAfterRendering: function() {
         var borderTopWidthString = $("#idMainView--factoryViewSubheader").css('border-top-width');
         var stringLength = borderTopWidthString.length;
         var borderTopWidth = parseInt(borderTopWidthString.substring(0,stringLength-2), 10);
        $("#idMainView--MainViewNavContainer").height(
                (($("#idMainView").height()
                - $("#idMainView--factoryViewToolbar").height()
                - $("#idMainView--factoryViewSubheader").height()
                - borderTopWidth ) / $("#idMainView").height()) * 100 + "%");

     },
    /**
     * Called when the Controller is destroyed. Use this one to free resources
     * and finalize activities.
     *
     * @memberOf airbus.MainView
     */
    // onExit: function() {
    //
    // }
    worksetItemSelected : function(oEvent) {

        var itemKey = oEvent.getSource().getKey();
        if (itemKey === "factory") {
            //disable options for station and line
            sap.ui.getCore().byId("idMainView--idProduction").setEnabled(false);
            sap.ui.getCore().byId("idMainView--idStation").setEnabled(false);
            //unlock selected station box
            airbus.mes.factoryView.util.ModelManager.lockshellselected = false;
            //load necessary models
            airbus.mes.factoryView.util.ModelManager.loadModelFactoryModel();
            //set header of tabs correctly
            sap.ui.getCore().byId("idMainView--idProduction").setText(
                airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " ");
            sap.ui.getCore().byId("idMainView--idStation").setText(
                airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("stationDetail") + " ");
            //direct nav container to factory view
            sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idFactoryView");
            //to get the first button(Factory View) on list of 3 buttons and then forcefully select it
            sap.ui.getCore().byId("idMainView--IconTabsPages").setSelectedButton(sap.ui.getCore().byId("idMainView--IconTabsPages").getButtons()[0]);

        } else if(itemKey === "prod_line") {
            //disable options for station
            sap.ui.getCore().byId("idMainView--idStation").setEnabled(false);
            //unlock selected station box
            airbus.mes.factoryView.util.ModelManager.lockshellselected = false;
            //create the view if not exists
            if (!airbus.mes.factoryView.util.ModelManager.ProductionView) {
                airbus.mes.factoryView.util.ModelManager.ProductionView = sap.ui.view({
                    id : "idProductionView",
                    viewName : "airbus.mes.factoryView.ProductionLineView",
                    type : sap.ui.core.mvc.ViewType.XML,
                    height : "98%",
                    width: "100%"
                });
                sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(airbus.mes.factoryView.util.ModelManager.ProductionView)
            }
                //set header of tabs correctly
                sap.ui.getCore().byId('idMainView--idProduction').setText(
                    airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " " + airbus.mes.factoryView.util.ModelManager.line_number);
            sap.ui.getCore().byId('idMainView--idStation').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("stationDetail"));
                //load necessary models
                airbus.mes.factoryView.util.ModelManager.loadModelProductionModel();
                airbus.mes.factoryView.util.ModelManager.loadProdLineColorPalette();
                //direct nav container to prodLine view
                sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idProductionView");
                //to get the second button(Production DETAIL) on list of 3 buttons and then forcefully select it
                sap.ui.getCore().byId("idMainView--IconTabsPages").setSelectedButton(sap.ui.getCore().byId("idMainView--IconTabsPages").getButtons()[1]);

        } else if(itemKey === "station") {
            //to prevent opening line View if station 5 is selected
            if(airbus.mes.factoryView.util.ModelManager.station_number != "5") {
                sap.ui.getCore().byId('idMainView--idProduction').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " " + airbus.mes.factoryView.util.ModelManager.line_number);
                sap.ui.getCore().byId("idMainView--idProduction").setEnabled(true);
            } else {
                sap.ui.getCore().byId('idMainView--idProduction').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " ");
                sap.ui.getCore().byId("idMainView--idProduction").setEnabled(false);
            }
            //enable navigation buttons
            sap.ui.getCore().byId("idMainView--idStation").setEnabled(true);
            //create the view if not exists//this will never occur dead code possibly
            if (!airbus.mes.factoryView.util.ModelManager.StationView) {
                airbus.mes.factoryView.util.ModelManager.StationView = sap.ui.view({
                    id : "idStationView",
                    viewName : "airbus.mes.factoryView.StationView",
                    type : sap.ui.core.mvc.ViewType.XML,
                    height:"97%"
                });
                sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(airbus.mes.factoryView.util.ModelManager.StationView);
            }
            sap.ui.getCore().byId('idMainView--idStation').setText("STATION "+airbus.mes.factoryView.util.ModelManager.station_number +" DETAIL");
            //unlock selected station box
            airbus.mes.factoryView.util.ModelManager.lockshellselected = true;
            //load necessary models
            airbus.mes.factoryView.util.ModelManager.loadModelStationModel();
            airbus.mes.factoryView.util.ModelManager.loadStationColorPalette();
            //direct nav container to Station view
            sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idStationView");
            //to get the third button(station DETAIL) on list of 3 buttons and then forcefully select it
            sap.ui.getCore().byId("idMainView--IconTabsPages").setSelectedButton(sap.ui.getCore().byId("idMainView--IconTabsPages").getButtons()[2]);

        } else {
            //do nothing or probably select factory view again
        }
        airbus.mes.factoryView.util.ModelManager.minimizeMsgBar();
    },

    lineSelected : function(oChannel, oEvent, line_number) {

        //var oShell = this.getView().byId("myShell");
        sap.ui.getCore().byId("idMainView--idProduction").setEnabled(true);
        sap.ui.getCore().byId("idMainView--idStation").setEnabled(false);
        //unlock selected station box
        airbus.mes.factoryView.util.ModelManager.lockshellselected = false;

        //create view if not exists
        if (!airbus.mes.factoryView.util.ModelManager.ProductionView) {
            var heightContainer = $("#idMainView--MainViewNavContainer").height();
            airbus.mes.factoryView.util.ModelManager.ProductionView = sap.ui.view({
                id : "idProductionView",
                viewName : "airbus.mes.factoryView.ProductionLineView",
                type : sap.ui.core.mvc.ViewType.XML,
                height : heightContainer + "px",
                width:"100%"
            });
            sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(airbus.mes.factoryView.util.ModelManager.ProductionView);
        }
        //set necessary headers
        sap.ui.getCore().byId('idMainView--idProduction').setText(
                "PRODUCTION LINE " + airbus.mes.factoryView.util.ModelManager.line_number);
        sap.ui.getCore().byId('idMainView--idStation').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("stationDetail"));

        //load required Models
        airbus.mes.factoryView.util.ModelManager.loadModelProductionModel();
        airbus.mes.factoryView.util.ModelManager.loadProdLineColorPalette();
        //direct nav container to prodLine view
        sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idProductionView");
        //to get the second button on list of 3 buttons and then forcefully select it
        sap.ui.getCore().byId("idMainView--IconTabsPages").setSelectedButton(sap.ui.getCore().byId("idMainView--IconTabsPages").getButtons()[1]);

    },

    // Event Bus methods
    stationSelected : function(oChannel, oEvent, oData) {


        //lock selected station box
        airbus.mes.factoryView.util.ModelManager.lockshellselected = true;
        //enable navigation buttons

        //to prevent opening line View if station 5 is selected
        if(airbus.mes.factoryView.util.ModelManager.station_number != "5") {
            sap.ui.getCore().byId('idMainView--idProduction').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " " + airbus.mes.factoryView.util.ModelManager.line_number);
            sap.ui.getCore().byId("idMainView--idProduction").setEnabled(true);
        } else {
            sap.ui.getCore().byId('idMainView--idProduction').setText(airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("productionLine") + " ");
            sap.ui.getCore().byId("idMainView--idProduction").setEnabled(false);
        }

        sap.ui.getCore().byId("idMainView--idStation").setEnabled(true);
        //set header with correct names
        sap.ui.getCore().byId('idMainView--idStation').setText("STATION "+airbus.mes.factoryView.util.ModelManager.station_number +" DETAIL");
        //create the view if not exists
        if (!airbus.mes.factoryView.util.ModelManager.StationView) {
            airbus.mes.factoryView.util.ModelManager.StationView = sap.ui.view({
                id : "idStationView",
                viewName : "airbus.mes.factoryView.StationView",
                type : sap.ui.core.mvc.ViewType.XML,
                height:"97%"
            });
            sap.ui.getCore().byId("idMainView--MainViewNavContainer").addPage(airbus.mes.factoryView.util.ModelManager.StationView);
        }
        //load necessary models
        airbus.mes.factoryView.util.ModelManager.loadModelStationModel();
        airbus.mes.factoryView.util.ModelManager.loadStationColorPalette();
        //direct nav container to Station view
        sap.ui.getCore().byId("idMainView--MainViewNavContainer").to("idStationView");
        //to get the third button(station DETAIL) on list of 3 buttons and then forcefully select it
        sap.ui.getCore().byId("idMainView--IconTabsPages").setSelectedButton(sap.ui.getCore().byId("idMainView--IconTabsPages").getButtons()[2]);

    },


});
