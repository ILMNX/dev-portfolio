import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkLightMode() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle dark/light mode"
            className="transition-colors duration-300 flex items-center gap-2 px-4 py-2 rounded-full shadow-md bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 hover:from-blue-200 hover:to-blue-400 dark:hover:from-blue-900 dark:hover:to-blue-700 border border-gray-300 dark:border-gray-700"
        >
            <span className="text-lg">
                {isDark ? (
                    // Moon icon
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path
                            d="M21 12.79A9 9 0 0112.21 3a1 1 0 00-.98 1.22A7 7 0 1019.78 13a1 1 0 001.22-.98z"
                            fill="currentColor"
                        />
                    </svg>
                ) : (
                    // Sun icon
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5" fill="currentColor" />
                        <g stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </g>
                    </svg>
                )}
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-200">
                {isDark ? "Dark" : "Light"} Mode
            </span>
        </button>
    );
}