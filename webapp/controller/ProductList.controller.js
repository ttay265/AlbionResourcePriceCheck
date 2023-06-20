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
            let inFibQty = Math.round(this.byId("inFiberQty").getValue());
            let inClothPrice = parseFloat(this.byId("inCloth-1Price").getValue());
            let inClothQty = Math.round(this.byId("inCloth-1Qty").getValue());
            let inRRR = this.byId("inRRR").getValue();

            let returnedFib = inFibQty;
            let returnedCloth = inClothQty;
            const totalCost = Math.round(inFibPrice * inFibQty + inClothPrice * inClothQty);

            let finalFib = returnedFib;
            let finalCloth = returnedCloth;
            let fee = 0;
            do {
                fee += this.fee * Math.round(returnedCloth);
                returnedFib = parseFloat(inRRR) * parseInt(returnedFib) / 100;
                returnedCloth = parseFloat(inRRR) * parseInt(returnedCloth) / 100;
                finalFib += Math.round(returnedFib);
                finalCloth += Math.round(returnedCloth);
            }
            while (returnedCloth >= 1);
            this.byId("totalCost").setValue(totalCost + fee);
            this.byId("resultQty").setValue(finalCloth);
            const val = this.byId("resultPrice").getValue() || 0;
            const totalSell = Math.round(parseFloat(val) * parseInt(finalCloth) - 4 * parseFloat(val) * parseInt(finalCloth) / 100);
            this.calculateRefineProfit(totalCost, totalSell);
        },
        onSellingPriceLiveChange: function(e) {
            let inFibPrice = parseFloat(this.byId("inFiberPrice").getValue());
            let inFibQty = Math.round(this.byId("inFiberQty").getValue());
            let inClothPrice = parseFloat(this.byId("inCloth-1Price").getValue());
            let inClothQty = Math.round(this.byId("inCloth-1Qty").getValue());
            const resultQty = this.byId("resultQty").getValue();
            const val = e.getParameter("newValue") || 0;

            const totalCost = Math.round(inFibPrice * inFibQty + inClothPrice * inClothQty);
            const totalSell = Math.round(parseFloat(val) * parseInt(resultQty) - 4 * parseFloat(val) * parseInt(resultQty) / 100);
            this.calculateRefineProfit(totalCost, totalSell);
        },
        calculateRefineProfit: function(cost, sellPrice) {
            this.byId("totalSell").setValue(sellPrice);
            this.byId("netProfit").setValue(sellPrice - cost);
            this.byId("profitMargin").setValue(((sellPrice - cost) / cost * 100).toFixed(2) + "%");
        },
        onFiberQtyLiveChange: function(e) {
            const rtier = this.byId("RTier").getSelectedKey();
            let diff = 5;
            switch (rtier) {
                case "4":
                    {
                        diff = 2;
                        break;
                    }

                case "5":
                    {
                        diff = 3;
                        break;
                    }

                case "6":
                    {
                        diff = 4;
                        break;
                    }
                case "7":
                    {
                        diff = 5;
                        break;
                    }
                case "8":
                    {
                        diff = 6;
                        break;
                    }
            }
            const val = e.getParameter("newValue") || 0;
            this.byId("inCloth-1Qty").setValue(Math.round(val / diff));

        },
        onClothQtyLiveChange: function(e) {
            const rtier = this.byId("RTier").getSelectedKey();
            let diff = 5;
            switch (rtier) {
                case "4":
                    {
                        diff = 2;
                        break;
                    }

                case "5":
                    {
                        diff = 3;
                        break;
                    }

                case "6":
                    {
                        diff = 4;
                        break;
                    }
                case "7":
                    {
                        diff = 5;
                        break;
                    }
                case "8":
                    {
                        diff = 6;
                        break;
                    }
            }
            const val = e.getParameter("newValue") || 0;
            this.byId("inFiberQty").setValue(Math.round(val * diff));
        },
        onFeeChange: function(e) {
            const rtier = parseInt(this.byId("RTier").getSelectedKey());
            const renh = parseInt(this.byId("REnh").getSelectedKey());
            let itemValue = 1;
            for (let i = 1; i <= (rtier + renh); i++) {
                itemValue *= 2;
            }
            const usageFee = parseInt(this.byId("fee").getValue());
            this.fee = usageFee / 100 * itemValue * 0.1125;
        }
    });
});