import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { courseId, title } = useLocalSearchParams<{
    courseId: string;
    title: string;
  }>();
  const { courses } = useCourseStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const course = courses.find((c) => c.id === courseId);

  // HTML content to show in WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0f172a;
          color: #f1f5f9;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .badge {
          background: rgba(255,255,255,0.2);
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          margin-bottom: 12px;
        }
        h1 { font-size: 22px; margin-bottom: 8px; }
        .instructor { opacity: 0.8; font-size: 14px; }
        .price { font-size: 28px; font-weight: bold; margin-top: 12px; }
        .section {
          background: #1e293b;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
        }
        .section h2 {
          font-size: 16px;
          margin-bottom: 12px;
          color: #a5b4fc;
        }
        p { color: #94a3b8; line-height: 1.6; font-size: 14px; }
        .lesson {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #334155;
        }
        .lesson:last-child { border-bottom: none; }
        .lesson-num {
          background: #6366f1;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .lesson-title { font-size: 14px; color: #e2e8f0; }
        .lesson-duration { margin-left: auto; color: #64748b; font-size: 12px; }
        .btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: bold;
          width: 100%;
          margin-top: 8px;
          cursor: pointer;
        }
        .btn:active { opacity: 0.8; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="badge">${course?.category?.toUpperCase() || "COURSE"}</div>
        <h1>${course?.title || title || "Course Content"}</h1>
        <div class="instructor">by ${course?.instructor || "Instructor"}</div>
        <div class="price">$${course?.price || "0"}</div>
      </div>

      <div class="section">
        <h2>📖 About This Course</h2>
        <p>${course?.description || "Learn the fundamentals and advanced concepts in this comprehensive course."}</p>
      </div>

      <div class="section">
        <h2>📚 Course Curriculum</h2>
        ${[
          "Introduction & Setup",
          "Core Fundamentals",
          "Advanced Concepts",
          "Practical Projects",
          "Best Practices",
          "Final Assessment",
        ]
          .map(
            (lesson, i) => `
          <div class="lesson">
            <div class="lesson-num">${i + 1}</div>
            <div class="lesson-title">${lesson}</div>
            <div class="lesson-duration">${10 + i * 5} min</div>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="section">
        <h2>⭐ Rating</h2>
        <p style="font-size: 32px; color: #fbbf24; margin-bottom: 4px;">${course?.rating || "4.5"} / 5</p>
        <p>Based on student reviews</p>
      </div>

      <button class="btn" onclick="window.ReactNativeWebView.postMessage('enroll')">
        Enroll Now
      </button>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: insets.top + 8,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: "#1e293b",
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#f1f5f9",
            fontSize: 16,
            fontWeight: "bold",
            flex: 1,
          }}
          numberOfLines={1}
        >
          {title || "Course Content"}
        </Text>
      </View>

      {/* Loading indicator */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}

      {/* Error state */}
      {error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="wifi-outline" size={48} color="#334155" />
          <Text style={{ color: "#64748b", marginTop: 12, fontSize: 16 }}>
            Failed to load content
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError(false);
              webViewRef.current?.reload();
            }}
            style={{
              marginTop: 16,
              backgroundColor: "#6366f1",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          onMessage={(event) => {
            if (event.nativeEvent.data === "enroll") {
              router.back();
            }
          }}
          style={{ flex: 1, backgroundColor: "#0f172a" }}
        />
      )}
    </View>
  );
}
