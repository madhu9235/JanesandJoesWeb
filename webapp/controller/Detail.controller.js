/*global location */
sap.ui.define([
	"tvsmatser/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"tvsmatser/model/formatter",
	"sap/ui/core/Item"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("tvsmatser.controller.Detail", {
		formatter: formatter,
		onInit: function() {
			parent.BackBtnDetail = "true";
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			parent.detailView = this.getView();
			this.setModel(oViewModel, "detailView");
			parent.SelectData = [{
				"key": "",
				"value": "Select"
			}, {
				"key": "Yes",
				"value": "Yes"
			}, {
				"key": "No",
				"value": "No"
			}];
			parent.detailView.byId("IdSaveBtn").setVisible(false);
			// this.getRouter().attachRouteMatched(this.loadLotInspectionDetails, this);
			parent.loadLotInspectionDetailsStatus = "OnInit";

			parent.tabelIndex = [];
		},
		loadLotInspectionDetails: function(e) {
			// if (e.mParameters.name === "detail") {
			this.onAfterRendering();
			// 	}
		},
		SaveBtn: function() {
			parent.detailView.byId("IdSaveBtn").setVisible(false);
			parent.SaveBtnStatus = "false";
			parent.busyDialog1.open();
			var data = sap.ui.getCore().byId(parent.tableId).getModel().getData();
			var oEntry = {};
			var MaterialLots = [];
			var i;
			var SelectedIndex = parent.tabelIndex.reduce(function(a, b) {
				if (a.indexOf(b) < 0) a.push(b);
				return a;
			}, []);

			//PartOrProcess
			for (i = 0; i < SelectedIndex.length; i++) {
				oEntry.Matnr = parent.Material;
				oEntry.Plant = parent.selectPlant;
				oEntry.Shop = parent.selectShop;
				oEntry.Description = parent.Material_Description;
				oEntry.Date = null;
				oEntry.Eno = parent.employeeNo;
				
				
				
				// var status = "false";
				// if (data[i].Messwert1 != "" || data[i].Messwert2 != "" || data[i].Messwert2) {
				// 	status = "true";
				// } else if (data[i].Pruefbemkt1 != "" || data[i].Pruefbemkt2 != "" || data[i].Pruefbemkt3 != "") {
				// 	status = "true";
				// }
				// if (status == "true") {
				// if(SelectedIndex.indexOf(""+i+"") != -1){
				var Messwert1 = "";
				var Messwert2 = "";
				var Messwert3 = "";
				var Pruefbemkt1 = "";
				var Pruefbemkt2 = "";
				var Pruefbemkt3 = "";
				
					if(data[SelectedIndex[i]].Auswmenge1 == "OK/NOK"){
									//MESSWERT1,MESSWERT2 and MESSWERT3
					Messwert1 =	Pruefbemkt1 = data[SelectedIndex[i]].Messwert1;
					Messwert2 =	Pruefbemkt2 = data[SelectedIndex[i]].Messwert2;
					Messwert3 = Pruefbemkt3 = data[SelectedIndex[i]].Messwert3;
					}else if(data[SelectedIndex[i]].Pmethod == "VISUAL" || data[SelectedIndex[i]].Pmethod == "CHECK"){
						//PRUEFBEMKT1, PRUEFBEMKT2 and PRUEFBEMKT3
					Pruefbemkt1 = Messwert1 = data[SelectedIndex[i]].Pruefbemkt1;
					Pruefbemkt2 = Messwert2 = data[SelectedIndex[i]].Pruefbemkt2;
					Pruefbemkt3 = Messwert3 = data[SelectedIndex[i]].Pruefbemkt3;
					}else{
							//MESSWERT1,MESSWERT2 and MESSWERT3
					Messwert1 =	Pruefbemkt1 = data[SelectedIndex[i]].Messwert1;
					Messwert2 =	Pruefbemkt2 = data[SelectedIndex[i]].Messwert2;
					Messwert3 = Pruefbemkt3 = data[SelectedIndex[i]].Messwert3;
					}
			
					// if(data[SelectedIndex[i]].Pmethod == "VISUAL" || data[SelectedIndex[i]].Pmethod == "CHECK"){
					// 	Messwert1 = data[SelectedIndex[i]].Pruefbemkt1;
					// 	Messwert2 = data[SelectedIndex[i]].Pruefbemkt2;
					// 	Messwert3 = data[SelectedIndex[i]].Pruefbemkt3;
					// }else{
					// 	Messwert1 = data[SelectedIndex[i]].Messwert1;
					// 	Messwert2 = data[SelectedIndex[i]].Messwert2;
					// 	Messwert3 = data[SelectedIndex[i]].Messwert3;
					// }
				
				MaterialLots.push({
					"Werks": data[SelectedIndex[i]].Werks,
					"Dispo": data[SelectedIndex[i]].Dispo,
					"Matnr": data[SelectedIndex[i]].Matnr,
					"Maktx": data[SelectedIndex[i]].Maktx,
					"Mdv01": data[SelectedIndex[i]].Mdv01,
					"Ktext": data[SelectedIndex[i]].Ktext,
					"Plnnr": data[SelectedIndex[i]].Plnnr,
					"Plnal": data[SelectedIndex[i]].Plnal,
					"Vorglfnr": data[SelectedIndex[i]].Vorglfnr,
					"Ltxa1": data[SelectedIndex[i]].Ltxa1,
					"Merknr": data[SelectedIndex[i]].Merknr,
					"Kurztext": data[SelectedIndex[i]].Kurztext,
					"Lsl": data[SelectedIndex[i]].Lsl,
					"Usl": data[SelectedIndex[i]].Usl,
					"Masseinhsw": data[SelectedIndex[i]].Masseinhsw,
					"Stichprver": data[SelectedIndex[i]].Stichprver,
					"Messwert1": Messwert1,
					"Messwert2": Messwert2,
					"Messwert3": Messwert3,
					"Spckrit": data[SelectedIndex[i]].Spckrit,
					"Pastrterm": "/Date(" + parent.datePostValue + ")/",
					"Prueflos": data[SelectedIndex[i]].Prueflos,
					"Verid": data[SelectedIndex[i]].Verid,
					"Text1": data[SelectedIndex[i]].Text1,
					"Msgtyp": data[SelectedIndex[i]].Msgtyp,
					"Msgdsc": data[SelectedIndex[i]].Msgdsc,
					"Vcode": data[SelectedIndex[i]].Vcode,
					"Sollstpumf": parseInt(data[SelectedIndex[i]].Sollstpumf),
					"Auswmenge1": data[SelectedIndex[i]].Auswmenge1,
					"PartOrProcess": parent.selectPart,
					"Pmethod": data[SelectedIndex[i]].Pmethod,
					"Pruefbemkt1": Pruefbemkt1,
					"Pruefbemkt2": Pruefbemkt2,
					"Pruefbemkt3": Pruefbemkt3,
					"Pruefquali": data[SelectedIndex[i]].Pruefquali,
					"Pruefer": data[SelectedIndex[i]].Pruefer,
					"PartGroup": data[SelectedIndex[i]].PartGroup,
					"PartDesp": data[SelectedIndex[i]].PartDesp,
					"Cmm": data[SelectedIndex[i]].Cmm,
					"Shift": data[SelectedIndex[i]].Shift,
					"ShiftName": data[SelectedIndex[i]].ShiftName,
					"Dept": data[SelectedIndex[i]].Dept,
					"GaugeNo": data[SelectedIndex[i]].GaugeNo,
					"CharCat1": data[SelectedIndex[i]].CharCat1,
					"Pdr": data[SelectedIndex[i]].Pdr
				});
				
				oEntry.MaterialLots = MaterialLots;
				//	}
				// MaterialLots.push(data[i]);

			}
			// }

			/*oEntry.Matnr = parent.Material;
			oEntry.Plant = parent.selectPlant;
			oEntry.Shop = parent.selectShop;
			oEntry.Description = parent.Material_Description;
			oEntry.Date = "null";
			MaterialLots.push({
				"Werks": "HOS",
				"Dispo": "1MS",
				"Matnr": "0181013",
				"Maktx": "HUB COMP REAR",
				"Mdv01": "1MHBR200",
				"Ktext": "QD WHEEL HUB REAR CELL XLN/CH/SPORT",
				"Plnnr": "50000059",
				"Plnal": "01",
				"Vorglfnr": "0020",
				"Ltxa1": "\"BEARING BORE  , DRUM BORE BORING\"",
				"Merknr": "0400",
				"Kurztext": "Axis backlash",
				"Lsl": "0.0000",
				"Usl": "0.0100",
				"Masseinhsw": "MMT",
				"Stichprver": "",
				"Messwert1": "0.0100",
				"Messwert2": "0.0100",
				"Messwert3": "0.0100",
				"Spckrit": "",
				"Pastrterm": "/Date(1464566400000)/",
				"Prueflos": "130000160500",
				"Verid": "0001",
				"Text1": "Version 1 (LINE1-XLN/CH/SPORT - QD)",
				"Msgtyp": "",
				"Msgdsc": "",
				"Vcode": "",
				"Sollstpumf": 9999999,
				"Auswmenge1": "",
				"PartOrProcess": "PROCESS",
				"Pmethod": "DIAL",
				"Pruefbemkt1": "",
				"Pruefbemkt2": "",
				"Pruefbemkt3": "",
				"Pruefquali": "00004",
				"Pruefer": "",
				"PartGroup": "",
				"PartDesp": "",
				"Cmm": "",
				"Shift": "",
				"ShiftName": "",
				"Dept": "",
				"GaugeNo": "",
				"CharCat1": "",
				"Pdr": ""
			});
			oEntry.MaterialLots = MaterialLots;*/
			if (MaterialLots != 0) {
				OData.request({
						requestUri: "/sap/opu/odata/sap/ZSRV_INSPECTION_LOT/MaterialCollection?",
						method: "GET",
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/json",
							"X-CSRF-Token": "Fetch"
						}
					},
					function(data, response) {
						var header_xcsrf_token = response.headers['x-csrf-token'];
						OData.request({
								requestUri: "/sap/opu/odata/sap/ZSRV_INSPECTION_LOT/MaterialCollection?",
								method: "POST",
								headers: {
									"X-Requested-With": "XMLHttpRequest",
									"Content-Type": "application/json",
									"Accept": "application/json",
									"X-CSRF-Token": header_xcsrf_token
								},
								data: oEntry
							},
							function(data, response) {
								parent.busyDialog1.close();
								var Add_dialog = new sap.m.Dialog({
									title: 'Confirm',
									type: 'Message',
									content: new sap.m.Text({
										text: 'Updated Successfully'
									}),
									beginButton: new sap.m.Button({
										text: 'Ok',
										press: function() {
											parent.tabelIndex = [];
											Add_dialog.close();
										}
									}),

									afterClose: function() {
										Add_dialog.destroy();
									}
								});
								Add_dialog.open();
							},
							function(err) {
								parent.busyDialog1.close();
								parent.detailView.byId("IdSaveBtn").setVisible(true);
								parent.SaveBtnStatus = "true";

								var Add_dialog = new sap.m.Dialog({
									title: 'Warning',
									type: 'Message',
									content: new sap.m.Text({
										text: 'Error in updating data'
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
							});
					},
					function(err) {
						var request = err.request;
						var response = err.response;
						parent.detailView.byId("IdSaveBtn").setVisible(true);
						parent.SaveBtnStatus = "true";
						parent.busyDialog1.close();
						var Add_dialog = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: 'Error in Get -- Request'
							}),
							beginButton: new sap.m.Button({
								text: 'Ok',
								press: function() {
									Add_dialog.close();
								}
							}),

							afterClose: function() {
								Add_dialog.destroy();
							}
						});
						Add_dialog.open();
						// alert("Error in Get -- Request" +
						// 	request +
						// 	" Response " +
						// 	response);

					});
			} else {
				var Add_dialog1 = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					content: new sap.m.Text({
						text: "NO Records to update"
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
			}
		},

		// {
		// 											parts: ["Lsl", "Usl", "Messwert1"],
		// 											formatter: function(va1, va11, va12) {
		// 												va1 = parseFloat(va1);
		// 												va11 = parseFloat(va11);
		// 												 var va13 = parseFloat(va12);
		// 												if (va13 < va1) {
		// 													this.addStyleClass("InputBox_table_lessthan_greater");
		// 												} else if (va13 > va11) {
		// 													this.addStyleClass("InputBox_table_lessthan_greater");
		// 												}
		// 												return va12;
		// 											}
		// 										}
		onAfterRendering: function() {
			if (parent.loadLotInspectionDetailsStatus == "true") {
				parent.loadLotInspectionDetailsStatus = "false";
				parent.detailView.byId("page").setVisible(true);
				parent.detailView.byId("IdSaveBtn").setVisible(false);
				parent.SaveBtnStatus = "false";
				// parent.detailView.byId("fragmentPlantTableId").setText(parent.selectPlant);
				// parent.detailView.byId("fragmentShopTableId").setText(parent.selectShop);
				// parent.detailView.byId("fragmentMaterilTableId").setText(parent.Material);
				// parent.detailView.byId("fragmentDescriptionTableId").setText(parent.Material_Description);
				// parent.detailView.byId("fragmentProductionVersionTableId").setText(parent.Productionversion);
				// parent.detailView.byId("fragmentProductionDateTableId").setText(parent.dateValue);
				// parent.detailView.byId("fragmentProductionDateTableId").setText(parent.dateValue);
				parent.detailView.byId("page").setTitle("Lot Inspection Details for Plant " + parent.selectPlant + " and Shop " + parent.selectShop +
					" on " + parent.dateValue);
				// parent.detailView.byId("fragmentProductionLineTableId").setText(parent.Productionline);
				// parent.detailView.byId("fragmentProductionLineDescTableId").setText(parent.ProductionlineDescription);
				// parent.detailView.byId("fragmentInspectionListTableId").setText(parent.Inspection);
				// parent.detailView.byId("fragmentStatusTableId").setText(parent.Status);

				var oTable = new sap.m.Table(parent.tableId, {
					columns: [
						new sap.m.Column({
						width: "4rem"
						}),
						new sap.m.Column({
						width: "4rem"
						}),
						new sap.m.Column({}),
						new sap.m.Column({}),
						new sap.m.Column({}),
						new sap.m.Column({}),
						new sap.m.Column({}),
						new sap.m.Column({
						width:"4rem"
						})
					],
					items: {
						path: '/',
						factory: function(id, context) {
							var Auswmenge1 = context.getProperty("Auswmenge1");
							var Pmethod = context.getProperty("Pmethod");
							var status = "";
							if (parent.Status === "OPEN") {
								if(Auswmenge1 == "OK/NOK"){
									//MESSWERT1,MESSWERT2 and MESSWERT3.
								status = "true";	
								}else if(Pmethod == "VISUAL" || Pmethod == "CHECK"){
									//PRUEFBEMKT1, PRUEFBEMKT2 and PRUEFBEMKT3
								status = "VISUAL";
								}
								
								
								if (status == "") {
									return new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),
											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											new sap.m.Input({
												type: "Number",
												value: "{Messwert1}",
												description: {
													parts: ["Lsl", "Usl", "Messwert1"],
													formatter: function(va1, va11, va12) {
														va1 = parseFloat(va1);
														va11 = parseFloat(va11);
														var va13 = parseFloat(va12);
														if (va13 < va1) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														} else if (va13 > va11) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														}
														// return va12;
													}
												},
												pattern: "[0-9]*",
												liveChange: function(oEnent) {
													var str = this.getBindingContext().getPath();
														var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}

													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
													var LSL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Lsl);
													var USL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Usl);
													var value = "";
													if (oEnent.mParameters.value) {
														value = parseFloat(oEnent.mParameters.value);
														Number.prototype.between = function(a, b) {
															var min = Math.min.apply(Math, [a, b]),
																max = Math.max.apply(Math, [a, b]);
															return this >= min && this <= max;
														};
														var res = value.between(LSL_Color, USL_Color);
														if (res == false) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														} else if (res == true) {
															this.removeStyleClass("InputBox_table_lessthan_greater");
														}
													}
													if (value == "") {
														this.removeStyleClass("InputBox_table_lessthan_greater");
													}

													return null;
												}
											}),
											new sap.m.Input({
												type: "Number",
												value: "{Messwert2}",
												description: {
													parts: ["Lsl", "Usl", "Messwert2"],
													formatter: function(va1, va11, va12) {
														va1 = parseFloat(va1);
														va11 = parseFloat(va11);
														var va13 = parseFloat(va12);
														if (va13 < va1) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														} else if (va13 > va11) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														}
													}
												},
												pattern: "[0-9]*",
												liveChange: function(oEnent) {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
													var LSL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Lsl);
													var USL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Usl);
													var value = "";
													if (oEnent.mParameters.value) {
														value = parseFloat(oEnent.mParameters.value);
														Number.prototype.between = function(a, b) {
															var min = Math.min.apply(Math, [a, b]),
																max = Math.max.apply(Math, [a, b]);
															return this >= min && this <= max;
														};
														var res = value.between(LSL_Color, USL_Color);
														if (res == false) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														} else if (res == true) {
															this.removeStyleClass("InputBox_table_lessthan_greater");
														}
													}
													if (value == "") {
														this.removeStyleClass("InputBox_table_lessthan_greater");
													}
													return null;
												}
											}),
											new sap.m.Input({
												type: "Number",
												value: "{Messwert3}",
												description: {
													parts: ["Lsl", "Usl", "Messwert3"],
													formatter: function(va1, va11, va12) {
														va1 = parseFloat(va1);
														va11 = parseFloat(va11);
														var va13 = parseFloat(va12);
														if (va13 < va1) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														} else if (va13 > va11) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														}
													}
												},
												pattern: "[0-9]*",
												liveChange: function(oEnent) {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
													var LSL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Lsl);
													var USL_Color = parseFloat(this.getModel().getProperty(this.getBindingContext().getPath()).Usl);
													var value = "";
													if (oEnent.mParameters.value) {
														value = parseFloat(oEnent.mParameters.value);
														Number.prototype.between = function(a, b) {
															var min = Math.min.apply(Math, [a, b]),
																max = Math.max.apply(Math, [a, b]);
															return this >= min && this <= max;
														};
														var res = value.between(LSL_Color, USL_Color);
														if (res == false) {
															this.addStyleClass("InputBox_table_lessthan_greater");
														}
														if (res == true) {
															this.removeStyleClass("InputBox_table_lessthan_greater");
														}
													}
													if (value == "") {
														this.removeStyleClass("InputBox_table_lessthan_greater");
													}
													return null;
												}
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								}else 	if (status == "true") {
									return new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),

											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											new sap.m.Select({
												selectedKey: "{Messwert1}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Messwert2}",
												change: function() {
													var str = this.getBindingContext().getPath();
														var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Messwert3}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											// new sap.m.Text({
											// 	text: "{Spckrit}"
											// }),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								
									}else 	if (status == "VISUAL") {
									return new sap.m.ColumnListItem({
										cells: [

											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),

											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											new sap.m.Select({
												selectedKey: "{Pruefbemkt1}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Pruefbemkt2}",
												change: function() {
													var str = this.getBindingContext().getPath();
														var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Pruefbemkt3}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											// new sap.m.Text({
											// 	text: "{Spckrit}"
											// }),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								
									}else {
									return new sap.m.ColumnListItem({
										cells: [

											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),

											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											// new sap.m.Text({
											// 	text: "{Usl}"
											// }),
											new sap.m.Select({
												selectedKey: "{Messwert1}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Messwert2}",
												change: function() {
													var str = this.getBindingContext().getPath();
														var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Select({
												selectedKey: "{Messwert3}",
												change: function() {
													var str = this.getBindingContext().getPath();
													var count = str.split("/");
													if (parent.tabelIndex.indexOf("" + count[1] + "") == -1) {
														parent.tabelIndex.push(count[1]);
													}
													if (parent.SaveBtnStatus == "false") {
														parent.detailView.byId("IdSaveBtn").setVisible(true);
													}
													parent.SaveBtnStatus = "true";
												},
												items: [
													new sap.ui.core.Item({
														key: "",
														text: "Select"
													}), new sap.ui.core.Item({
														key: "OK",
														text: "OK"
													}), new sap.ui.core.Item({
														key: "NOK",
														text: "NOT OK"
													})
												]
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											// new sap.m.Text({
											// 	text: "{Spckrit}"
											// }),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								}
							} else {
								if (Auswmenge1 == "") {
									return new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),
											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											// new sap.m.Text({
											// 	text: "{Usl}"
											// }),
											new sap.m.Text({
												text: "{Messwert1}"
											}),
											new sap.m.Text({
												text: "{Messwert2}"
											}),
											new sap.m.Text({
												text: "{Messwert3}"
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											// new sap.m.Text({
											// 	text: "{Spckrit}"
											// }),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								} else {
									return new sap.m.ColumnListItem({
										cells: [
											new sap.m.Text({
												text: "{Vorglfnr} - {Ltxa1}"
											}),
											new sap.m.Text({
												text: "{Merknr} - {Kurztext}"
											}),
											new sap.m.Text({
												text: "{Lsl} / {Usl}"
											}),
											// new sap.m.Text({
											// 	text: "{Usl}"
											// }),
											new sap.m.Text({
												text: "{Messwert1}"
											}),
											new sap.m.Text({
												text: "{Messwert2}"
											}),
											new sap.m.Text({
												text: "{Messwert3}"
											}),
											new sap.m.Text({
												text: "{Masseinhsw} - {Spckrit}"
											}),
											// new sap.m.Text({
											// 	text: "{Spckrit}"
											// }),
											new sap.m.Text({
												text: "{Pmethod}"
											})
										]
									});
								}
							}

						}
					}
				});
				parent.LotInspectionDetailsJSON.iSizeLimit = 1000;
				sap.ui.getCore().byId(parent.tableId).setModel(parent.LotInspectionDetailsJSON);
				parent.detailView.byId("PanelTableId").removeAllContent();
				parent.detailView.byId("PanelTableId").insertContent(oTable);
				jQuery.sap.delayedCall(2000, this, function() {
				parent.busyDialog1.close();
				});
			}
			if (parent.loadLotInspectionDetailsStatus == "OnInit") {
				parent.loadLotInspectionDetailsStatus = "true";
			}
		},
		numberValidation: Number.prototype.between = function(a, b) {
			var min = Math.min.apply(Math, [a, b]),
				max = Math.max.apply(Math, [a, b]);
			return this > min && this < max;
		}
	});

});