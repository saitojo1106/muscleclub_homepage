import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // ログインページに表示される名前
      name: "Credentials",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        // ここで認証ロジックを実装
        // 実際のアプリでは、データベースなどの検証が必要
        if (
          credentials?.username === "admin" && 
          credentials?.password === "muscleclub2024"
        ) {
          return {
            id: "1",
            name: "Administrator",
            email: "admin@example.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login', // カスタムログインページ
  },
  callbacks: {
    async jwt({ token, user }) {
      // ユーザーから追加情報を取得した場合はトークンに追加
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
});

export { handler as GET, handler as POST };