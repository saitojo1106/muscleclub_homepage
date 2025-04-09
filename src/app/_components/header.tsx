import Link from "next/link";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-16 mt-8">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-4 md:mb-0">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          マッスルクラブ
        </Link>
      </h2>
      <nav className="flex flex-wrap gap-5 md:gap-8">
        <Link href="/" className="hover:text-blue-500 transition-colors font-semibold">
          ホーム
        </Link>
        <Link href="/members" className="hover:text-blue-500 transition-colors font-semibold">
          部員紹介
        </Link>
        <Link href="/achievements" className="hover:text-blue-500 transition-colors font-semibold">
          大会実績
        </Link>
        <Link href="/posts" className="hover:text-blue-500 transition-colors font-semibold">
          ブログ
        </Link>
        <Link href="/events" className="hover:text-blue-500 transition-colors font-semibold">
          イベントカレンダー
        </Link>
      </nav>
    </header>
  );
};

export default Header;