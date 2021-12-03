sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/Fragment",
    "sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI",
    "sap/ui/core/mvc/Controller"
], function(ControllerExtension, Fragment, ExtensionAPI , Controller) {
    "use strict";
    return Controller.extend("fb.fioribookshop.custom.CustomController", {
        // getRate : async function () {
        //     const response = await fetch('https://www.nbrb.by/api/exrates/rates/431');
        //     const commits = await response.json();
        //     return commits.Cur_OfficialRate;
        // },
        
        openCurrencyPopover: function (oEvent) {
           
        
            let oButton = oEvent.getSource();
				//oView = this.getView();

            let oView = sap.ui.getCore().byId("BooksList");
            debugger;
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name:"fb.fioribookshop.custom.CustomCurrencyPopover",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});

        }
    });
});