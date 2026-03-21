type HexColor = `#${string}`;

export type BrandColor = HexColor | { light: HexColor; dark: HexColor };

export type AppConfig = {
  name: string;
  slug: string;
  bundleId: string;
  description: string;
  albumName: string;

  theme: {
    brand: {
      primary: BrandColor;
      onPrimary: BrandColor;
      accent: BrandColor;
      onAccent: BrandColor;
    };
    system: Record<
      | "background"
      | "secondaryBackground"
      | "text"
      | "secondaryText"
      | "separator"
      | "link",
      "native" | HexColor
    >;
  };

  ai: {
    imageModel: string;
    textModel: string;
  };

  features: {
    payments: boolean;
    onboarding: boolean;
  };

  i18n: {
    enabled: boolean;
    defaultLanguage: "device" | (string & {});
    fallbackLanguage: string;
    supportedLanguages: readonly string[];
  };

  links: {
    privacyPolicy: string;
    termsOfService: string;
    support: string;
  };
};
