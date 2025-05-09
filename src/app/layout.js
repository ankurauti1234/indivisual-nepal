import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";


export const metadata = {
  title: "Indivisual - Empowering Data-Driven Decisions",
  description:
    "Indivisual is a powerful web analytics tool designed for broadcasters, advertisers, and brands to gain deep insights into key performance metrics. With real-time analytics, customizable reports, and actionable insights, Indivisual helps optimize strategies, track engagement, and maximize impact.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}