sap.ui.define([
    "sap/m/InputBase",
    "sap/ui/core/IconPool",
    "sap/m/InputBaseRenderer"
], function(InputBase, IconPool) {
    'use strict';
    return InputBase.extend("ns.bookshop.control.CustomInput", {
        metadata: {
            events: {
                endButtonPress: {}
            }
        },
        init: function () {
            InputBase.prototype.init.apply(this,arguments);
            this.icon = this.addEndIcon({
                id: this.getId() + "-questionMarkBtn",
                src: IconPool.getIconURI("call"),
                noTabStop: true,
                tooltip: "Open number input",
                press: this.onEndButtonPress.bind(this)
            });
        },

        onEndButtonPress: function () {
            if (this.getEnabled() && this.getEditable()) {
                this.fireEndButtonPress({});
            }
        },
     
        renderer: "sap.m.InputBaseRenderer"
    })
});