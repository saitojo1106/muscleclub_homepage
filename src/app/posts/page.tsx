import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import DateFormatter from "@/app/_components/date-formatter";
import { Intro } from "@/app/_components/intro";

export default function BlogPage() {
  const posts = getAllPosts();
  
  // 最新の投稿を1件取得
  const latestPost = posts.length > 0 ? posts[0] : null;
  // 残りの投稿を取得
  const morePosts = posts.slice(1);
  
  return (
    <main>
      <Container>
        <Header />
        <Intro />
        
        {/* 最新の投稿（ヒーロー表示） */}
        {latestPost && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">最新の投稿</h2>
            <Link href={`/posts/${latestPost.slug}`}>
              <div className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-72 md:h-96">
                  <Image
                    src={latestPost.coverImage}
                    alt={`Cover Image for ${latestPost.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{latestPost.title}</h3>
                    <p className="text-white/90 mb-4 line-clamp-2">{latestPost.excerpt}</p>
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3">
                        <Image
                          src={latestPost.author.picture}
                          alt={latestPost.author.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{latestPost.author.name}</p>
                        <p className="text-white/80 text-sm">
                          <DateFormatter dateString={latestPost.date} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}
        
        {/* 他の記事一覧 */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">すべての記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {morePosts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
                <div className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage}
                      alt={`Cover Image for ${post.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{post.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <DateFormatter dateString={post.date} />
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center mt-2">
                      <Image
                        src={post.author.picture}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{post.author.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}