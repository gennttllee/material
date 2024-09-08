/// <reference types="react-scripts" />
export interface Country {
  name: CountryName;
  flag: string;
  cca2: string;
}

export interface CountryName {
  common: string;
  official: string;
  nativeName: { [key: string]: NativeName };
}

export interface NativeName {
  official: string;
  common: string;
}

export interface Facilities {
  name: string;
  number: number;
}

export interface prototypeImage {
  key: string;
  meta: object;
}

export interface Prototype {
  _id: string;
  projectName: string;
  projectType: string;
  overview: string;
  units: number;
  numberOfRooms: number;
  description: string;
  numberOfBedRooms: number;
  numberOfLivingRooms: number;
  numberOfDiningRooms: number;
  numberOfToilets: number;
  numberOfKitchens: number;
  numberOfStorage: number;
  unitOfMeasurement: 'Metric' | 'Imperial';
  floorArea: number;
  otherSpaces: Facilities[];
  prototypeImages: prototypeImage[];
  owner: string;
}
