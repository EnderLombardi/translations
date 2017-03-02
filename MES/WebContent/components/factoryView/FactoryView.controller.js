"use strict";
sap.ui.controller("airbus.mes.factoryView.FactoryView", {

    /**
     * Called when a controller is instantiated and its View controls (if
     * available) are already created. Can be used to modify the View before it
     * is displayed, to bind event handlers and do other one-time
     * initialization.
     *
     * @memberOf airbus.FactoryView
     */
    stype: undefined,
    line_number : undefined,
    station_number : undefined,
    onInit : function() {
    },

    onLinePress : function(oEvt) {
        var oEventBus = sap.ui.getCore().getEventBus();
        var line = airbus.mes.factoryView.oView.getModel("factoryViewI18n").getProperty("line");
        if(line === "Ligne"){
            airbus.mes.factoryView.util.ModelManager.line_number = oEvt.getSource().getText().substring(6, 7);
        }else{
            airbus.mes.factoryView.util.ModelManager.line_number = oEvt.getSource().getText().substring(5, 6);
        }
        oEventBus.publish("MainView", "onClickLine", null);
    },

    onStationSelect : function(oEvent) {

        var oEventBus = sap.ui.getCore().getEventBus();
        var oStation = oEvent.getSource();
        // get Station name
        airbus.mes.factoryView.util.ModelManager.station_number = oStation.getHeading().substring(8,10).trim();

        // get Line for station clicked
        airbus.mes.factoryView.util.ModelManager.line_number = parseInt(oStation.getLineNumber(),10);
        airbus.mes.factoryView.util.ModelManager.msn = oStation.getMsn();
        airbus.mes.factoryView.util.ModelManager.hand = oStation.getHand();
        oEventBus.publish("MainView", "onClickStation", null);
    },
    onStation5Select : function(){
        var dialog = new sap.m.Dialog({
            title: 'Station 5',
            content: new sap.m.Text({text:"Confirmation"}),
            beginButton: new sap.m.Button({
                text: 'Submit',
                press: function () {
                    new sap.m.MessageToast.show('Submit pressed!');
                    dialog.close();
                }
            }),
            endButton: new sap.m.Button({
                text: 'Close',
                press: function () {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }
        });

        //to get access to the global model
        this.getView().addDependent(dialog);
        dialog.open();
    },

    // Station 5 functions : onClick
    onClickStation5 : function(evt) {
        this.SelectedStationBtnObj= evt.getSource();
        this.stype = evt.getSource().getParent().getItems()[0].getHeading().split(" ")[2]
        this.station_number = evt.getSource().getParent().getItems()[0].getHeading().split(" ")[1]
        this.line_number =  evt.getSource().getParent().getItems()[0].getLineNumber();
        airbus.mes.factoryView.util.ModelManager.line_number =  evt.getSource().getParent().getItems()[0].getLineNumber();
        switch (evt.getSource().getText()) {
          case "Load":
              if (evt.getSource().getParent().getItems()[0].getMsn()!="" ) {
                  evt.getSource().setText("Unload");
                  evt.getSource().setIcon("sap-icon://down");
                  evt.getSource().setTooltip("Unload " + this.stype);
                    airbus.mes.factoryView.util.ModelManager.messageShow("MSN already loaded");

                } else {
                airbus.mes.factoryView.util.ModelManager.Load_Unload = "Load";
//                if (!this.openLoad) {
                    var openLoad = sap.ui.jsfragment("airbus.mes.factoryView.fragment.Station5Load", this);
//                }
                openLoad.open();
                }
              break;
          case "Unload":
              if (evt.getSource().getParent().getItems()[0].getMsn()=="") {
                  evt.getSource().setText("Load");
                  evt.getSource().setIcon("sap-icon://up");
                  evt.getSource().setTooltip("Load " + this.stype);
                  sap.m.MessageToast.show("MSN already unloaded");
                } else {
                    airbus.mes.factoryView.util.ModelManager.Load_Unload = "Unload";
//                var msn=evt.getSource().getParent().getItems()[0].getMsn();
//                var hand=evt.getSource().getParent().getItems()[0].getHand();
                    var MSN=this.SelectedStationBtnObj.getParent().getItems()[0].getMsn();
                    var HAND=this.SelectedStationBtnObj.getParent().getItems()[0].getHand();
                    var stypeToto = evt.getSource().getParent().getItems()[0].getHeading().split(" ")[2];
                    //var LINE_NUMBER = this.SelectedStationBtnObj.getParent().getItems()[0].getLineNumber();
                    //Local Station 5 Model
                    //                        var tModel = new sap.ui.model.json.JSONModel();
                    //Unloading pop up Elements
                    sap.ui.commons.MessageBox.confirm(
                        'Do you want to unload the ' + this.stype + ' from MSN ' + MSN + ' ' + HAND  + ' ?',
                        fnCallbackConfirm, 'Station 5 ' + this.stype);
                    function fnCallbackConfirm(bResult) {
                        if (bResult == true) {
                            //                                tModel.setData({});
                            //                                sap.ui.getCore().byId('L' + this.line_number + 'ST05').getModel().setData(tModel.oData);
                            sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setText("Load");
                            sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setIcon("sap-icon://up");
                            sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setTooltip("Load "+ stypeToto);

                            airbus.mes.factoryView.util.ModelManager.loadUnloadStation5(MSN,HAND/*,LINE_NUMBER*/);
                            //airbus.mes.factoryView.util.ModelManager.loadModelFactoryModel();

                            /*not needed anymore*/
                            //airbus.mes.factoryView.util.ModelManager.ClearStation5(ModelManager.line_number);

                        }
                    }
                   // this.openDialogUnload(this);
                }
              break;
        }
},
// Unloading
//openDialogUnload : function() {
//
//                        var MSN=this.SelectedStationBtnObj.getParent().getItems()[0].getMsn();
//                        var HAND=this.SelectedStationBtnObj.getParent().getItems()[0].getHand();
//                        //var LINE_NUMBER = this.SelectedStationBtnObj.getParent().getItems()[0].getLineNumber();
//                        //Local Station 5 Model
////                        var tModel = new sap.ui.model.json.JSONModel();
//                        //Unloading pop up Elements
//                        sap.ui.commons.MessageBox.confirm(
//                                'Do you want to unload the ' + this.stype + ' from MSN ' + MSN + ' ' + HAND  + ' ?',
//                                fnCallbackConfirm, 'Station 5 ' + this.stype);
//                        function fnCallbackConfirm(bResult) {
//                            if (bResult == true) {
//                                console.log(bResult);
////                                tModel.setData({});
////                                sap.ui.getCore().byId('L' + this.line_number + 'ST05').getModel().setData(tModel.oData);
//                                sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setText("Load");
//                                sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setIcon("sap-icon://up");
//                                sap.ui.getCore().byId("idFactoryView").getController().SelectedStationBtnObj.setTooltip("Load "+this.stype);
//
//                                airbus.mes.factoryView.util.ModelManager.loadUnloadStation5(MSN,HAND/*,LINE_NUMBER*/);
//                                //airbus.mes.factoryView.util.ModelManager.loadModelFactoryModel();
//
//                                /*not needed anymore*/
//                                //airbus.mes.factoryView.util.ModelManager.ClearStation5(ModelManager.line_number);
//
//                            }
//                        }
//                    },
    /**
     * Similar to onAfterRendering, but this hook is invoked before the
     * controller's View is re-rendered (NOT before the first rendering!
     * onInit() is used for that one!).
     *
     * @memberOf airbus.FactoryView
     */
    // onBeforeRendering: function() {
    //
    // },
    /**
     * Called when the View has been rendered (so its HTML is part of the
     * document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     *
     * @memberOf airbus.FactoryView
     */

    onAfterRendering : function() {
        if(this.getView().byId("stationLine1").getBinding(
        "items")){
        var filters = [];
        var filterStation5 = new sap.ui.model.Filter({
            path : "Station",
            test : function(value) {
                if (value != 5)
                    return true;
                else
                    return false;
            }
        });
        var filterLine1 = new sap.ui.model.Filter({
            path : "Line",
            operator : sap.ui.model.FilterOperator.EQ,
            value1 : "01"
        });
        var filterLine2 = new sap.ui.model.Filter({
            path : "Line",
            operator : sap.ui.model.FilterOperator.EQ,
            value1 : "02"
        });
        var filterLine3 = new sap.ui.model.Filter({
            path : "Line",
            operator : sap.ui.model.FilterOperator.EQ,
            value1 : "03"
        });
        var filterLine4 =  new sap.ui.model.Filter({
                path : "Station",
                operator : sap.ui.model.FilterOperator.EQ,
                value1 : "5"
        });

        filters.push(filterStation5);
        filters.push(filterLine1);
        var oProductionLine1 = this.getView().byId("stationLine1").getBinding(
                "items").filter(filters);

        filters.pop();
        filters.push(filterLine2);
        var oProductionLine2 = this.getView().byId("stationLine2").getBinding(
                "items").filter(filters);

        filters.pop();
        filters.push(filterLine3);
        var oProductionLine3 = this.getView().byId("stationLine3").getBinding(
                "items").filter(filters);

        filters.pop();
        filters.pop();
        filters.push(filterLine4);
        var oProductionLine4 = this.getView().byId("stationLine5").getBinding(
                "items").filter(filters);


    }},
    pulse : function(oEvt){
        var line = oEvt.getSource().getParent().getParent().getParent().getItems()[0].getText().split(" ")[1];
        console.log(line);
        var stationL1 = oEvt.getSource().getParent().getItems()[0].getSelectedItem().getText();
        console.log(stationL1);
        if(stationL1 === "Reverse Pulse Entire Line"){
            stationL1="RP";
        }
        //value to send in the request
        var valueStationL1 = stationL1.substr(stationL1.length - 2);
        //Confirmation box to check if the station has been previously loaded on station 05 or not
        jQuery.sap.require("sap.ui.commons.MessageBox");

        //Confirmation box to pulse when station 80 is not available
        if(sap.ui.getCore().byId("idFactoryView--stationLine"+line).getItems()[6].getMsn() !=  '' 
            && sap.ui.getCore().byId("idFactoryView--stationLine"+line).getItems()[7].getStationHeadColor() != "green" 
            && stationL1 != "RP" ) {
                sap.ui.commons.MessageBox.show('On line ' + line + ', you are pulsing from Station 70 to Station 80, But the conveyor status of station 80 (Crane presence) is  not green. Do you want to continue?',
                sap.ui.commons.MessageBox.Icon.WARNING, 
                'Warning',
                [sap.ui.commons.MessageBox.Action.YES, sap.ui.commons.MessageBox.Action.NO],
                fnCallbackMessageBox,
                sap.ui.commons.MessageBox.Action.YES);
                function fnCallbackMessageBox(bResult) {
                    if (bResult == "YES") {
                        if (valueStationL1 == "ne") {
                            airbus.mes.factoryView.util.ModelManager.pulseLine(line);
                        } else {
                            airbus.mes.factoryView.util.ModelManager.pulse(line,valueStationL1);
                        }
                    }
                }
        } else if (valueStationL1 == "ne") {
            airbus.mes.factoryView.util.ModelManager.pulseLine(line);
        } else {
            airbus.mes.factoryView.util.ModelManager.pulse(line,valueStationL1);
        }

    },
        /**
         * Called when pulse drop down list is selected.
         * It enables the the pulse button if a value from drop down is selected
         * @input oEvt {object}
         */
        onPluseDropDownSelect : function(oEvt){
            oEvt.getSource().getParent().getItems()[1].setEnabled(true);
        },
        refreshFactoryModel : function () {
            airbus.mes.factoryView.util.ModelManager.loadModelFactoryModel();
        },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 *
 * @memberOf airbus.FactoryView
 */
// onExit: function() {
//
// }
});
