import { CreateGroupForm, Group } from '../types/group.types';

const defaultGroupFormValues: CreateGroupForm = {
  archived: false,
  description: '',
  meetingHour: '',
  meetingPlace: '',
  name: '',
  private: false,
  public: false,
  shortName: '',
  slug: '',
  summary: '',
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
    description: group.description,
    label: -1,
    meetingHour: group.meetingHour,
    meetingPlace: group.meetingPlace,
    name: group.name,
    private: group.private,
    public: group.public,
    shortName: group.shortName,
    slug: group.slug,
    summary: group.summary,
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
    saveHistoryRecord: true,
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
