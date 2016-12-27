jQuery.sap.declare("custom.m.DateTimeInput");
sap.m.DateTimeInput.extend("custom.m.DateTimeInput", {
  
  metadata : {
    properties : {
    "maxDate": {
      type: "string",
      defaultValue : null
    },
    
    "minDate": {
      type: "string",
      defaultValue : null
    }
    }
  },
  
  renderer : {},
  
  onAfterRendering : function() {
    // call super class
    this._super.onAfterRendering.call(this);
    
    // get scoller config, more details you can find here -> http://demo.mobiscroll.com/datetime/dateminmax/
    var o = this._getScrollerConfig();
    
    // get passed maxDate value & set it to scroller config
		var oMaxDate = this.getMaxDate();
		if (typeof oMaxDate === "string" && oMaxDate) {
			o.maxDate = new Date(oMaxDate.substring(0, 4) + "-" + oMaxDate.substring(4, 6) + "-" + oMaxDate.substring(6, 8));
		}
  
    // get passed minDate value & set it to scroller config
		var oMinDate = this.getMinDate();
		if (typeof oMinDate === "string" && oMinDate) {
			o.minDate = new Date(oMinDate.substring(0, 4) + "-" + oMinDate.substring(4, 6) + "-" + oMinDate.substring(6, 8));
		}

    this._$input.scroller(o);
		this._showValue();

  }

});
