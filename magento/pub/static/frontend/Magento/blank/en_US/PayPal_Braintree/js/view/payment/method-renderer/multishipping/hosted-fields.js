/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/*browser:true*/

define([
    'jquery',
    'PayPal_Braintree/js/view/payment/method-renderer/hosted-fields',
    'PayPal_Braintree/js/validator',
    'Magento_Ui/js/model/messageList',
    'mage/translate',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/set-payment-information',
    'Magento_Checkout/js/model/payment/additional-validators',
    'PayPal_Braintree/js/view/payment/adapter'
], function (
    $,
    Component,
    validator,
    messageList,
    $t,
    fullScreenLoader,
    setPaymentInformationAction,
    additionalValidators,
    braintree
) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'PayPal_Braintree/payment/multishipping/form'
        },

        /**
         * Get list of available CC types
         *
         * @returns {Object}
         */
        getCcAvailableTypes: function () {
            let availableTypes = validator.getAvailableCardTypes(),
                billingCountryId;

            billingCountryId = $('#multishipping_billing_country_id').val();

            if (billingCountryId && validator.getCountrySpecificCardTypes(billingCountryId)) {
                return validator.collectTypes(
                    availableTypes, validator.getCountrySpecificCardTypes(billingCountryId)
                );
            }

            return availableTypes;
        },

        /**
         * @override
         */
        handleNonce: function (payload) {
            let self = this;

            this.setPaymentMethodNonce(payload.nonce);
            this.setCreditCardBin(payload.details.bin);

            // place order on success validation
            self.validatorManager.validate(self, function () {
                return self.setPaymentInformation();
            }, function () {
                self.isProcessing = false;
                self.paymentMethodNonce = null;
                self.creditCardBin = null;
            });
        },

        /**
         * @override
         */
        placeOrder: function () {
            if (this.isProcessing) {
                return false;
            }
            this.isProcessing = true;


            braintree.tokenizeHostedFields();
            return false;
        },

        /**
         * @override
         */
        getData: function () {
            let data = this._super();

            data['additional_data']['is_active_payment_token_enabler'] = true;

            return data;
        },

        /**
         * @override
         */
        setPaymentInformation: function () {
            if (additionalValidators.validate()) {
                fullScreenLoader.startLoader();
                $.when(
                    setPaymentInformationAction(
                        this.messageContainer,
                        this.getData()
                    )
                ).done(this.done.bind(this))
                    .fail(this.fail.bind(this));
            }
        },

        /**
         * {Function}
         */
        fail: function () {
            fullScreenLoader.stopLoader();

            return this;
        },

        /**
         * {Function}
         */
        done: function () {
            fullScreenLoader.stopLoader();
            $('#multishipping-billing-form').trigger('submit');

            return this;
        }
    });
});
