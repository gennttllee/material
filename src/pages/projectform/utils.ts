export interface ProjectBrief {
  projectType: string;
  commercialSpaces: { name: string; quantity: number }[];
  buildingType: string;
  units: string;
  bedrooms: string;
  livingrooms: string;
  diningrooms: string;
  bathrooms: string;
  kitchens: string;
  stores: string;
  others: string[];
  measurements: string;
  projectDrawing: string;
  mechanicalDrawing: string;
  structuralDrawing: string;
  landLocation: {
    [key: string]: string;
  };
  needHelpWithLand: string;
  landBudget: string;
  preferredLocation: {
    [key: string]: string;
  };
  currency: {
    code: string;
    label: string;
  };
  preferredLandSize: string;
  isLandAcquired: string;
  projectLocation: {
    [key: string]: string;
  };
}

const formToSchema = (form: ProjectBrief) => {
  let isCommercial = form.projectType === 'commercial';
  let tobeReturned = {
    commercialType: !isCommercial ? '' : form.buildingType,
    commercialSpaces: form.commercialSpaces.map((m) => ({ name: m.name, value: m.quantity })),
    projectType: form.projectType,
    residentialType: isCommercial ? '' : form.buildingType,
    projectLocation: form.projectLocation,
    numberOfUnits: form.units,
    numberOfBedrooms: isCommercial ? undefined : form.bedrooms,
    numberOfLivingRooms: isCommercial ? undefined : form.livingrooms,
    numberOfDiningRooms: isCommercial ? undefined : form.diningrooms,
    numberOfToilets: isCommercial ? undefined : form.bathrooms,
    numberOfKitchens: isCommercial ? undefined : form.kitchens,
    numberOfStorage: isCommercial ? undefined : form.stores,
    numberOfBaths: isCommercial ? undefined : form.bathrooms,
    otherSpaces: form.others,

    defaultUnitOfMeasurement: form.measurements === 'ft' ? 'Imperial' : 'Metric',
    documents: {
      areThereAnyStructuralDocs: form.structuralDrawing === 'Yes' ? true : false,
      areThereAnyMechAndElcDocs: form.mechanicalDrawing === 'Yes' ? true : false,
      areThereAnyArchitectureDocs: form.projectDrawing === 'Yes' ? true : false
    },
    land: {
      isLandAcquired: form.isLandAcquired === 'Yes' ? true : false,
      location: form.landLocation?.country ? form.landLocation : undefined,
      landAcquisition: {
        location: form.preferredLocation?.country ? form.preferredLocation : undefined,
        isLandAgentHelpNeeded: form.needHelpWithLand === 'Yes' ? true : false,
        sizeTo: {
          from: parseInt(form.preferredLandSize.split('-')[0]),
          to: parseInt(form.preferredLandSize.split('-')[1])
        },
        budget: {
          from: parseInt(form.landBudget.split('-')[0]),
          to: parseInt(form.landBudget.split('-')[1])
        }
      }
    },
    currency: form.currency
  };

  return removeemptyFields(tobeReturned);
};

const handleCurrentMilestone = (current: number, milestones: any, setMileStones: any) => {
  if (current >= 0 && current < 13) {
    let temp = milestones.slice();
    temp[0] = { ...temp[0], status: 'ongoing' };
    setMileStones(() => temp);
  } else if (current >= 13 && current < 16) {
    let temp = milestones.slice();
    temp[1] = { ...temp[1], status: 'ongoing' };
    setMileStones(() => temp);
  } else if (current >= 16 && current < 22) {
    let temp = milestones.slice();
    temp[2] = { ...temp[2], status: 'ongoing' };
    setMileStones(() => temp);
  } else {
    let temp = milestones.slice();
    temp[3] = { ...temp[3], status: 'ongoing' };
    setMileStones(() => temp);
  }
};

type MileStone = {
  status: string;
  title: string;
};
const resetOnging = (milestones: MileStone[]) => {
  let milestone = milestones.slice();
  for (let i = 0; i < milestone.length; i++) {
    if (milestone[i].status === 'ongoing') {
      milestone[i].status = 'Not-Started';
    }
  }
  return milestone;
};

const handleCompletion = (ProjectBrief: any, milestones: any, setMileStones: any) => {
  let temp = resetOnging(milestones.slice());
  if (ProjectBrief.projectType !== '' && ProjectBrief.measurements !== '') {
    temp[0].status = 'completed';
  }

  if (ProjectBrief.projectDrawing !== '' && ProjectBrief.structuralDrawing !== '') {
    temp[1].status = 'completed';
  }
  if (ProjectBrief.isLandAcquired === 'Yes' && ProjectBrief.landlocation !== 'No') {
    temp[2].status = 'completed';
  } else if (ProjectBrief.isLandAcquired === 'No' && ProjectBrief.needHelpWithLand === 'No') {
    temp[2].status = 'completed';
  } else if (ProjectBrief.isLandAcquired === 'No' && ProjectBrief.needHelpWithLand === 'Yes') {
    let range = ProjectBrief.landBudget.split('-');
    if (range[1] !== '' && range[0] !== '') {
      temp[2].status = 'completed';
    }
  }
  setMileStones(() => temp);
};

const removeemptyFields = (obj: any) => {
  for (let i in obj) {
    if (typeof obj[i] === 'object') {
      removeemptyFields(obj[i]);
    } else {
      if (obj[i] === '' || obj[i] === 0 || obj[i] === undefined) {
        delete obj[i];
      }
    }
  }
  return obj;
};

let purge = (obj: any) => {
  let temp = obj.land;
  if (temp.isLandAcquired === true) {
    delete temp.landAcquisition;
  } else if (
    temp.isLandAcquired === false &&
    temp.landAcquisition.isLandAgentHelpNeeded === false
  ) {
    delete temp.landAcquisition.budget;
    delete temp.landAcquisition.sizeTo;
  }

  obj.land = temp;
  return obj;
};

export {
  resetOnging,
  formToSchema,
  handleCurrentMilestone,
  handleCompletion,
  purge,
  removeemptyFields
};
