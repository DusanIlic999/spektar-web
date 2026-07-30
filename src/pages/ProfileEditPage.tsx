import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";

export default function ProfileEditPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = useForm();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const user = state?.user;

  const { mutate, isPending } = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("displayName", values.displayName);
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("bio", values.bio);
      if (image) {
        formData.append("image", image);
      }
      return apiClient.put("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Profil izmenjen", "Uspesno ste izmenili profil!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      form.resetFields();
      handleRemove();
      navigate("/profile");
    },
    onError: () =>
      toast.error(
        "Greska pri izmeni profila",
        "Desila se greska pri izmeni profila, pokusajte ponovo",
      ),
  });
  useEffect(() => {
    if (!user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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

  const onFinish = (values: any) => {
    mutate(values);
  };
  if (!user) return null;
  return (
    <div className="w-full flex flex-col items-center pb-5">
      <div className="w-xl text-white">
        <h3 className="text-xl font-bold py-4">Izmeni profil</h3>
      </div>
      <div className="bg-black/80 w-xl rounded-2xl border border-white/15">
        <Form
          layout="vertical"
          className="!p-5"
          onFinish={onFinish}
          form={form}
          initialValues={user}
        >
          <Form.Item
            name={"displayName"}
            label={
              <span className="text-gray-400 font-semibold text-sm">
                VIDLJIVO IME
              </span>
            }
          >
            <Input className="dark-input" placeholder="npr. Peki Banana" />
          </Form.Item>
          <Form.Item
            name={"bio"}
            label={
              <span className="text-gray-400 text-sm font-semibold">
                BIOGRAFIJA
              </span>
            }
          >
            <Input.TextArea
              className="dark-input"
              placeholder="Biografija o tebi i tvojim interesovanjima..."
              rows={4}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Form.Item
            name={"email"}
            label={
              <span className="text-gray-400 font-semibold text-sm">EMAIL</span>
            }
          >
            <Input
              className="dark-input"
              placeholder="npr. peraperic@example.com"
            />
          </Form.Item>

          <Form.Item
            name={"username"}
            label={
              <span className="text-gray-400 font-semibold text-sm">
                USERNAME
              </span>
            }
          >
            <Input className="dark-input" placeholder="npr. PetarPera" />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-gray-400 text-sm font-semibold">
                Avatar
              </span>
            }
          >
            <div className="w-130! h-40 mt-1 bg-black/50 relative rounded-2xl">
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
                    className="w-130! h-40 relative -top-8 object-cover rounded-xl"
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
                  className="absolute z-10 bg-gray-900/50 rounded-2xl w-full h-full top-0 backdrop-blur-[2px] select-none cursor-pointer flex items-center justify-center text-gray-200/50 font-semibold"
                >
                  Klikni da dodas sliku
                </div>
              )}
            </div>
          </Form.Item>
          <Row justify={"end"} className="flex gap-5 text-white">
            <button
              className="px-4 py-2 bg-green-600 border border-green-400 rounded-lg cursor-pointer"
              disabled={isPending}
            >
              Izmeni profil
            </button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
