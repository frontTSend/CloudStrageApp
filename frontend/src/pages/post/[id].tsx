import type { PostType } from '@/types/PostType';
import { useRouter } from "next/router";
import useSWR from 'swr';
import { config } from '@/utils';
import { getUserLayout } from "@/utils/getLayout";
import { auth } from '@/utils/aws';
import axios from 'axios';
import { Button } from '@/components/atoms'
import Head from 'next/head';

const Post = () => {
  const router = useRouter();

  const { data, error } = useSWR<PostType>(`${config.api}/post/?id=${router.query.id}`, (url: string) => {
    const token = auth.getIdToken();

    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data)
  });


  const onClickDownload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const user = await auth.getUser();
      const token = auth.getIdToken();
      const target = e.target as HTMLAnchorElement;

      if (!user || !token) throw new Error('不正なユーザー');
      if (target.href || !data) return;

      e.preventDefault();

      const res = await axios.get<string>(`${config.api}/file/download/?key=${data.file_path}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      target.href = res.data;
      target.click();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {data && (
        <>
          <Head>
            <title>{data.description}</title>
          </Head>
          {data.description}
          <div style={{ marginTop: 16 }}>
            <Button as="a" target="_blank" download onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClickDownload(e)}>
              ダウンロード
            </Button>
          </div>
        </>
      )}
      {error && <p>データがありません</p>}
    </>
  )
}

Post.getLayout = getUserLayout;

export default Post;