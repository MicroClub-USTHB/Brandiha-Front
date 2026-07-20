/**
 * Graffiti paint-splash used as the cursor itself. Artwork sourced from the
 * design team's splash.svg; the raw hex fill/stroke are swapped for theme
 * tokens. On the default theme the fill is the 4-stop brand gradient (via the
 * --grad-* stops); every stop falls back to --primary, so other themes render
 * a solid splash. Centred on the pointer via `.graffiti-cursor__splash`.
 */
export function CursorSplash() {
  return (
    <svg
      width="36"
      height="44"
      viewBox="0 0 3322 4042"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="graffiti-splash-gradient" x1="0" y1="0" x2="1" y2="0.06">
          <stop offset="11.07%" stopColor="var(--grad-1, var(--primary))" />
          <stop offset="31.47%" stopColor="var(--grad-2, var(--primary))" />
          <stop offset="68.11%" stopColor="var(--grad-3, var(--primary))" />
          <stop offset="84.94%" stopColor="var(--grad-4, var(--primary))" />
        </linearGradient>
      </defs>
      <path
        d="M2696.34 1906.32C2814.64 1906.32 3102.43 1834.54 3271.06 1789.58C3294.96 1783.21 3310.19 1815.94 3289.8 1829.96L2791.44 2172.58C2791.44 2172.58 2563.21 2381.79 2696.34 2667.07C2829.48 2952.34 3381.02 2800.2 3304.94 3085.47C3228.86 3370.75 2696.34 2724.12 2449.1 2952.34C2201.86 3180.57 2696.34 4109.33 2449.1 3846.22C2204.55 3585.96 2049.72 3142.53 1802.47 3199.59C1682.59 3227.25 1663.34 3395.84 1612.29 3541.92C1579.06 3637.01 1472.81 3828.35 1365.05 3789.16C1155.84 3713.09 1441.12 3199.59 1441.12 3199.59C1441.12 3199.59 1517.2 2838.23 1155.84 3009.4C794.487 3180.57 338.043 4283.65 52.7646 3979.35C-232.514 3675.05 1022.71 2952.35 927.62 2800.2C832.526 2648.05 604.304 2705.1 604.304 2705.1C604.304 2705.1 832.526 2648.05 775.47 2438.84C718.414 2229.64 -61.3475 2267.68 14.7282 2001.42C90.804 1735.16 737.433 2286.7 851.544 2096.51C965.656 1906.32 851.544 1697.12 851.544 1697.12C851.544 1697.12 1079.77 1925.34 1231.92 1849.27C1384.06 1773.19 1460.14 1659.08 1460.14 1411.84C1460.14 1164.6 946.637 137.597 1231.92 23.4856C1517.19 -90.6256 1489.8 518.647 1593.27 955.396C1737.45 1563.99 1897.57 1640.06 1897.57 1640.06C1897.57 1640.06 2125.79 1811.23 2239.9 1544.97C2354.01 1278.71 2430.08 955.395 2582.23 1050.49C2734.38 1145.58 2373.03 1659.08 2392.05 1754.18C2411.07 1849.27 2487.14 1906.32 2696.34 1906.32Z"
        fill="url(#graffiti-splash-gradient)"
        stroke="var(--foreground)"
        strokeWidth="19.0186"
      />
    </svg>
  );
}
