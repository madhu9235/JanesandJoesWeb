jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 ZtvsCollection in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"tvsmatser/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"tvsmatser/test/integration/pages/App",
	"tvsmatser/test/integration/pages/Browser",
	"tvsmatser/test/integration/pages/Master",
	"tvsmatser/test/integration/pages/Detail",
	"tvsmatser/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "tvsmatser.view."
	});

	sap.ui.require([
		"tvsmatser/test/integration/MasterJourney",
		"tvsmatser/test/integration/NavigationJourney",
		"tvsmatser/test/integration/NotFoundJourney",
		"tvsmatser/test/integration/BusyJourney",
		"tvsmatser/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});
