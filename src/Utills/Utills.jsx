export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "active":
      return "green";
    case "pending":
      return "orange";
    case "rejected":
      return "red";
    case "refund":
      return "purple";
    case "verified":
      return "blue";
    case "created":
      return "cyan";
    case "inactive":
      return "gray";
    default:
      return "default";
  }
};


export function toIST(dateInput) {
  if (!dateInput) return "--"; // handle undefined/null

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "--"; // handle invalid date

  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(date);
}


export const CATEGORY_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1521334884684-d80222895322",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  },
];

