# Running the Sample App

## LG Developer Setup

Make sure you have the [webOS TV SDK CLI](https://webostv.developer.lge.com/develop/tools/cli-installation) installed.

Follow the steps [here](https://webostv.developer.lge.com/develop/getting-started/preparing-lg-account) to create an LG Developer account, enable Developer Mode on your LG TV, and connect your computer to the TV.


## Packaging and Installing the App

Build the app from the root directory of the repo:

```shell
$ ares-package .
```

You should now see a file call `com.moengage.websdk.test_0.0.1_all.ipk` in the root directory.

Install the app to your TV/emulator:

```shell
$ ares-install --device $DEVICE_NAME ./com.moengage.websdk.test_0.0.1_all.ipk
```

The sample app should now be visible in your TV's app drawer.

## Debugging the App

To debug the sample app, run the following command:

```shell
$ ares-inspect --device $DEVICE_NAME --app com.moengage.websdk.test --open
```

This command runs the app on your TV/emulator and opens a tab with a Chrome DevTools instance that's connected to the app. In the console, you should see logs being received by the SDK.

You can check all the CLI commands [here](https://webostv.developer.lge.com/develop/tools/cli-dev-guide#launch-the-web-app)
