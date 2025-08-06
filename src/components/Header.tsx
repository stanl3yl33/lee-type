import Link from "next/link";

export default function Header() {
  return (
    <header className="flex">
      {/* logo brings us to home page view as well */}
      <div>Logo</div>
      <nav>
        {/* game / home view */}
        <Link href="/" />

        {/* Leaderboard page */}
        <Link href="/leaderboard" />

        {/* Settings */}
        <Link href="/settings" />

        {/* Login page / account page based on if there is a current session or not - todo later*/}
        <Link href="/login" />
        <Link href="/account" />
      </nav>
    </header>
  );
}
