import { clsx } from "clsx";
import { useState, useEffect } from "react";

export interface CarouselSlide {
  image: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  slides,
  autoPlay = true,
  interval = 3000,
  showIndicators = true,
  showArrows = true,
  className
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto play functionality - 使用 useEffect 正确处理副作用
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    // 清理函数：组件卸载或依赖变化时清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [autoPlay, interval, currentIndex, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <p className="text-slate-400">暂无轮播内容</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className={clsx("relative overflow-hidden rounded-lg", className)}>
      {/* 主图片区域 */}
      <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
        <img
          src={currentSlide.image}
          alt={currentSlide.alt || `Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* 文字叠加 */}
        {(currentSlide.title || currentSlide.description) ? (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-8">
            {currentSlide.title ? (
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentSlide.title}
              </h3>
            ) : null}
            {currentSlide.description ? (
              <p className="text-white/90">{currentSlide.description}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* 左右箭头 */}
      {showArrows && slides.length > 1 ? (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-full p-2 transition-all shadow-lg"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 rounded-full p-2 transition-all shadow-lg"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      ) : null}

      {/* 指示器 */}
      {showIndicators && slides.length > 1 ? (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={clsx(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
