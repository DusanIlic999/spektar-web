import { useMutation } from "@tanstack/react-query";
import { Form, Input, Row } from "antd";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";
import { useForm } from "antd/es/form/Form";
import { useAuthStore } from "../store/authStore";
import { userStorage } from "../lib/userStorage";

interface ILogin {
  email: string;
  password: string;
}

interface ILoginFormProps {
  close: () => void;
}

export const LoginForm = ({ close }: ILoginFormProps) => {
  const setToken = useAuthStore((s) => s.setToken);
  const [form] = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: (obj: ILogin) => apiClient.post("/auth/login", obj),
    onSuccess: (data: {
      data: {
        accessToken: string;
        user: {
          id: string;
          email: string;
          username: string;
          displayName: string;
        };
      };
    }) => {
      toast.success("Uspesna prijava", "Uspesno ste se prijavili.");
      setToken(data.data.accessToken);
      userStorage.set(data.data.user.username);
      close();
    },
    onError: () =>
      toast.error(
        "Pogresni kredencijali",
        "Desila se greska tokom prijave, proverite svoje kredencijale.",
      ),
  });

  const onFinish = (obj: ILogin) => {
    mutate(obj);
    form.resetFields();
  };

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Row justify={"center"}>
          <Form.Item
            label={<span className="text-white">Email</span>}
            name="email"
          >
            <Input className="w-70! 2xl:w-100!" placeholder="Email..." />
          </Form.Item>
        </Row>
        <Row justify={"center"}>
          <Form.Item
            label={<span className="text-white">Lozinka</span>}
            name={"password"}
          >
            <Input.Password className="w-70! 2xl:w-100!" placeholder="Lozinka..." />
          </Form.Item>
        </Row>
        <Row justify={"end"} className="flex gap-5 text-white">
          <button
            disabled={isPending}
            className="px-3 py-2 bg-green-800/80 rounded-xl cursor-pointer select-none"
          >
            Prijavi se
          </button>
        </Row>
      </Form>
    </div>
  );
};
