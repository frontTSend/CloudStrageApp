import type { ApiDirType } from '@common/types/ApiDirType';

export type Props = {
  dirs?: ApiDirType[]
  uploadModalOpen: () => void
}