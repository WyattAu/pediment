import { createSignal, Show } from "solid-js";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  class?: string;
}

export default function Avatar(props: AvatarProps) {
  const [imgError, setImgError] = createSignal(false);

  const sizeStyles = () => {
    switch (props.size ?? "md") {
      case "sm": return "h-8 w-8 text-xs";
      case "lg": return "h-12 w-12 text-lg";
      case "xl": return "h-16 w-16 text-xl";
      default: return "h-10 w-10 text-sm";
    }
  };

  const initials = () => {
    const name = props.name ?? props.alt ?? "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];
  const colorIndex = () => {
    const name = props.name ?? props.alt ?? "";
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % colors.length;
  };

  return (
    <div class={`relative inline-flex items-center justify-center rounded-full font-medium text-white ${sizeStyles()} ${colors[colorIndex()]} ${props.class ?? ""}`}>
      <Show
        when={props.src && !imgError()}
        fallback={<span>{initials()}</span>}
      >
        <img
          src={props.src}
          alt={props.alt ?? props.name ?? "Avatar"}
          onError={() => setImgError(true)}
          class="h-full w-full rounded-full object-cover"
        />
      </Show>
    </div>
  );
}
