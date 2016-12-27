sap.ui.define([
	"tvsmatser/controller/BaseController"
], function(Controller) {
	"use strict";
	return Controller.extend("tvsmatser.controller.Home", {
		onInit: function() {
			// alert("Init method is invoked");
			//Init method is invoked
			parent.busyDialog1 = new sap.m.BusyDialog({
				text: "Processing..."
			});
			parent.homeView = this.getView();
			parent.myView = parent.myView;
			parent.oModelLotInspectionDetails = new sap.ui.model.json.JSONModel();
			parent.busyDialog1.open();
			parent.homeView = this.getView();
			parent.that = this;
			parent.LotInspectionDetailsID = "";
			var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
				"November",
				"December");
			var Digital = new Date();
			var month = Digital.getMonth();
			var date = Digital.getDate();
			var year = Digital.getYear();
			if (year < 1000) {
				year += 1900;
			}
			parent.rdate = date + " " + months[month] + " " + year;
			var MaxDate = parseInt(month) + 1;
			MaxDate = ("0" + MaxDate).slice(-2);
			date = ("0" + date).slice(-2);
			//minDate="20160412" maxDate="20160520"

			// this.getView().byId("DatePickerId").setMinDate("20000412");
			// this.getView().byId("DatePickerId").setMaxDate(year + MaxDate + date);
			// parent.homeView.byId("DatePickerId").setValue(parent.rdate);

			parent.homeView.byId("DataAndTimeid").setText(parent.rdate);
			parent.SectionJSON = [{
				"key": "PLANT AUDIT",
				"value": "Plant Audit"
			}, {
				"key": "SPC",
				"value": "SPC"
			}];

			var PartJSON = [{
				"key": "PART",
				"value": "Part"
			}, {
				"key": "PROCESS",
				"value": "Process"
			}];

			//Master Table Data
			parent.masterJSONData = new sap.ui.model.json.JSONModel();

			// ComboBox Bind for Scetion
			var sectionModel = new sap.ui.model.json.JSONModel();
			sectionModel.setData(parent.SectionJSON);
			this.getView().byId("SectionId").setModel(sectionModel);

			// ComboBox Bind for part
			var partModel = new sap.ui.model.json.JSONModel();
			partModel.setData(PartJSON);
			this.getView().byId("PartId").setModel(partModel);

			// ComboBox Bind for shop
			parent.shopModel = new sap.ui.model.json.JSONModel();
			// ComboBox Bind for Plant

			parent.plantModel = new sap.ui.model.json.JSONModel();
			var plantODataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
			plantODataModel.read("/PlantsCollection?$expand=ShopDetails", null, null, true, function(oData, oResporense) {
				parent.plantModel.setData(oData.results);
				parent.homeView.byId("plantSelectId").setModel(parent.plantModel);
				// ComboBox Bind for shop
				parent.shopModel.setData(parent.plantModel.oData[0].ShopDetails.results);
				parent.homeView.byId("shopSelectId").setModel(parent.shopModel);

			}, function(oData, oResporense) {
				parent.busyDialog1.close();
				//alert(oData.message);
			});
			parent.materialModel = new sap.ui.model.json.JSONModel();
			// var materialODataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
			// materialODataModel.read("/MaterialCollection?$expand=MaterialLots&$filter=Plant%20eq%20%27HOS%27%20and%20Shop%20eq%20%272MS%27",
			// 	null, null, true,
			// 	function(oData, oResponse) {
			// 		parent.materialModel.setData(oData.results);
			// 		parent.homeView.byId("materialSelectId").setModel(parent.materialModel);
			// 		// ComboBox Bind for shop

			// 	},
			// 	function(oData, oResponse) {
			// 		parent.busyDialog1.close();
			// 		//alert(oData.message);
			// 	});

			parent.busyDialog1.close();
		},
		onChangeSection: function() {
			var vlaue = this.getView().byId("SectionId").getSelectedItem().getText();
			for (var i = 0; i < parent.SectionJSON.length; i++) {
				if (parent.SectionJSON[i].value == vlaue) {
					this.getView().byId("PartId").setVisible(false);
					this.getView().byId("PartLabelId").setVisible(false);
				} else {
					this.getView().byId("PartId").setVisible(true);
					this.getView().byId("PartLabelId").setVisible(true);
				}
			}
			jQuery.sap.delayedCall(1000, this, function() {
				this.shopChange();
			});
		},
		onChangePart: function() {
			jQuery.sap.delayedCall(1000, this, function() {
				this.shopChange();
			});
		},
		PlantChange: function(event) {
			parent.busyDialog1.open();
			var value = this.getView().byId("plantSelectId").getSelectedItem().getText();
			parent.shopModel.setData([]);
			parent.materialModel.setData([]);
			parent.shopModel.refresh(true);
			parent.materialModel.refresh(true);
			for (var i = 0; i < parent.plantModel.oData.length; i++) {
				if (parent.plantModel.oData[i].Description == value) {
					// ComboBox Bind for shop
					parent.shopModel.setData(parent.plantModel.oData[i].ShopDetails.results);
					this.getView().byId("shopSelectId").setModel(parent.shopModel);
					if (parent.plantModel.oData[i].ShopDetails.results.length != "0") {
						jQuery.sap.delayedCall(1000, this, function() {
							this.shopChange();
						});
					}
				}
			}
			parent.busyDialog1.close();
		},
		shopChange: function(event) {
			parent.busyDialog1.open();
			// var shopValue  = shopValue = this.getView().byId("shopSelectId").getValue();
			// for (var i = 0; i < parent.shopModel.oData.length; i++) {
			// 	// if(shopValue = parent.shopModel.oData[i]){

			// 	// }
			// }
			var dateValue = parent.homeView.byId("DatePickerId").getValue();
			var selectSection = parent.homeView.byId("SectionId").getSelectedItem().getKey();
			var selectPart = "";
			if (selectSection == "SPC") {
				selectPart = "";
			} else {
				selectPart = parent.homeView.byId("PartId").getSelectedItem().getKey();
			}
			parent.materialModel.refresh(true);
			var shopSelectkey = "";
			if (parent.homeView.byId("shopSelectId").getItems().length) {
				shopSelectkey = this.getView().byId("shopSelectId").getSelectedItem().getKey();
			} else {
				shopSelectkey = "";
			}
			var plantSelectkey = "";
			if (parent.homeView.byId("plantSelectId").getItems().length) {
				plantSelectkey = this.getView().byId("plantSelectId").getSelectedItem().getKey();
			} else {
				plantSelectkey = "";
			}

			if (shopSelectkey != "" && dateValue != "") {
				// ComboBox Bind for material
				parent.materialModel.setData([]);
				parent.materialModel.refresh(true);
				var materialODataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
				// dateFormat = "2016-05-30";
				materialODataModel.read("/MaterialCollection?$expand=MaterialLots&$filter=Plant%20eq%20'" + plantSelectkey +
					"'%20and%20Shop%20eq%20'" + shopSelectkey + "'%20and%20Date%20eq%20datetime'" + dateValue + "T00:00:00" +
					"'%20and%20PartProcess%20eq%20'" + selectPart + "'",
					null, null, true,
					function(oData, oResponse) {
						parent.materialModel.setData(oData.results);
						parent.homeView.byId("materialSelectId").setModel(parent.materialModel);
						// ComboBox Bind for shop
						parent.busyDialog1.close();
					},
					function(oData, oResponse) {
						parent.busyDialog1.close();
						//alert(oData.message);
					});
			} else {
				parent.busyDialog1.close();
			}
			// parent.busyDialog1.close();

		},
		handleStartDateChange: function(oEvent) {
			this.shopChange();
		},
		btnPressGet_details: function() {
			parent.loadDataStatus = "false";
			parent.busyDialog1.open();
			parent.masterJSONData.setData([]);
			parent.masterJSONData.refresh(true);
			parent.selectSection = parent.homeView.byId("SectionId").getSelectedItem().getKey();

			if (parent.selectSection == "SPC") {
				parent.selectPart = "";
			} else {
				parent.selectPart = parent.homeView.byId("PartId").getSelectedItem().getKey();
			}
			parent.employeeNo = parent.homeView.byId("employeeInputId").getValue();

			parent.selectShop = "";
			parent.selectMaterial = "";
			parent.selectPlant = "";
			if (parent.homeView.byId("plantSelectId").getItems().length) {
				parent.selectPlant = parent.homeView.byId("plantSelectId").getSelectedItem().getKey();
			} else {
				parent.selectPlant = "";
			}
			if (parent.homeView.byId("shopSelectId").getItems().length) {
				parent.selectShop = parent.homeView.byId("shopSelectId").getSelectedItem().getKey();
			} else {
				parent.selectShop = "";
			}

			if (parent.homeView.byId("materialSelectId").getItems().length) {
				parent.selectMaterial = parent.homeView.byId("materialSelectId").getSelectedItem().getKey();
			} else {
				parent.selectMaterial = "";
			}

			var dateValue = parent.homeView.byId("DatePickerId").getValue();
			// dateValue = dateValue + "T00:00:00";
			// // set data
			parent.dateValue = dateValue;
			parent.datePostValue = Date.parse(dateValue);
			parent.datePostValue = parseInt(parent.datePostValue);
			// parent.datePostValue = parseInt(parent.datePostValue.toString().substr(0, parent.datePostValue.toString().length - 3));
			var oDataArray = [];
			// parent.selectPlant = "HOS";
			// parent.selectShop = "1MS";
			if (parent.employeeNo == "") {
				parent.busyDialog1.close();
				var Add_dialog = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Please Enter Employee No'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							Add_dialog.close();
						}
					}),

					afterClose: function() {
						Add_dialog.destroy();
					}
				});
				Add_dialog.open();
			} else if (parent.selectPlant == "") {
				parent.busyDialog1.close();
				var Add_dialog = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Please Select Plant'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							Add_dialog.close();
						}
					}),

					afterClose: function() {
						Add_dialog.destroy();
					}
				});
				Add_dialog.open();
			} else if (parent.selectShop == "") {
				parent.busyDialog1.close();
				var Add_dialog = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Please Select Shop'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							Add_dialog.close();
						}
					}),

					afterClose: function() {
						Add_dialog.destroy();
					}
				});
				Add_dialog.open();
				// }else{

				// var meaterialODATA = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
				// meaterialODATA.read(
				// 	"/MaterialCollection?$expand=MaterialLots&$filter=Plant%20eq%20'" + parent.selectPlant + "'%20and%20Shop%20eq%20'" + parent.selectShop +
				// 	"'%20and%20Date%20eq%20datetime'" + dateFormat + "T00:00:00" + "'%20and%20Matnr%20eq%20'" + parent.selectMaterial + "'",
				// 	null, null, true,
				// 	function(oData, oResponse) {

				// 		if (oData.results.length) {

				// 			for (var i = 0; i < oData.results.length; i++) {
				// 				if (oData.results[i].Matnr == parent.selectMaterial) {
				// 					for (var j = 0; j < oData.results[i].MaterialLots.results.length; j++) {
				// 						oDataArray.push(oData.results[i].MaterialLots.results[j]);
				// 					}
				// 				} else {
				// 					for (var j = 0; j < oData.results[i].MaterialLots.results.length; j++) {
				// 						oDataArray.push(oData.results[i].MaterialLots.results[j]);
				// 					}
				// 				}
				// 			}
				// 			parent.masterJSONData.setData(oDataArray);
				// 			sap.ui.controller("tvsmatser.controller.Master").bindMaster();
				// 		}
				// 		parent.busyDialog1.close();
				// 	},
				// 	function(oData, oResponse) {
				// 		parent.busyDialog1.close();
				// 		//alert(oData.message);
				// 	});
				// 	this.getRouter().navTo("master");
				// if(oDataArray != 0){
				// 	this.getRouter().navTo("master");
				// }
			} else if (parent.datePostValue == "") {
				var Add_dialog = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Please Select Date'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							Add_dialog.close();
						}
					}),

					afterClose: function() {
						Add_dialog.destroy();
					}
				});
				Add_dialog.open();
			} else if (dateValue == "") {
				parent.busyDialog1.close();
				var Add_dialog1 = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: 'Select Date'
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							Add_dialog1.close();
						}
					}),

					afterClose: function() {
						Add_dialog1.destroy();
					}
				});
				Add_dialog1.open();

			} else if (parent.selectMaterial == "") {
				if (parent.materialModel.oData.length) {
					for (var i = 0; i < parent.materialModel.oData.length; i++) {
						for (var j = 0; j < parent.materialModel.oData[i].MaterialLots.results.length; j++) {
							oDataArray.push(parent.materialModel.oData[i].MaterialLots.results[j]);
						}
					}
					if (oDataArray != 0) {
						parent.masterJSONData.setData(oDataArray);
						this.getRouter().navTo("master");
					} else {
						parent.busyDialog1.close();
						var Add_dialog = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: 'No Data Found'
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function() {
									Add_dialog.close();
								}
							}),

							afterClose: function() {
								Add_dialog.destroy();
							}
						});
						Add_dialog.open();
					}
				} else {
					parent.busyDialog1.close();
					var Add_dialog = new sap.m.Dialog({
						title: 'Warning',
						type: 'Message',
						content: new sap.m.Text({
							text: 'No Data Found'
						}),
						beginButton: new sap.m.Button({
							text: 'OK',
							press: function() {
								Add_dialog.close();
							}
						}),

						afterClose: function() {
							Add_dialog.destroy();
						}
					});
					Add_dialog.open();
				}

			} else {
				var INDEX = parent.materialModel.oData.map(function(e) {
					return e.Matnr;
				}).indexOf(parent.selectMaterial);
				parent.masterJSONData.setData(parent.materialModel.oData[INDEX].MaterialLots.results);
				if (parent.materialModel.oData[INDEX].MaterialLots.results.length != 0) {
					this.getRouter().navTo("master");
					jQuery.sap.delayedCall(2000, this, function() {
						parent.busyDialog1.close();
					});

				} else {
					parent.busyDialog1.close();
					var Add_dialog = new sap.m.Dialog({
						title: 'Warning',
						type: 'Message',
						content: new sap.m.Text({
							text: 'No Data Found'
						}),
						beginButton: new sap.m.Button({
							text: 'OK',
							press: function() {
								Add_dialog.close();
							}
						}),

						afterClose: function() {
							Add_dialog.destroy();
						}
					});
					Add_dialog.open();
				}
				parent.busyDialog1.close();
			}

		},
		onBeforeRendering: function() {

		},

		onAfterRendering: function() {

		},

		onExit: function() {

		}

	});

});