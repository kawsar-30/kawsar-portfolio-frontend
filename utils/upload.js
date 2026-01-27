export const uploadMedia = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file); // 

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    const data = await res.json();

    if (data.success) {
   
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