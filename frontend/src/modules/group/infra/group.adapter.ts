import { convertShortMembershipForm } from '#modules/group/infra/membership.converter';
import { adaptSocialLink } from '#modules/social_link/infra/socialLink.adapter';
import { adaptStudentPreview } from '#modules/student/infra/student.adapter';

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
import {
  adaptGroupThematic,
  adaptGroupThematicDTO,
} from './groupThematic.adapter';
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
    members: groupDTO.members.map((studentDTO) =>
      adaptStudentPreview(studentDTO),
    ),
  };
}

export function adaptGroup(groupDTO: GroupDTO): Group {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    frenchName: groupDTO.french_name,
    englishName: groupDTO.english_name,
    shortName: groupDTO.short_name,
    frenchShortName: groupDTO.french_short_name,
    englishShortName: groupDTO.english_short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
    icon: groupDTO.icon,
    groupType: adaptGroupTypePreview(groupDTO.group_type),
    parent: groupDTO.parent && adaptGroupPreview(groupDTO.parent),
    thematic: groupDTO.thematic && adaptGroupThematic(groupDTO.thematic),
    creationYear: groupDTO.creation_year,
    archived: groupDTO.archived,
    private: groupDTO.private,
    public: groupDTO.public,
    summary: groupDTO.summary,
    frenchSummary: groupDTO.french_summary,
    englishSummary: groupDTO.english_summary,
    description: groupDTO.description,
    frenchDescription: groupDTO.french_description,
    englishDescription: groupDTO.english_description,
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
    french_description: groupForm.frenchDescription,
    english_description: groupForm.englishDescription,
    icon: groupForm.icon,
    meeting_hour: groupForm.meetingHour,
    meeting_place: groupForm.meetingPlace,
    french_name: groupForm.frenchName,
    english_name: groupForm.englishName,
    private: groupForm.private,
    public: groupForm.public,
    french_short_name: groupForm.frenchShortName,
    english_short_name: groupForm.englishShortName,
    slug: groupForm.slug,
    french_summary: groupForm.frenchSummary,
    english_summary: groupForm.englishSummary,
    tags: groupForm.tags,
    video1: groupForm.video1,
    video2: groupForm.video2,
    children_label: groupForm.childrenLabel,
    creation_year: groupForm.creationYear,
    label: (groupForm.label >= 0 && groupForm.label) || null,
    parent: groupForm.parent,
    thematic: groupForm.thematic && adaptGroupThematicDTO(groupForm.thematic),
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
