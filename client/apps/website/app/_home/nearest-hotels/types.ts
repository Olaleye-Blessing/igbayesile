export interface IGeoLocation {
  city: {
    name: string;
    names: {
      en: string;
    };
  };
  country: {
    names: {
      en: string;
    };
  };
  subdivisions: [
    {
      names: {
        en: string;
      };
    },
  ];
  state: {
    name: string;
  };
}
