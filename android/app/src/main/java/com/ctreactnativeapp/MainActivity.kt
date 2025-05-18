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
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        
        // Handle CleverTap push notification clicks
        intent?.let { 
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                CleverTapAPI.getDefaultInstance(applicationContext)?.pushNotificationClickedEvent(it.extras)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Handle initial intent if needed
        intent?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                CleverTapAPI.getDefaultInstance(applicationContext)?.pushNotificationClickedEvent(it.extras)
            }
        }
    }
}