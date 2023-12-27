import { Group, GroupPreview } from '../types/group.types';
import { GroupDTO, GroupPreviewDTO } from './group.dto';
import { adaptGroupTypePreview } from './groupType.adapter';

export function adaptGroupPreview(groupDTO: GroupPreviewDTO): GroupPreview {
  return {
    id: groupDTO.id,
    name: groupDTO.name,
    shortName: groupDTO.short_name,
    slug: groupDTO.slug,
    url: groupDTO.url,
    icon: groupDTO.icon,
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
    isMember: groupDTO.is_member,
    lockMemberships: groupDTO.lock_memberships,
  };
}
