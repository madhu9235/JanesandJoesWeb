jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"tvsmatser/test/integration/NavigationJourneyPhone",
		"tvsmatser/test/integration/NotFoundJourneyPhone",
		"tvsmatser/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});

