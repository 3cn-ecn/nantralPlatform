import { CreateGroupForm, Group } from '../types/group.types';

const defaultGroupFormValues: CreateGroupForm = {
  archived: false,
  frenchDescription: '',
  englishDescription: '',
  meetingHour: '',
  meetingPlace: '',
  name: '',
  shortName: '',
  private: false,
  public: false,
  thematic: null,
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
  // required by CreateGroupForm type
  banner: undefined,
  icon: undefined,
  changeReason: undefined,
  membership: undefined,
};

function convertToForm(group: Group): CreateGroupForm {
  return {
    archived: Boolean(group.archived),
    frenchDescription: group.frenchDescription ?? '',
    englishDescription: group.englishDescription ?? '',
    label: -1,
    meetingHour: group.meetingHour ?? '',
    meetingPlace: group.meetingPlace ?? '',
    name: group.name ?? '',
    shortName: group.shortName ?? '',
    private: Boolean(group.private),
    public: Boolean(group.public),
    slug: group.slug ?? '',
    frenchSummary: group.frenchSummary ?? '',
    englishSummary: group.englishSummary ?? '',
    tags: [],
    video1: group.video1 ?? '',
    video2: group.video2 ?? '',
    banner: undefined,
    icon: undefined,
    childrenLabel: 'Sous-Groupes',
    creationYear: group.creationYear ?? new Date().getFullYear(),
    lockMemberships: Boolean(group.lockMemberships),
    address: group.address ?? '',
    latitude: group.latitude ?? 0,
    longitude: group.longitude ?? 0,
    thematic: group.thematic ?? null,
    changeReason: undefined,
    membership: undefined,
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
