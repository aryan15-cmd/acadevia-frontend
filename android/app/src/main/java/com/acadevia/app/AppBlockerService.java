package com.acadevia.app;

import android.accessibilityservice.AccessibilityService;
import android.view.accessibility.AccessibilityEvent;
import android.content.SharedPreferences;
import android.util.Log;

import org.json.JSONArray;

public class AppBlockerService extends AccessibilityService {

    private static final String TAG = "BLOCKER";

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {

        // 🔥 Only react to app/window changes (IMPORTANT)
        if (event.getEventType() != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return;
        }

        if (event.getPackageName() == null) return;

        String currentApp = event.getPackageName().toString();

        Log.d(TAG, "Current App: " + currentApp);

        try {
            SharedPreferences prefs = getSharedPreferences("AppBlocker", MODE_PRIVATE);
            String json = prefs.getString("blocked_apps", "[]");

            JSONArray apps = new JSONArray(json);

            for (int i = 0; i < apps.length(); i++) {
                String blockedApp = apps.getString(i);

                if (blockedApp.equals(currentApp)) {

                    Log.d(TAG, "🚫 BLOCKING APP: " + currentApp);

                    // 🚀 REAL BLOCK → send user to HOME screen
                    performGlobalAction(GLOBAL_ACTION_HOME);

                    return; // stop loop immediately
                }
            }

        } catch (Exception e) {
            Log.e(TAG, "Error in blocking logic", e);
        }
    }

    @Override
    public void onInterrupt() {
        Log.d(TAG, "Service Interrupted");
    }
}