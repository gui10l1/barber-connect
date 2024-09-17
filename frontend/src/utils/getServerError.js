export default function getServerError(err) {
  if (!err?.response?.data) return undefined;

  const { message } = err.response.data;

  return { message };
}