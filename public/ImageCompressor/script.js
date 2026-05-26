const upload = document.getElementById("upload");
const quality = document.getElementById("quality");
const compressBtn = document.getElementById("compressBtn");

const originalPreview = document.getElementById("originalPreview");
const compressedPreview = document.getElementById("compressedPreview");

const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");

const percentage = document.getElementById("percentage");
const downloadBtn = document.getElementById("downloadBtn");

let file;

upload.addEventListener("change", (e) => {
  file = e.target.files[0];

  if (!file) return;

  originalPreview.src = URL.createObjectURL(file);

  originalSize.textContent =
    "Original Size: " + (file.size / 1024).toFixed(2) + " KB";
});

compressBtn.addEventListener("click", () => {
  if (!file) return;

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = (event) => {
    const img = new Image();

    img.src = event.target.result;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const compressedUrl = URL.createObjectURL(blob);

          compressedPreview.src = compressedUrl;

          const compressedKB = (blob.size / 1024).toFixed(2);
          const originalKB = (file.size / 1024).toFixed(2);

          compressedSize.textContent =
            "Compressed Size: " + compressedKB + " KB";

          const saved = (
            ((originalKB - compressedKB) / originalKB) *
            100
          ).toFixed(2);

          percentage.textContent =
            "Compression Reduced: " + saved + "%";

          downloadBtn.href = compressedUrl;
        },
        "image/jpeg",
        quality.value
      );
    };
  };
});