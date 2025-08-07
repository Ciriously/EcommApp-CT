package com.ctreactnativeapp

import android.content.Intent
import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.clevertap.android.sdk.CleverTapAPI

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String = "CTReactNativeApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * This function handles new intents, such as a push notification click
   * when the app is already open.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)

    // On Android 12+, we need to manually process the notification click.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        // Use a null-safe 'let' block. This is safer than intent!! and prevents crashes.
        intent?.let {
            val cleverTapDefaultInstance = CleverTapAPI.getDefaultInstance(applicationContext)
            // 'it' refers to the non-null intent inside this block
            cleverTapDefaultInstance?.pushNotificationClickedEvent(it.extras)
        }
    }
  }
}