import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import Image from "next/image";
import Link from "next/link";

// インスタグラムのアイコンコンポーネント
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// 部員のデータ
const members = [
  {
    id: 1,
    name: "齋藤　丈",
    role: "エース",
    year: "3年生",
    image: "/assets/members/pro_D2PyqRsQ.jpeg", // 実際の画像パスに置き換えてください
    speciality: "ベンチプレス",
    message: "気合があれば結果がついてくる！",
    records: "ベンチプレス: 100kg / スクワット: 120kg / デッドリフト: 150kg",
    instagram: "https://www.instagram.com/pythondaisuki_bb" // インスタグラムのURL
  },
  {
    id: 2,
    name: "山田 孝翔",
    role: "副部長",
    year: "2年生",
    image: "/assets/members/pro_xPtf0FWG.jpeg", // 実際の画像パスに置き換えてください
    speciality: "デッドリフト",
    message: "正しいフォームで効率的な筋トレを目指しています。",
    records: "ベンチプレス: 45kg / スクワット: 80kg / デッドリフト: 90kg",
    instagram: "https://www.instagram.com/taka_toast_135" // インスタグラムのURL
  },
  {
    id: 3,
    name: "皆川 隼人",
    role: "卒業生",
    year: "４年生",
    image: "/assets/members/pro_NqQm0DuA.jpeg", // 実際の画像パスに置き換えてください
    speciality: "ベンチプレス",
    message: "筋トレは継続が大切です。一緒に頑張りましょう！",
    records: "ベンチプレス: 85kg / スクワット: 110kg / デッドリフト: 140kg",
    instagram: "https://www.instagram.com/mina_48_haya" // インスタグラムのURL
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
                <div className="md:w-1/3 relative h-64 md:h-[300px]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* インスタグラムリンクをオーバーレイで表示 */}
                  <Link 
                    href={member.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
                    aria-label={`${member.name}のInstagramへ`}
                  >
                    <InstagramIcon />
                  </Link>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold">{member.name}</h2>
                    <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {member.role}
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {member.year} / 専門: {member.speciality}
                    {/* インスタグラムリンクをテキスト内にも表示 */}
                    <Link 
                      href={member.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
                    >
                      <InstagramIcon /> <span className="ml-1 hidden sm:inline">@{member.instagram.split('/').pop()}</span>
                    </Link>
                  </p>
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