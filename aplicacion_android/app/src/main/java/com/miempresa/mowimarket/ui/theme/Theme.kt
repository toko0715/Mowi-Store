package com.miempresa.mowimarket.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = OrangePrimary,
    secondary = OrangeAccent,
    tertiary = CoralPink,
    background = Color(0xFF1C1C1C),
    surface = Color(0xFF2C2C2C),
    onPrimary = TextOnOrange,
    onSecondary = TextOnOrange,
    onBackground = Color(0xFFE5E5E5),
    onSurface = Color(0xFFE5E5E5),
    error = ErrorRed
)

private val LightColorScheme = lightColorScheme(
    primary = OrangePrimary,
    onPrimary = TextOnOrange,
    primaryContainer = OrangeLight,
    onPrimaryContainer = TextPrimary,

    secondary = OrangeAccent,
    onSecondary = TextPrimary,
    secondaryContainer = Color(0xFFFFE0B2),
    onSecondaryContainer = TextPrimary,

    tertiary = CoralPink,
    onTertiary = TextOnOrange,

    background = BackgroundLight,
    onBackground = TextPrimary,

    surface = SurfaceWhite,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceElevated,
    onSurfaceVariant = TextSecondary,

    outline = Color(0xFFDDDDDD),
    outlineVariant = WarmGray,

    error = ErrorRed,
    onError = TextOnOrange,
    errorContainer = Color(0xFFFFDAD6),
    onErrorContainer = Color(0xFF93000A)
)

@Composable
fun MowiMarketTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color desactivado para mantener tema naranja MOWI
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
