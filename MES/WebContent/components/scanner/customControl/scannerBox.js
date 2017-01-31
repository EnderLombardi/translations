"use strict";
sap.ui.core.Control.extend("airbus.mes.scanner.customControl.scannerBox", {

    metadata:{
        properties: {}
    },

    renderer: function(oRm, oControl){

        // begin div
        oRm.write("<div");
        oRm.addClass("controls");
        oRm.writeClasses();
        oRm.write(">")

        // begin fieldset
        oRm.write("<fieldset");
        oRm.addClass("input-group");
        oRm.writeClasses();
        oRm.write(">");

        oRm.write("<div")
        oRm.addClass("inputBar");
        oRm.writeClasses();
        oRm.write(">")

        oRm.write("<p");
        oRm.addClass("textInput");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("</p>");

        oRm.write("</div>");

        oRm.write("<div");
        oRm.addClass("buttonPlace");
        oRm.writeClasses();
        oRm.write(">")
        oRm.write("<button id='scanLaunch'");
        oRm.write(">")
        oRm.writeEscaped("Scan");
        oRm.write("</button>")
        oRm.write("</div>");

        // end first fieldset
        oRm.write("</fieldset>")

        oRm.write("<fieldset");
        oRm.addClass("reader-config-group");
        oRm.writeClasses();
        oRm.write(">");

        oRm.write("<select id='deviceSelection'");
        oRm.addClass("input-stream_constraints");
        oRm.writeClasses();
        oRm.write(">")
        oRm.write("</select>");

        oRm.write("</fieldset>");

        //end div
        oRm.write("</div>");

        oRm.write("<div id='interactive'");
        oRm.addClass("viewport");
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("</div>");

    }

});

//sap.ui.commons.Button.extend("airbus.mes.scanner.customControl.scannerButton",{
//    metadata :{
//        events:{
//            "click" : {}
//        }
//    },
//    onclick : function(evt) {
//        this.fireClick();
//    },
//    renderer: {}
//});

