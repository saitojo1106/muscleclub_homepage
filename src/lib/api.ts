import { Post } from '@/types';

// クライアントとサーバーで共通の情報を判定する方法
const isServer = typeof window === 'undefined';

export function getPostSlugs() {
  if (!isServer) {
    return []; // クライアントサイドでは空配列を返す
  }
  
  try {
    // サーバーサイドのみで実行されるコード
    const fs = require('fs');
    const path = require('path');
    const postsDirectory = path.join(process.cwd(), '_posts');
    return fs.readdirSync(postsDirectory);
  } catch (error) {
    console.error('投稿スラグ取得エラー:', error);
    return [];
  }
}

export function getPostBySlug(slug: string, fields: string[] = []): Partial<Post> {
  if (!isServer) {
    return {
      slug,
      title: '読み込み中...',
      date: new Date().toISOString(),
      content: '',
      excerpt: '',
      coverImage: '',
      author: { name: '', picture: '' },
      ogImage: { url: '' }
    };
  }
  
  try {
    // サーバーサイドのみで実行されるコード
    const fs = require('fs');
    const path = require('path');
    const matter = require('gray-matter');
    
    const realSlug = slug.replace(/\.md$/, '');
    const postsDirectory = path.join(process.cwd(), '_posts');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const items: Partial<Post> = {};

    // 必要なフィールドだけを返す
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field as keyof Post] = realSlug as any;
      }
      if (field === 'content') {
        items[field as keyof Post] = content as any;
      }
      if (field === 'date' && data[field]) {
        items[field as keyof Post] = data[field].toISOString() as any;
      }
      if (data[field]) {
        items[field as keyof Post] = data[field] as any;
      }
    });

    return items;
  } catch (error) {
    console.error(`スラグ ${slug} の記事取得エラー:`, error);
    return {
      slug: slug.replace(/\.md$/, ''),
      title: 'エラーが発生しました',
      date: new Date().toISOString(),
      content: '',
      excerpt: '',
      coverImage: '',
      author: { name: '', picture: '' },
      ogImage: { url: '' }
    };
  }
}

export function getAllPosts(fields: string[] = []): Partial<Post>[] {
  if (!isServer) {
    // クライアントサイド実行時はダミーデータを返す
    return [
      {
        slug: 'hello-world',
        title: 'サンプル記事',
        date: '2023-01-01T00:00:00.000Z',
        coverImage: '/assets/sample.jpg',
        author: {
          name: '管理者',
          picture: '/assets/author.jpg',
        },
        excerpt: 'サンプル記事の内容です。',
        content: '# サンプル記事\n\nこれはサンプル記事の内容です。',
        ogImage: {
          url: '/assets/sample.jpg',
        },
      }
    ];
  }
  
  try {
    const slugs = getPostSlugs();
    const allFields = [
      'title',
      'date',
      'slug',
      'author',
      'coverImage',
      'excerpt',
      ...fields
    ];
    
    const posts = slugs
      .map((slug: string) => getPostBySlug(slug, allFields)) // 明示的にstring型を指定
      // dateで降順ソート
      .sort((post1: Partial<Post>, post2: Partial<Post>) => ((post1.date || '') > (post2.date || '') ? -1 : 1));
    
    return posts;
  } catch (error) {
    console.error('全記事取得エラー:', error);
    return [];
  }
}
