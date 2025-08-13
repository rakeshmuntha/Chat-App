
const formatMessageTime = (date: string ) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).substring(0, 5);
}

export default formatMessageTime