// Canvas 相关 API
import { axiosInstance } from "./axios";
import type {
  Canvas,
  CreateCanvasRequest,
  UpdateCanvasRequest,
} from "./types";

export const canvasApi = {
  /**
   * 创建画布
   */
  async create(data: CreateCanvasRequest): Promise<Canvas> {
    const response = await axiosInstance.post<Canvas>("/canvas", data);
    return response.data as Canvas;
  },

  /**
   * 获取所有画布列表
   */
  async findAll(): Promise<Canvas[]> {
    const response = await axiosInstance.get<Canvas[]>("/canvas");
    return response.data as Canvas[];
  },

  /**
   * 获取单个画布
   */
  async findOne(id: string): Promise<Canvas> {
    const response = await axiosInstance.get<Canvas>(`/canvas/${id}`);
    return response.data as Canvas;
  },

  /**
   * 更新画布
   */
  async update(id: string, data: UpdateCanvasRequest): Promise<Canvas> {
    const response = await axiosInstance.patch<Canvas>(`/canvas/${id}`, data);
    return response.data as Canvas;
  },

  /**
   * 删除画布
   */
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/canvas/${id}`);
  },

  /**
   * 发布画布
   */
  async publish(id: string): Promise<Canvas> {
    const response = await axiosInstance.post<Canvas>(`/canvas/${id}/publish`);
    return response.data as Canvas;
  },

  /**
   * 取消发布画布
   */
  async unpublish(id: string): Promise<Canvas> {
    const response = await axiosInstance.post<Canvas>(`/canvas/${id}/unpublish`);
    return response.data as Canvas;
  },
};

