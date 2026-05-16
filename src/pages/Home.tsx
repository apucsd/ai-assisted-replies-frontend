import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SiFiverr, SiGoogle } from "react-icons/si";
import {
  FaMagic,
  FaShieldAlt,
  FaCopy,
  FaCheck,
  FaPlus,
  FaBriefcase,
  FaChevronRight,
  FaGlobe,
  FaUserAlt,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import {
  useModerateMessageMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetMessagesQuery,
} from "@/redux/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
  const [originalText, setOriginalText] = useState("");
  const [safeText, setSafeText] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  // Pagination State
  const [page, setPage] = useState(1);
  const [combinedHistory, setCombinedHistory] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Infinite Scroll Trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
  });

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false);

  // New Project Form
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    clientName: "",
    platform: "FIVERR",
    orderLink: "",
  });

  const token = localStorage.getItem("token");
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery(undefined, { skip: !token });

  const { data: historyResponse, isFetching: historyLoading } =
    useGetMessagesQuery(
      { projectId: selectedProjectId || "", page, limit: 10 },
      { skip: !selectedProjectId || !token },
    );

  const [createProject, { isLoading: creatingProject }] =
    useCreateProjectMutation();
  const [moderateMessage, { isLoading: moderating }] =
    useModerateMessageMutation();

  const activeProject = projects.find((p: any) => p.id === selectedProjectId);

  // Reset history when project changes
  useEffect(() => {
    if (selectedProjectId) {
      setCombinedHistory([]);
      setPage(1);
      setHasMore(true);
      setSafeText("");
    }
  }, [selectedProjectId]);

  // Append new data when historyResponse changes
  useEffect(() => {
    if (historyResponse?.data) {
      if (page === 1) {
        setCombinedHistory(historyResponse.data);
      } else {
        setCombinedHistory((prev) => {
          const newItems = historyResponse.data.filter(
            (newItem: any) =>
              !prev.some((oldItem) => oldItem.id === newItem.id),
          );
          return [...prev, ...newItems];
        });
      }

      if (historyResponse.meta) {
        setHasMore(page < historyResponse.meta.totalPage);
      } else {
        setHasMore(false);
      }
    }
  }, [historyResponse]);

  // Load more when inView changes
  useEffect(() => {
    if (inView && hasMore && !historyLoading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, historyLoading]);

  const handleActionWithAuth = (action: () => void) => {
    if (!token) {
      setIsLoginModalOpen(true);
    } else {
      action();
    }
  };

  const handleCreateProject = async () => {
    if (!projectForm.name.trim()) {
      toast.warning("Project name is required");
      return;
    }
    try {
      const project = await createProject(projectForm).unwrap();
      setSelectedProjectId(project.id);
      setProjectForm({
        name: "",
        description: "",
        clientName: "",
        platform: "FIVERR",
        orderLink: "",
      });
      setIsCreateProjectModalOpen(false);
      toast.success("Project created!");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleProcess = async () => {
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!selectedProjectId) {
      setIsCreateProjectModalOpen(true);
      return;
    }
    if (!originalText.trim()) {
      toast.warning("Please enter your message first");
      return;
    }

    try {
      const result = await moderateMessage({
        originalMsg: originalText,
        projectId: selectedProjectId,
      }).unwrap();
      setSafeText(result.safeMsg || "Processed text will appear here.");
      toast.success("Converted!");
      setPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Processing failed.");
      setSafeText(`[SECURE] ${originalText}`);
    }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#f8f9fa] dark:bg-zinc-950 overflow-hidden relative">
      {/* Sidebar: Projects Dashboard */}
      <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shadow-sm z-20">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
              Your Projects
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                handleActionWithAuth(() => setIsCreateProjectModalOpen(true))
              }
              className="h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <FaPlus className="text-xs" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
          <div className="space-y-1">
            {!token ? (
              <div className="p-4 text-center space-y-3">
                <p className="text-xs italic text-zinc-400">
                  Login to see projects
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="rounded-full text-[10px] uppercase font-bold tracking-widest"
                >
                  Login
                </Button>
              </div>
            ) : projectsLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full animate-pulse bg-zinc-50 dark:bg-zinc-800/50 rounded-xl mb-1"
                  />
                ))
            ) : (
              projects.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group ${
                    selectedProjectId === p.id
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${selectedProjectId === p.id ? "bg-white/10 text-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800"}`}
                    >
                      <FaBriefcase className="text-xs" />
                    </div>
                    <span className="text-sm font-bold truncate max-w-[140px]">
                      {p.name}
                    </span>
                  </div>
                  <FaChevronRight
                    className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${selectedProjectId === p.id ? "opacity-100" : ""}`}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content: Native Scroll for better mouse compatibility */}
      <main className="flex-1 overflow-y-auto bg-transparent relative z-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto py-12 px-8 space-y-12 pb-32">
          {activeProject ? (
            <motion.div
              key={selectedProjectId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Active Project Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-widest">
                      Context
                    </span>
                    <h1 className="text-4xl font-black tracking-tighter">
                      {activeProject.name}
                    </h1>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {activeProject.clientName && (
                      <span className="flex items-center gap-2">
                        <FaUserAlt className="text-[10px]" />{" "}
                        {activeProject.clientName}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <SiFiverr className="text-[10px]" />{" "}
                      {activeProject.platform}
                    </span>
                    {activeProject.orderLink && (
                      <a
                        href={activeProject.orderLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-instagram-blue hover:underline"
                      >
                        <FaGlobe className="text-[10px]" /> Order Link
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500">
                  <FaShieldAlt className="text-base" /> SafeMode Active
                </div>
              </div>

              {/* Input Console */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-md">
                <div className="p-8 pb-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="p-4 min-h-[200px] w-full text-xl font-medium leading-relaxed border-none focus-visible:ring-0 resize-none bg-transparent placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                  />
                </div>
                <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800 flex justify-end items-center gap-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-auto">
                    {originalText.length} Chars
                  </span>
                  <Button
                    disabled={moderating || !originalText.trim()}
                    onClick={handleProcess}
                    className="h-14 px-10 rounded-2xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 text-white font-bold transition-all flex items-center gap-3 border-none shadow-xl shadow-zinc-200 dark:shadow-none"
                  >
                    {moderating ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <FaMagic className="text-lg" />
                        <span className="text-lg tracking-tight uppercase tracking-widest">
                          Secure Message
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Current Result */}
              <AnimatePresence>
                {safeText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between px-4">
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-instagram-blue">
                        Latest Secured Message
                      </span>
                      <Button
                        onClick={() => handleCopy(safeText)}
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 font-bold text-[10px] uppercase tracking-widest hover:bg-instagram-blue/5 text-instagram-blue border border-instagram-blue/20 rounded-xl"
                      >
                        {copied ? <FaCheck /> : <FaCopy />}
                        {copied ? "Copied" : "Copy Result"}
                      </Button>
                    </div>
                    <div className="border border-instagram-blue/20 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xl relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-instagram-blue to-instagram-pink opacity-50" />
                      <div className="p-10">
                        <p className="text-2xl font-bold leading-tight tracking-tight text-zinc-800 dark:text-zinc-100 selection:bg-instagram-blue/10 whitespace-pre-wrap italic">
                          "{safeText}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message History */}
              <div className="space-y-6 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3 px-2">
                  <FaHistory className="text-zinc-400" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                    Message History
                  </h2>
                </div>

                <div className="space-y-4">
                  {combinedHistory.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="group border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          <FaClock className="text-[8px]" />
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(msg.safeMsg)}
                          className="h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaCopy className="text-xs" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 opacity-50 line-clamp-1 italic">
                        Original: {msg.originalMsg}
                      </p>
                      <p className="text-lg font-bold text-zinc-700 dark:text-zinc-300 leading-snug">
                        {msg.safeMsg}
                      </p>
                    </div>
                  ))}

                  {/* Infinite Scroll Trigger */}
                  {hasMore && (
                    <div
                      ref={loadMoreRef}
                      className="h-20 flex items-center justify-center pt-4"
                    >
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
                    </div>
                  )}

                  {!hasMore && combinedHistory.length > 0 && (
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 pt-10">
                      End of history
                    </p>
                  )}

                  {combinedHistory.length === 0 && !historyLoading && (
                    <p className="text-sm italic text-zinc-300 px-2">
                      No messages yet for this project.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 pt-40">
              <div className="p-8 rounded-[3rem] bg-zinc-100 dark:bg-zinc-900">
                <FaBriefcase className="text-7xl text-zinc-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-widest">
                  Select a Project
                </h3>
                <p className="text-sm font-medium">
                  Messages are tracked per project context for platform safety.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals... */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="space-y-4 text-center pb-4">
            <div className="mx-auto p-4 rounded-[2rem] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 w-fit">
              <SiFiverr className="text-5xl" />
            </div>
            <DialogTitle className="text-3xl font-black tracking-tighter">
              Freelancer Login
            </DialogTitle>
            <DialogDescription className="text-base font-medium">
              Protect your communication with AI. Sign in to track messages per
              project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pb-4">
            <Button
              onClick={() =>
                (window.location.href = `${API_BASE_URL}/auth/google`)
              }
              className="w-full h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-4 font-bold shadow-sm"
            >
              <SiGoogle className="text-xl text-red-500" />
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateProjectModalOpen}
        onOpenChange={setIsCreateProjectModalOpen}
      >
        <DialogContent className="sm:max-w-lg rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black tracking-tight">
              Create New Context
            </DialogTitle>
            <DialogDescription>
              Associate your messages with a specific client or order.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                Project Name *
              </label>
              <Input
                placeholder="e.g. Logo Design"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
                className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-800 border-none px-6"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                  Client Name
                </label>
                <Input
                  placeholder="John"
                  value={projectForm.clientName}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      clientName: e.target.value,
                    })
                  }
                  className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-800 border-none px-6"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                  Platform
                </label>
                <Input
                  value={projectForm.platform}
                  disabled
                  className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-800 border-none px-6 opacity-40"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">
                Order URL
              </label>
              <Input
                placeholder="Fiverr Order Link..."
                value={projectForm.orderLink}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, orderLink: e.target.value })
                }
                className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-800 border-none px-6"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsCreateProjectModalOpen(false)}
              className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={creatingProject}
              className="rounded-2xl h-12 px-8 bg-zinc-900 dark:bg-white dark:text-zinc-900 font-black uppercase tracking-widest text-[10px] shadow-lg"
            >
              {creatingProject ? "Creating..." : "Launch Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
