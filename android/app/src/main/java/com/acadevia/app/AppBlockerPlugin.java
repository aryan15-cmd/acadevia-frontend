package com.acadevia.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppBlocker")
public class AppBlockerPlugin extends Plugin {

    @PluginMethod
    public void setBlockedApps(PluginCall call) {

        if (call.getArray("apps") == null) {
            call.reject("No apps provided");
            return;
        }

        String apps = call.getArray("apps").toString();

        SharedPreferences prefs = getContext()
            .getSharedPreferences("AppBlocker", Context.MODE_PRIVATE);

        prefs.edit().putString("blocked_apps", apps).apply();

        Log.d("BLOCKER", "Saved apps: " + apps);

        call.resolve();
    }
}