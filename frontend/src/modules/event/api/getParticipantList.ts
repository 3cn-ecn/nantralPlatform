import axios from 'axios';

import { adaptStudentPreview } from '#modules/student/infra/student.adapter';
import { StudentPreviewDTO } from '#modules/student/infra/student.dto';
import { StudentPreview } from '#modules/student/student.types';
import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

type GetParticipantListOptions = {
  page?: number;
  pageSize?: number;
};

export async function getParticipantList(
  eventId: number,
  options: GetParticipantListOptions
): Promise<Page<StudentPreview>> {
  const { data } = await axios
    .get<PageDTO<StudentPreviewDTO>>(
      `/api/event/event/${eventId}/participants/`,
      {
        params: {
          page: options.page,
          page_size: options.pageSize,
        },
      }
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptStudentPreview);
}
