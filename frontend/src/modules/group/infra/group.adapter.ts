import { adaptSocialLink } from '#modules/social_link/infra/socialLink.adapter';

import { CreateGroupForm, Group, GroupPreview } from '../types/group.types';
import { CreateGroupFormDTO, GroupDTO, GroupPreviewDTO } from './group.dto';
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
    creationYear: groupDTO.creation_year,
    archived: groupDTO.archived,
    private: groupDTO.private,
    public: groupDTO.public,
    summary: groupDTO.summary,
    description: groupDTO.description,
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
  };
}

export function adaptGroupForm(groupForm: CreateGroupForm): CreateGroupFormDTO {
  return {
    archived: groupForm.archived,
    banner: groupForm.banner,
    description: groupForm.description,
    icon: groupForm.icon,
    meeting_hour: groupForm.meetingHour,
    meeting_place: groupForm.meetingPlace,
    name: groupForm.name,
    private: groupForm.private,
    public: groupForm.public,
    short_name: groupForm.shortName,
    slug: groupForm.slug,
    summary: groupForm.summary,
    tags: groupForm.tags,
    video1: groupForm.video1,
    video2: groupForm.video2,
    children_label: groupForm.childrenLabel,
    creation_year: groupForm.creationYear,
    label: (groupForm.label >= 0 && groupForm.label) || null,
    parent: groupForm.parent,
    lock_memberships: groupForm.lockMemberships,
    _change_reason: groupForm.changeReason,
  };
}
