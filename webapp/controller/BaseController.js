/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/mvc/Controller"], function(C) {
	"use strict";
	return C.extend("com.order.productCustom_Order_Product.controller.BaseController", {
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		getModel: function(n) {
			return this.getView().getModel(n) || this.getOwnerComponent().getModel(n);
		},
		setModel: function(m, n) {
			return this.getView().setModel(m, n);
		},
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getDataManager: function() {
			return this.getOwnerComponent().getDataManager();
		},
		getBarcodeScanHandler: function() {
			return this.getOwnerComponent().getBarcodeScanHandler();
		}
	});
});