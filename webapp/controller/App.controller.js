sap.ui.define([
    // "sap/ui/core/mvc/Controller",
    "com/order/productCustom_Order_Product/controller/BaseController",
    "sap/m/Dialog"
], function(BaseController, Dialog) {
    "use strict";

    return BaseController.extend("com.order.productCustom_Order_Product.controller.App", {
        // apply content density mode to root view
        onInit: function() {

            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }
    });
});