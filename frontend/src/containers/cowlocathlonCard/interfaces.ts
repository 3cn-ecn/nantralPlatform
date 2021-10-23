import { ColocathlonParticipant } from "../housingMap/interfaces";

export interface RootProps {
  API_URL: string;
  ROOMMATES_SLUG: string;
  EDIT_URL: string;
  PHASE: number;
  IS_ADMIN: string;
  USER_ID: number;
}

export interface ParticipateButtonProps {
  API_URL: string;
  ROOMMATES_SLUG: string;
  isParticipating: boolean;
  participants: ColocathlonParticipant[];
  quota: number;
  isAdmin: boolean;
}

export interface ParticipantsModalProps {
  showModal: boolean;
  handleClose: () => void;
  participants: ColocathlonParticipant[];
}
