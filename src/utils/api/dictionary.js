import Swal from "sweetalert2";

export const checkWord = async (word) => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = await res.json();

    if (data.title === "No Definitions Found") {
      Swal.fire({
        icon: "error",
        title: "Invalid Word",
        text: data.message,
        confirmButtonColor: "#6366f1",
        background: "#0f172a",
        color: "#f1f5f9",
      });
      return false; // ❌ invalid word
    } else {
      Swal.fire({
        icon: "success",
        title: `Valid Word: ${word}`,
        text: "Meaning fetched successfully!",
        confirmButtonColor: "#22c55e",
        background: "#0f172a",
        color: "#f1f5f9",
      });
      return true; // ✅ valid word
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while checking the word.",
      confirmButtonColor: "#ef4444",
      background: "#0f172a",
      color: "#f1f5f9",
    });
    return false;
  }
};
