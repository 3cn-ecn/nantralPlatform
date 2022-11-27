import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../../utils/axios';
import { Roommates } from '../housingMap/interfaces';


export function getRoommatesDetails(
  api_url: string,
  ROOMMATES_SLUG: string,
  setRoommates: React.Dispatch<React.SetStateAction<Roommates | undefined>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): void {
  setIsLoading(true);
  axios
    .get(`${api_url}?slug=${ROOMMATES_SLUG}`)
    .then((res: AxiosResponse) => {
      let roommates: Roommates = res.data[0];
      setRoommates(roommates);
    })
    .catch((err: AxiosError) => {
      console.error(err.code);
      setRoommates(undefined);
    })
    .finally(() => setIsLoading(false));
}
