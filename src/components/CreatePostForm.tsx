import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { apiClient } from "../api/client";
import { toast } from "../lib/toast";

const POSTYPE = {
  ANNOUNCEMENT: "announcement",
  GUIDE: "guide",
  EVENT: "event",
  DISCUSSION: "discussion",
  PHOTO: "photo",
} as const;

type EPostType = (typeof POSTYPE)[keyof typeof POSTYPE];

interface ICreatePost {
  title: string;
  content: string;
}

interface CreatePostFormProps {
  communityId: string;
  slug?: string;
  onSuccess?: () => void;
}

export const CreatePostForm = ({
  communityId,
  slug,
  onSuccess,
}: CreatePostFormProps) => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<EPostType>(POSTYPE.ANNOUNCEMENT);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ICreatePost) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("type", type);
      formData.append("communityId", communityId);
      if (image) {
        formData.append("image", image);
      }
      return apiClient.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Objava kreirana", "Uspesno ste objavili post!");
      queryClient.invalidateQueries({ queryKey: ["posts", slug] });
      form.resetFields();
      handleRemove();
      setType(POSTYPE.ANNOUNCEMENT);
      onSuccess?.();
    },
    onError: () =>
      toast.error(
        "Greska pri objavljivanju",
        "Desila se greska pri kreiranju objave, pokusajte ponovo",
      ),
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImage(null);
  };

  const onFinish = (values: ICreatePost) => {
    mutate(values);
  };

  return (
    <div className="w-full">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row justify={"start"}>
          <Form.Item
            label={<span className="text-white">Title</span>}
            name="title"
            rules={[{ required: true, message: "Naslov je obavezan" }]}
          >
            <Input className="w-70! 2xl:w-130!" placeholder="Title..." />
          </Form.Item>
        </Row>
        <Row justify={"start"}>
          <Form.Item
            label={<span className="text-white">Content</span>}
            name="content"
            rules={[{ required: true, message: "Sadrzaj je obavezan" }]}
          >
            <Input.TextArea
              className="w-70! 2xl:w-130!"
              placeholder="Content..."
              rows={4}
              style={{ resize: "none" }}
            />
          </Form.Item>
        </Row>
        <Row justify={"start"}>
          <Form.Item label={<span className="text-white">Tip objave</span>}>
            <div className="text-white flex-wrap flex items-center gap-5">
              <div
                className={`px-3 py-2 ${type === POSTYPE.ANNOUNCEMENT && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                onClick={() => setType(POSTYPE.ANNOUNCEMENT)}
              >
                Obavestenje
              </div>
              <div
                className={`px-3 py-2 ${type === POSTYPE.DISCUSSION && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                onClick={() => setType(POSTYPE.DISCUSSION)}
              >
                Diskusija
              </div>
              <div
                className={`px-3 py-2 ${type === POSTYPE.EVENT && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                onClick={() => setType(POSTYPE.EVENT)}
              >
                Dogadjaj
              </div>
              <div
                className={`px-3 py-2 ${type === POSTYPE.GUIDE && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                onClick={() => setType(POSTYPE.GUIDE)}
              >
                Vodic
              </div>
              <div
                className={`px-3 py-2 ${type === POSTYPE.PHOTO && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                onClick={() => setType(POSTYPE.PHOTO)}
              >
                Fotografija
              </div>
            </div>
          </Form.Item>
        </Row>
        <Row justify={"start"}>
          <Form.Item
            label={<span className="text-white">Slika (opciono)</span>}
          >
            <div className="w-70! 2xl:w-130! h-40 mt-1 bg-black/50 rounded-lg relative">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-70! 2xl:w-130! h-40 relative -top-8 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute -top-10 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-red-700"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleClick}
                  className="absolute z-10 bg-black/50 w-full h-full top-0 backdrop-blur-[2px] select-none cursor-pointer rounded-lg flex items-center justify-center text-white"
                >
                  Klikni da dodas sliku
                </div>
              )}
            </div>
          </Form.Item>
        </Row>
        <Row justify={"end"} className="flex gap-5 text-white">
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 bg-green-600/80 rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Objavljivanje..." : "Objavi"}
          </button>
        </Row>
      </Form>
    </div>
  );
};
