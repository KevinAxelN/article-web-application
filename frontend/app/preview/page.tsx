"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/api";

const PAGE_SIZE = 3;

export default function PreviewPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPosts(100, 0);

        setPosts(data.filter((post) => post.status === "publish"));
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  const currentPosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            Article Blog
          </Link>

          <div className="flex gap-6 text-sm">
            <Link href="/">All Posts</Link>
            <Link href="/add-new">Add New</Link>
            <Link href="/preview" className="font-semibold">
              Preview
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Blog Preview</h1>

          <p className="mt-2 text-gray-500">Published articles</p>
        </div>

        <div className="space-y-6">
          {currentPosts.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
              No published articles yet.
            </div>
          ) : (
            currentPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border bg-white p-8 shadow-sm"
              >
                <div className="mb-3 text-sm font-medium text-gray-500">
                  {post.category}
                </div>

                <h2 className="mb-4 text-2xl font-bold">{post.title}</h2>

                <p className="whitespace-pre-line leading-7 text-gray-600">
                  {post.content}
                </p>

                <div className="mt-6 border-t pt-4 text-xs text-gray-400">
                  {new Date(post.created_date).toLocaleDateString()}
                </div>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`rounded-lg px-4 py-2 ${
                    page === number ? "bg-black text-white" : "border bg-white"
                  }`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
