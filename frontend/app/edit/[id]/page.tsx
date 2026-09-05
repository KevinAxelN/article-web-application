"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPost, updatePost } from "@/lib/api";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const post = await getPost(id);

        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
      } catch (error) {
        alert("Article not found");
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

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
      setSaving(true);

      await updatePost(id, {
        title,
        content,
        category,
        status,
      });

      router.push("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to update article",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
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
        <h1 className="mb-8 text-3xl font-bold">Edit Article</h1>

        <form className="space-y-6 rounded-xl border bg-white p-8 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full rounded-lg border px-4 py-3"
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
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/" className="rounded-lg border px-5 py-3">
              Cancel
            </Link>

            <button
              disabled={saving}
              onClick={(e) => handleSubmit(e, "draft")}
              className="rounded-lg border px-5 py-3"
            >
              Draft
            </button>

            <button
              disabled={saving}
              onClick={(e) => handleSubmit(e, "publish")}
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Publish
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
