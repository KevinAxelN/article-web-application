"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost } from "@/lib/api";

export default function AddNewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent, status: "publish" | "draft") {
    e.preventDefault();

    if (title.trim().length < 20) {
      alert("Title must be at least 20 characters");
      return;
    }

    if (content.trim().length < 200) {
      alert("Content must be at least 200 characters");
      return;
    }

    if (category.trim().length < 3) {
      alert("Category must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);

      await createPost({
        title,
        content,
        category,
        status,
      });

      router.push("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to create article",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            Article Blog
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-3xl  font-bold">Add New Article</h1>

        <form className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">
          <div>
            <label className="mb-2 block text-sm  font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 20 characters</p>
          </div>

          <div>
            <label className="mb-2 block text-sm  font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article..."
              rows={12}
              className="w-full rounded-lg border placeholder:text-slate-400 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
            <p className="mt-1 text-xs text-gray-500">
              {content.length}/200 minimum characters
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kategori Artikel"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/"
              className="rounded-lg border  px-5 py-3 text-sm font-medium"
            >
              Cancel
            </Link>

            <button
              disabled={loading}
              onClick={(e) => handleSubmit(e, "draft")}
              className="rounded-lg border  px-5 py-3 text-sm font-medium hover:bg-gray-100"
            >
              Save Draft
            </button>

            <button
              disabled={loading}
              onClick={(e) => handleSubmit(e, "publish")}
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Publish
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
