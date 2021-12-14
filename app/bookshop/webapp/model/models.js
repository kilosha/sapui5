sap.ui.define([
	"sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/core/Locale",
    "sap/ui/core/LocaleData"
], function (JSONModel, Device, Locale, LocaleData) {
	"use strict";

	return {

		createDeviceModel : function () {
			const oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
        },

        createCountryModel: function (sizeLimit = 300) {
            let localeId;
            const currentConfig = sap.ui.getCore().getConfiguration();
            const locale = localeId ? new Locale(localeId) : currentConfig.getLocale();
            const localeData = new LocaleData(locale);
            const territories = localeData.getTerritories(); 

            const toObject = code => Object.freeze({
                code: code,
                name: territories[code],
            });

            const aRegions = [
                "EU", // "European Union"
                "EZ", // "Eurozone"
                "UN", // "United Nations"
                "ZZ", // "Unknown Region"
            ]

            const countries = Object.keys(territories)
                .filter(key => key.length==2 && aRegions.findIndex(item => item == key) == -1)
                .map(toObject)
                .sort((a, b) => a.name.localeCompare(b.name))
           
            const model = new JSONModel(countries);
            model.setSizeLimit(sizeLimit);
            model.setDefaultBindingMode("OneWay");
            return model;
        },
	};
});