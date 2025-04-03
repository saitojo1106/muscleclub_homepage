import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import Image from "next/image";

// 大会実績データ
const competitions = [
  {
    id: 1,
    title: "マッスルゲート仙台2024",
    date: "2024年8月15日",
    location: "仙台電力ホール",
    image: "/assets/competitions/sendai_msg2024_classic2.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "齋藤　丈", category: "新人の部", rank: "4位" },
    ],
    description: "全国から集まった学生ボディビルダーたちとの熱い戦いでした。マッスルクラブからは1名が出場し、1名が入賞を果たしました。"
  },
  {
    id: 2,
    title: "マッスルゲート仙台",
    date: "2023年8月15日",
    location: "仙台電力ホール",
    image: "/assets/competitions/sendai_msg2024_body.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "齋藤　丈", category: "ジュニアの部", rank: "4位" },
    ],
    description: "地区大会では、マッスルクラブのメンバーが大活躍。団体総合でも優勝を果たしました。"
  },
  {
    id: 3,
    title: "宮城選手権ボディビル大会",
    date: "2024年8月2日",
    location: "仙台市体育館",
    image: "/assets/competitions/miyagicontest_2024.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "齋藤　丈", category: "総合", rank: "予選落ち" }
    ],
    description: "上級者がたくさん出場しているかなりハイレベルな戦いでした。マッスルクラブからは1名が出場しましたが、予選落ちとなりました。"
  }
];

export default function AchievementsPage() {
  return (
    <main>
      <Container>
        <Header />
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">大会実績</h1>
        
        {/* 大会実績一覧 */}
        <div className="space-y-12 mb-16">
          {competitions.map((competition) => (
            <div key={competition.id} className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
              <div className="relative h-64 md:h-80">
                <Image
                  src={competition.image}
                  alt={competition.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{competition.title}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>{competition.date}</p>
                  <p>@ {competition.location}</p>
                </div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">{competition.description}</p>
                
                <h3 className="text-xl font-semibold mb-3">大会結果</h3>
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-slate-700">
                        <th className="text-left py-2 px-4">選手名</th>
                        <th className="text-left py-2 px-4">カテゴリー</th>
                        <th className="text-left py-2 px-4">順位</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competition.results.map((result, index) => (
                        <tr key={index} className="border-b dark:border-slate-700 last:border-0">
                          <td className="py-2 px-4">{result.member}</td>
                          <td className="py-2 px-4">{result.category}</td>
                          <td className="py-2 px-4 font-semibold">{result.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}