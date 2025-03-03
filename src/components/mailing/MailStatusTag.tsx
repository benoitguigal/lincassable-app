import { Tag } from "antd";

type MailStatutEnum =
  | "created"
  | "waiting"
  | "request"
  | "click"
  | "deferred"
  | "delivered"
  | "soft_bounce"
  | "spam"
  | "unique_opened"
  | "hard_bounce"
  | "opened"
  | "invalid_email"
  | "blocked"
  | "error"
  | "blocked"
  | "proxy_open"
  | "unique_proxy_open";

type Props = {
  statut: MailStatutEnum;
};

const MailStatusTag: React.FC<Props> = ({ statut }) => {
  let color = "";
  let label = "";

  switch (statut) {
    case "created":
      color = "yellow";
      label = "Created";
      break;
    case "waiting":
      color = "gray";
      label = "Waiting";
      break;
    case "request":
      color = "blue";
      label = "Request";
      break;
    case "click":
      color = "green";
      label = "Click";
      break;
    case "deferred":
      color = "orange";
      label = "Deferred";
      break;
    case "delivered":
      color = "purple";
      label = "Délivré";
      break;
    case "soft_bounce":
      color = "red";
      label = "Soft Bounce";
      break;
    case "spam":
      color = "brown";
      label = "Spam";
      break;
    case "unique_opened":
    case "opened":
      color = "cyan";
      label = "Ouvert";
      break;
    case "hard_bounce":
      color = "darkred";
      label = "Hard Bounce";
      break;
    case "invalid_email":
      color = "darkorange";
      label = "Invalid Email";
      break;
    case "blocked":
      color = "black";
      label = "Blocked";
      break;
    case "error":
      color = "red";
      label = "Error";
      break;
    case "proxy_open":
      color = "lightblue";
      label = "Proxy Open";
      break;
    case "unique_proxy_open":
      color = "darkblue";
      label = "Unique Proxy Open";
      break;
    default:
      color = "gray";
      label = "Unknown";
      break;
  }

  return <Tag color={color}>{label}</Tag>;
};

export default MailStatusTag;
