import { YesOrNo } from 'pages/projects/Home/Components/usePrototypeForm';
import * as yup from 'yup';

export const newProtoTypeSchema = yup
  .object({
    name: yup.string().required(),
    type: yup.string().oneOf(['bungalow', 'duplex', 'townhouse', 'other']).required(),
    desc: yup.string().required(),
    rooms: yup.number().min(2).required(),
    floorArea: yup.number().required(),
    defaultUnitOfMeasurement: yup.string().required(),
    facilities: yup.array(),
    images: yup.array().min(2).required()
  })
  .required();

export const protoTypeFacilitySchema = yup
  .object({
    name: yup.string().required(),
    count: yup.number().required()
  })
  .required();

export const protoTypeUsageSchema = (ownsLand: YesOrNo, landAcquisition: YesOrNo) =>
  yup
    .object({
      city: landAcquisition === 'no' ? yup.string() : yup.string().required(),
      state: landAcquisition === 'no' ? yup.string() : yup.string().required(),
      units: yup.number().required(),
      currency: yup
        .object({
          code: yup.string().required(),
          label: yup.string().required()
        })
        .required(),
      projectType: yup.string().required(),
      unitOfMeasurement: yup.string().oneOf(['Metric', 'Imperial']).required(),
      country: landAcquisition === 'no' ? yup.string() : yup.string().required(),
      //
      desiredLandSize: yup.number(),
      hasLand: yup.string().required(),
      landSize: ownsLand === 'yes' ? yup.number().required() : yup.number(),
      wantHelpWithLandAcquisition: yup.string(),
      scheduleCall: yup.mixed().required(),
      facilities: yup.array().required(),
      budget:
        ownsLand === 'yes' || landAcquisition === 'no' ? yup.number() : yup.number().required()
    })
    .required();
