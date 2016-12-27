/*global history */
sap.ui.define([
	"tvsmatser/controller/BaseController",
	"tvsmatser/format/Formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"tvsmatser/model/formatter"
], function(BaseController, Formatter, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("tvsmatser.controller.Master", {
		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {
			parent.myView = this.getView();
			parent.that = this;
			parent.SaveBtnStatus = "CLOSED";
			parent.BackBtnDetail = "false";
			parent.detailthat = parent.detailthat;
			parent.tableId = "idTableLotInspectionDetails";
			parent.LotInspectionDetailsJSON = new sap.ui.model.json.JSONModel();
			parent.SaveBtnStatus = "false";
			parent.loadLotInspectionDetailsStatus = "true";

			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function() {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
			this.getRouter().attachRouteMatched(this.loadData, this);

		},
		// Bind to Mater list
		// bindMaster: function() {
		// 	parent.myView.byId("list").setModel(parent.masterJSONData);
		// 	parent.busyDialog1.close();
		// },

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter and hides the pull to refresh control, if
		 * necessary.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			// this.byId("pullToRefresh").hide();
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			// var sQuery = oEvent.getParameter("query");
			var listData = parent.myView.byId("list");
			var sQuery = oEvent.getSource().getValue();
			var mylist = listData.getBinding("items");

			if (mylist) {
				var oFilters = [
					new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Maktx", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Mdv01", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Verid", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Text1", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Prueflos", sap.ui.model.FilterOperator.Contains, sQuery),
					new sap.ui.model.Filter("Vcode", sap.ui.model.FilterOperator.Contains, sQuery)
				];
				var filterObj = new sap.ui.model.Filter(oFilters, false);
				mylist.filter(filterObj);
			} else {
				mylist.filter([]);
			}

			return mylist;

			// if (sQuery) {
			// 	this._oListFilterState.aSearch = [new Filter("material", FilterOperator.Contains, sQuery)];
			// 	this._oListFilterState.aSearch = [new Filter("description", FilterOperator.Contains, sQuery)];
			// 	this._oListFilterState.aSearch = [new Filter("productionVer", FilterOperator.Contains, sQuery)];
			// 	this._oListFilterState.aSearch = [new Filter("lineProd", FilterOperator.Contains, sQuery)];
			// 	this._oListFilterState.aSearch = [new Filter("lineDise", FilterOperator.Contains, sQuery)];
			// 	this._oListFilterState.aSearch = [new Filter("Inspection", FilterOperator.Contains, sQuery)];

			// } else {
			// 	this._oListFilterState.aSearch = [];
			// }
			// this._applyFilterSearch();

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function(oEvent) {
			var oList = this.getView().byId("list");
			var select_Item = oList.getSelectedItem();
			
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			parent.busyDialog1.open();
			parent.Status = "";
			parent.Material = oEvent.getParameter("listItem").getBindingContext().getProperty("Matnr");
			parent.Material_Description = oEvent.getParameter("listItem").getBindingContext().getProperty("Maktx");
			parent.Productionversion = oEvent.getParameter("listItem").getBindingContext().getProperty("Verid");
			parent.Inspection = oEvent.getParameter("listItem").getBindingContext().getProperty("Prueflos");

			//Prueflos
			//parent.selectPlant
			parent.Productionline = oEvent.getParameter("listItem").getBindingContext().getProperty("Mdv01");
			parent.ProductionlineDescription = oEvent.getParameter("listItem").getBindingContext().getProperty("Text1");
			parent.Status = oEvent.getParameter("listItem").getBindingContext().getProperty("Vcode");
			var Inspection = parseInt(parent.Inspection);
			var save_status = "";
			if (parent.SaveBtnStatus == "true") {
				var Add_dialog = new sap.m.Dialog({
					title: 'Warning',
					type: 'Message',
					state: 'Warning',
					contentHeight : "10%",
					content: [
						new sap.m.Text({
							text: 'Unsaved changes will be lost.'

						}),
						new sap.m.Text({
							text: 'Do you wish to open another Inspection lot?'
						})
					],
					beginButton: new sap.m.Button({
						text: 'Yes',
						press: function() {
							parent.tabelIndex = [];
							Add_dialog.close();
							parent.busyDialog1.open();
							if (Inspection) {
								parent.SelectedItem = select_Item;
								parent.SaveBtnStatus = "false";
								parent.tableId = parent.tableId + 1;
								parent.loadLotInspectionDetailsStatus = "true";
								parent.LotInspectionDetailsJSON.setData([]);
								parent.LotInspectionDetailsJSON.refresh(true);
								// this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
								var sOdata = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
								// sOdata.read("/MaterialLotCollection?&$filter=Werks%20eq%20%27" + "HOS" + "%27%20and%20Prueflos%20eq%20%" + "27130000160500%27",
								sOdata.read("/MaterialLotCollection?&$filter=Werks%20eq%20'" + parent.selectPlant + "'%20and%20Prueflos%20eq%20'" +
									parent.Inspection +
									"'%20and%20PartOrProcess%20eq%20'" + parent.selectPart + "'",
									null, null, true,
									function(oData, oResponse) {
										parent.LotInspectionDetailsJSON.setData(oData.results);
										
										sap.ui.controller("tvsmatser.controller.Detail").loadLotInspectionDetails();
										parent.that.getRouter().navTo("detail");
									},
									function(oData, oResporense) {
										parent.busyDialog1.close();
										// alert(oData.message);
						var Add_dialog1 = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: oData.message
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
									});
							} else {
								parent.busyDialog1.close();
								var Add_dialog2 = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: "No Inspection"
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function() {
									Add_dialog2.close();
								}
							}),

							afterClose: function() {
								Add_dialog2.destroy();
							}
						});
						Add_dialog2.open();
							}
						}
					}),

					endButton: new sap.m.Button({
						text: 'No',
						press: function() {
							save_status = "";
							// parent.SelectedItem 
						oList.setSelectedItem(parent.SelectedItem);
							Add_dialog.close();
						}
					}),
					afterClose: function() {
						Add_dialog.destroy();
					}
				});

				Add_dialog.open();
			} else {
				save_status = "true";
			}
			if (save_status == "true") {

				if (Inspection) {
					parent.SelectedItem = select_Item;
					parent.SaveBtnStatus = "false";
					parent.tableId = parent.tableId + 1;
					parent.loadLotInspectionDetailsStatus = "true";
					parent.LotInspectionDetailsJSON.setData([]);
					parent.LotInspectionDetailsJSON.refresh(true);
					// this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
					this.getRouter().navTo("detail");
					var sOdata = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSRV_INSPECTION_LOT");
					// sOdata.read("/MaterialLotCollection?&$filter=Werks%20eq%20%27" + "HOS" + "%27%20and%20Prueflos%20eq%20%" + "27130000160500%27",
					sOdata.read("/MaterialLotCollection?&$filter=Werks%20eq%20'" + parent.selectPlant + "'%20and%20Prueflos%20eq%20'" + parent.Inspection +
						"'%20and%20PartOrProcess%20eq%20'" + parent.selectPart + "'",
						null, null, true,
						function(oData, oResponse) {
							parent.LotInspectionDetailsJSON.setData(oData.results);
							sap.ui.controller("tvsmatser.controller.Detail").loadLotInspectionDetails();
							// sap.ui.controller("tvsmatser.controller.Detail").submitData();
							// jQuery.sap.delayedCall(1000, this, function() {

							// });
							// parent.busyDialog1.close();
						},
						function(oData, oResporense) {
							parent.busyDialog1.close();
								var Add_dialog = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: oData.message
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

				} else {
					parent.busyDialog1.close();
						var Add_dialog1 = new sap.m.Dialog({
							title: 'Warning',
							type: 'Message',
							content: new sap.m.Text({
								text: "No Inspection"
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

			} else {
				parent.busyDialog1.close();
			}
		},
		loadData: function(e) {
			if (e.mParameters.name === "master") {
				this.onAfterRendering();
			}
		},
		onBeforeRendering: function() {
			// alert("onBeforeRendering");
		},
		onAfterRendering: function() {
			if (parent.loadDataStatus == "false") {
				var listData = parent.myView.byId("list");
				var mylist = listData.getBinding("items");
				mylist.filter(null);
				parent.loadDataStatus = "true";
				parent.SaveBtnStatus = "false";
				parent.myView.byId("list").setModel(parent.masterJSONData);
				parent.busyDialog1.close();
			}
			// alert("onAfterRendering");
		},
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Maktx",
				groupBy: "None"
			});
		},

		_onMasterMatched: function() {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function(mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("Matnr");
					this.getRouter().navTo("object", {
						objectId: sObjectId
					}, true);
				}.bind(this),
				function(mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},

		_showDetail: function(oItem) {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Matnr")
			}, bReplace);
		},

		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},
		_applyFilterSearch: function() {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		_applyGroupSort: function(aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		_updateFilterBar: function(sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});