sap.ui.define([
	"sap/ui/test/Opa5",
	"./arrangements/Startup",
    "./WorklistJourney",
	"sap/ui/test/opaQunit"
], function (Opa5, Startup) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Startup(),
		viewNamespace: "ns.bookshop.view."
	});

});
