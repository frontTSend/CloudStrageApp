import { useMemo } from 'react';
import { useSelector } from '@/hooks';
import { PLAN_TYPE, STORAGE_TYPE } from '@/utils/const';
import { translateByte } from '@/utils';

const useLogic = () => {
  const user = useSelector(state => state.user);
  const isGuest = useMemo(() => user.email === `__guest__${process.env.NEXT_PUBLIC_GUEST_KEY}`, [user]);
  const storage = useMemo(() => {
    if (isGuest) return STORAGE_TYPE.GUEST;

    switch (user.plan) {
      case 0:
        return STORAGE_TYPE.FREE;
      case 1:
        return STORAGE_TYPE.PREMIUM;
      default:
        return STORAGE_TYPE.FREE;
    }
  }, [isGuest, user])

  const userDatas = useMemo(() => {
    const datas = [
      { heading: 'ユーザー名', value: user.name },
      {
        heading: '現在のプラン',
        value: (() => {
          switch (user.plan) {
            case PLAN_TYPE.FREE:
              return '無料';
            case PLAN_TYPE.PREMIUM:
              return 'プレミアム';
            default:
              return '無料'
          }
        })()
      },
      { heading: 'ストレージ', value: `${(Math.round(translateByte(user.storage, 'mb') * 10) / 10)}MB / ${storage}MB` }
    ]

    isGuest || datas.splice(0, 0, { heading: 'メールアドレス', value: user.email },)

    return datas
  }, [user, isGuest, storage])

  return {
    userDatas,
    isGuest
  };
}

export default useLogic;