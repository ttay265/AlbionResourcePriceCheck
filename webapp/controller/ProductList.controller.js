sap.ui.define([
    "com/order/productCustom_Order_Product/controller/BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("com.order.productCustom_Order_Product.controller.ProductList", {

        onInit: function() {
            this.url = "https://east.albion-online-data.com/api/v2/stats/Prices/";
            const jsonModel = new sap.ui.model.json.JSONModel();
            this.setModel(jsonModel);
        },

        onAfterRendering: function() {

        },
        onOrderQuantityChange: function(e) {
            debugger;
        },
        onSearch: function(e) {
            const that = this;
            that.getView().byId("product").setBusyIndicatorDelay(0);
            that.getView().byId("product").setBusy(true);
            const resType = this.getView().byId("resource").getSelectedKey();
            const tier = this.getView().byId("tier").getSelectedKey();
            const enc = this.getView().byId("enc").getSelectedKey();
            const filename = tier + resType + enc;
            const fullURL = this.url + filename + ".json";
            this.getModel().loadData(fullURL).then(e => {

                that.getView().byId("product").getItems().forEach(e => {
                    e.getCells()[1].setState("None");
                    e.getCells()[1].setInverted(false);
                    e.getCells()[2].setState("None");
                    e.getCells()[2].setInverted(false);
                });

                that.getView().byId("product").setBusy(false);
                //Highlight the lowest/highest city 
                const data = that.getModel().getProperty("/");
                const oHighestSell = data.reduce(function(prev, current) {
                    return (prev.sell_price_min > current.sell_price_min) ? prev : current
                }); //returns object
                const oHighestItem = that.getView().byId("product").getItems().find(e =>
                    e.getCells()[0].getBindingContext().getProperty("city") == oHighestSell.city
                );
                oHighestItem.getCells()[1].setState("Error");
                oHighestItem.getCells()[1].setInverted(true);
                oHighestItem.getCells()[2].setState("Error");
                oHighestItem.getCells()[2].setInverted(true);

                const oLowestSell = data.reduce(function(prev, current) {
                    return (prev.sell_price_min < current.sell_price_min && prev.sell_price_min !== 0) ? prev : current
                }); //returns object
                const oLowestItem = that.getView().byId("product").getItems().find(e =>
                    e.getCells()[0].getBindingContext().getProperty("city") == oLowestSell.city
                );
                oLowestItem.getCells()[1].setState("Success");
                oLowestItem.getCells()[1].setInverted(true);
                oLowestItem.getCells()[2].setState("Success");
                oLowestItem.getCells()[2].setInverted(true);
            });

        }



    });

});