import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import Image from "next/image";

// 部員のデータ
const members = [
  {
    id: 1,
    name: "山田 太郎",
    role: "部長",
    year: "3年生",
    image: "/assets/members/member1.jpg", // 実際の画像パスに置き換えてください
    speciality: "ベンチプレス",
    message: "筋トレを通じて心身ともに成長していきましょう！",
    records: "ベンチプレス: 100kg / スクワット: 120kg / デッドリフト: 150kg"
  },
  {
    id: 2,
    name: "鈴木 花子",
    role: "副部長",
    year: "2年生",
    image: "/assets/members/member2.jpg", // 実際の画像パスに置き換えてください
    speciality: "スクワット",
    message: "正しいフォームで効率的な筋トレを目指しています。",
    records: "ベンチプレス: 45kg / スクワット: 80kg / デッドリフト: 90kg"
  },
  {
    id: 3,
    name: "佐藤 次郎",
    role: "会計",
    year: "3年生",
    image: "/assets/members/member3.jpg", // 実際の画像パスに置き換えてください
    speciality: "デッドリフト",
    message: "筋トレは継続が大切です。一緒に頑張りましょう！",
    records: "ベンチプレス: 85kg / スクワット: 110kg / デッドリフト: 140kg"
  },
  {
    id: 4,
    name: "高橋 美咲",
    role: "広報",
    year: "1年生",
    image: "/assets/members/member4.jpg", // 実際の画像パスに置き換えてください
    speciality: "ボディメイク",
    message: "健康的な体づくりを目指しています。",
    records: "ベンチプレス: 40kg / スクワット: 70kg / デッドリフト: 80kg"
  },
];

export default function MembersPage() {
  return (
    <main>
      <Container>
        <Header />
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">部員紹介</h1>
        
        {/* 部員一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {members.map((member) => (
            <div key={member.id} className="border dark:border-slate-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{member.name}</h2>
                    <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {member.role}
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{member.year} / 専門: {member.speciality}</p>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">メッセージ</h3>
                    <p className="text-gray-600 dark:text-gray-300">{member.message}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">記録</h3>
                    <p className="text-gray-600 dark:text-gray-300">{member.records}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}