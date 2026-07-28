import { useMutation } from "@tanstack/react-query";
import { Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";

interface ICreateCommunity {
  name: string;
  description: string;
  type: string;
  category: string;
}

export default function CreateCommunityFormPage() {
  const [form] = useForm();
  const [category, setCategory] = useState("neightborhood");
  const [type, setType] = useState("public");

  const { mutate } = useMutation({
    mutationFn: (obj: ICreateCommunity) => apiClient.post("/communities", obj),
    onSuccess: () => {
      toast.success("Zajednica kreirana", "Uspesno ste kreirali zajednicu!");
      form.resetFields();
    },
    onError: () =>
      toast.error(
        "Greska pri kreiranju",
        "Desila se greska pri kreiranju zajednice, proverite sa administratorom",
      ),
  });

  const onFinish = (obj: ICreateCommunity) => {
    mutate({ ...obj, category: category, type: type });
  };

  return (
    <>
      <div className="w-full flex justify-center pb-5">
        <div className="w-150 text-white">
          <h3 className="text-xl font-bold py-4">Kreiraj zajednicu</h3>
          <div className="bg-black/80 w-150 rounded-2xl border border-white/15">
            <Form
              layout="vertical"
              className="!p-5"
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                name={"name"}
                label={
                  <span className="text-gray-400 font-semibold text-sm">
                    NAZIV ZAJEDNICE
                  </span>
                }
              >
                <Input
                  className="dark-input"
                  placeholder="npr. Zemun Zajednica"
                />
              </Form.Item>
              <Form.Item
                name={"description"}
                label={
                  <span className="text-gray-400 text-sm font-semibold">
                    OPIS
                  </span>
                }
              >
                <Input.TextArea
                  className="dark-input"
                  placeholder="Opisi sta je svrha ove zajednice..."
                  rows={4}
                  style={{ resize: "none" }}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 text-sm font-semibold">
                    KATEGORIJA
                  </span>
                }
              >
                <div className="text-white flex-wrap flex items-center gap-5">
                  <div
                    className={`px-3 py-2 ${category === "neightborhood" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("neightborhood")}
                  >
                    Kvart/Komsiluk
                  </div>
                  <div
                    className={`px-3 py-2 ${category === "hobby" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("hobby")}
                  >
                    Hobi
                  </div>
                  <div
                    className={`px-3 py-2 ${category === "sport" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("sport")}
                  >
                    Sport
                  </div>
                  <div
                    className={`px-3 py-2 ${category === "food" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("food")}
                  >
                    Hrana i pice
                  </div>
                  <div
                    className={`px-3 py-2 ${category === "events" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("events")}
                  >
                    Dogadjaji
                  </div>
                  <div
                    className={`px-3 py-2 ${category === "rest" && "bg-green-600"} border-white/25 border rounded-2xl cursor-pointer select-none`}
                    onClick={() => setCategory("rest")}
                  >
                    Ostalo
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label={
                  <span className="text-gray-400 text-sm font-semibold">
                    TIP ZAJEDNICE
                  </span>
                }
              >
                <div className="flex gap-3 pt-2">
                  <div
                    className={`flex flex-col gap-2 p-4 cursor-pointer ${type === "public" ? "bg-green-400/20 border-green-400" : "border-white/25"} rounded-2xl border select-none`}
                    onClick={() => setType("public")}
                  >
                    <span
                      className={`${type === "public" ? "text-green-400" : "text-gray-400"} font-medium`}
                    >
                      Javna
                    </span>
                    <span className="text-gray-400 text-xs">
                      Svi mogu da vide i pridruze se
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-2 p-4 cursor-pointer ${type === "restricted" ? "bg-green-400/20 border-green-400" : "border-white/25"} rounded-2xl border select-none`}
                    onClick={() => setType("restricted")}
                  >
                    <span
                      className={`${type === "restricted" ? "text-green-400" : "text-gray-400"} font-medium`}
                    >
                      Ogranicena
                    </span>
                    <span className="text-gray-400 text-xs">
                      Svi mogu da vide, pridruzivanje na odobrenje
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-2 p-4 cursor-pointer ${type === "private" ? "bg-green-400/20 border-green-400" : "border-white/25"} rounded-2xl border select-none`}
                    onClick={() => setType("private")}
                  >
                    <span
                      className={`${type === "private" ? "text-green-400" : "text-gray-400"} font-medium`}
                    >
                      Privatna
                    </span>
                    <span className="text-gray-400 text-xs">
                      Samo pozvani mogu da vide
                    </span>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                name={"location"}
                label={
                  <span className="text-gray-400 text-sm font-semibold">
                    LOKACIJA
                  </span>
                }
              >
                <Input
                  className="dark-input"
                  placeholder="npr. Vracar, Beograd (opciono)"
                />
              </Form.Item>
              <Row justify={"end"} className="flex gap-5 text-white">
                <button
                  className="px-4 py-2 border border-gray-400 rounded-2xl cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    form.resetFields();
                    setType("public");
                    setCategory("neightborhood");
                  }}
                >
                  Otkazi
                </button>
                <button className="px-4 py-2 bg-green-600 border border-green-400 rounded-2xl cursor-pointer">
                  Kreiraj zajednicu
                </button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
