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
                });
                if (oHighestSell) {
                    const oHighestItem = that.getView().byId("product").getItems().find(e =>
                        e.getCells()[0].getBindingContext().getProperty("city") == oHighestSell.city
                    );
                    if (oHighestItem) {
                        oHighestItem.getCells()[1].setState("Error");
                        oHighestItem.getCells()[1].setInverted(true);
                        oHighestItem.getCells()[2].setState("Error");
                        oHighestItem.getCells()[2].setInverted(true);
                    }
                }


                const lowData = data;
                let i = 0;
                for (i = lowData.length - 1; i >= 0; i--) {
                    if (lowData[i].sell_price_min === 0) {
                        lowData.splice(i, 1);
                    }
                }

                const oLowestSell = data.reduce(function(prev, current) {
                    return (prev.sell_price_min < current.sell_price_min) ? prev : current
                });
                if (oLowestSell) {
                    const oLowestItem = that.getView().byId("product").getItems().find(e =>
                        e.getCells()[0].getBindingContext().getProperty("city") == oLowestSell.city
                    );
                    if (oLowestItem) {
                        oLowestItem.getCells()[1].setState("Success");
                        oLowestItem.getCells()[1].setInverted(true);
                        oLowestItem.getCells()[2].setState("Success");
                        oLowestItem.getCells()[2].setInverted(true);
                    }
                }
            });
        },
        onRefineCalculatePress: function(e) {
            let inFibPrice = parseFloat(this.byId("inFiberPrice").getValue());
            let inFibQty = parseInt(this.byId("inFiberQty").getValue());
            let inClothPrice = parseFloat(this.byId("inCloth-1Price").getValue());
            let inClothQty = parseInt(this.byId("inCloth-1Qty").getValue());
            let inRRR = this.byId("inRRR").getValue();

            let returnedFib = inFibQty;
            let returnedCloth = inClothQty;
            const totalCost = inFibPrice * inFibQty + inClothPrice * inClothQty;
            this.byId("totalCost").setValue(totalCost);
            let finalFib = returnedFib;
            let finalCloth = returnedCloth;
            do {
                returnedFib = parseFloat(inRRR) * parseInt(returnedFib) / 100;
                returnedCloth = parseFloat(inRRR) * parseInt(returnedCloth) / 100;
                finalFib += returnedFib;
                finalCloth += returnedCloth;
            }
            while (parseFloat(returnedCloth) >= 1);
            this.byId("resultQty").setValue(finalCloth);
        },
        onSellingPriceLiveChange: function(e) {
            let inFibPrice = parseFloat(this.byId("inFiberPrice").getValue());
            let inFibQty = parseInt(this.byId("inFiberQty").getValue());
            let inClothPrice = parseFloat(this.byId("inCloth-1Price").getValue());
            let inClothQty = parseInt(this.byId("inCloth-1Qty").getValue());
            const resultQty = this.byId("resultQty").getValue();
            const val = e.getParameter("newValue") || 0;

            const totalCost = inFibPrice * inFibQty + inClothPrice * inClothQty;
            this.byId("totalSell").setValue(parseFloat(val) * parseInt(resultQty) - 4 * parseFloat(val) * parseInt(resultQty) / 100);
            this.byId("netProfit").setValue(parseFloat(val) * parseInt(resultQty) - totalCost);
        },
        onFiberQtyLiveChange: function(e) {
            const rtier = this.byId("RTier").getSelectedKey();
            let diff = 5;
            switch (rtier) {
                case "T4":
                    {
                        diff = 2;
                        break;
                    }

                case "T5":
                    {
                        diff = 3;
                        break;
                    }

                case "T6":
                    {
                        diff = 4;
                        break;
                    }
                case "T7":
                    {
                        diff = 5;
                        break;
                    }
                case "T8":
                    {
                        diff = 6;
                        break;
                    }
            }
            const inFiberQty = this.byId("inFiberQty").getValue();
            const val = e.getParameter("newValue") || 0;
            this.byId("inCloth-1Qty").setValue(parseInt(inFiberQty / diff));

        }
    });
});