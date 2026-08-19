import { useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import UploadCard from "../components/upload/UploadCard";
import SuccessBanner from "../components/upload/SuccessBanner";
import ChatCard from "../components/chat/ChatCard";

import type { Message } from "../types/chat";
import type { UploadResult } from "../types/upload";
import type { DocumentItem } from "../types/document";

const Home = () => {
  const location = useLocation();

  // Current opened document (from Documents page)
  const activeDocument = location.state?.activeDocument as
    | DocumentItem
    | undefined;

  // 💬 Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // 📄 Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [uploadResult, setUploadResult] =
    useState<UploadResult | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#eaf4ff_0%,_#d8ebff_36%,_#d3d9ff_70%,_#f0d3ea_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-[1480px] gap-5">
        <Sidebar />

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[34px] border border-white/70 bg-[#edf4ff]/80 p-5 lg:p-6 shadow-[0_25px_70px_rgba(103,136,224,0.12)] backdrop-blur-sm">
          {/* Header */}
          <div className="shrink-0">
            <h1 className="text-[2.35rem] font-bold tracking-tight text-[#f75f9a]">
              Yomiko RAG Assistant
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your kawaii AI-powered document companion 🌸
            </p>
          </div>

          {/* Upload Card */}
          <div className="mt-5 shrink-0">
            <UploadCard
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              isIndexing={isIndexing}
              setIsIndexing={setIsIndexing}
              setIsIndexed={setIsIndexed}
              setUploadResult={setUploadResult}
              activeDocument={activeDocument}
            />
          </div>

          {/* Success Banner */}
          {isIndexed && uploadResult && (
            <div className="mt-4 shrink-0">
              <SuccessBanner result={uploadResult} />
            </div>
          )}

          {/* Chat */}
          <div className="mt-5 min-h-0 flex-1 overflow-hidden">
            <ChatCard
              messages={messages}
              setMessages={setMessages}
              isThinking={isThinking}
              setIsThinking={setIsThinking}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;