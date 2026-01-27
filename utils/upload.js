export const uploadMedia = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file); // ব্যাকএন্ডে 'file' নামে রিসিভ করবে

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        // মাল্টিপার্ট ফর্মে Content-Type দিতে হয় না, ব্রাউজার নিজে সেট করে নেয়
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    const data = await res.json();

    if (data.success) {
      // ব্যাকএন্ড থেকে আসা ডাটা স্ট্রাকচার:
      // { url, publicId, mediaType, originalName }
      return data.media; 
    } else {
      console.error("Upload Failed:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};