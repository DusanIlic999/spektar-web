import { Form, Input, Row, type FormInstance } from "antd";

interface CommentFormProps {
  form: FormInstance<any>;
  onFinish: ({ comment }: { comment: string; }) => void;
  loading: boolean;
  label: string;
}

export function CommentForm({
  form,
  onFinish,
  loading,
  label = "Ostavi komentar:",
}: CommentFormProps) {
  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
    <Form.Item
        name="comment"
        rules={[{ required: true, message: "Komentar ne može biti prazan" }]}
        label={<span className="text-white font-bold">{label}</span>}
      >
        <Input.TextArea
          className="dark-input"
          rows={4}
          style={{ resize: "none" }}
          placeholder="Komentar..."
        />
      </Form.Item>
      <Row justify="end">
        <button
          disabled={loading}
          className="text-white px-2 py-1 border border-green-600 bg-green-800 rounded-md cursor-pointer disabled:opacity-50"
          type="submit"
        >
          Komentariši
        </button>
      </Row>
    </Form>
  );
}
