sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/VBox",
	"sap/m/HBox",
	"sap/m/Button"
], function (Control, VBox, HBox, Button) {
	"use strict";
	return Control.extend("ns.bookshop.control.CustomNumber", {
		metadata : {
             events: {
                buttonPress: {}
            },
			aggregations : {
				_button : {type : "sap.m.Button", multiple: true, visibility : "hidden"}
			},
		},
		init : function () {
            this.addAggregation("_button", new Button({
                text: "0",
                press: this.buttonPress.bind(this)
            }).addStyleClass("sapUiTinyMarginBeginEnd"));
			this.addAggregation("_button", new Button({
                text: "1",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "2",
                press: this.buttonPress.bind(this)
            }).addStyleClass("sapUiTinyMarginBeginEnd"));
            this.addAggregation("_button", new Button({
                text: "3",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "4",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "5",
                press: this.buttonPress.bind(this)
            }).addStyleClass("sapUiTinyMarginBeginEnd"));
            this.addAggregation("_button", new Button({
                text: "6",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "7",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "8",
                press: this.buttonPress.bind(this)
            }).addStyleClass("sapUiTinyMarginBeginEnd"));
            this.addAggregation("_button", new Button({
                text: "9",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                text: "+",
                press: this.buttonPress.bind(this)
            }));
            this.addAggregation("_button", new Button({
                icon: "sap-icon://decline",
                press: this.buttonPress.bind(this)
            }));
            
        },

        buttonPress: function (oEvent) {
            let text = oEvent.getSource().getProperty('text');
            this.fireButtonPress({text: text});
        },
        
		renderer : function (oRM, oControl) {
            oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_button")[1]);
            oRM.renderControl(oControl.getAggregation("_button")[2]);
            oRM.renderControl(oControl.getAggregation("_button")[3]);
            oRM.write("</div>");
            oRM.write("<div>");
            oRM.renderControl(oControl.getAggregation("_button")[4]);
            oRM.renderControl(oControl.getAggregation("_button")[5]);
            oRM.renderControl(oControl.getAggregation("_button")[6]);
            oRM.write("</div>");
            oRM.write("<div>");
            oRM.renderControl(oControl.getAggregation("_button")[7]);
            oRM.renderControl(oControl.getAggregation("_button")[8]);
            oRM.renderControl(oControl.getAggregation("_button")[9]);
            oRM.write("</div>");
            oRM.write("<div>");
            oRM.renderControl(oControl.getAggregation("_button")[10]);
            oRM.renderControl(oControl.getAggregation("_button")[0]);
            oRM.renderControl(oControl.getAggregation("_button")[11]);
            oRM.write("</div>");
		}
	});
});