"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, updatePost, type Post } from "@/lib/api";
import { Pencil, Trash2 } from "lucide-react";

type Tab = "publish" | "draft" | "thrash";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("publish");
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    try {
      const data = await getPosts(100, 0);
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => post.status === activeTab);

  async function moveToTrash(id: number) {
    const post = posts.find((p) => p.id === id);

    if (!post) return;

    const confirmed = confirm(
      "Are you sure you want to move this article to trash?",
    );

    if (!confirmed) return;

    try {
      await updatePost(String(id), {
        title: post.title,
        content: post.content,
        category: post.category,
        status: "thrash",
      });

      await loadPosts();
    } catch (error) {
      alert("Failed to move article to trash");
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Article Blog
          </Link>

          <div className="flex gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-900">
              All Posts
            </Link>
            <Link href="/add-new" className="text-gray-500 hover:text-gray-900">
              Add New
            </Link>
            <Link href="/preview" className="text-gray-500 hover:text-gray-900">
              Preview
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
            <p className="mt-1 text-gray-500">Manage your articles</p>
          </div>

          <Link
            href="/add-new"
            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add New
          </Link>
        </div>

        <div className="mb-6 flex gap-2 rounded-lg bg-white p-2 shadow-sm">
          <TabButton
            active={activeTab === "publish"}
            onClick={() => setActiveTab("publish")}
          >
            Published
          </TabButton>

          <TabButton
            active={activeTab === "draft"}
            onClick={() => setActiveTab("draft")}
          >
            Drafts
          </TabButton>

          <TabButton
            active={activeTab === "thrash"}
            onClick={() => setActiveTab("thrash")}
          >
            Trashed
          </TabButton>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading articles...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No articles in this category.
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {post.title}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.category}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/edit/${post.id}`}
                          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </Link>

                        {activeTab !== "thrash" && (
                          <button
                            onClick={() => moveToTrash(post.id)}
                            className="rounded-lg border px-3 py-2 text-sm hover:bg-red-50"
                            title="Move to trash"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-5 py-2.5 text-sm font-medium ${
        active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}
