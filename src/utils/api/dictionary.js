import Swal from "sweetalert2";

export const checkWord = async (word) => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      // ignore json parse error
    }

    // not found → show swal and return false
    if (!res.ok) {
      const message =
        data?.message ||
        "Sorry pal, we couldn't find definitions for the word you were looking for.";
      Swal.fire({
        icon: "error",
        title: "Invalid Word",
        text: message,
        confirmButtonColor: "#6366f1",
        background: "#0f172a",
        color: "#f1f5f9",
      });
      return false;
    }

    // found → no swal here; just return true
    return true;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Could not verify the word. Please check your connection.",
      confirmButtonColor: "#ef4444",
      background: "#0f172a",
      color: "#f1f5f9",
    });
    return false;
  }
};
