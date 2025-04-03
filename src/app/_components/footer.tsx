import Container from "@/app/_components/container";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 dark:bg-slate-800 dark:border-slate-700">
      <Container>
        <div className="py-16 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/3 text-center lg:text-left mb-10 lg:mb-0">
            <h3 className="text-4xl font-bold tracking-tighter leading-tight">
              マッスルクラブ
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              筋トレと健康的な生活を通じて、心身ともに成長していく仲間たちのコミュニティ
            </p>
          </div>
          
          <div className="lg:w-1/3 text-center mb-10 lg:mb-0">
            <h4 className="font-semibold mb-4">リンク</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-blue-500">ホーム</a></li>
              <li><a href="/members" className="hover:text-blue-500">部員紹介</a></li>
              <li><a href="/achievements" className="hover:text-blue-500">大会実績</a></li>
              <li><a href="/posts" className="hover:text-blue-500">ブログ</a></li>
            </ul>
          </div>
          
          <div className="lg:w-1/3 text-center lg:text-right">
            <h4 className="font-semibold mb-4">お問い合わせ</h4>
            <p className="text-gray-600 dark:text-gray-400">メール: tohtechmuscleclub@gmail.com</p>
            <p className="text-gray-600 dark:text-gray-400">活動場所: 東北工業大学長町キャンパス　トレーニング室</p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">活動日: 毎週月　火　水　木　土　日</p>
            <p className="text-gray-600 dark:text-gray-400">活動時間: 平日17:00 - 19:00 休日10:00 - 12:00</p>
          </div>
        </div>
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-neutral-200 dark:border-slate-700">
          © {new Date().getFullYear()} マッスルクラブ. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;