import { clsx } from "clsx";

export type CouponType = "discount" | "amount" | "shipping";

export interface CouponCardProps {
  title: string;
  type: CouponType;
  value: string;
  description?: string;
  validUntil?: string;
  minPurchase?: string;
  buttonText?: string;
  onClaim?: () => void;
  claimed?: boolean;
  className?: string;
}

const typeConfig: Record<CouponType, { icon: string; color: string; label: string }> = {
  discount: {
    icon: "%",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    label: "折扣券"
  },
  amount: {
    icon: "¥",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    label: "满减券"
  },
  shipping: {
    icon: "🚚",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    label: "包邮券"
  }
};

export function CouponCard({
  title,
  type,
  value,
  description,
  validUntil,
  minPurchase,
  buttonText = "立即领取",
  onClaim,
  claimed = false,
  className
}: CouponCardProps) {
  const config = typeConfig[type];

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800",
        claimed && "opacity-60",
        className
      )}
    >
      {/* 左侧主色块 */}
      <div className="flex">
        <div className={clsx("flex flex-col items-center justify-center p-6 text-white min-w-[120px]", config.color)}>
          <div className="text-4xl font-bold mb-1">{config.icon}</div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs opacity-90 mt-1">{config.label}</div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
            {description ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {description}
              </p>
            ) : null}
            <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-500">
              {minPurchase ? (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>满 {minPurchase} 可用</span>
                </div>
              ) : null}
              {validUntil ? (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>有效期至 {validUntil}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* 领取按钮 */}
          <button
            onClick={onClaim}
            disabled={claimed}
            className={clsx(
              "mt-4 rounded-lg px-6 py-2 font-semibold text-sm transition-all",
              claimed
                ? "bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
            )}
          >
            {claimed ? "已领取" : buttonText}
          </button>
        </div>
      </div>

      {/* 已领取标记 */}
      {claimed ? (
        <div className="absolute top-4 right-4 bg-slate-900/80 text-white text-xs font-bold px-3 py-1 rounded-full">
          已领取
        </div>
      ) : null}

      {/* 装饰性圆孔 */}
      <div className="absolute left-[120px] top-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700" />
      </div>
    </div>
  );
}
