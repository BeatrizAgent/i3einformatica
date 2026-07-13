import { icons as lucide } from "@iconify-json/lucide";

export type UiIconName = "arrow-right" | "arrow-down" | "arrow-up-right" | "chevron-down" | "menu" | "triangle-alert" | "x";

type IconData = {
  body: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const uiIcons = Object.fromEntries(
  (["arrow-right", "arrow-down", "arrow-up-right", "chevron-down", "menu", "triangle-alert", "x"] as UiIconName[]).map((name) => {
    const icon = lucide.icons[name];
    if (!icon) throw new Error(`Missing UI icon: lucide:${name}`);
    return [name, {
      body: icon.body,
      left: icon.left ?? 0,
      top: icon.top ?? 0,
      width: icon.width ?? lucide.width ?? 24,
      height: icon.height ?? lucide.height ?? 24,
    } satisfies IconData];
  }),
) as Record<UiIconName, IconData>;

export function UiIcon({ name, size = 18, className }: { name: UiIconName; size?: number; className?: string }) {
  const icon = uiIcons[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${icon.left} ${icon.top} ${icon.width} ${icon.height}`}
      width={size}
      height={size}
      className={`ui-icon${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
