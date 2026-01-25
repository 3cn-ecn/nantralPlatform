import { CreateGroupForm, Group } from '../types/group.types';

const defaultGroupFormValues: CreateGroupForm = {
  archived: false,
  frenchDescription: '',
  englishDescription: '',
  meetingHour: '',
  meetingPlace: '',
  frenchName: '',
  englishName: '',
  private: false,
  public: false,
  thematic: null,
  frenchShortName: '',
  englishShortName: '',
  slug: '',
  frenchSummary: '',
  englishSummary: '',
  tags: [],
  video1: '',
  video2: '',
  childrenLabel: 'Sous groupes',
  creationYear: new Date().getFullYear(),
  label: -1,
  lockMemberships: false,
  address: '',
  latitude: 0,
  longitude: 0,
};

function convertToForm(group: Group): CreateGroupForm {
  return {
    archived: group.archived,
    frenchDescription: group.frenchDescription,
    englishDescription: group.englishDescription,
    label: -1,
    meetingHour: group.meetingHour,
    meetingPlace: group.meetingPlace,
    frenchName: group.frenchName,
    englishName: group.englishName,
    private: group.private,
    public: group.public,
    frenchShortName: group.frenchShortName,
    englishShortName: group.englishShortName,
    slug: group.slug,
    frenchSummary: group.frenchSummary,
    englishSummary: group.englishSummary,
    tags: [],
    video1: group.video1,
    video2: group.video2,
    banner: undefined,
    icon: undefined,
    childrenLabel: 'Sous-Groupes',
    creationYear: group.creationYear,
    lockMemberships: group.lockMemberships,
    address: group.address,
    latitude: group.latitude,
    longitude: group.longitude,
    thematic: group.thematic,
  };
}

export function useGroupFormValues({
  group,
  parent,
}: {
  group?: Group;
  parent?: Group;
}) {
  const form = group ? convertToForm(group) : defaultGroupFormValues;
  if (parent) {
    form.parent = parent.id;
  }
  return form;
}
