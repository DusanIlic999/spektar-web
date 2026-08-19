import { useMutation } from "@tanstack/react-query";
import { Form, Input, Row } from "antd";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";
import { useForm } from "antd/es/form/Form";
import OAuthButton from "./OAuth/oauth.button";

interface IRegister {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

interface IRegisterFormProps {
  close: () => void;
}

export const RegisterForm = ({ close }: IRegisterFormProps) => {
  const [form] = useForm();
  const { mutate } = useMutation({
    mutationFn: (obj: IRegister) => apiClient.post("/users", obj),
    onSuccess: () => {
      toast.success("Uspesna registracija", "Uspesno ste kreirali profil.");
      close();
    },
    onError: () =>
      toast.error(
        "Neuspela registracija",
        "Desila se greska tokom registracije, molim vas proverite sa administratorom.",
      ),
  });

  const onFinish = (obj: IRegister) => {
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
            label={<span className="text-white">Korisnicko ime</span>}
            name="username"
          >
            <Input
              className="w-70! 2xl:w-100!"
              placeholder="Korisnicko ime..."
            />
          </Form.Item>
        </Row>
        <Row justify={"center"}>
          <Form.Item
            label={<span className="text-white">Lozinka</span>}
            name={"password"}
          >
            <Input.Password
              className="w-70! 2xl:w-100!"
              placeholder="Lozinka..."
            />
          </Form.Item>
        </Row>
        <Row justify={"center"}>
          <Form.Item
            label={<span className="text-white">Prikazano ime</span>}
            name={"displayName"}
          >
            <Input
              className="w-70! 2xl:w-100!"
              placeholder="Prikazano ime..."
            />
          </Form.Item>
        </Row>
        <Row justify={"end"} className="flex items-end gap-5 text-white">
          <button className="w-fit h-fit px-3 py-2 bg-green-800/80 rounded-sm cursor-pointer select-none">
            Registruj se
          </button>
          <OAuthButton />
        </Row>
      </Form>
    </div>
  );
};
