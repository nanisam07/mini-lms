import { scheduleBookmarkNotification } from "@/hooks/useNotifications";
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

// 🔥 CATEGORY MAPPER (IMPORTANT)
function mapCategory(category: string) {
  if (!category) return "Development";

  const c = category.toLowerCase();

  if (c.includes("phone")) return "Mobile Development";
  if (c.includes("laptop")) return "Web Development";
  if (c.includes("watch")) return "UI/UX Design";
  if (c.includes("electronics")) return "Programming";

  return "Software Engineering";
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

      const courses: Course[] = products.map((product: any, index: number) => {
        const user = users[index % users.length];

        const instructorName =
          typeof user?.name === "object"
            ? `${user.name.first} ${user.name.last}`
            : typeof user?.name === "string"
              ? user.name
              : "Instructor";

        const mappedCategory = mapCategory(product.category);

        return {
          id: product.id?.toString() || index.toString(),

          // 🔥 REAL COURSE TITLE (FIXED)
          title: `${mappedCategory} Mastery ${index + 1}`,

          // 🔥 REAL COURSE DESCRIPTION (FIXED)
          description: `Learn ${mappedCategory} from beginner to advanced with real-world projects and practical examples.`,

          // 🔥 CLEAN CATEGORY
          category: mappedCategory,

          // 🔥 KEEP IMAGE (fallback handled in UI)
          thumbnail: product.thumbnail,

          // 🔥 INSTRUCTOR
          instructor: instructorName,
          instructorAvatar: user?.picture?.thumbnail || "",

          // 🔥 REALISTIC RATING
          rating: Number((Math.random() * 1 + 4).toFixed(1)),

          // 🔥 COURSE PRICE (converted)
          price: Math.floor(product.price / 10),
        };
      });

      set({ courses });
    } catch (err: any) {
      console.log("Fetch error:", err?.message);
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

    // 🔔 Notification trigger
    if (updated.length >= 5) {
      await scheduleBookmarkNotification(updated.length);
    }
  },
}));
