import { ColocathlonParticipant } from '../housingMap/interfaces';

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
