import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../lib/hooks/useAuth";
import type { ApiError } from "../lib/api/types";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  const { mutate: register, isPending, error, isSuccess } = useRegister();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // 前端验证
    if (password !== confirmPassword) {
      setLocalError("两次输入的密码不一致");
      return;
    }

    if (password.length < 8) {
      setLocalError("密码至少需要8位");
      return;
    }

    register({ email, password, name: name || undefined });
  };

  const errorMessage = localError || (error ? (error as ApiError).message : null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            注册 Nixora 账号
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            已有账号？{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              立即登录
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isSuccess && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <p className="text-sm text-green-800 dark:text-green-400">
                注册成功！正在跳转到登录页...
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="邮箱地址"
              />
            </div>

            <div>
              <label htmlFor="name" className="sr-only">
                姓名（可选）
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="姓名（可选）"
                maxLength={120}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="密码（至少8位）"
                minLength={8}
                maxLength={64}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                确认密码
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="确认密码"
                minLength={8}
                maxLength={64}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
            >
              {isPending ? "注册中..." : "注册"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
