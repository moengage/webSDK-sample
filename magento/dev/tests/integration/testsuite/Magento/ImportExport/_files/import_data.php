<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

$bunches = [
    0 => [
        'entity' => 'customer',
        'behavior' => 'v2_update',
        'data' => [
            0 => [
                'email' => 'AnthonyANealy@magento.com',
                '_website' => 'base',
                '_store' => 'admin',
                'confirmation' => null,
                'created_at' => '05-06-12 15:53',
                'created_in' => 'Admin',
                'default_billing' => '1',
                'default_shipping' => '1',
                'disable_auto_group_change' => '0',
                'dob' => '13-06-1984',
                'firstname' => 'Anthony',
                'gender' => 'Male',
                'group_id' => '1',
                'lastname' => 'Nealy',
                'middlename' => 'A.',
                'password_hash' => '',
                'prefix' => null,
                'reward_update_notification' => '1',
                'reward_warning_notification' => '1',
                'rp_token' => null,
                'rp_token_created_at' => null,
                'store_id' => '0',
                'suffix' => null,
                'taxvat' => null,
                'website_id' => '1',
                'password' => null,
            ],
            1 => [
                'email' => 'LoriBBanks@magento.com',
                '_website' => 'admin',
                '_store' => 'admin',
                'confirmation' => null,
                'created_at' => '05-06-12 15:59',
                'created_in' => 'Admin',
                'default_billing' => '3',
                'default_shipping' => '3',
                'disable_auto_group_change' => '0',
                'dob' => '13-06-1984',
                'firstname' => 'Lori',
                'gender' => 'Female',
                'group_id' => '1',
                'lastname' => 'Banks',
                'middlename' => 'R.',
                'password_hash' => '',
                'prefix' => null,
                'reward_update_notification' => '1',
                'reward_warning_notification' => '1',
                'rp_token' => null,
                'rp_token_created_at' => null,
                'store_id' => '0',
                'suffix' => null,
                'taxvat' => null,
                'website_id' => '0',
                'password' => null,
            ],
        ],
    ],
    1 => [
        'entity' => 'customer',
        'behavior' => 'v2_update',
        'data' => [
            0 => [
                'email' => 'BetsyHParker@magento.com',
                '_website' => 'base',
                '_store' => 'admin',
                'confirmation' => null,
                'created_at' => '05-06-12 16:13',
                'created_in' => 'Admin',
                'default_billing' => '4',
                'default_shipping' => '4',
                'disable_auto_group_change' => '0',
                'dob' => null,
                'firstname' => 'Betsy',
                'gender' => 'Female',
                'group_id' => '1',
                'lastname' => 'Parker',
                'middlename' => 'H.',
                'password_hash' => '',
                'prefix' => null,
                'reward_update_notification' => '1',
                'reward_warning_notification' => '1',
                'rp_token' => null,
                'rp_token_created_at' => null,
                'store_id' => '0',
                'suffix' => null,
                'taxvat' => null,
                'website_id' => '2',
                'password' => null,
            ],
        ],
    ],
];

$importDataResource = \Magento\TestFramework\Helper\Bootstrap::getObjectManager()->create(
    \Magento\ImportExport\Model\ResourceModel\Import\Data::class
);

foreach ($bunches as $bunch) {
    $importDataResource->saveBunch($bunch['entity'], $bunch['behavior'], $bunch['data']);
}

/** @var $objectManager \Magento\TestFramework\ObjectManager */
$objectManager = \Magento\TestFramework\Helper\Bootstrap::getObjectManager();
$objectManager->get(\Magento\Framework\Registry::class)->unregister('_fixture/Magento_ImportExport_Import_Data');
$objectManager->get(
    \Magento\Framework\Registry::class
)->register('_fixture/Magento_ImportExport_Import_Data', $bunches);
