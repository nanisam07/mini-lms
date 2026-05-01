import { api } from "@/services/api";
import { Course } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface CourseStore {
  courses: Course[];
  bookmarks: string[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  loadBookmarks: () => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  bookmarks: [],
  isLoading: false,
  error: null,

  loadBookmarks: async () => {
    try {
      const stored = await AsyncStorage.getItem("bookmarks");
      if (stored) set({ bookmarks: JSON.parse(stored) });
    } catch {}
  },

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const [productsRes, usersRes] = await Promise.all([
        api.get("/api/v1/public/randomproducts?limit=20"),
        api.get("/api/v1/public/randomusers?limit=20"),
      ]);

      const products = productsRes.data.data.data;
      const users = usersRes.data.data.data;

      const courses: Course[] = products.map((product: any, index: number) => ({
        id: product.id?.toString() || index.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        instructor: users[index % users.length]?.name || "Instructor",
        instructorAvatar: users[index % users.length]?.picture?.thumbnail || "",
        category: product.category,
        rating: product.rating || 4.5,
      }));

      set({ courses });
    } catch (err: any) {
      set({ error: err?.message || "Failed to fetch courses" });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleBookmark: async (courseId: string) => {
    const { bookmarks } = get();
    const updated = bookmarks.includes(courseId)
      ? bookmarks.filter((id) => id !== courseId)
      : [...bookmarks, courseId];

    set({ bookmarks: updated });
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
  },
}));
