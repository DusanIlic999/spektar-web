import { notification } from "antd";

const success = (msg: string, desc?: string) =>
  notification.success({ message: msg, description: desc, placement: "bottomRight" });

const error = (msg: string, desc?: string) =>
  notification.error({ message: msg, description: desc, placement: "bottomRight"  });

const warning = (msg: string, desc?: string) =>
  notification.warning({ message: msg, description: desc, placement: "bottomRight"  });

const info = (msg: string, desc?: string) =>
  notification.info({ message: msg, description: desc, placement: "bottomRight"  });

export const toast = { success, error, warning, info };
