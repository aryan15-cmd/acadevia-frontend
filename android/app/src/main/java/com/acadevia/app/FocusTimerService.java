package com.acadevia.app;

import android.app.*;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.*;
import android.view.*;
import android.widget.TextView;
import android.provider.Settings;
import android.util.Log;

public class FocusTimerService extends Service {

    private Handler handler = new Handler(Looper.getMainLooper());
    private int seconds = 0;

    private WindowManager windowManager;
    private TextView timerView;

    private final String TAG = "TIMER_DEBUG";

    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            seconds++;

            int mins = seconds / 60;
            int secs = seconds % 60;

            String time = String.format("%02d:%02d", mins, secs);

            if (timerView != null) {
                timerView.setText(time);
            }

            handler.postDelayed(this, 1000);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();

        Log.d(TAG, "Service Started ✅");

        try {
            startForeground(1, createNotification());
            showFloatingTimer();
            handler.post(runnable);
        } catch (Exception e) {
            Log.e(TAG, "Service crash prevented: " + e.getMessage());
            stopSelf();
        }
    }

    private void showFloatingTimer() {

        // 🔥 CHECK OVERLAY PERMISSION
        if (!Settings.canDrawOverlays(this)) {
            Log.e(TAG, "Overlay permission NOT granted ❌");

            // STOP SERVICE IF NO PERMISSION
            stopSelf();
            return;
        }

        try {
            timerView = new TextView(this);
            timerView.setText("00:00");
            timerView.setTextSize(18);
            timerView.setTextColor(0xFFFFFFFF);
            timerView.setBackgroundColor(0x88000000);
            timerView.setPadding(30, 15, 30, 15);

            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );

            params.gravity = Gravity.TOP | Gravity.END;
            params.x = 30;
            params.y = 100;

            windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

            windowManager.addView(timerView, params);

            Log.d(TAG, "Floating timer added ✅");

        } catch (Exception e) {
            Log.e(TAG, "Error adding overlay: " + e.getMessage());
            stopSelf();
        }
    }

    private Notification createNotification() {

    String channelId = "focus_timer";

    NotificationChannel channel = new NotificationChannel(
            channelId,
            "Focus Timer",
            NotificationManager.IMPORTANCE_LOW
    );

    NotificationManager manager = getSystemService(NotificationManager.class);
    manager.createNotificationChannel(channel);

    return new Notification.Builder(this, channelId)
            .setContentTitle("Focus Mode Running ⏱️")
            .setContentText("Stay focused!")
            .setSmallIcon(android.R.drawable.ic_dialog_info) // ✅ safer icon
            .setOngoing(true) // 🔥 IMPORTANT
            .build();
}

    @Override
    public void onDestroy() {
        super.onDestroy();

        if (handler != null) {
            handler.removeCallbacks(runnable);
        }

        if (windowManager != null && timerView != null) {
            try {
                windowManager.removeView(timerView);
            } catch (Exception e) {
                Log.e(TAG, "Error removing view: " + e.getMessage());
            }
        }

        Log.d(TAG, "Service Destroyed ❌");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}