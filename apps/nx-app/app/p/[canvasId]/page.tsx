import { ComponentRenderer } from "@/components/ComponentRenderer";
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
              渲染的组件
            </h2>
            <ComponentRenderer components={canvas.components as any[]} />
          </div>

          {/* 调试信息：可选显示 JSON */}
          <details className="mt-8">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              查看原始 JSON 数据
            </summary>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm mt-2">
              {JSON.stringify(canvas, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </main>
  );
}
