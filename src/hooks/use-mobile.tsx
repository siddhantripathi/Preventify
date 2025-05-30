import * as React from "react"

export type DeviceType = "mobile" | "tablet" | "desktop" | "large";

const BREAKPOINTS = {
  mobile: 640,  // sm
  tablet: 768,  // md
  desktop: 1024, // lg
  large: 1280   // xl
};

export function useDevice() {
  const [deviceType, setDeviceType] = React.useState<DeviceType | undefined>(undefined);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setDeviceType("mobile");
      } else if (width < BREAKPOINTS.tablet) {
        setDeviceType("tablet");
      } else if (width < BREAKPOINTS.desktop) {
        setDeviceType("desktop");
      } else {
        setDeviceType("large");
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop" || deviceType === "large",
    isLarge: deviceType === "large"
  };
}

// Keep backward compatibility
export function useIsMobile() {
  const { isMobile } = useDevice();
  return !!isMobile;
}
