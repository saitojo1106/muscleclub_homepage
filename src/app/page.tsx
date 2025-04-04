import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function Index() {
  const recentPosts = getAllPosts().slice(0, 3); // 最新の3件の記事を取得

  return (
    <main>
      <Container>
        <Intro />
        
        {/* ヒーローセクション */}
        <section className="relative h-96 mb-16 rounded-lg overflow-hidden">
          <Image
            src="/assets/hero-image.jpg" // 適切な画像に置き換えてください
            alt="マッスルクラブ"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">マッスルクラブ</h1>
            <p className="text-xl md:text-2xl text-center max-w-2xl">
              筋トレと健康的な生活を通じて、心身ともに成長していく仲間たちのコミュニティです
            </p>
          </div>
        </section>

        {/* メニューセクション */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/members" className="group">
            <div className="border dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-500 transition-colors">部員紹介</h2>
              <p className="text-gray-600 dark:text-gray-400">マッスルクラブのメンバーをご紹介します</p>
            </div>
          </Link>
          
          <Link href="/achievements" className="group">
            <div className="border dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.937 6.937 0 006.11 6.11.75.75 0 00.859-.584c.212-1.012.394-2.036.543-3.071h.858c.148 1.035.33 2.06.543 3.071a.75.75 0 00.859.584 6.937 6.937 0 006.11-6.11.75.75 0 00-.584-.859 41.059 41.059 0 00-3.071-.543v-.858c1.035-.148 2.06-.33 3.071-.543a.75.75 0 00.584-.859 6.937 6.937 0 00-6.11-6.11.75.75 0 00-.859.584c-.212 1.012-.394 2.036-.543 3.071h-.858a41.059 41.059 0 00-.543-3.071.75.75 0 00-.859-.584 6.937 6.937 0 00-6.11 6.11.75.75 0 00.584.859c1.012.212 2.036.394 3.071.543z" clipRule="evenodd" />
                  <path d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-yellow-500 transition-colors">大会実績</h2>
              <p className="text-gray-600 dark:text-gray-400">これまでの大会での成績や活動実績をご紹介します</p>
            </div>
          </Link>
          
          <Link href="/posts" className="group">
            <div className="border dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
                  <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-green-500 transition-colors">ブログ</h2>
              <p className="text-gray-600 dark:text-gray-400">マッスルクラブの活動日記や筋トレのノウハウを発信しています</p>
            </div>
          </Link>
        </section>
        
        {/* 最新の投稿セクション */}
        {recentPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">最新の投稿</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/posts/${post.slug}`} className="group">
                  <div className="border dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={post.coverImage}
                        alt={`Cover Image for ${post.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{post.excerpt.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(post.date).toLocaleDateString('ja-JP')}
                        </p>
                        <span className="text-blue-500 text-sm font-medium flex items-center">
                          続きを読む
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/posts" className="inline-block px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                全ての投稿を見る
              </Link>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
