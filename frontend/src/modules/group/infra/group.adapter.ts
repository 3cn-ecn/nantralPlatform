import { adaptUserPreview } from '#modules/account/infra/user.adapter';
import { convertShortMembershipForm } from '#modules/group/infra/membership.converter';
import { adaptSocialLink } from '#modules/social_link/infra/socialLink.adapter';

import {
  CreateGroupForm,
  Group,
  GroupPreview,
  MapGroupPreview,
  MapGroupSearch,
} from '../types/group.types';
import {
  CreateGroupFormDTO,
  GroupDTO,
  GroupPreviewDTO,
  MapGroupPreviewDTO,
  MapGroupSearchDTO,
} from './group.dto';
import { adaptGroupThematic } from './groupThematic.adapter';
import { adaptGroupTypePreview } from './groupType.adapter';

export function adaptGroupPreview(groupDTO: GroupPreviewDTO): GroupPreview {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    shortName: groupDTO.short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
    icon: groupDTO.icon,
    category: groupDTO.category,
    subCategory: groupDTO?.sub_category,
    thematic: groupDTO.thematic && adaptGroupThematic(groupDTO.thematic),
  };
}

export function adaptMapGroupPreview(
  groupDTO: MapGroupPreviewDTO,
): MapGroupPreview {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    shortName: groupDTO.short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
    icon: groupDTO.icon,
    category: groupDTO.category,
    subCategory: groupDTO?.sub_category,
    address: groupDTO.address,
    latitude: groupDTO.latitude,
    longitude: groupDTO.longitude,
    summary: groupDTO.summary,
    banner: groupDTO.banner,
    thematic:
      groupDTO.thematic &&
      (groupDTO.thematic != null
        ? adaptGroupThematic(groupDTO.thematic)
        : null),
    members: groupDTO.members.map((userDTO) => adaptUserPreview(userDTO)),
  };
}

export function adaptGroup(groupDTO: GroupDTO): Group {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    shortName: groupDTO.short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
    icon: groupDTO.icon,
    groupType: adaptGroupTypePreview(groupDTO.group_type),
    parent: groupDTO.parent && adaptGroupPreview(groupDTO.parent),
    thematic:
      groupDTO.thematic &&
      (groupDTO.thematic != null
        ? adaptGroupThematic(groupDTO.thematic)
        : null),
    creationYear: groupDTO.creation_year,
    archived: groupDTO.archived,
    private: groupDTO.private,
    public: groupDTO.public,
    summary: groupDTO.summary,
    frenchSummary: groupDTO.summary_fr,
    englishSummary: groupDTO.summary_en,
    description: groupDTO.description,
    frenchDescription: groupDTO.description_fr,
    englishDescription: groupDTO.description_en,
    meetingPlace: groupDTO.meeting_place,
    meetingHour: groupDTO.meeting_hour,
    banner: groupDTO.banner,
    video1: groupDTO.video1,
    video2: groupDTO.video2,
    isAdmin: groupDTO.is_admin,
    isSubscribed: groupDTO.is_subscribed,
    isMember: groupDTO.is_member,
    lockMemberships: groupDTO.lock_memberships,
    category: groupDTO.category,
    subCategory: groupDTO?.sub_category,
    socialLinks: groupDTO.social_links.map((social_link) =>
      adaptSocialLink(social_link),
    ),
    address: groupDTO.address,
    latitude: groupDTO.latitude,
    longitude: groupDTO.longitude,
  };
}

export function adaptGroupForm(groupForm: CreateGroupForm): CreateGroupFormDTO {
  return {
    archived: groupForm.archived,
    banner: groupForm.banner,
    description_fr: groupForm.frenchDescription,
    description_en: groupForm.englishDescription,
    icon: groupForm.icon,
    meeting_hour: groupForm.meetingHour,
    meeting_place: groupForm.meetingPlace,
    name: groupForm.name,
    private: groupForm.private,
    public: groupForm.public,
    short_name: groupForm.shortName,
    slug: groupForm.slug,
    summary_fr: groupForm.frenchSummary,
    summary_en: groupForm.englishSummary,
    tags: groupForm.tags,
    video1: groupForm.video1,
    video2: groupForm.video2,
    children_label: groupForm.childrenLabel,
    creation_year: groupForm.creationYear,
    label: (groupForm.label >= 0 && groupForm.label) || null,
    parent: groupForm.parent,
    thematic: (groupForm.thematic && groupForm.thematic.id) || null,
    lock_memberships: groupForm.lockMemberships,
    address: groupForm.address,
    latitude: groupForm.latitude,
    longitude: groupForm.longitude,
    _change_reason: groupForm.changeReason,
    membership:
      groupForm.membership && convertShortMembershipForm(groupForm.membership),
  };
}

export function adaptMapGroupSearch(
  groupSearchDTO: MapGroupSearchDTO,
): MapGroupSearch {
  return {
    id: groupSearchDTO.id,
    name: groupSearchDTO.name,
    icon: groupSearchDTO.icon,
  };
}
