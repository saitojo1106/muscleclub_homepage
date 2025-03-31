import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import DateFormatter from "@/app/_components/date-formatter";

export default function BlogPage() {
  const posts = getAllPosts();
  
  return (
    <main>
      <Container>
        <Header />
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">ブログ</h1>
        
        {/* ブログ記事一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <div className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={`Cover Image for ${post.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold mb-2 hover:text-blue-500 transition-colors">{post.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <DateFormatter dateString={post.date} />
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{post.excerpt.substring(0, 120)}...</p>
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
      </Container>
    </main>
  );
}