import Link from "next/link";

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/session1">
          <a>session1</a>
        </Link>
      </li>
      <li>
        <Link href="/session2">
          <a>session2</a>
        </Link>
      </li>
      <li>
        <Link href="/session3">
          <a>session3</a>
        </Link>
      </li>
    </ul>
  );
}
