import { notification } from "antd";

const success = (msg: string, desc?: string) =>
  notification.success({ message: msg, description: desc });

const error = (msg: string, desc?: string) =>
  notification.error({ message: msg, description: desc });

const warning = (msg: string, desc?: string) =>
  notification.warning({ message: msg, description: desc });

const info = (msg: string, desc?: string) =>
  notification.info({ message: msg, description: desc });

export const toast = { success, error, warning, info };
