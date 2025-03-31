import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import Image from "next/image";

// 大会実績データ
const competitions = [
  {
    id: 1,
    title: "全国学生ボディビル選手権2023",
    date: "2023年8月15日",
    location: "東京体育館",
    image: "/assets/competitions/comp1.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "山田太郎", category: "70kg級", rank: "2位" },
      { member: "佐藤次郎", category: "80kg級", rank: "3位" }
    ],
    description: "全国から集まった学生ボディビルダーたちとの熱い戦いでした。マッスルクラブからは5名が出場し、2名が入賞を果たしました。"
  },
  {
    id: 2,
    title: "地区別学生パワーリフティング大会2023",
    date: "2023年5月22日",
    location: "県立スポーツセンター",
    image: "/assets/competitions/comp2.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "鈴木花子", category: "女子60kg級", rank: "1位" },
      { member: "高橋美咲", category: "女子52kg級", rank: "2位" },
      { member: "山田太郎", category: "男子75kg級", rank: "1位" }
    ],
    description: "地区大会では、マッスルクラブのメンバーが大活躍。団体総合でも優勝を果たしました。"
  },
  {
    id: 3,
    title: "インターカレッジ筋トレコンテスト2022",
    date: "2022年11月30日",
    location: "市民体育館",
    image: "/assets/competitions/comp3.jpg", // 実際の画像パスに置き換えてください
    results: [
      { member: "佐藤次郎", category: "総合", rank: "3位" }
    ],
    description: "複数の種目を組み合わせた総合筋トレコンテスト。持久力と瞬発力の両方が試される大会でした。"
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