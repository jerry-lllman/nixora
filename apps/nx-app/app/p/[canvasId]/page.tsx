import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    canvasId: string;
  }>;
}

async function getPublishedCanvas(canvasId: string) {
  try {
    const canvas = await prisma.canvas.findUnique({
      where: {
        id: canvasId,
        isPublished: true // 只查询已发布的
      },
      select: {
        id: true,
        title: true,
        components: true,
        description: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        publishUrl: true
        // 不返回敏感字段 userId
      }
    });

    return canvas;
  } catch (error) {
    console.error("Error fetching canvas:", error);
    return null;
  }
}

export default async function CanvasPage({ params }: PageProps) {
  const { canvasId } = await params;
  const canvas = await getPublishedCanvas(canvasId);

  if (!canvas) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {canvas.title}
          </h1>

          {canvas.description && (
            <p className="text-gray-600 mb-6">{canvas.description}</p>
          )}

          <div className="mb-4 text-sm text-gray-500">
            <p>
              Published at:{" "}
              {canvas.publishedAt
                ? new Date(canvas.publishedAt).toLocaleString()
                : "N/A"}
            </p>
            <p>Canvas ID: {canvas.id}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Canvas Data (JSON)
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(canvas, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
