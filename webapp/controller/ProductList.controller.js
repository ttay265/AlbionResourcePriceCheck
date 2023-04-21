sap.ui.define([
    "com/order/productCustom_Order_Product/controller/BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("com.order.productCustom_Order_Product.controller.ProductList", {

        onInit: function() {
            this.url = "https://east.albion-online-data.com/api/v2/stats/Prices/";
            // const url = "https://east.albion-online-data.com/api/v2/stats/Prices/T8_FIBER.json";
            const jsonModel = new sap.ui.model.json.JSONModel();
            this.setModel(jsonModel);
            // jsonModel.loadData("https://east.albion-online-data.com/api/v2/stats/Prices/T4_FIBER.json");
        },

        onAfterRendering: function() {

        },
        onOrderQuantityChange: function(e) {
            debugger;
        },
        onSearch: function(e) {
            const resType = this.getView().byId("resource").getSelectedKey();
            const tier = this.getView().byId("tier").getSelectedKey();
            const enc = this.getView().byId("enc").getSelectedKey();
            const filename = tier + resType + enc;
            const fullURL = this.url + filename + ".json";
            this.getModel().loadData(fullURL);
        }



    });

});