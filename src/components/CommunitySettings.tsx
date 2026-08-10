import { Col, Form, Input, Row } from "antd";
import type { ICommunity } from "../types/community";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import type { IMember } from "../types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../lib/toast";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useModal } from "../context/moda.context.use";
import { useCurrentUser } from "../lib/use-current-user";

export const CommunitySettings = ({
  community,
  members,
  slug,
}: {
  community: ICommunity;
  members: IMember[];
  slug: string;
}) => {
  const [form] = useForm();
  const [category, setCategory] = useState(community.category);
  const [type, setType] = useState(community.type);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const currentUser = useCurrentUser();

  const makeOwner = useMutation({
    mutationFn: (userId: string) =>
      apiClient.patch(`/communities/${community.id}/make/${userId}/owner`),
    onSuccess: () => {
      toast.success(
        "Vlasnik izmenjen",
        "Uspesno ste izmenili vlasnika zajednice!",
      );
      queryClient.invalidateQueries({ queryKey: ["members", slug, "full"] });
    },
    onError: () =>
      toast.error(
        "Greska tokom izmene vlasnika",
        "Desila se greska tokom izmene vlasnika zajednice, proverite sa administratorom",
      ),
  });

  const deleteCommunity = useMutation({
    mutationFn: () => apiClient.delete(`/communities/${community.id}`),
    onSuccess: () => {
      toast.success("Zajednica obrisana", "Uspesno ste obrisali zajednice!");
      queryClient.invalidateQueries({ queryKey: ["community", slug, "full"] });
      navigate("/communities");
    },
    onError: () =>
      toast.error(
        "Greska tokom brisanja zajednice",
        "Desila se greska tokom brisanja zajednice, proverite sa administratorom",
      ),
  });

  const { mutate } = useMutation({
    mutationFn: (obj: {
      name: string;
      description: string;
      type: string;
      category: string;
    }) => apiClient.patch(`/communities/${community.id}`, obj),
    onSuccess: () => {
      toast.success("Zajednica izmenjena", "Uspesno ste izmenili zajednicu!");
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["community", slug, "full"] });
    },
    onError: () =>
      toast.error(
        "Greska tokom izmene",
        "Desila se greska tokom izmene zajednice, proverite sa administratorom",
      ),
  });

  const { mutate: disband, isPending: disbandPending } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/communities/${community.id}/disband`);
    },
    onSuccess: () => {
      toast.success("Vidimo se", "Uspesno ste se izasli iz zajednici.");
      queryClient.invalidateQueries({
        queryKey: ["community", community.slug, "full"],
      });
      queryClient.invalidateQueries({
        queryKey: ["members", community.slug, "full"],
      });
    },
    onError: () =>
      toast.error(
        "Greska tokom izlaza iz zajednice",
        "Desila se greska tokom izlaska iz zajednice, pokusajte ponovo ili pozovite administratora",
      ),
  });

  const handleOwnerDisband = () => {
    return openModal(
      <div>
        <label htmlFor="owner">Prosledi vlastinistvo zajednice:</label>
        <select
          name="owner"
          className="mt-2 w-full! dd"
          onChange={(elId) => makeOwner.mutate(elId.currentTarget.value)}
        >
          {members.map((member: IMember) => {
            if (member.id === currentUser?.id) return;
            return (
              <option value={member.user.id}>
                <div>
                  {member.user.displayName}, {member.user.email}, {member.role}
                </div>
              </option>
            );
          })}
        </select>
      </div>,
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      name: community.name,
      description: community.description,
    });
  }, [community, form]);

  const onFinish = (values: { name: string; description: string }) => {
    mutate({
      name: values.name,
      description: values.description,
      category,
      type,
    });
  };

  return (
    <div className="w-full p-5 space-y-5 bg-gray-900 rounded-lg">
      <div className="p-7 border border-white/25 rounded-lg bg-black/30">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name={"name"}
                label={<span className="text-white">Ime Zajednice</span>}
              >
                <Input placeholder="Ime zajednice..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name={"description"}
                label={<span className="text-white">Opis Zajednice</span>}
              >
                <Input.TextArea
                  rows={4}
                  style={{ resize: "none" }}
                  placeholder="Opis zajednice..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Form.Item
              label={
                <span className="text-gray-400 text-sm font-semibold">
                  TIP ZAJEDNICE
                </span>
              }
            >
              <div className="flex flex-col 2xl:flex-row gap-3 pt-2">
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
          </Row>
          <Row justify={"end"}>
            <button className="border border-green-600 bg-green-800 text-white px-3 py-1 rounded-sm cursor-pointer">
              Sacuvaj
            </button>
          </Row>
        </Form>
      </div>
      <div>
        <div className="flex p-3 gap-2 w-full justify-end items-end h-full">
          <button
            className="px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer"
            onClick={handleOwnerDisband}
          >
            Izadji iz zajednice
          </button>
          <button
            className="px-3 py-1 bg-red-800 border border-red-600 rounded-lg cursor-pointer"
            onClick={() => {
              deleteCommunity.mutate();
            }}
          >
            Obrisi zajednicu
          </button>
        </div>
      </div>
    </div>
  );
};
