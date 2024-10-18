/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable no-undef */
define([
    'Magento_Checkout/js/view/payment/default',
    'jquery',
    'underscore',
    'mageUtils',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/full-screen-loader',
    'mage/translate',
    'Magento_PaymentServicesPaypal/js/view/payment/methods/smart-buttons',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Magento_Checkout/js/action/set-billing-address',
    'Magento_Ui/js/model/messageList'
], function (
    Component,
    $,
    _,
    utils,
    quote,
    fullScreenLoader,
    $t,
    SmartButtons,
    additionalValidators,
    setBillingAddressAction,
    globalMessageList
) {
    'use strict';

    return Component.extend({
        defaults: {
            sdkNamespace: 'paypalApplePay',
            fundingSource: 'applepay',
            buttonContainerId: 'apple-pay-${ $.uid }',
            template: 'Magento_PaymentServicesPaypal/payment/apple-pay',
            isAvailable: false,
            isButtonRendered: false,
            grandTotalAmount: null,
            paymentsOrderId: null,
            paypalOrderId: null,
            paymentTypeIconTitle: $t('Pay with Apple Pay'),
            requestProcessingError: $t('Error happened when processing the request. Please try again later.'),
            notEligibleErrorMessage: $t('This payment option is currently unavailable.'),
            paymentTypeIconUrl:  window.checkoutConfig.payment['payment_services_paypal_apple_pay'].paymentTypeIconUrl
        },

        /**
         * @inheritdoc
         */
        initialize: function (config) {
            _.bindAll(this, 'onClick', 'onInit', 'catchError', 'beforeCreateOrder', 'afterCreateOrder');
            config.uid = utils.uniqueid();
            this._super();
            this.initSmartButtons();
            quote.totals.subscribe(function (totals) {
                this.grandTotalAmount(totals['base_grand_total']);
            }.bind(this));

            return this;
        },

        /**
         * Initialize observables
         *
         * @returns {Component} Chainable.
         */
        initObservable: function () {
            this._super().observe('grandTotalAmount isAvailable isButtonRendered');
            this.grandTotalAmount(quote.totals()['base_grand_total']);

            return this;
        },

        /**
         * Create instance of smart buttons.
         */
        initSmartButtons: function () {
            this.buttons = new SmartButtons({
                sdkNamespace: this.sdkNamespace,
                fundingSource: this.fundingSource,
                scriptParams: window.checkoutConfig.payment[this.getCode()].sdkParams,
                createOrderUrl: window.checkoutConfig.payment[this.getCode()].createOrderUrl,
                styles: window.checkoutConfig.payment[this.getCode()].buttonStyles,
                onInit: this.onInit,
                onClick: this.onClick,
                beforeCreateOrder: this.beforeCreateOrder,
                afterCreateOrder: this.afterCreateOrder,
                catchCreateOrder: this.catchError,
                onApprove: function () {
                    this.placeOrder();
                }.bind(this),
                onError: this.catchError
            });
        },

        /**
         * Get method code
         *
         * @return {String}
         */
        getCode: function () {
            return 'payment_services_paypal_apple_pay';
        },

        /**
         * Get method data
         *
         * @return {Object}
         */
        getData: function () {
            return {
                'method': this.item.method,
                'additional_data': {
                    'payments_order_id': this.paymentsOrderId,
                    'paypal_order_id': this.paypalOrderId,
                    'payment_source': this.fundingSource
                }
            };
        },

        /**
         * Render buttons
         */
        afterRender: function () {
            this.buttons.sdkLoaded.then(function () {
                this.buttons.render('#' + this.buttonContainerId);
                this.isAvailable(!!this.buttons.instance && this.buttons.instance.isEligible());
            }.bind(this)).catch(function () {
                this.isAvailable(false);

                return this.buttons;
            }.bind(this)).finally(function () {
                this.isButtonRendered(true);
            }.bind(this));
        },

        /**
         * Enable/disable buttons.
         *
         * @param {Object} data
         * @param {Object} actions
         */
        onInit: function (data, actions) {
            if (!this.isPlaceOrderActionAllowed()) {
                actions.disable();
            }

            this.isPlaceOrderActionAllowed.subscribe(function (isAllowed) {
                if (isAllowed) {
                    actions.enable();
                } else {
                    actions.disable();
                }
            });
        },

        /**
         * Validate form onClick
         *
         * @param {Object} data
         * @param {Object} actions
         * @return {*}
         */
        onClick: function (data, actions) {
            if (this.validate() && additionalValidators.validate()) {
                return actions.resolve();
            }

            return actions.reject();
        },

        /**
         * Before order created.
         *
         * @return {Promise}
         */
        beforeCreateOrder: function () {
            return new Promise(function (resolve, reject) {
                setBillingAddressAction(globalMessageList).done(resolve.bind(null, null)).fail(reject);
            });
        },

        /**
         * After order created.
         *
         * @param {Object} data
         * @return {String}
         */
        afterCreateOrder: function (data) {
            if (data.response['paypal-order'] && data.response['paypal-order']['mp_order_id']) {
                this.paymentsOrderId = data.response['paypal-order']['mp_order_id'];
                this.paypalOrderId = data.response['paypal-order'].id;

                return this.paypalOrderId;
            }

            throw new Error();
        },

        /**
         * Catch error.
         *
         * @param {Error} error
         */
        catchError: function (error) {
            this.messageContainer.addErrorMessage({
                message: this.requestProcessingError
            });
            console.log('Error: ', error.message);
        }

    });
});
