import { icons as logos } from "@iconify-json/logos";
import { icons as simpleIcons } from "@iconify-json/simple-icons";
import { icons as arcticons } from "@iconify-json/arcticons";

export type BrandIconName = "microsoft365" | "microsoft" | "azure" | "teams" | "sharepoint" | "onedrive" | "copilot" | "security" | "serverbox" | "shield" | "paloalto" | "cisco" | "hp";

type BrandIconData = {
  body: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type IconCollection = {
  prefix: string;
  width?: number;
  height?: number;
  icons: Record<string, { body: string; left?: number; top?: number; width?: number; height?: number }>;
};

function iconFrom(collection: IconCollection, name: string): BrandIconData {
  const icon = collection.icons[name];
  if (!icon) throw new Error(`Missing brand icon: ${collection.prefix}:${name}`);

  return {
    left: icon.left ?? 0,
    top: icon.top ?? 0,
    width: icon.width ?? collection.width ?? 24,
    height: icon.height ?? collection.height ?? 24,
    ...icon,
  };
}

const brandIcons: Record<BrandIconName, BrandIconData> = {
  microsoft365: iconFrom(logos, "microsoft-icon"),
  microsoft: iconFrom(logos, "microsoft-icon"),
  azure: iconFrom(logos, "microsoft-azure"),
  teams: iconFrom(logos, "microsoft-teams"),
  sharepoint: iconFrom(simpleIcons, "microsoftsharepoint"),
  onedrive: iconFrom(logos, "microsoft-onedrive"),
  copilot: iconFrom(arcticons, "microsoft-copilot"),
  security: iconFrom(arcticons, "microsoft-defender"),
  serverbox: iconFrom(arcticons, "serverbox"),
  shield: iconFrom(arcticons, "shield"),
  paloalto: iconFrom(simpleIcons, "paloaltonetworks"),
  cisco: iconFrom(simpleIcons, "cisco"),
  hp: iconFrom(simpleIcons, "hp"),
};

export function BrandIcon({
  name,
  size = 96,
  className,
  tone = "light",
}: {
  name: BrandIconName;
  size?: number;
  className?: string;
  tone?: "light" | "dark";
}) {
  const icon = brandIcons[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${icon.left} ${icon.top} ${icon.width} ${icon.height}`}
      width={size}
      height={size}
      className={`brand-icon brand-icon--${tone}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
