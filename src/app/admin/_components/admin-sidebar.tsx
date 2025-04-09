import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-slate-800 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/admin/dashboard" 
              className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              ダッシュボード
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/events" 
              className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              イベント管理
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/posts" 
              className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              ブログ管理
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/members" 
              className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              メンバー管理
            </Link>
          </li>
          <li>
            <Link 
              href="/admin/settings" 
              className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              設定
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}