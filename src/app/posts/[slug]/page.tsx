import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Link from "next/link";
import Image from "next/image";

// SNSシェアアイコンコンポーネント
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
  </svg>
);

const LineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12 5.373 12 12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10-10-4.486 10-10 10zm-3.5-9H7v-5h1.5v5zm5 0H12v-5h1.5v5zm-2-9C7.9 4 5 6.9 5 10.5c0 3.6 2.9 6.5 6.5 6.5 3.6 0 6.5-2.9 6.5-6.5C18 6.9 15.1 4 11.5 4zm0 11c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z" />
  </svg>
);

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const url = `https://muscleclub.vercel.app/posts/${post.slug}`;

  // タグを追加 (本来はMarkdownファイルから取得)
  const tags = ["筋トレ", "健康", "食事管理"];

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />

          {/* タグ */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <PostBody content={content} />
          
          {/* SNSシェアボタン */}
          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="text-lg font-semibold mb-4">この記事をシェアする</h3>
            <div className="flex space-x-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <TwitterIcon />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-[#4267B2] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <FacebookIcon />
              </a>
              <a 
                href={`https://line.me/R/msg/text/?${encodeURIComponent(post.title + ' ' + url)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-[#06C755] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                <LineIcon />
              </a>
            </div>
          </div>
          
          {/* 関連記事 (サンプル) */}
          <div className="max-w-4xl mx-auto mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
            <h3 className="text-2xl font-bold mb-6">関連記事</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {getAllPosts().slice(0, 2).map((relatedPost) => (
                relatedPost.slug !== post.slug && (
                  <Link key={relatedPost.slug} href={`/posts/${relatedPost.slug}`}>
                    <div className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-40">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">{relatedPost.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          <DateFormatter dateString={relatedPost.date} />
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
          
          {/* ブログ一覧に戻るボタン */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <Link href="/posts" className="inline-flex items-center px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              ブログ一覧に戻る
            </Link>
          </div>
        </article>
      </Container>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | マッスルクラブ`;

  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      images: [post.ogImage.url],
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
