"use strict";
jQuery.sap.declare("airbus.mes.operationdetail.Formatter");

airbus.mes.operationdetail.Formatter = {

    status:{'completed'    : 'COMPLETED',
            'paused'    : 'IN_QUEUE',
            'active'    : 'IN_WORK',
            'notStarted': 'NOT_STARTED',
            'blocked'    : 'Blocked'
    },

    setSliderStatus : function(status, progress) {
        switch (status) {
            case airbus.mes.operationdetail.Formatter.status.completed:
                return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("confirmed");

            case airbus.mes.operationdetail.Formatter.status.active:
                return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("in_progress");

            case airbus.mes.operationdetail.Formatter.status.paused:

                return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("paused") + " " + String(progress).split(".")[0] + "%";

                if (progress == "0.0" || progress == "0" || progress == 0)
                    return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("notStarted");
                else
                    return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("paused") + " " + String(progress).split(".")[0] + "%";

            case airbus.mes.operationdetail.Formatter.status.blocked:
                return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("blocked");

            default:
                return airbus.mes.operationdetail.oView.getModel("i18n").getProperty("notStarted");
        }
    },

    sliderStatusFirst : function(status, progress) {
        if (typeof progress == "undefined")
            return;
        this.removeStyleClass("dynProgressSlider");
        this.setVisible(true);
        this.removeStyleClass("sliderBlockedColor");

        //to manage blocked status for next version
        if (status == "B") {
            this.removeStyleClass("sliderCompletedColor");
            this.addStyleClass("sliderBlockedColor");
        }
        if (progress == "0.0" || progress == "0" || progress == 0) {
            this.setVisible(false);
            return "0%";
        } else if (String(progress) == "100") {
            return progress + "%";
        } else {
            return progress + "%";
        }
    },

    sliderStatus : function(status, progress) {
        if (typeof progress == "undefined")
            return;

        this.removeStyleClass("dynProgressSlider");
        this.setVisible(true);

        if (progress == "0.0" || progress == "0" || progress == 0 || progress == NaN) {
            this.removeStyleClass("dynProgressSlider");
            return "100%";
        } else if (String(progress) == "100") {
            this.setVisible(false);
            return "0%";
        } else {
            this.addStyleClass("dynProgressSlider");
            return (100 - parseInt(progress,10)) + "%";
        }
    },


    displayOriginalPlan : function(startTime, endTime) {
        if (endTime !== undefined && startTime !== undefined) {
            var newStartTime = startTime.replace("T", " ");
            var newEndTime = endTime.replace("T", " ");
            return newStartTime + " - " + newEndTime;
        } else {
            return "-";
        }
    },

    displayValueOrDash : function( sDate ) {
        if ( sDate != undefined && sDate != "" ) {
            return sDate;
        } else {
            return "-";
        }
    },

    checkOperationStartEndDate:function(startTime, endTime,endDate){
        if (endDate === undefined || endDate === 'TimeUnavailable'){
            var newStartTime = startTime.replace("T", " ");
            var newEndTime = endTime.replace("T", " ");
            return newStartTime + " - " + newEndTime;
        } else
            return endDate;
    },

    displayBadge : function(){
        return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_ACTIVE");
    },

    displayPin : function(){
        return airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN");
    },

    displaySeperator : function() {
        if (airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_ACTIVE")
            || airbus.mes.settings.AppConfManager.getConfiguration("MES_BADGE_PIN")) {
            return true;
        } else
            return false;
    },
    //convert the duration in milliseconde from the json in IM
    convertMStoIM : function(){
        var duration = airbus.mes.operationdetail.ModelManager.durationNeededForCalc;
        var convert = ((duration * 100 * 0.001)/3600).toFixed(0);
        return parseInt(convert,10);
    },
    //convert value from the progress bar in IM
    convertProgressBarToImField : function(progress){
        var duration = airbus.mes.operationdetail.Formatter.convertMStoIM();
        var result = (duration * (progress / 100)).toFixed(0);
        return result;
    },
    // convert Value from IM Input in value % value for the progress bar
    convertImFieldToProgressBar : function(im){
        var duration = airbus.mes.operationdetail.Formatter.convertMStoIM();
        var result = (im * 100 / duration).toFixed(0);
        return result;
    },
    //Progress bar syncronised with the IM Input for changes.
    // and verification on the input type.
    liveChangeIm : function(event){
        var duration = airbus.mes.operationdetail.Formatter.convertMStoIM();
        if(sap.ui.getCore().byId("imTextArea").mEventRegistry.liveChange != undefined){
            if(sap.ui.getCore().byId("imTextArea").mEventRegistry.liveChange.length >= 1)
            sap.ui.getCore().byId("imTextArea").mEventRegistry.liveChange.length = null;
        }
        if(duration != "0" || duration != 0){
            sap.ui.getCore().byId("imTextArea").attachLiveChange(function() {

                // value from im field
                var value = sap.ui.getCore().byId("imTextArea").getValue();

                // Regex to prevent other input than number
                value = value.replace(/[^0-9]+/g, '');

                if(sap.ui.getCore().byId("imTextArea").getValue() != value){
                    // Reset field if other value than number
                    sap.ui.getCore().byId("imTextArea").setValue(value);
                }

                // value at 100%
                var convertedDuration = airbus.mes.operationdetail.Formatter.convertImFieldToProgressBar(duration) + "%";

                // dynamic conversion based on the IM input
                var dynamicCoversion = airbus.mes.operationdetail.Formatter.convertImFieldToProgressBar(sap.ui.getCore().byId("imTextArea").getValue()) + "%";

                if(sap.ui.getCore().byId("imTextArea").getValue() >= duration){
                    sap.ui.getCore().byId("imTextArea").setValue(duration);
                    $("#progressSlider-progress").width(convertedDuration);
                    $("#progressSlider-handle").css('left', convertedDuration);
                    if(duration != "0" || duration != 0){
                        $("#progressTextDynamic").text("Progress: " + convertedDuration);
                    }else{
                        $("#progressTextDynamic").text("Progress: " + $("#progressSlider-progress").width());
                    }
                }else{
                    $("#progressSlider-progress").width(dynamicCoversion);
                    $("#progressSlider-handle").css('left', dynamicCoversion);
                    if(duration != "0" || duration != 0){
                        $("#progressTextDynamic").text("Progress: " + dynamicCoversion);
                    }else{
                        $("#progressTextDynamic").text("Progress: " + $("#progressSlider-progress").width());
                    }
                }
            });
        }else{
            sap.ui.getCore().byId("imTextArea").attachLiveChange(function() {
                var value = sap.ui.getCore().byId("imTextArea").getValue();
                value = value.replace(/[^0-9]+/g, '');
                sap.ui.getCore().byId("imTextArea").setValue(value);

                if(sap.ui.getCore().byId("imTextArea").getValue() > duration){
                    sap.ui.getCore().byId("imTextArea").setValue(duration);
                }
            });
        }
    },
    liveChangeProgressBar : function(){
        var duration = airbus.mes.operationdetail.Formatter.convertMStoIM();
        if(duration != "0" || duration != 0){
            sap.ui.getCore().byId("progressSlider").attachLiveChange(function(){
            var inner = $("#progressSlider-inner").width();

                var convert = (($("#progressSlider-progress").width() * 100) / inner).toFixed(0);

                var value  = airbus.mes.operationdetail.Formatter.convertProgressBarToImField(convert);

                sap.ui.getCore().byId("imTextArea").setValue(value);
            });
        }else{
            sap.ui.getCore().byId("progressSlider").attachLiveChange(function(){
                sap.ui.getCore().byId("imTextArea").setValue(duration);
            });
        }
    }
};
