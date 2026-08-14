// src/features/posts/components/ShareButton.tsx
import { Dropdown, App } from "antd";
import type { MenuProps } from "antd";
import { useShare } from "../lib/useShare";
import { IoShareSocialOutline } from "react-icons/io5";

const targets = {
  x: (u: string, t: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  facebook: (u: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  whatsapp: (u: string, t: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  telegram: (u: string, t: string) =>
    `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
};

const openExternal = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

interface Props {
  url: string;
  title: string;
}

export function ShareButton({ url, title }: Props) {
  const { share, copyLink, canNativeShare } = useShare();
  const { message } = App.useApp();

  // na mobilnom: jedan klik → native share sheet, bez dropdown-a
  if (canNativeShare) {
    return (
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => share({ title, url })}
      >
        <IoShareSocialOutline />
        Podeli
      </button>
    );
  }

  const items: MenuProps["items"] = [
    {
      key: "copy",
      label: "Kopiraj link",
      onClick: async () => {
        const ok = await copyLink(url);
        if (ok) {
          message.success("Link kopiran");
        } else {
          message.error("Kopiranje nije uspelo");
        }
      },
    },
    { type: "divider" },
    {
      key: "x",
      label: "X",
      onClick: () => openExternal(targets.x(url, title)),
    },
    {
      key: "fb",
      label: "Facebook",
      onClick: () => openExternal(targets.facebook(url)),
    },
    {
      key: "wa",
      label: "WhatsApp",
      onClick: () => openExternal(targets.whatsapp(url, title)),
    },
    {
      key: "tg",
      label: "Telegram",
      onClick: () => openExternal(targets.telegram(url, title)),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomLeft">
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer"
      >
        <IoShareSocialOutline />
        Podeli
      </button>
    </Dropdown>
  );
}
