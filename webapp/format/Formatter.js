jQuery.sap.declare("tvsmatser.format.Formatter");
sap.ui.define(function() {
	"use strict";
	var Formatter = {
		setStatus: function(value) {
			if (value === "OPEN") {
				this.addStyleClass("openStatus");
			} else if (value === "CLOSED") {
				this.addStyleClass("closeStatus");
			}
			return value;
		}

	};

	return Formatter;
}, true);