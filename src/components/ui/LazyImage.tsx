import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  ImageSourcePropType,
  LayoutChangeEvent,
  View,
  ViewStyle,
} from "react-native";

// Lazy loading strategies
export type LazyStrategy = "immediate" | "lazy" | "on-scroll" | "on-viewport";

// Placeholder types
export type PlaceholderType = "blur" | "skeleton" | "color" | "none";

interface LazyImageProps {
  source: ImageSourcePropType | string;
  style?: ViewStyle;
  contentFit?: "cover" | "contain" | "fill" | "scale-down";
  contentPosition?: string;
  strategy?: LazyStrategy;
  placeholder?: PlaceholderType;
  placeholderColor?: string;
  cachePolicy?: "memory" | "disk" | "memory-disk" | "none";
  threshold?: number; // Distance from viewport to trigger loading
  onLoad?: () => void;
  onError?: (error: any) => void;
  onLoadStart?: () => void;
  fallbackSource?: ImageSourcePropType | string;
}

interface LazyImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  shouldLoad: boolean;
  ImageComponent: any;
}

// Global viewport tracking for performance
class ViewportTracker {
  private observers = new Set<(inViewport: boolean) => void>();
  private screenHeight = Dimensions.get("window").height;

  register(callback: (inViewport: boolean) => void, threshold: number = 100) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  checkViewport(y: number, height: number, threshold: number = 100): boolean {
    const topInViewport = y < this.screenHeight + threshold;
    const bottomInViewport = y + height > -threshold;
    return topInViewport && bottomInViewport;
  }
}

const viewportTracker = new ViewportTracker();

// Cache for loaded Image components
const imageComponentCache = new Map<string, any>();

export const LazyImage = React.memo<LazyImageProps>(
  ({
    source,
    style,
    contentFit = "cover",
    contentPosition = "center",
    strategy = "lazy",
    placeholder = "blur",
    placeholderColor = "#f0f0f0",
    cachePolicy = "memory-disk",
    threshold = 100,
    onLoad,
    onError,
    onLoadStart,
    fallbackSource,
  }) => {
    const [state, setState] = useState<LazyImageState>({
      isLoading: false,
      isLoaded: false,
      hasError: false,
      shouldLoad: strategy === "immediate",
      ImageComponent: imageComponentCache.get("expo-image"),
    });

    const layoutRef = useRef<{ y: number; height: number }>({
      y: 0,
      height: 0,
    });
    const isMounted = useRef(true);

    // Load Image component dynamically
    const loadImageComponent = useCallback(async () => {
      if (imageComponentCache.has("expo-image")) {
        setState((prev) => ({
          ...prev,
          ImageComponent: imageComponentCache.get("expo-image"),
        }));
        return;
      }

      try {
        const { Image: ExpoImage } = await import("expo-image");
        imageComponentCache.set("expo-image", ExpoImage);

        if (isMounted.current) {
          setState((prev) => ({ ...prev, ImageComponent: ExpoImage }));
        }
      } catch {
        console.warn(
          "Expo Image not available, falling back to React Native Image"
        );

        try {
          const { Image: RNImage } = await import("react-native");
          imageComponentCache.set("react-native-image", RNImage);

          if (isMounted.current) {
            setState((prev) => ({ ...prev, ImageComponent: RNImage }));
          }
        } catch (fallbackError) {
          console.error("Failed to load any Image component:", fallbackError);
          if (onError) onError(fallbackError);
        }
      }
    }, [onError]);

    // Handle layout changes for viewport detection
    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        const { y, height } = event.nativeEvent.layout;
        layoutRef.current = { y, height };

        if (strategy === "on-viewport" && !state.shouldLoad) {
          const inViewport = viewportTracker.checkViewport(
            y,
            height,
            threshold
          );
          if (inViewport) {
            setState((prev) => ({ ...prev, shouldLoad: true }));
          }
        }
      },
      [strategy, threshold, state.shouldLoad]
    );

    // Initialize loading process
    const initializeLoading = useCallback(async () => {
      if (state.isLoading || state.isLoaded) return;

      setState((prev) => ({ ...prev, isLoading: true }));
      if (onLoadStart) onLoadStart();

      await loadImageComponent();
    }, [state.isLoading, state.isLoaded, loadImageComponent, onLoadStart]);

    // Handle image load success
    const handleImageLoad = useCallback(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isLoaded: true,
        hasError: false,
      }));
      if (onLoad) onLoad();
    }, [onLoad]);

    // Handle image load error
    const handleImageError = useCallback(
      (error: any) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          hasError: true,
        }));
        if (onError) onError(error);
      },
      [onError]
    );

    // Effect to handle loading based on strategy
    useEffect(() => {
      if (state.shouldLoad && !state.ImageComponent) {
        loadImageComponent();
      }
    }, [state.shouldLoad, state.ImageComponent, loadImageComponent]);

    useEffect(() => {
      if (
        state.shouldLoad &&
        state.ImageComponent &&
        !state.isLoaded &&
        !state.isLoading
      ) {
        initializeLoading();
      }
    }, [
      state.shouldLoad,
      state.ImageComponent,
      state.isLoaded,
      state.isLoading,
      initializeLoading,
    ]);

    // Strategy-specific effects
    useEffect(() => {
      let unregister: (() => void) | undefined;

      switch (strategy) {
        case "on-scroll":
          // Register for scroll-based loading
          unregister = viewportTracker.register((inViewport) => {
            if (inViewport && !state.shouldLoad) {
              setState((prev) => ({ ...prev, shouldLoad: true }));
            }
          }, threshold);
          break;

        case "lazy":
          // Delayed loading after component mount
          const timer = setTimeout(() => {
            setState((prev) => ({ ...prev, shouldLoad: true }));
          }, 100);
          return () => clearTimeout(timer);
      }

      return unregister;
    }, [strategy, threshold, state.shouldLoad]);

    // Cleanup
    useEffect(() => {
      return () => {
        isMounted.current = false;
      };
    }, []);

    // Render placeholder
    const renderPlaceholder = useMemo(() => {
      if (state.isLoaded && !state.hasError) return null;

      const placeholderStyle = [
        style,
        {
          backgroundColor: placeholderColor,
          opacity: placeholder === "none" ? 0 : state.isLoading ? 0.6 : 1,
        },
      ];

      if (placeholder === "skeleton") {
        return (
          <View style={placeholderStyle}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
          </View>
        );
      }

      return <View style={placeholderStyle} />;
    }, [
      state.isLoaded,
      state.hasError,
      state.isLoading,
      style,
      placeholderColor,
      placeholder,
    ]);

    // Render actual image
    const renderImage = useMemo(() => {
      if (
        !state.ImageComponent ||
        !state.shouldLoad ||
        (!state.isLoaded && !state.isLoading)
      ) {
        return null;
      }

      const imageSource =
        state.hasError && fallbackSource ? fallbackSource : source;
      const isExpoImage =
        imageComponentCache.has("expo-image") &&
        state.ImageComponent === imageComponentCache.get("expo-image");

      const imageProps: any = {
        source: imageSource,
        style: [style, state.isLoaded ? {} : { opacity: 0 }],
        onLoad: handleImageLoad,
        onError: handleImageError,
      };

      // Add Expo Image specific props
      if (isExpoImage) {
        imageProps.contentFit = contentFit;
        imageProps.contentPosition = contentPosition;
        imageProps.cachePolicy = cachePolicy;
        imageProps.transition = { duration: 200 };
      } else {
        // React Native Image props
        imageProps.resizeMode = contentFit;
      }

      return React.createElement(state.ImageComponent, imageProps);
    }, [
      state.ImageComponent,
      state.shouldLoad,
      state.isLoaded,
      state.isLoading,
      state.hasError,
      source,
      fallbackSource,
      style,
      contentFit,
      contentPosition,
      cachePolicy,
      handleImageLoad,
      handleImageError,
    ]);

    return (
      <View onLayout={handleLayout} style={style}>
        {renderPlaceholder}
        {renderImage}
      </View>
    );
  }
);

LazyImage.displayName = "LazyImage";
