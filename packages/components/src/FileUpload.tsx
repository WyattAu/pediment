import { createSignal, Show, For } from "solid-js";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  onFiles?: (files: File[]) => void;
  class?: string;
}

export default function FileUpload(props: FileUploadProps) {
  const [dragging, setDragging] = createSignal(false);
  const [files, setFiles] = createSignal<File[]>([]);
  const [error, setError] = createSignal<string>("");

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const maxSize = props.maxSize ?? 10 * 1024 * 1024; // 10MB default
    const oversized = newFiles.find(f => f.size > maxSize);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }
    setError("");
    const updated = props.multiple ? [...files(), ...newFiles] : newFiles;
    setFiles(updated);
    props.onFiles?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files().filter((_, i) => i !== index);
    setFiles(updated);
    props.onFiles?.(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div class={props.class ?? ""}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        class={`flex flex-col items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed p-8 transition-colors ${
          dragging() ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--accent)]/50"
        }`}
      >
        <div class="text-3xl mb-2">📁</div>
        <p class="text-sm text-[var(--text-primary)] font-medium">Drop files here or click to upload</p>
        <p class="text-xs text-[var(--text-secondary)] mt-1">
          {props.accept ?? "Any file"} {props.maxSize ? `• Max ${Math.round(props.maxSize / 1024 / 1024)}MB` : ""}
        </p>
        <input
          type="file"
          accept={props.accept}
          multiple={props.multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          class="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      <Show when={error()}>
        <p class="mt-2 text-xs text-red-500">{error()}</p>
      </Show>
      <Show when={files().length > 0}>
        <div class="mt-3 space-y-2">
          <For each={files()}>
            {(file, i) => (
              <div class="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-sm">📄</span>
                  <span class="text-sm text-[var(--text-primary)] truncate">{file.name}</span>
                  <span class="text-xs text-[var(--text-secondary)]">{formatSize(file.size)}</span>
                </div>
                <button onClick={() => removeFile(i())} class="text-[var(--text-secondary)] hover:text-red-500 text-sm">×</button>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
