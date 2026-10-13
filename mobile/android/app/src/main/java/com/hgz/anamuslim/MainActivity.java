package com.hgz.anamuslim;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen splash = SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        splash.setOnExitAnimationListener(provider -> {
            boolean reduceMotion = "true".equals(getSharedPreferences("CapacitorStorage", MODE_PRIVATE)
                .getString("am-mobile-reduce-motion", "false"));
            if (reduceMotion) provider.remove();
            else provider.getView().animate().alpha(0f).setDuration(180).withEndAction(provider::remove).start();
        });
    }
}
